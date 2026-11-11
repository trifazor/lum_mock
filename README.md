# LUM — Cashflow for SMEs

One-page SvelteKit site (static, GitHub Pages ready).

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs ./build
```

## Deploy to GitHub Pages
1. Push this folder to a GitHub repo on the `main` branch.
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds and publishes automatically
   (it sets `BASE_PATH=/<repo-name>` for you).
