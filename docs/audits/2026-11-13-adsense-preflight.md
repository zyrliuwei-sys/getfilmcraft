# AdSense pre-submission implementation — 2026-11-13

Implemented in the local working tree. No production deployment or Git commit was performed.

## Public navigation and site information

- Removed public sign-in links and the signed-in user/admin menu from the shared marketing header, including its mobile state. Removed the global Google One Tap prompt.
- Kept the authenticated application and admin guards. Tabbit verified direct `/admin` navigation still redirects to `/sign-in?callbackUrl=%2Fadmin`.
- Legacy `/pricing` and `/ai-livestream` template routes now redirect to `/`, preventing their old public authentication calls to action from rendering.
- Added `/about` and `/contact` to the shared header, footer, and sitemap. Static information pages now use the same public shell.
- About uses the exact requested title and independence statement. The maintainer is described only as an independent developer.
- Contact uses `support@getfilmcraft.org` and the user-approved target of replying within 3–5 business days. Its title is exactly `Contact getfilmcraft.org`.
- Removed two stale `/logo.png` author-image references from existing, noindexed template blog articles after the crawl found that image was missing.
- Authentication endpoints and robots.txt exclusions remain operational. The public-content acceptance check covers rendered HTML and anchors, not protected application code or crawler exclusion directives.

## Release information

Official source: [GitHub latest release API](https://api.github.com/repos/storytold/filmcraft/releases/latest) and [v0.20.1 release](https://github.com/storytold/filmcraft/releases/tag/v0.20.1).

The verified response reports `v0.20.1`, published `2026-11-12T00:26:09Z`, with 50 assets. The checked-in fallback snapshot contains that same version, timestamp, and exact asset-name set; the obsolete 0.12.0 fallback is gone.

The server now retrieves version, publication date, and asset names together. Successful responses are cached for an hour. On an outage it retains the last successful response, or uses the verified snapshot, and retries after five minutes. Download and online pages display the release date and flag fallback data. Invalid dates, drafts, prereleases, empty asset lists, and malformed tags cannot replace a known release.

All 23 platform download entries match published v0.20.1 asset names, as do the checksum and web-build links. The unavailable Windows x86 artifacts are filtered out. Browser verification covered all four platform tabs; installers were not downloaded or executed.

## New guides

The repository contained four guides before this work. Twelve additions bring `/guides` to 16 articles and the sitemap to 27 English URLs (including the new About and Contact pages). The homepage keeps its original four featured cards and links to the complete guide index. Every new article includes a relevant existing interface image, version-specific official references, practical checks, and links to related guides.

Counts below exclude MDX metadata, markup, and link destinations. Each article exceeds the requested 300 words; rendered browser counts also passed independently.

| URL                                         | English words |
| ------------------------------------------- | ------------: |
| `/guides/filmcraft-audio-cleanup`           |           666 |
| `/guides/filmcraft-color-management-scopes` |           647 |
| `/guides/filmcraft-export-settings`         |           619 |
| `/guides/filmcraft-keyframe-animation`      |           672 |
| `/guides/filmcraft-linux-installation`      |           655 |
| `/guides/filmcraft-multicam-audio-sync`     |           625 |
| `/guides/filmcraft-premiere-shortcuts`      |           576 |
| `/guides/filmcraft-proxy-workflow`          |           600 |
| `/guides/filmcraft-relink-offline-media`    |           613 |
| `/guides/filmcraft-subtitles-srt`           |           628 |
| `/guides/filmcraft-vertical-video`          |           673 |
| `/guides/filmcraft-vs-davinci-resolve`      |           689 |

Guide publication/modified dates are now per article. The new articles, Article structured data, and sitemap lastmod use 2026-11-13; the original articles retain their original date. Related-article lists are limited to three relevant entries. Tables scroll within their container on narrow screens.

Sources include the FilmCraft v0.20.1 keyboard, project-file, caption, graphics, sequence-settings, multicamera, audio, and export documentation/source, plus [Blackmagic's official Resolve overview](https://www.blackmagicdesign.com/products/davinciresolve) and [training resources](https://www.blackmagicdesign.com/products/davinciresolve/training). The guides are documentation-based instructions, not claimed hands-on application benchmarks.

## Verification

- `pnpm build` passed after the final code/content changes. Dependency directive warnings remain non-blocking.
- `pnpm exec tsc --noEmit --pretty false` passed.
- `pnpm exec tsx --test scripts/tests/filmcraft-release.test.ts` passed both tests, covering initial outage, cache reuse, a future-release fixture, rate limiting, invalid responses, recovery, and asset/version consistency.
- `git diff --check` passed.
- A local production-build crawl visited all 27 sitemap URLs plus blog/template paths: 32 successful page responses, nine distinct referenced local images, no broken internal links or TOC fragments, and no `/admin` or `/sign-in` strings in public page HTML. No public admin, dashboard, login, or settings anchors were found.
- Tabbit verified About/Contact content, the email link, desktop and mobile navigation, all 12 article bodies, production canonicals, publication dates, download tabs, and the direct admin redirect.
- Mobile table check: 540px table scrolls inside its container; the document stays at the 390px viewport width. Desktop light theme and mobile dark theme were visually inspected.
- No browser page errors occurred during the final article pass.
- The homepage `Review()` implementation and all `fc.home.review.*` message values match their pre-change copies. Both strengths/limits lists and the alpha/readiness/plugin limitations are unchanged.
- No Chinese pages were added; `messages/zh.json` is unchanged.

Local preview: [Guides](http://127.0.0.1:3102/guides), [About](http://127.0.0.1:3102/about), [Contact](http://127.0.0.1:3102/contact).
