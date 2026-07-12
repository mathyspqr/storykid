import assert from "node:assert/strict";
import test from "node:test";
import { readdir,readFile } from "node:fs/promises";
import path from "node:path";

async function files(root){const entries=await readdir(root,{withFileTypes:true});const nested=await Promise.all(entries.map(entry=>entry.isDirectory()?files(path.join(root,entry.name)):[path.join(root,entry.name)]));return nested.flat().filter(file=>/\.(ts|tsx)$/.test(file))}

test("architecture: le client n’importe aucun module ou secret serveur",async()=>{for(const file of await files("src")){const source=await readFile(file,"utf8");assert.doesNotMatch(source,/@\/server\//,file);assert.doesNotMatch(source,/SUPABASE_SECRET|SERVICE_ROLE|STRIPE_SECRET|WEBHOOK_SECRET|GEMINI_API_KEY|CRON_SECRET/,file)}});
test("offre: le prix de production est centralisé",async()=>{const source=await readFile("src/shared/story-production.ts","utf8");assert.match(source,/standard: \{ id: "standard", pages: 8, priceCents: 399/) });
