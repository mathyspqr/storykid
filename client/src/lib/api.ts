"use client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
export async function apiFetch(path:string,init:RequestInit={}){const client=createSupabaseBrowserClient();const result=client?await client.auth.getSession():null;const headers=new Headers(init.headers);if(result?.data.session?.access_token)headers.set("authorization",`Bearer ${result.data.session.access_token}`);return fetch(path,{...init,headers})}
