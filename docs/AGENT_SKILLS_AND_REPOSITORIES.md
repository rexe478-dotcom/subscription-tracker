# Agent Skills and GitHub Repositories

## Antigravity native structure
Antigravity supports project-specific skills in `.agents/skills/<skill-name>/SKILL.md`, rules in `.agents/rules/*.md`, and custom agents in `.agents/agents/*.md`. This pack already contains project-specific skills and role definitions. Keep these in the repository so the project remains reproducible.

Official documentation:
- Skills: https://antigravity.google/docs/skills
- Customization discovery: https://antigravity.google/docs/customization-discovery
- Rules: https://antigravity.google/docs/rules/
- Google Codelab on agent skills: https://codelabs.developers.google.com/getting-started-with-antigravity-skills

## Recommended external skills (verify before installing)
Use the `skills` CLI if available in the Antigravity terminal. Check the repository README and inspect the skill contents before installation.

### 1. Supabase official agent skills — recommended
Repository: https://github.com/supabase/agent-skills
Official guide: https://supabase.com/docs/guides/ai-tools/ai-skills
Install the relevant skills at project scope:
```bash
npx skills add supabase/agent-skills --skill supabase
npx skills add supabase/agent-skills --skill supabase-postgres-best-practices
```
Use for Supabase Auth, Postgres, RLS, Edge Functions, migrations, Cron and security review. This is the most important external skill set for this stack.

### 2. Vercel React and web-design guidelines — recommended selectively
Repository: https://github.com/vercel-labs/agent-skills
Official skill directory: https://vercel.com/docs/agent-resources/skills
```bash
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```
Use the React performance skill for component architecture/performance and web-design-guidelines for accessibility and interface review. Vercel's deployment skills are not required because the proposed host is Cloudflare Pages.

### 3. UI/UX Pro Max — optional, not a dependency
Repository to inspect: https://github.com/tjhes/antigravity-skills
Skill path reported in the repository: `skills/ui-ux-pro-max/`.
Before installing, verify current maintainer activity, licence, exact install instructions, skill contents, and compatibility with the current Antigravity version. Do not let its generic palette/style suggestions override this project's `DESIGN_SYSTEM.md`.
A second source to inspect is https://github.com/TTSubin/antigravity-mcp/tree/main/.agents/skills/ui-ux-pro-max; verify whether it is maintained and whether it duplicates the first source. Install at most one UI/UX Pro Max implementation.

### 4. Optional visual-design reference
Repository: https://github.com/devdanalmag/antigravity-designer
This is a design-rules template, not a mandatory package. Inspect its licence and contents before copying. Prefer this project's own rules if it overlaps.

## Project-specific skills already included
- `product-planning`: requirements, scope and product decisions.
- `ui-design-system`: design tokens, layout, accessibility and visual QA.
- `frontend-engineering`: React/TypeScript/Vite implementation.
- `supabase-engineering`: Auth, Edge Functions and Supabase patterns.
- `postgres-data-modeling`: schema, migrations, indexes and RLS.
- `pwa-engineering`: installability, service worker and offline behaviour.
- `notifications-engineering`: server-side push/email scheduling.
- `mascot-brand-assets`: character and brand asset workflow.
- `qa-accessibility-security`: test, accessibility and security review.

## Agent roles included
- Product & Architecture Lead (coordinates and resolves decisions).
- Design Systems Agent.
- Frontend Engineer.
- Supabase & Database Engineer.
- PWA & Notifications Engineer.
- QA, Accessibility & Security Engineer.

## Installation policy
- Do not install every skill found online.
- Prefer official sources, minimal overlapping skills and project-local installation.
- Never run arbitrary scripts from a repository without inspecting them.
- Ask before enabling MCP servers or granting account/database access.
- Record exact installed skill versions and date in `docs/IMPLEMENTATION_LOG.md`.
