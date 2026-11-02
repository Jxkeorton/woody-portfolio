---
name: add-sanity-block
description: Add a new Sanity content block to the Astro portfolio site using the BDD workflow (fixture, failing test, schema, Astro component, renderer registration, validation, commit). Use when the user asks for a new block type, section, or content layout that editors can add to a project page.
---

# Add a Sanity block

Follow this order every time. The block is complete only when behaviour tests pass and the validation steps are clean. This project uses Astro only: no UI framework islands. Components are `.astro` files, and any client-side behaviour is a small vanilla TypeScript module.

## Conventions

- Sanity `_type`: camelCase (`pullQuote`)
- Folder and component: PascalCase (`src/blocks/PullQuote/PullQuote.astro`)
- Files in the folder:
  - `PullQuote.astro` (component)
  - `pullQuote.schema.ts` (Sanity schema)
  - `PullQuote.test.ts` (behaviour tests)
  - `pullQuote.fixture.ts` (sample Sanity data)
  - `pullQuote.types.ts` (the block's data shape, hand-written because this project does not use TypeGen)
  - `pullQuote.client.ts` (only if the block needs client-side JS)
- A new block touches exactly these shared places (miss one and it silently does not render or cannot be added):
  1. `src/blocks/BlockRenderer.astro`: one line in the `components` map
  2. `src/utils/project.types.ts`: add the block to the `Block` union
  3. `src/utils/sanity.ts`: add a `_type == "pullQuote" => { ... }` branch to the `PROJECT_QUERY` projection
  4. `sanity/schemaTypes/index.ts`: add the schema to `blockSchemas`
  5. `sanity/schemaTypes/project.ts`: add `{ type: 'pullQuote' }` to the `blocks` array `of: [...]`
- Queries live in `src/utils/sanity.ts` (not `src/lib`). CLAUDE.md is the source of truth for paths.

## Steps

### 1. Pin down the requirement
Restate what the block is for in one or two sentences. Confirm, asking the user only about what is unclear:
- What editors enter (fields, which are required, which are optional)
- What visitors see, including empty and minimal states
- Whether it needs interactivity (carousel, lightbox, toggle). Default to none: prefer semantic HTML and CSS. Use a small `.client.ts` script only if CSS cannot do it.
- A `_type` name that Sanity does not reserve. Reserved names include `text`, `image`, `file`, `string`, `number`, `boolean`, `array`, `object`, `block`, `reference`, `slug`, `url`, `date`, `datetime` and `span`. Choose a different name (this project uses `richText` and `imageSet`). The editor-facing `title` can still be plain, for example "Text". Step 9 catches a clash.
- Whether it duplicates an existing block. Keep the editor to roughly 6 to 8 block types, so prefer extending a block with an option over adding a near-duplicate.

List the behaviours as given/when/then lines and show them to the user before writing code if anything was ambiguous.

### 2. Branch
Create `feat/block-<name>` from an up-to-date `main`. Never work on `main`.

### 3. Fixture
Create `<blockName>.fixture.ts` exporting at least: `full` (every field), `minimal` (required fields only), and any special case (for example no attribution, no image). Fixtures are typed with the generated Sanity types where available, never `any`.

### 4. Failing tests first
Write `<BlockName>.test.ts` with behaviour-style names:

```ts
describe('PullQuote block', () => {
  describe('given a quote with an attribution', () => {
    it('shows the quote text and the attribution', async () => { /* ... */ })
  })
  describe('given a quote without an attribution', () => {
    it('shows only the quote text', async () => { /* ... */ })
  })
})
```

How to test an Astro component: render it with Astro's Container API (`import { experimental_AstroContainer as AstroContainer } from 'astro/container'`) and assert on the returned HTML string. This project has no happy-dom, jsdom or Testing Library, and new dependencies need approval, so write small local helpers instead (for example `headings(html)` or `imgs(html)` that pull tags and attributes out with a regex). See `src/blocks/Heading/Heading.test.ts` and `src/blocks/ImageSet/ImageSet.test.ts`. `vitest.config.ts` already uses `getViteConfig` so `.astro` files compile.

Always cover:
- Full data renders correctly
- Optional fields missing: nothing broken, no empty wrappers or labels
- Accessibility: images have alt text, interactive controls have accessible names, headings are in a sensible order
- Interactive behaviour, if any, tested against the `.client.ts` module with user-event (keyboard as well as mouse)

Run the new tests and confirm they fail for the right reason (missing component, not a typo). Do not proceed on a test that passes before the implementation exists.

### 5. Schema
Create `<blockName>.schema.ts` using `defineType` and `defineField` from `sanity`:

```ts
import { defineType, defineField } from 'sanity'

export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Pull quote',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({ name: 'attribution', title: 'Attribution', type: 'string' }),
  ],
  preview: {
    select: { title: 'text', subtitle: 'attribution' },
  },
})
```

Rules:
- Every image field has a required `alt` field.
- Every field has a plain-English `title`, and a `description` when it is not obvious to a non-technical editor.
- Add a `preview` so editors can tell blocks apart in the list.
- Set sensible length limits and required validation.
- Never rename an existing field without a migration plan. This only applies when changing an existing block.
- Register the schema in `sanity/schemaTypes/index.ts` and add it to the `blocks` array `of: [...]` in `sanity/schemaTypes/project.ts`.
- Do not build an array field with no allowed types: Sanity rejects `of: []`. Add the field when its first member exists.

### 6. Component
Create `<BlockName>.astro`:
- Typed `Props` interface from the generated Sanity types
- No data fetching inside the block; it only renders its props
- Semantic HTML, scoped CSS, design tokens from `src/styles`
- Images through the project's image helper with explicit width and height and lazy loading below the fold
- Render nothing for absent optional fields rather than empty elements
- If client JS is truly needed: put logic in `<blockName>.client.ts`, import it with a `<script>` in the component, keep it dependency-free, and progressively enhance so the content works without JS

- Content that can be blank in a way the schema cannot prevent (an empty paragraph, an empty string) must render nothing, not an empty element a screen reader will announce. Add a test for it.
- Blocks set no outer margin. Vertical rhythm between blocks is owned by `BlockRenderer.astro`.
- Rich text uses `astro-portabletext` (pre-approved) inside the shared `.prose` class in `src/styles/global.css`. Scoped component CSS does not reach the elements the renderer creates, so prose styling belongs in `global.css`.
- Images: use `imageUrl` and `imageSrcSet` from `src/utils/sanity.ts` and the pure helpers in `src/utils/image.ts`. Reserve space from the cropped size, set `object-position` from the hotspot, use the LQIP as a background, and never ask for more pixels than the original.
- Offer editors named options (for example `layout: inset | wide | full`), never raw values.
- Astro templates: a nested `{...}` expression after a sibling element inside a ternary does not parse; move it out. Raw generated CSS needs `<style is:inline set:html={...}>`. oxfmt does not format `.astro` files, so keep their indentation tidy by hand.

If a new dependency outside the pre-approved list seems necessary, stop and ask the user first.

### 7. Wire it up
- Add one case to `src/blocks/BlockRenderer.astro` mapping the `_type` to the component.
- Add the block's fields to the `PROJECT_QUERY` projection in `src/utils/sanity.ts`, selecting only what the block uses, and add a query test for them in `src/utils/sanity.test.ts`.
- Add a case to `src/blocks/BlockRenderer.test.ts` that the block renders in order with other blocks.
- Add the type to the `Block` union and the schema to the two Studio lists (see Conventions).
- Regenerate Sanity types if the project uses TypeGen, and fix any type errors.

### 8. Make tests pass, then refactor
Implement the minimum to turn the tests green, then tidy with tests still green. Add a test for any behaviour discovered along the way.

### 9. Validate (do not skip steps, do not claim a step passed without running it)
0. `node_modules/.bin/sanity schema validate` (reserved names and bad field definitions fail here, not in the unit tests)
1. `pnpm test`
2. `pnpm lint` and `pnpm format:check`
3. `pnpm check` (astro check)
4. `pnpm build`
5. Review `git diff` and `git diff --staged` against the requirement: only block-related changes, no debug code, no `.only` in tests, no secrets, no unapproved dependencies, every stated behaviour has a test.

Check the block with real content. You cannot write to the Sanity dataset, so ask the user to add one in the Studio (`pnpm studio`), publish it, and refresh the dev server. Say plainly in the report if you did not see it with real content. Also check the built page: if this block added client-side JS, note how many KB, and justify it.

### 10. Commit
Branch from an up-to-date `main`. If the previous block's PR is not merged yet, either wait or stack on it, and note that a stacked PR cannot be opened once its base branch has been deleted by a merge; open it against `main` then. Do not commit generated files such as `.claude/launch.json`.

Use a Conventional Commit, for example `feat(blocks): add pull quote block`. Small follow-up commits are fine (`test(pullQuote): cover missing attribution`). Do not push, open a PR or merge unless asked.

### 11. Report
Finish with a short summary:
- The block's `_type`, fields, and what visitors see
- Which behaviours are tested
- Which validation steps ran and their results, including anything not verified
- Any decision the user should review (new dependency, schema trade-off, client JS)
- A reminder to check the block in Studio and on a preview deploy before merging, since the tests cannot judge how it looks to an editor
