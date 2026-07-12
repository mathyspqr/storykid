import assert from "node:assert/strict";
import test from "node:test";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const url=process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.SUPABASE_URL;
const publicKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.SUPABASE_PUBLISHABLE_KEY;
const serviceKey=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;

test("Supabase RLS: propriétaire, isolation et protection des pages payantes",{skip:!url||!publicKey||!serviceKey},async t=>{
  const admin=createClient(url,serviceKey,{auth:{persistSession:false}});
  const preflight=await admin.from("stories").select("id").limit(1);
  if(preflight.error?.code==="PGRST205"){t.skip("Migration StoryKid non appliquée au projet Supabase");return}
  assert.ifError(preflight.error);
  const stamp=`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const password=`StoryKid-${stamp}!`;
  const users=[];
  for(const side of ["owner","other"]){const {data,error}=await admin.auth.admin.createUser({email:`codex-${side}-${stamp}@example.test`,password,email_confirm:true});assert.ifError(error);assert.ok(data.user);users.push(data.user)}
  t.after(async()=>{for(const user of users)await admin.auth.admin.deleteUser(user.id)});
  const {data:story,error:storyError}=await admin.from("stories").insert({user_id:users[0].id,status:"preview_ready",moment:"bedtime",child_name:"Mia",child_age:5,universe:"animals",companion:"fox",emotional_goal:"reassure",tone:"soft",format:"standard",page_count:8}).select("id").single();assert.ifError(storyError);
  const {error:pagesError}=await admin.from("story_pages").insert([{story_id:story.id,page_number:1,text:"Première page",is_preview:true},{story_id:story.id,page_number:2,text:"Page protégée",is_preview:false}]);assert.ifError(pagesError);
  async function signedClient(userIndex){const client=createClient(url,publicKey,{auth:{persistSession:false}});const {error}=await client.auth.signInWithPassword({email:`codex-${userIndex===0?"owner":"other"}-${stamp}@example.test`,password});assert.ifError(error);return client}
  const owner=await signedClient(0);const other=await signedClient(1);
  const {data:ownerStories}=await owner.from("stories").select("id").eq("id",story.id);assert.equal(ownerStories?.length,1);
  const {data:otherStories}=await other.from("stories").select("id").eq("id",story.id);assert.equal(otherStories?.length,0);
  const {data:previewPages}=await owner.from("story_pages").select("page_number").eq("story_id",story.id).order("page_number");assert.deepEqual(previewPages?.map(page=>page.page_number),[1]);
  const {data:updated}=await owner.from("stories").update({status:"ready"}).eq("id",story.id).select("status");assert.equal(updated?.length,0,"Le client ne peut pas promouvoir lui-même une histoire");
});
