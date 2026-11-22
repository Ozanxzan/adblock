# Nazuaf Privacy Test

Free ad blocker, tracker, and DNS filter test for browsers, extensions, VPNs and DNS filters. Check uBlock Origin, AdGuard, Pi-hole or NextDNS against 128 ad and tracker hosts in one click.

Live: **https://adblock.nazuaf.com**

Fork of [Turtlecute33/adblocktest](https://github.com/Turtlecute33/adblocktest) (AdBlockTest), rebuilt so the site is easy to edit. See **README-REPLIKASI.md** (Bahasa Indonesia) for what changed and why.

## Run locally

```bash
npm ci
npm run dev        # dev server with hot reload
npm run build      # production build into dist/
```

## Edit the look

All Nazuaf styling lives in one file: **`src/sass/theme/nazuaf.sass`** (loaded last in `src/sass/index.sass`, so it wins without `!important`). Edit it, run `npm run build`, done. No inline `<style>` blocks in the templates anymore.

## Deploy

Push to `master` — GitHub Actions builds and deploys to GitHub Pages (see `.github/workflows/deploy.yml`).

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
