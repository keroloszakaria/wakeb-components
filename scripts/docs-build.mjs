import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import reference from "../docs/reference-data.mjs";
import { assertMatrixInSync } from "./peer-matrix.mjs";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { name, version } = JSON.parse(readFileSync(join(root,"package.json"),"utf8"));
// Supported-versions tables, peer fixtures and their recorded npm run check:peers results must agree.
assertMatrixInSync();
const types = ts.createSourceFile("types.ts", readFileSync(join(root,"src/types.ts"),"utf8"), ts.ScriptTarget.Latest, true);
const interfaces = Object.fromEntries(types.statements.filter(ts.isInterfaceDeclaration).map(item => [item.name.text, item.members.map(member => member.name?.getText(types))]));
for (const locale of ["", "ar/"]) {
  assert.ok(readFileSync(join(root, "docs", locale, "guide/data-models.md"), "utf8").includes(readFileSync(join(root, "src/types.ts"), "utf8")), "Public data model docs must match declarations");
}
const publicNames = [...readFileSync(join(root,"src/index.ts"),"utf8").matchAll(/^export const (\w+) = \/\* @__PURE__ \*\/ defineWakebFacade\("\1", \1Renderer\)/gm)].map(m => m[1]);
assert.deepEqual(reference.map(item=>item.name).sort(),publicNames.sort());
for (const entry of reference) {
  assert.deepEqual(entry.props.map(row=>row[0]).sort(), interfaces[entry.interface].sort(), `${entry.name} public props documentation`);
  const component = readFileSync(join(root, "src/components", entry.name + ".vue"), "utf8");
  // Behavior and styles shared by every provider renderer live in src/composables and src/styles.
  const shared = (pattern, dir, ext) => [...component.matchAll(pattern)].map(([, name]) => readFileSync(join(root, "src", dir, name + ext), "utf8"));
  const source = [component, ...shared(/@use "\.\.\/styles\/([\w-]+)"/g, "styles", ".scss"), ...shared(/from "\.\.\/composables\/([\w-]+)"/g, "composables", ".ts")].join("\n");
  for (const [variable] of entry.variables) for (const token of variable.match(/--[a-z0-9-]+/g) ?? []) assert.ok(source.includes(token), `${entry.name} documents ${token} but never consumes it`);
  for (const [prefix, lang] of [["",0],["ar/",1]]) {
    const title = lang ? ["الاستخدام","المدخلات","Slots","متغيرات CSS","الوصول وحدود السلوك","جرّب بنفسك"] : ["Usage","Props","Slots","CSS variables","Accessibility and limits","Try it"];
    const rows = entry.props.map(([n,t,d,en,ar])=>`| \`${n}\` | \`${t.replaceAll("|","\\|")}\` | \`${d}\` | ${lang ? ar : en} |`).join("\n");
    const cssRows = entry.variables.map(([n,d])=>`| \`${n}\` | \`${d}\` |`).join("\n");
    const page = `<!-- Generated from docs/reference-data.mjs -->
# ${entry.name}

${entry.summary[lang]}

## ${title[0]}

\`\`\`vue
<script setup lang="ts">
import { ${entry.name} } from 'wakeb-components'${entry.setup ? "\n" + entry.setup : ""}
</script>
<template>
  ${entry.example}
</template>
\`\`\`

## ${title[1]}

| ${lang ? "المعامل | النوع | الافتراضي | الوصف" : "Prop | Type | Default | Description"} |
| --- | --- | --- | --- |
${rows}

${entry.events ? `## ${lang ? "الأحداث" : "Events"}\n\n${entry.events[lang]}\n\n` : ""}## ${title[2]}

${entry.slots[lang]}

## ${title[3]}

| ${lang ? "المتغير | الافتراضي" : "Variable | Default"} |
| --- | --- |
${cssRows}

## ${title[4]}

${entry.limits[lang]}

## ${title[5]}

<${entry.playground ?? "ComponentPlayground"} initial="${entry.slug}" />
`;
    const folder=join(root,"docs",prefix,"components"); mkdirSync(folder,{recursive:true}); writeFileSync(join(folder,entry.slug+".md"),page);
  }
}
function run(args) { const result=spawnSync(process.execPath,args,{cwd:root,encoding:"utf8",windowsHide:true}); if(result.status!==0) throw new Error(result.stderr||result.stdout||result.error?.message); return result.stdout; }
// Build the library first so the downloadable archive never packs a stale or missing dist.
assert.ok(process.env.npm_execpath, "Use npm run docs:build");
run([process.env.npm_execpath,"run","build"]);
const downloads=join(root,"docs/public/downloads"); mkdirSync(downloads,{recursive:true});
run([process.env.npm_execpath,"pack","--ignore-scripts","--pack-destination",downloads]);
console.log(run([join(root,"node_modules/vitepress/bin/vitepress.js"),"build","docs"]));
const out=join(root,"docs/.vitepress/dist"), files={};
function walk(dir,prefix="") { for(const item of readdirSync(dir,{withFileTypes:true})) { const path=prefix+item.name; if(item.isDirectory()) walk(join(dir,item.name),path+"/"); else if(path!=="deployment-proof.json") files[path]=createHash("sha256").update(readFileSync(join(dir,item.name))).digest("hex"); } }
walk(out);
const git=spawnSync("git",["rev-parse","HEAD"],{cwd:root,encoding:"utf8",windowsHide:true});
const dirty=spawnSync("git",["status","--porcelain"],{cwd:root,encoding:"utf8",windowsHide:true});
writeFileSync(join(out,"deployment-proof.json"),JSON.stringify({package:name,version,builtAt:new Date().toISOString(),sourceCommit:git.status===0?git.stdout.trim():"local",sourceDirty:dirty.status!==0||dirty.stdout.trim()!=="",files},null,2)+"\n");
console.log("All public component props documented in both languages.");
