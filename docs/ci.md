# Continuous integration

The **CI / Quality Gate** check runs for pull requests targeting main, pushes to main, and manual dispatches. It uses Node.js 22, pnpm 11.18.0, a frozen lockfile, and no deployment credentials.

Run the same checks locally:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm validate:navigation
pnpm build
```

The aggregate test command discovers every top-level tests/*.test.ts file. Existing per-module test scripts remain available. All checks are mandatory; a failed step leaves the job failed even when later diagnostic steps run.

Vercel continues to own deployment and preview builds. CI does not deploy, modify environments or access production secrets. Production build may still depend on public backend availability depending on prerender behavior.

## Enable main protection after baseline is green

In GitHub Settings → Rules → Rulesets (or Settings → Branches), create an active ruleset targeting main. Require pull requests and status checks, select the actual Quality Gate check name from a successful run and the Vercel preview check if available, require branches to be up to date, block force pushes and deletions, and avoid administrator bypass where practical. Do not require an external approving reviewer for a single-maintainer workflow. Check that the rules apply before merging subsequent PRs.

The previous theme-only workflow is retained during initial CI rollout; remove it once this broader check is green and no existing protection requires it.
