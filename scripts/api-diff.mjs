/*
 * Baseline-to-current public API diff (SPEC R12).
 *
 * Compares the 0.7.0 snapshot in specs/ui-abstraction/baseline.json with the current source and
 * classifies every difference as "unchanged", "additive" or "breaking". Breaking differences must be
 * listed in specs/ui-abstraction/baseline-changes.json; tests/baseline-diff.test.ts fails on an
 * unlisted breaking difference and on a stale allowlist entry.
 *
 * Type-level parts (props, emits, slots, exported names) are decided with the TypeScript checker, so
 * the verdict follows assignability, not text:
 *   - props are inputs: a change is additive when every 0.7 value is still accepted (old -> new);
 *   - event and slot payloads are outputs: additive when every new payload still satisfies the 0.7
 *     declaration (new -> old).
 * Runtime parts (value exports, prop defaults) need the compiled renderers, so the Vitest suite
 * collects them and passes them to `diffRuntime`.
 *
 * CLI: `node scripts/api-diff.mjs [--all]` prints the type-level differences (breaking only, or all).
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const BASELINE_FILE = join(ROOT, "specs/ui-abstraction/baseline.json");
export const ALLOWLIST_FILE = join(ROOT, "specs/ui-abstraction/baseline-changes.json");
export const MIGRATION_FILE = join(ROOT, "docs/guide/migration.md");

/** Collapses whitespace and drops trailing separators so formatting never counts as a change. */
export const normalize = (text) =>
  String(text)
    .replace(/\r\n?/g, "\n")
    .replace(/\s+/g, " ")
    .replace(/\s*([;,])\s*([}\]>)])/g, " $2")
    .replace(/([{[(<])\s+/g, "$1")
    .replace(/\s+([}\])>])/g, "$1")
    .trim();

export const loadBaseline = () => JSON.parse(readFileSync(BASELINE_FILE, "utf8"));
export const loadAllowlist = () => JSON.parse(readFileSync(ALLOWLIST_FILE, "utf8"));

/* ----------------------------------------------------------------------------- exported names */

/** Value and type export names of an index source, sorted. */
export function exportNames(source) {
  const values = new Set();
  const types = new Set();
  for (const [, body] of source.matchAll(/export\s+type\s*\{([^}]*)\}/g))
    for (const name of body.split(",").map((part) => part.trim().split(/\s+as\s+/).pop()).filter(Boolean)) types.add(name);
  for (const [, name] of source.matchAll(/export\s*\{\s*default\s+as\s+(\w+)\s*\}/g)) values.add(name);
  for (const [, name] of source.matchAll(/export\s+(?:const|function|class)\s+(\w+)/g)) values.add(name);
  for (const [, body] of source.matchAll(/export\s*\{(?!\s*default\s+as)([^}]*)\}\s*from/g))
    for (const name of body.split(",").map((part) => part.trim().split(/\s+as\s+/).pop()).filter(Boolean)) values.add(name);
  return { values: [...values].sort(), types: [...types].sort() };
}

function diffNames(area, before, after, isBreakingRemoval = true) {
  const now = new Set(after);
  const then = new Set(before);
  const out = [];
  for (const name of before)
    out.push(now.has(name)
      ? { id: `exports.${area}.${name}`, kind: "unchanged" }
      : { id: `exports.${area}.${name}`, kind: isBreakingRemoval ? "breaking" : "additive", from: name, to: "(removed)" });
  for (const name of after) if (!then.has(name)) out.push({ id: `exports.${area}.${name}`, kind: "additive", from: "(absent)", to: name });
  return out;
}

/* ------------------------------------------------------------------------- baseline program */

/** Unresolvable expressions inside the 0.7 `<script setup>` macros, replaced before type-checking. */
const MACRO_REWRITES = [[/typeof\s+triggerProps\.value/g, "unknown"]];

const macroBody = (macro, name) => {
  if (!macro) return "{}";
  const start = macro.indexOf("<");
  const end = macro.lastIndexOf(">");
  if (!macro.startsWith(name) || start < 0 || end < start) throw new Error(`Unreadable ${name} macro: ${macro}`);
  return MACRO_REWRITES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), macro.slice(start + 1, end));
};

/** The 0.7 types plus one Emits/Slots interface per component built from its recorded macros. */
export function baselineSource(baseline) {
  const contracts = baseline.components.map((component) => {
    const macros = component.sourceContractMacros ?? {};
    return [
      `export interface ${component.name}__Emits ${macroBody(macros.defineEmits, "defineEmits")}`,
      `export interface ${component.name}__Slots ${macroBody(macros.defineSlots, "defineSlots")}`,
    ].join("\n");
  });
  return `${baseline.publicTypesSource}\n/* Generated from sourceContractMacros. */\n${contracts.join("\n")}\n`;
}

const VIRTUAL_BASELINE = join(ROOT, "src/__api_baseline__.ts");
const VIRTUAL_CURRENT = join(ROOT, "src/__api_current__.ts");

function createProgram(baseline) {
  const files = new Map([
    [VIRTUAL_BASELINE, baselineSource(baseline)],
    [
      VIRTUAL_CURRENT,
      [
        `import type { WakebComponentProps } from "./core/options";`,
        `import type { WakebComponentEmits, WakebComponentSlots } from "./contracts";`,
        `export type { WakebComponentProps, WakebComponentEmits, WakebComponentSlots };`,
      ].join("\n"),
    ],
  ]);
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    types: [],
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
  };
  const host = ts.createCompilerHost(options, true);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (fileName, languageVersion, ...rest) => {
    const text = files.get(resolve(fileName));
    return text === undefined ? getSourceFile(fileName, languageVersion, ...rest) : ts.createSourceFile(fileName, text, languageVersion, true);
  };
  const fileExists = host.fileExists.bind(host);
  host.fileExists = (fileName) => files.has(resolve(fileName)) || fileExists(fileName);
  const readFile = host.readFile.bind(host);
  host.readFile = (fileName) => files.get(resolve(fileName)) ?? readFile(fileName);
  return ts.createProgram([...files.keys()], options, host);
}

/* ----------------------------------------------------------------------------- member model */

const memberName = (member) => (member.name && (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) ? member.name.text : undefined);

/** Named members of an interface or type literal: `{ name, optional, node, typeNode }`. */
function members(checker, type) {
  const out = new Map();
  for (const symbol of checker.getPropertiesOfType(type)) {
    const node = symbol.declarations?.[0];
    if (!node) continue;
    const name = memberName(node) ?? symbol.getName();
    out.set(name, { name, optional: Boolean(node.questionToken), node });
  }
  return out;
}

const textOf = (node) => (node ? normalize(node.getText()) : "(none)");

/** Declared type of a prop, without the `undefined` that `?` adds. */
const propType = (checker, member) => (member.node.type ? checker.getTypeFromTypeNode(member.node.type) : checker.getAnyType());

/** First parameter of a slot signature, or undefined when the slot has no payload. */
function slotPayload(checker, member) {
  const node = member.node;
  const fn = ts.isMethodSignature(node) ? node : node.type && ts.isFunctionTypeNode(node.type) ? node.type : undefined;
  const param = fn?.parameters[0];
  if (!param) return undefined;
  return { type: param.type ? checker.getTypeFromTypeNode(param.type) : checker.getAnyType(), text: textOf(param.type) };
}

/** Verdict for a type change; `direction` is "input" (old must fit new) or "output" (new must fit old). */
function verdict(checker, before, after, direction) {
  const forward = checker.isTypeAssignableTo(before, after);
  const backward = checker.isTypeAssignableTo(after, before);
  if (forward && backward) return "unchanged";
  return (direction === "input" ? forward : backward) ? "additive" : "breaking";
}

const PRINT = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseFullyQualifiedType;
const show = (checker, type, expand) =>
  normalize(checker.typeToString(type, undefined, expand ? PRINT | ts.TypeFormatFlags.InTypeAlias : PRINT)).replace(/import\("[^"]*"\)\./g, "");
const isObject = (type) => Boolean(type.flags & ts.TypeFlags.Object) && !(type.flags & ts.TypeFlags.Union);

/**
 * Where two non-equivalent types differ: `path: old -> new` for every nested member whose type is no
 * longer equivalent, following object members and array elements. A leaf whose alias name did not
 * change is printed expanded, so `SharedIcon -> SharedIcon` still shows what moved.
 */
function explain(checker, before, after, path = "", depth = 0, seen = new Set()) {
  if (checker.isTypeAssignableTo(before, after) && checker.isTypeAssignableTo(after, before)) return [];
  const leaf = () => {
    const same = show(checker, before, false) === show(checker, after, false);
    // Expand the alias (outside `| undefined`) when the name alone would hide the change.
    const print = (type) => {
      if (!same) return show(checker, type, false);
      const defined = checker.getNonNullableType(type);
      return defined === type ? show(checker, type, true) : `${show(checker, defined, true)} | undefined`;
    };
    return [`${path || "(self)"}: ${print(before)} -> ${print(after)}`];
  };
  if (depth > 4) return leaf();
  const element = (type) => (checker.isArrayType(type) || checker.isTupleType(type) ? checker.getTypeArguments(type) : undefined);
  const [oldItems, newItems] = [element(before), element(after)];
  if (oldItems && newItems && oldItems.length === newItems.length && checker.isArrayType(before) === checker.isArrayType(after))
    return oldItems.flatMap((item, index) => explain(checker, item, newItems[index], `${path}[${checker.isArrayType(before) ? "" : index}]`, depth + 1, seen));
  if (!isObject(before) || !isObject(after) || before.getCallSignatures().length || after.getCallSignatures().length) return leaf();
  const key = `${before.id}:${after.id}`;
  if (seen.has(key)) return [];
  seen.add(key);
  const names = new Set([...checker.getPropertiesOfType(before), ...checker.getPropertiesOfType(after)].map((symbol) => symbol.getName()));
  const out = [];
  for (const name of [...names].sort()) {
    const was = checker.getPropertyOfType(before, name);
    const is = checker.getPropertyOfType(after, name);
    const at = path ? `${path}.${name}` : name;
    if (!was) out.push(`${at}: (absent) -> ${show(checker, checker.getTypeOfSymbol(is), false)}`);
    else if (!is) out.push(`${at}: ${show(checker, checker.getTypeOfSymbol(was), false)} -> (removed)`);
    else out.push(...explain(checker, checker.getTypeOfSymbol(was), checker.getTypeOfSymbol(is), at, depth + 1, seen));
  }
  return out.length ? out : leaf();
}

/** A compared member: kind from assignability, plus `from`/`to` text and `changes` when not unchanged. */
function compared(checker, id, before, after, direction, from, to) {
  const kind = verdict(checker, before, after, direction);
  return kind === "unchanged" ? { id, kind } : { id, kind, from, to, changes: explain(checker, before, after) };
}

/* -------------------------------------------------------------------------- type-level diff */

function diffProps(checker, component, before, after) {
  const out = [];
  const prefix = `${component}.prop`;
  for (const [name, old] of before) {
    const now = after.get(name);
    if (!now) {
      out.push({ id: `${prefix}.${name}`, kind: "breaking", from: textOf(old.node.type), to: "(removed)" });
      continue;
    }
    if (old.optional !== now.optional)
      out.push({ id: `${prefix}.${name}.required`, kind: now.optional ? "additive" : "breaking", from: old.optional ? "optional" : "required", to: now.optional ? "optional" : "required" });
    out.push(compared(checker, `${prefix}.${name}.type`, propType(checker, old), propType(checker, now), "input", textOf(old.node.type), textOf(now.node.type)));
  }
  for (const [name, now] of after)
    if (!before.has(name)) out.push({ id: `${prefix}.${name}`, kind: now.optional ? "additive" : "breaking", from: "(absent)", to: textOf(now.node.type) });
  return out;
}

function diffEmits(checker, component, before, after) {
  const out = [];
  const prefix = `${component}.emit`;
  for (const [name, old] of before) {
    const now = after.get(name);
    if (!now) {
      out.push({ id: `${prefix}.${name}`, kind: "breaking", from: textOf(old.node.type), to: "(removed)" });
      continue;
    }
    out.push(compared(checker, `${prefix}.${name}.payload`, propType(checker, old), propType(checker, now), "output", textOf(old.node.type), textOf(now.node.type)));
  }
  for (const [name, now] of after) if (!before.has(name)) out.push({ id: `${prefix}.${name}`, kind: "additive", from: "(absent)", to: textOf(now.node.type) });
  return out;
}

function diffSlots(checker, component, before, after) {
  const out = [];
  const prefix = `${component}.slot`;
  for (const [name, old] of before) {
    const now = after.get(name);
    if (!now) {
      out.push({ id: `${prefix}.${name}`, kind: "breaking", from: "(declared)", to: "(removed)" });
      continue;
    }
    // Slot optionality only changes `$slots` typing inside the component; it is not part of the comparison.
    const was = slotPayload(checker, old);
    const is = slotPayload(checker, now);
    const id = `${prefix}.${name}.payload`;
    if (was && is) out.push(compared(checker, id, was.type, is.type, "output", was.text, is.text));
    else if (was || is) out.push({ id, kind: was ? "breaking" : "additive", from: was?.text ?? "(none)", to: is?.text ?? "(none)" });
    else out.push({ id, kind: "unchanged" });
  }
  for (const [name] of after) if (!before.has(name)) out.push({ id: `${prefix}.${name}`, kind: "additive", from: "(absent)", to: "(declared)" });
  return out;
}

/** Type-level diff of every baseline component, plus exported type names. */
export function diffTypes(baseline = loadBaseline(), currentIndex = readFileSync(join(ROOT, "src/index.ts"), "utf8")) {
  const program = createProgram(baseline);
  const diagnostics = ts.getPreEmitDiagnostics(program).filter((d) => d.file && [VIRTUAL_BASELINE, VIRTUAL_CURRENT].includes(resolve(d.file.fileName)));
  if (diagnostics.length)
    throw new Error(`Baseline/current probe does not type-check:\n${diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")).join("\n")}`);
  const checker = program.getTypeChecker();
  const exportsOf = (file) => {
    const symbol = checker.getSymbolAtLocation(program.getSourceFile(file));
    return new Map(checker.getExportsOfModule(symbol).map((item) => [item.getName(), item]));
  };
  const old = exportsOf(VIRTUAL_BASELINE);
  const now = exportsOf(VIRTUAL_CURRENT);
  const declared = (symbol) => checker.getDeclaredTypeOfSymbol(symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol);
  const mapEntry = (map, name) => {
    const prop = checker.getPropertyOfType(declared(now.get(map)), name);
    if (!prop) throw new Error(`${map} has no entry for ${name}`);
    return checker.getTypeOfSymbol(prop);
  };
  const byName = (map, name) => {
    const symbol = map.get(name);
    if (!symbol) throw new Error(`Baseline declares no ${name}`);
    return declared(symbol);
  };

  const differences = [];
  for (const component of baseline.components) {
    const { name } = component;
    differences.push(...diffProps(checker, name, members(checker, byName(old, component.interface)), members(checker, mapEntry("WakebComponentProps", name))));
    differences.push(...diffEmits(checker, name, members(checker, byName(old, `${name}__Emits`)), members(checker, mapEntry("WakebComponentEmits", name))));
    differences.push(...diffSlots(checker, name, members(checker, byName(old, `${name}__Slots`)), members(checker, mapEntry("WakebComponentSlots", name))));
  }
  differences.push(...diffNames("type", exportNames(baseline.publicExportsSource).types, exportNames(currentIndex).types));
  return differences;
}

/* --------------------------------------------------------------------------- runtime diff */

const quote = (value) => JSON.stringify(value);

/** Function defaults compare by normalized source: `(a) => b` and `a => b` are the same, as are quote styles. */
const fnText = (source) =>
  normalize(source)
    .replace(/^\(\s*(\w+)\s*\)\s*=>/, "$1 =>")
    .replace(/'/g, '"');

/** Baseline default cell (documentation notation) to a canonical string. */
export function baselineDefault(cell) {
  const text = normalize(cell);
  if (/^(\[\]\s*)?\(?required\)?$/.test(text)) return "required";
  if (text === "undefined") return "undefined";
  if (/^\(?[\w\s,]*\)?\s*=>/.test(text)) return `fn:${fnText(text)}`;
  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return quote(text);
  }
}

/** Runtime prop option of a compiled renderer to the same canonical string. */
export function runtimeDefault(option) {
  if (!option || typeof option !== "object") return "undefined";
  if (option.required) return "required";
  if (!("default" in option)) return "undefined";
  const types = [option.type].flat();
  let value = option.default;
  if (typeof value === "function") {
    if (types.includes(Function)) return `fn:${fnText(value.toString())}`;
    value = value({});
  }
  if (value === undefined) return "undefined";
  if (typeof value === "function") return `fn:${fnText(value.toString())}`;
  return JSON.stringify(value);
}

/** Inputs used to compare function defaults by behavior when their source text differs. */
const PROBES = [0, 1, 2, 9, -1, undefined, null, "", "x", "Label"];

/** True when the baseline arrow function returns what the current default returns for every probe. */
function sameBehavior(cell, fn) {
  // The cell comes from the checked-in baseline, never from user input.
  const old = new Function(`return (${cell});`)();
  const run = (f, input) => {
    try {
      return JSON.stringify(f(input)) ?? "undefined";
    } catch (error) {
      return `throws ${error?.constructor?.name}`;
    }
  };
  return PROBES.every((input) => run(old, input) === run(fn, input));
}

/**
 * Runtime diff. `values` are the current runtime export names; `renderers` maps component names to
 * their runtime prop options (from the compiled renderer, which owns the defaults). `notation` maps
 * `Component.prop` to the literal value of a baseline cell written as prose (see baseline-changes.json).
 */
export function diffRuntime(baseline, values, renderers, notation = {}) {
  const differences = diffNames("value", exportNames(baseline.publicExportsSource).values, [...values].sort());
  for (const component of baseline.components) {
    const options = renderers[component.name];
    if (!options) throw new Error(`No runtime props for ${component.name}`);
    for (const [prop, , cell] of component.props) {
      const id = `${component.name}.default.${prop}`;
      const prose = notation[`${component.name}.${prop}`];
      if (prose && normalize(prose.cell) !== normalize(cell)) throw new Error(`Stale notation entry ${component.name}.${prop}: baseline cell is ${cell}`);
      const from = prose ? JSON.stringify(prose.value) : baselineDefault(cell);
      const option = options[prop];
      const to = prop in options ? runtimeDefault(option) : "(removed)";
      if (from === to) differences.push({ id, kind: "unchanged" });
      else if (from.startsWith("fn:") && to.startsWith("fn:") && sameBehavior(cell, option.default)) differences.push({ id, kind: "unchanged" });
      else if (from === "required" && to !== "(removed)") differences.push({ id, kind: "additive", from, to });
      else differences.push({ id, kind: "breaking", from, to });
    }
  }
  return differences;
}

/* --------------------------------------------------------------------------- allowlist check */

/** VitePress heading anchors of a Markdown file: explicit `{#id}` or the slug of the heading text. */
export function anchors(markdown) {
  const out = new Set();
  for (const [, heading] of markdown.matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const explicit = heading.match(/\{#([\w-]+)\}\s*$/);
    if (explicit) out.add(explicit[1]);
    else
      out.add(
        heading
          .toLowerCase()
          .replace(/[`*_~"'()[\]{}<>.,:;!?/\\]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      );
  }
  return out;
}

/** Problems with the allowlist against the measured differences; empty when everything is accounted for. */
export function checkAllowlist(differences, allowlist, migration) {
  const problems = [];
  const breaking = new Map(differences.filter((d) => d.kind === "breaking").map((d) => [d.id, d]));
  const entries = new Map();
  const sections = anchors(migration);
  for (const entry of allowlist.breaking) {
    if (entries.has(entry.id)) problems.push(`duplicate allowlist entry ${entry.id}`);
    entries.set(entry.id, entry);
    if (!entry.reason?.trim()) problems.push(`${entry.id}: missing reason`);
    const [file, anchor] = String(entry.migration ?? "").split("#");
    if (file !== "docs/guide/migration.md" || !anchor) problems.push(`${entry.id}: migration must point to docs/guide/migration.md#<section>`);
    else if (!sections.has(anchor)) problems.push(`${entry.id}: migration section #${anchor} does not exist`);
    const actual = breaking.get(entry.id);
    if (!actual) problems.push(`stale allowlist entry ${entry.id}: no longer a breaking difference`);
    else if (actual.from !== entry.from || actual.to !== entry.to)
      problems.push(`stale allowlist entry ${entry.id}: recorded ${entry.from} -> ${entry.to}, measured ${actual.from} -> ${actual.to}`);
    else if (JSON.stringify(actual.changes ?? []) !== JSON.stringify(entry.changes ?? []))
      problems.push(`stale allowlist entry ${entry.id}: nested changes differ, measured ${JSON.stringify(actual.changes ?? [])}`);
  }
  for (const [id, d] of breaking) if (!entries.has(id)) problems.push(`unlisted breaking change ${id}: ${d.from} -> ${d.to}`);
  return problems.sort();
}

/* ----------------------------------------------------------------------------------- CLI */

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const all = process.argv.includes("--all");
  const differences = diffTypes();
  for (const d of differences.sort((a, b) => a.id.localeCompare(b.id)))
    if (all ? d.kind !== "unchanged" : d.kind === "breaking") {
      console.log(`${d.kind.padEnd(9)} ${d.id}: ${d.from} -> ${d.to}`);
      for (const change of d.changes ?? []) console.log(`            ${change}`);
    }
  const count = (kind) => differences.filter((d) => d.kind === kind).length;
  console.log(`type-level: ${count("unchanged")} unchanged, ${count("additive")} additive, ${count("breaking")} breaking`);
}
