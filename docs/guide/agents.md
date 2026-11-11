# Coding agents: skill and MCP

The **0.8.0-alpha.0 local candidate** includes a portable Wakeb skill and a separate,
read-only MCP server. They describe all 39 public components from the same reference
data as this site. Use the skill for writing conventions and the MCP for exact API
lookup. Neither changes files, executes generated code or publishes a package.

## Install the skill

Download the [skill archive](/downloads/wakeb-components-skill.zip) and extract it
into your agent's skill directory, keeping the `wakeb-components/SKILL.md` structure.
In this repository the source is `.agents/skills/wakeb-components/`.
For Codex, the personal destination is `~/.codex/skills/wakeb-components/`.
Other agents can load `SKILL.md` and its linked references using their own skill
or project-instruction mechanism. Restart or reload the client after installation.

Example request:

> Use the wakeb-components skill to build an Arabic review form on PrimeVue.
> Include required email validation, a notes field and an accessible confirmation dialog.

The skill explains provider selection, named imports, state ownership, model and
event differences, CSS tokens, keyboard access and verification. Its component
index links to one reference per component, so an agent only reads what it needs.

## Run the MCP locally

Use Node **22.14+**. From a checkout:

```sh
npm ci
npm run agents:build
npm ci --prefix packages/mcp
node packages/mcp/server.mjs
```

The process waits for MCP messages on stdin; an idle terminal is expected.
Protocol output goes to stdout. Connect it through a client that supports **stdio**.
For clients using `mcpServers` JSON, replace the path with your absolute checkout path:

```json
{
  "mcpServers": {
    "wakeb-components": {
      "command": "node",
      "args": ["D:/projects/wakeb-components/packages/mcp/server.mjs"]
    }
  }
}
```

Clients with another configuration format use the same command and arguments.
Use forward slashes or escaped backslashes on Windows; spaces remain inside a
single JSON argument. The server resolves its catalog relative to its own file,
so the client's working directory does not matter. No API key is needed.

You can also download the <a href="/downloads/wakeb-components-mcp-0.8.0-alpha.0.tgz" download>MCP package archive</a>
and install it into a separate tools directory:

```sh
npm install ./wakeb-components-mcp-0.8.0-alpha.0.tgz
```

Then use the absolute path to `node_modules/wakeb-components-mcp/server.mjs` in the
configuration above. The archive is a local candidate; the MCP package has not
been published to npm. Do not use an unverified `npx` package name.

## Tools

| Tool | Arguments | Result |
| --- | --- | --- |
| `list_components` | `query?: string`, `locale?: 'en' \| 'ar'` | Matching exports, summaries and slugs; an empty query returns all 39. Search covers names, purpose and prop names. |
| `get_component` | `name: string`, `locale?: 'en' \| 'ar'` | Props/defaults, typed events and slots, CSS variables, attribute targets, accessibility, provider limits and two complete Vue examples. Accepts `WAccordion` or `accordion`. |
| `get_guide` | `topic`, `locale?: 'en' \| 'ar'` | Full versioned guide Markdown. Topics: `installation`, `providers`, `customization`, `ssr`, `data-models`, `agents`, `verification`. |

Every tool result includes the package version and `status: 'unreleased'`.
Unknown components return an error instead of an invented API. Invalid arguments
are rejected by the MCP SDK schema. Search returns an empty list when nothing matches.

## Resources and prompt

`wakeb://catalog` lists the component index. Each component has English and Arabic
resources, for example `wakeb://components/accordion/en` and
`wakeb://components/accordion/ar`. Resources carry the same contracts as the tools.

The `write_wakeb_component` prompt takes `task` and `framework` (`vuetify`,
`primevue` or `shadcn`) and prepares an implementation brief. It asks the agent to
read setup and component contracts first; it does not generate or execute code.

## Suggested agent workflow

1. Match the catalog version to the installed package. The public 0.7 API differs.
2. Read `get_guide({ topic: 'providers' })` and select the app's provider once.
3. Search with `list_components({ query: 'modelValue' })` or a component name.
4. Read `get_component({ name: 'WTextField', locale: 'ar' })` for every component used.
5. Write typed Vue SFCs using root named imports, then run the app's typecheck and interaction checks.

For example, use `selectedTab` and `updateTab` with `WTabs`; use `v-model` with
`WTextField`. `WDataTable` emits loading options, while your application fetches,
sorts and pages the rows. The MCP never infers native provider props as Wakeb props.

## Maintenance and verification

Edit `docs/reference-data.mjs`, `docs/recipes.mjs` and the public contracts, then run
`npm run agents:build`. This regenerates `packages/mcp/catalog.json` and the skill's
references. `npm run docs:build` also refreshes them and creates both downloads.
The SDK handshake, discovery, bilingual lookup, resources, prompt, invalid input
and unknown-component behavior are tested with `npm run test:agents`.

The server reads only its bundled catalog and uses the official MCP TypeScript
SDK with stdio. It has no shell, workspace-file or network tools. An installed
catalog is a snapshot: regenerate or reinstall it when upgrading the library.
See [verification](./verification) for the component coverage and remaining limits.
