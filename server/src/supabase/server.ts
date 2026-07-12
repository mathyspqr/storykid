import { createClient } from "@supabase/supabase-js";
import type { Request } from "express";

export function publicConfig(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.SUPABASE_PUBLISHABLE_KEY;if(!url||!key)throw new Error("SUPABASE_PUBLIC_NOT_CONFIGURED");return {url,key}}
export function serviceConfig(){const {url}=publicConfig();const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;if(!key)throw new Error("SUPABASE_SERVICE_NOT_CONFIGURED");return {url,key}}
export function service(){const {url,key}=serviceConfig();return createClient(url,key,{auth:{persistSession:false}})}
export async function authenticatedUser(request:Request){const auth=request.header("authorization");const token=auth?.startsWith("Bearer ")?auth.slice(7):null;if(!token)return null;const {url,key}=publicConfig();const client=createClient(url,key,{auth:{persistSession:false}});const {data:{user}}=await client.auth.getUser(token);return user}
