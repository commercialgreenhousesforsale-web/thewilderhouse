# Automated Deployment Setup

This project uses **GitHub Actions** to automatically deploy to Cloudflare Pages on every push to `main`.

## Setup Instructions

### 1. Get Cloudflare API Credentials

You need two secrets from Cloudflare:

1. **CLOUDFLARE_API_TOKEN** - API token for authentication
   - Go to Cloudflare Dashboard → Settings → API Tokens
   - Create a new token with these permissions:
     - Zone: Cloudflare Pages - Manage
     - Resources: Include → Your account
   - Copy the token value

2. **CLOUDFLARE_ACCOUNT_ID** - Your Cloudflare Account ID
   - Go to Cloudflare Dashboard → Settings → Accounts
   - Copy your Account ID (it's on the right side panel)

### 2. Add Secrets to GitHub

1. Go to your GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add both secrets:
   - Name: `CLOUDFLARE_API_TOKEN`, Value: [your token]
   - Name: `CLOUDFLARE_ACCOUNT_ID`, Value: [your account ID]

### 3. Done!

Now whenever you push to `main`:
1. GitHub Actions automatically runs the deploy workflow
2. The site deploys to Cloudflare Pages
3. Live in ~1-2 minutes

No more manual `wrangler` commands!

## How It Works

- **On Pull Requests**: Deployment preview created, comment posted
- **On Push to Main**: Automatic production deployment
- **Failure**: GitHub will show failed status, you can see logs in Actions tab

## Troubleshooting

If deployment fails:
1. Check GitHub Actions logs (Repo → Actions → Latest workflow)
2. Verify secrets are correctly set
3. Check that `wrangler.toml` exists in the root directory

## Reverting a Deployment

If you need to revert:
```bash
git revert <commit-hash>
git push origin main
# This will trigger a new deployment with the reverted changes
```
