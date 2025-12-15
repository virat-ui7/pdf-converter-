# GitHub Actions Workflows

This directory contains CI/CD workflows for automated testing and deployment.

## Workflows

### test.yml
Runs on every pull request and push to main/develop branches.
- Linting check
- Code formatting check
- TypeScript type checking
- Build verification

### build.yml
Runs on pull requests to verify the project builds successfully.

### deploy.yml
Runs on merge to main branch.
- Runs all tests
- Builds the project
- Deploys to Vercel production

### preview.yml
Runs on pull requests.
- Builds the project
- Creates preview deployment on Vercel

## Setup

1. Add GitHub Secrets (Repository → Settings → Secrets):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

2. Connect Vercel to GitHub:
   - Go to Vercel Dashboard
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. Workflows will run automatically on:
   - Pull requests (test + preview)
   - Merges to main (deploy to production)

