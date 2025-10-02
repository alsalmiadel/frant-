# DEPLOYMENT_GUIDE (Consolidated)
_Generated: 2025-10-02 18:30:02 UTC_

This guide consolidates prior deployment docs (DEPLOYMENT_SETUP.md, DEPLOYMENT_CHECKLIST.md, PRODUCTION_ENV_SETUP.md, NETLIFY_BUILD_FIX.md, NETLIFY_DEPLOY_FIX_FINAL.md, QUICK_BUILD_FIX_SUCCESS.md).

## Requirements
- Node: 20.x (engines in package.json)
- NPM: 10.x
- Environment: `.env` aligned with `.env.example`

## One-time Setup
```bash
nvm use
npm ci
npm run build
```

## Environment
- Maintain `.env.example` as the single source of truth.
- Do not commit `.env`, secrets, or `dist/`.

## CI/CD
- Use `npm ci` on CI.
- Cache node_modules by lockfile.
- Enforce `npm run build` and `npm run preview` jobs.

## Netlify/Vercel
- Set NODE_VERSION=20 and NPM version to 10.
- Add required environment variables from `.env.example`.
