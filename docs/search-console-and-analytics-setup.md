# Search Console and GA4 setup

The repository produces crawlable HTML, `robots.txt`, `sitemap.xml`, `feed.xml`, route metadata and structured data during every production build. Neither Google Search Console nor Google Analytics requires a secret in Git.

## Current measurement decision — 18 September 2026

Risks In Sync remains an independent editorial experiment. The current decision deliberately separates search visibility from audience tracking:

- **Deploy the discoverability work.** Crawlable HTML, metadata, structured data, `robots.txt`, the sitemap and the Atom feed are part of the publication infrastructure.
- **Use Google Search Console as the active measurement baseline.** The `risksinsync.com` Domain property is verified through Porkbun DNS and the sitemap has been submitted successfully. Search Console is an ownership, indexing and search-performance tool. It does not require a browser analytics script, add cookies to the site or activate GA4. Use it to confirm which pages Google can index, detect canonical or structured-data problems, and see aggregate impressions, clicks, queries, CTR and position.
- **Keep GA4 disabled.** Do not create `VITE_GA_MEASUREMENT_ID` in Netlify. With the variable absent, the Google script, analytics requests, analytics cookies and consent control remain inactive.
- **Do not treat Search Console as a ranking purchase or guarantee.** Submitting a sitemap or requesting indexing helps discovery and diagnosis but does not guarantee indexing or improve ranking by itself.

This is the lowest-friction default: obtain the information needed to know whether the publication is discoverable, without starting browser-level audience measurement or creating an ongoing analytics operation.

## Production and Search Console handoff — 18 September 2026

The discoverability release is live and the initial setup has been completed:

- the Domain property for `risksinsync.com` is verified through the Porkbun DNS TXT record;
- the TXT record must remain in DNS to preserve verification;
- `https://risksinsync.com/sitemap.xml` was accepted by Search Console and reported six discovered pages;
- the live URL was inspected and indexing was requested for the homepage, Review archive, Year 1 · Nr. 1 and Year 1 · Nr. 2;
- the Pages report was still processing its first dataset, so no indexed/not-indexed conclusion should yet be drawn;
- production checks for the public routes, discovery files, real 404 and feedback form passed;
- the publisher completed the mobile visual check separately; and
- GA4 remains inactive because no production `VITE_GA_MEASUREMENT_ID` has been configured.

The next action is observation rather than more setup. Revisit Search Console after it has processed the property, record the first indexing states and queries in the table below, and investigate only specific exclusions or canonical errors reported by Google.

### Review triggers

Revisit this decision before enabling GA4 or another analytics provider, and when any of the following becomes true:

- Risks In Sync becomes a company, commercial service or part of another legal entity.
- Advertising, sponsorship, paid products, subscriptions, lead generation or email acquisition are introduced.
- Reader accounts, authentication, personalisation or cross-device/user measurement are introduced.
- The publication needs conversion, campaign or funnel measurement that Search Console and Netlify cannot provide.
- A new team or external supplier receives access to reader or analytics data.
- The intended audience, jurisdictions, controller identity, privacy contact or data-retention needs materially change.
- Google, Netlify, applicable guidance or the site's measurement implementation materially changes.

At review time, record the date, responsible legal entity/controller, purpose of measurement, chosen provider, data collected, retention, access, transfer position, consent mechanism and approval decision in this section before activating anything.

## Google Search Console and Porkbun

1. Sign in to [Google Search Console](https://search.google.com/search-console/), open the property selector and choose **Add property**.
2. Choose **Domain** and enter only `risksinsync.com`—no protocol, `www`, or path. A Domain property covers protocols and subdomains and is verified through DNS.
3. In the verification dialog, choose/copy the TXT record. Keep the dialog open.
4. In Porkbun, open **Account → Domain Management**, find `risksinsync.com`, select **DNS**, then **Add Record**. Use:
   - Type: `TXT`
   - Host: blank (the root domain)
   - Answer/Value: the complete `google-site-verification=...` value supplied by Search Console
   - TTL: Porkbun's default
5. Save the record. Do not remove or replace unrelated DNS entries. Return to Search Console and select **Verify**. DNS propagation can delay success; leave the TXT record in place and retry later if necessary.
6. After the first deployment of this change, open **Sitemaps**, enter `sitemap.xml`, and submit. Confirm that the fetched URL is `https://risksinsync.com/sitemap.xml` and that the status is successful.
7. Use **URL inspection** for `https://risksinsync.com/`, `/review/`, and every published `/review/<slug>/` URL. Check the live URL, confirm that it is crawlable and that Google's selected canonical matches the declared canonical, then use **Request indexing** after the first deployment.
8. Record the initial indexed/not-indexed state. In **Performance → Search results**, monitor pages and queries weekly at first; record the first impression and first organic visit without treating sitemap submission as an indexing guarantee.

Reference: [Google Domain properties](https://support.google.com/webmasters/answer/34592), [Google DNS verification](https://support.google.com/webmasters/answer/9008080), and [Porkbun DNS record steps](https://kb.porkbun.com/article/231-how-to-add-dns-records-on-porkbun).

### Indexing baseline

| URL | Publication date | Submitted | Indexing status | First impression | First organic visit | Notes |
|---|---|---|---|---|---|---|
| `https://risksinsync.com/` | — | 2026-09-18 | Requested; processing | — | — | Live URL inspected. |
| `https://risksinsync.com/review/` | — | 2026-09-18 | Requested; processing | — | — | Live URL inspected. |
| `https://risksinsync.com/review/year-1-nr-1/` | 2026-09-08 | 2026-09-18 | Requested; processing | — | — | Live URL inspected. |
| `https://risksinsync.com/review/year-1-nr-2/` | 2026-09-15 | 2026-09-18 | Requested; processing | — | — | Live URL inspected. |
| `https://risksinsync.com/review/<new-slug>/` | YYYY-MM-DD | YYYY-MM-DD | Not checked | — | — | Copy this row for each new issue. |

## GA4 creation and Netlify configuration

1. In [Google Analytics](https://analytics.google.com/), create or select the appropriate account. Under **Admin → Create → Property**, create a GA4 property for Risks In Sync with the publisher's correct reporting time zone and currency.
2. Under **Admin → Data streams → Add stream → Web**, use `https://risksinsync.com` and a clear stream name such as `Risks In Sync — production`.
3. Disable **Enhanced measurement** for the initial launch. The site sends its own canonical `page_view`; leaving automatic page views or form interactions enabled can duplicate or broaden collection.
4. Copy the stream's measurement ID in the form `G-XXXXXXXXXX`. Do not add the Google snippet manually and do not use Google Tag Manager; the application loads `gtag.js` only after explicit acceptance.
5. Review GA4 settings before activation: keep Google Signals, advertising personalisation, remarketing and User-ID off; choose and document an appropriate data-retention period; do not link advertising products unless the privacy position is reviewed again.
6. In Netlify, open the Risks In Sync project and go to **Project configuration → Environment variables → Add a variable**. Create `VITE_GA_MEASUREMENT_ID` with the copied ID, scope it to builds, and give it a value only for the **Production** deploy context. Do not set values for Deploy Previews, branch deploys, preview servers or local development.
7. Trigger a production deploy only after reviewing the Privacy wording and consent decisions below. Vite embeds this public measurement ID at build time; it is an identifier, not a secret.

The implementation also checks `window.location.hostname === "risksinsync.com"`, so it remains inactive on localhost and `*.netlify.app` even if a variable is accidentally exposed to those builds. An absent or malformed ID leaves analytics completely off.

Reference: [Google's GA4 setup](https://support.google.com/analytics/answer/14183469) and [Netlify context-specific environment variables](https://docs.netlify.com/build/environment-variables/overview/).

## What is measured after acceptance

- Canonical page views using origin + path only (no query string).
- Landing page and source/medium/campaign through GA4's normal acquisition attribution.
- Navigation from one review to an older or newer review.
- Successful feedback submission as an aggregate event containing only the review slug—not the selected answer or comment.

The code does not enable advertising, remarketing, Google Signals, ad personalisation, User-ID, automatic form capture or analytics before consent. Rejection is stored. Withdrawal sets the GA disable flag, removes known first-party `_ga` cookies where possible and stops future application events.

## Required publisher review before enabling GA4

- Confirm whether consent is the chosen legal basis and whether a certified consent-management platform is required for the publisher's audiences/jurisdictions.
- Confirm the Privacy wording, controller details, Google processing/transfer disclosures, retention period and a practical contact route for privacy rights.
- Confirm Google account settings match the statements above and that no other Netlify/site integration injects tracking.
- Decide and document a separate GPTBot training policy. `robots.txt` currently allows public crawling by the wildcard rule and explicitly allows OAI-SearchBot for search discovery; it intentionally adds no GPTBot-specific rule. OAI-SearchBot and GPTBot serve different purposes.
- Current publication packs declare no issue-specific images (`images: []`), so both issues correctly fall back to the generic social image. Add a cleared `social` or `hero` image through the existing publication pack when available; the unreferenced `public/cascade-risk-review-cover-y1-n2.png` is deliberately not assumed to be approved editorial media.

`llms.txt` is deliberately out of scope. It can be considered later as a supplementary machine-readable pointer, but it does not replace rendered HTML, links, canonical metadata, robots rules, the sitemap, the feed or structured data.

## Post-deployment checks

1. Fetch `/`, `/review/`, every issue, `/about/`, `/privacy/`, `/robots.txt`, `/sitemap.xml`, `/feed.xml`, and a nonsense URL. Expect `200` for published resources and a real `404` for the nonsense URL.
2. View source—not only the Elements panel—and confirm meaningful text, one canonical URL, metadata and parseable JSON-LD on each route.
3. In a clean browser profile, open DevTools Network filtered for `google`, `gtag`, `collect`, and `analytics`: reload before making a choice and verify zero Google requests and no `_ga` cookie.
4. Reject, reload and confirm the choice persists with zero Google requests. Then accept and confirm one `gtag/js` load and a page-view request. Disable analytics from the footer or Privacy, navigate again, and confirm no future collection request.
5. Test a feedback submission and confirm GA4 receives only `feedback_submit` plus `review_slug`; inspect the request to confirm no answer, comment or query string is included.
6. Validate rich results/structured data, share previews, keyboard focus, mobile layout and console hydration errors. Confirm Netlify still lists each slug-specific feedback form.
7. In Search Console, submit the sitemap, inspect the key URLs and fill in the baseline table above.
