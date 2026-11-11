import * as vite from "vite";
import { WakebError } from "../core/errors";
import { FRAMEWORKS, type WakebFramework } from "../core/options";

/* Minimal ESTree shapes; only the nodes the selector inspects are typed. */
type Node = { type: string; [key: string]: any };

// Vite 8 ships Oxc instead of esbuild. Keep the Vite 6 path without requiring a second compiler in hosts.
const api = vite as typeof vite & {
  transformWithOxc?: (code: string, file: string) => Promise<{ code: string }>;
  parseSync?: (file: string, code: string, options: { sourceType: "module" }) => { program: Node; errors?: { message: string }[] };
};

export const SUPPORTED_PATTERN = `import { createWakebComponents } from 'wakeb-components'

export default createWakebComponents({
  framework: 'vuetify', // a string literal: 'vuetify', 'primevue' or 'shadcn'
})`;

const fail = (file: string, problem: string) =>
  new WakebError(
    "WAKEB_CONFIG_INVALID",
    `${file}: ${problem}\nwakebComponents() reads the framework statically and never runs this file. Use this pattern:\n\n${SUPPORTED_PATTERN}\n`,
  );

const keyName = (property: Node) =>
  property.key.type === "Identifier" ? property.key.name : property.key.type === "Literal" ? String(property.key.value) : undefined;

/** import.meta.env.X or process.env.X, including optional chains and fallbacks such as `a ?? 'vuetify'`. */
const isEnv = (node: Node): boolean => {
  if (node.type === "ChainExpression") return isEnv(node.expression);
  if (node.type === "LogicalExpression" || node.type === "ConditionalExpression")
    return [node.left, node.right, node.test, node.consequent, node.alternate].some((part) => part && isEnv(part));
  let root = node;
  while (root.type === "MemberExpression") root = root.object;
  return root !== node && (root.type === "MetaProperty" || (root.type === "Identifier" && root.name === "process"));
};

function describe(value: Node) {
  if (isEnv(value)) return "the framework comes from an environment expression";
  if (value.type === "Identifier") return `the framework is the variable or imported constant '${value.name}'`;
  if (value.type === "TemplateLiteral") return "the framework is a template literal with expressions";
  return `the framework is a ${value.type}, not a string literal`;
}

/**
 * Extracts the framework from the consumer plugin file without evaluating it (SPEC R09).
 * Only `export default createWakebComponents({ framework: '<literal>' })` is accepted.
 */
export async function readFramework(code: string, file: string): Promise<WakebFramework> {
  const js = /\.[cm]?tsx?$/.test(file)
    ? (await (api.transformWithOxc ? api.transformWithOxc(code, file) : api.transformWithEsbuild(code, file, { loader: "ts" }))).code
    : code;
  let program: Node;
  try {
    if (api.parseSync) {
      const parsed = api.parseSync(`${file}.js`, js, { sourceType: "module" });
      if (parsed.errors?.length) throw new Error(parsed.errors.map(error => error.message).join("; "));
      program = parsed.program;
    } else program = api.parseAst(js) as unknown as Node;
  } catch (error) {
    throw fail(file, `the file could not be parsed (${(error as Error).message}).`);
  }
  const factories = new Set<string>();
  for (const statement of program.body) {
    if (statement.type === "ExportNamedDeclaration" && statement.source && statement.specifiers.some((s: Node) => s.exported.name === "default"))
      throw fail(file, "the default export is re-exported from another module.");
    if (statement.type === "ExportAllDeclaration") throw fail(file, "the file re-exports another module.");
    if (statement.type !== "ImportDeclaration" || statement.source.value !== "wakeb-components") continue;
    for (const specifier of statement.specifiers)
      if (specifier.type === "ImportSpecifier" && (specifier.imported.name ?? specifier.imported.value) === "createWakebComponents")
        factories.add(specifier.local.name);
  }
  if (!factories.size) throw fail(file, "createWakebComponents is not imported by name from 'wakeb-components'.");
  const exported = program.body.find((statement: Node) => statement.type === "ExportDefaultDeclaration")?.declaration as Node | undefined;
  if (!exported) throw fail(file, "the file has no default export.");
  if (exported.type !== "CallExpression" || exported.callee.type !== "Identifier" || !factories.has(exported.callee.name))
    throw fail(file, "the default export must be a direct createWakebComponents(...) call.");
  const [options] = exported.arguments as Node[];
  if (!options || options.type !== "ObjectExpression") throw fail(file, "createWakebComponents must receive an object literal.");
  if (options.properties.some((property: Node) => property.type === "SpreadElement"))
    throw fail(file, "the options object uses a spread, which could hide or override framework.");
  if (options.properties.some((property: Node) => property.computed))
    throw fail(file, "the options object uses a computed key, so framework cannot be located statically.");
  const declarations = options.properties.filter((property: Node) => keyName(property) === "framework");
  if (declarations.length > 1) throw fail(file, "framework is declared more than once.");
  if (!declarations.length) throw fail(file, `framework is missing. Accepted values: ${FRAMEWORKS.join(", ")}.`);
  const value = declarations[0].value as Node;
  const literal =
    value.type === "Literal" ? value.value : value.type === "TemplateLiteral" && !value.expressions.length ? value.quasis[0].value.cooked : undefined;
  if (typeof literal !== "string") throw fail(file, `${describe(value)}.`);
  if (!FRAMEWORKS.includes(literal as WakebFramework))
    throw fail(file, `framework '${literal}' is not supported. Accepted values: ${FRAMEWORKS.join(", ")}.`);
  return literal as WakebFramework;
}
