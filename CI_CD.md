# NutriSnap CI/CD

## Continuous integration

The frontend workflow is [`.github/workflows/frontend-ci.yml`](.github/workflows/frontend-ci.yml). It runs on pushes to `master` and on pull requests whose target branch is `master`. The repository's checked-out default branch is currently `master`, so the workflow follows the branch used by this project.

The job runs on `ubuntu-latest` with Node.js 20. Node 20 is compatible with the current React 18, Vite 6, and package-lock configuration. Each run:

1. Checks out the repository.
2. Restores npm's dependency cache through `setup-node`.
3. Installs the lockfile exactly with `npm ci`.
4. Runs `npm run lint`.
5. Runs `npm test`, which executes the Node built-in tests in `src/tests/*.test.js`.
6. Runs `npm run build`, which creates the Vite production bundle in `dist/`.

No backend calls, credentials, or secrets are required by these CI checks. The unit and request-contract tests use local fixtures and do not replace live verification of the Express backend, Nutritionix, or Gemini. The workflow does not publish artifacts, deploy to Render, or change backend code.

## Local verification

Run the same checks from the frontend repository root:

```sh
npm ci
npm run lint
npm test
npm run build
```

The local `npm ci` attempt was blocked by a Windows file lock on an existing `node_modules` native binary. Dependencies were repaired with `npm install`, after which `npm run lint`, `npm test`, and `npm run build` passed. GitHub Actions runs in a clean Ubuntu environment, so its `npm ci` step remains the authoritative lockfile-install check. The existing browser workflow remains a separate local verification tool because it needs Chrome and an isolated local server; it is not silently added to GitHub CI.

## Render deployment review

No Render configuration file (`render.yaml`, Dockerfile, or Render workflow) is present in this repository. The existing Render deployment is represented by the live application link in `README.md` and is configured outside this checkout. This change therefore adds CI only and does not propose or enable continuous deployment.

If deployment automation is desired later, confirm the Render service's current settings first: static-site versus web-service type, build command, publish directory, SPA fallback behavior, environment variables, and deploy-hook permissions. A future CD workflow must use protected secrets and be reviewed separately. This repository does not automatically deploy, push, or commit changes.

## Verifying the workflow on GitHub

1. Commit and push `.github/workflows/frontend-ci.yml` and `CI_CD.md` to a branch on GitHub. This local task does not perform that push.
2. Open the repository's **Actions** tab and select **Frontend CI**.
3. Open the run for the push, or open the pull request's **Checks** tab.
4. Confirm that **Install dependencies**, **Run ESLint**, **Run frontend tests**, and **Build production bundle** are all green.
5. Open the build log if a step fails. GitHub will show the exact command and output; fix the branch and push again.

The workflow has not run on GitHub from this local workspace, so this documentation does not claim a successful GitHub Actions run.
