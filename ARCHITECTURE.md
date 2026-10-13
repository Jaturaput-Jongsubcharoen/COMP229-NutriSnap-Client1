# Frontend architecture

## Scope and stack

NutriSnap remains a React 18 / JavaScript application built with Vite and React Router. The frontend has been reorganized around existing features. The backend, database schema, authentication rules, and existing feature URLs are unchanged. No new runtime dependencies were added.

```text
src/
  app/
    App.jsx                  Providers and BrowserRouter
    routes/AppRoutes.jsx     Lazy route definitions
  components/
    layout/AppLayout.jsx     Application shell and account controls
    feedback/Feedback.jsx    Loading, error, and success feedback
    ui/                      Shared icons and page headings
  features/
    auth/                    Session context, provider, pages, services
    dashboard/pages/         Overview and saved-entry totals
    food-search/             Nutritionix service and search page
    barcode/                 Image decoder and upload page
    ai-estimate/             Gemini service and estimate page
    nutrition/
      components/            EntryForm, NutritionCard, FoodResult
      hooks/useEntries.js    History loading and explicit retry
      pages/                 Manual entry and history
      services/              Save, list, delete
      nutritionUtils.js      Validation, formatting, totals
  navigation/                Shared destinations and desktop/mobile navigation
  services/api/              Shared backend Fetch request handling
  theme/                     Tokens, palettes, preference provider
  styles/globals.css         Shared layout and component styling
  images/                    Preserved original logo and existing assets
  tests/                     Node unit and request-contract tests
tests/
  browser/verify.mjs         Chrome CDP workflow and layout verification
  robot/                     Preserved existing login tests
```

`src/App.jsx` is a compatibility entry re-export. `src/main.jsx` retains React StrictMode. Legacy combined page files and conflicting styles are superseded by the feature modules. Original image assets and existing Robot tests remain.

## Routes and navigation

| URL | Screen |
| --- | --- |
| `/` | Dashboard |
| `/main-page` | Dashboard; existing login redirect |
| `/MainPage` | Dashboard; existing logout destination |
| `/login` | Login |
| `/register` | Registration |
| `/text-search` | Nutritionix natural language search |
| `/barcode` | Uploaded UPC/EAN barcode image |
| `/predict-image` | Existing AI text-description estimate |
| `/add-item` | Manual nutrition entry |
| `/history` | Saved entries and deletion |
| Other URLs | Dashboard, preserving the original wildcard behavior |

Navigation labels and destinations live separately in `navigationConfig.js`. Desktop and mobile renderers share that configuration. There are no route guards: the original public-route behavior is preserved. The backend still enforces bearer authentication for personal data.

## Session and data flow

1. Login submits the existing credential payload.
2. The auth provider saves `token` and `userID` using their existing localStorage keys.
3. One shared provider loads the username for that session.
4. Feature services attach the current bearer token only to authenticated backend calls.
5. Logout removes both stored values and updates the shared UI.
6. History/dashboard request entries through `useEntries`; explicit retries issue a fresh request.
7. Forms display success and clear fields only after the save response succeeds.

The provider and history hook reuse an in-flight promise during StrictMode effect replay and ignore obsolete results after unmount/session changes. Requests are not automatically retried; no timeouts or cookie credential settings have been added.

Text search and barcode results map Nutritionix fields to the existing string-valued nutrient payload. The first returned food is shown, and the original Dinner default is retained. Unknown values display a dash.

AI estimates remain text descriptions from the existing model. Numeric values are manually confirmed; model output is never silently parsed into persisted entries.

Manual-entry attachments remain session-only filename metadata. They are not sent to the backend or represented as uploaded persistent images. The real scanner is a separate barcode workflow.

## Responsibility boundaries

API transport belongs in services. Page components own feature interaction and screen composition. Reusable nutrition components render consistent values and forms. The theme provider owns preference state; theme colors belong in CSS. Navigation does not perform API requests.

The entry form encapsulates its submit lifecycle, validation, and service call so both manual and AI-confirmed saves use the same success/failure semantics. No global data library was introduced for the existing small application.

## Performance

Routes load lazily. Quagga and Gemini SDK code load only when their respective operations require them. Large original dashboard illustration assets are retained in the repository but are no longer imported by the redesigned shell. The logo remains in the production assets.

The observed production main bundle decreased from about 364KB to 187KB uncompressed (117KB to 62KB gzip). Other routes and service libraries have separate chunks; this is not a claim about total bundle reduction or measured page speed.

## Development and validation

Use the existing installation and build instructions in README.md. Additional checks:

```sh
npm run lint
npm test
npm run build
```

Node 22 was used for verification. The test command uses Node's built-in runner; no additional test dependency is required. ESLint excludes Python virtual environments and generated browser artifacts. This JavaScript project does not require runtime PropTypes; the corresponding lint rule is disabled.

For browser verification, start Vite at `127.0.0.1:5173` and launch a separate Chrome profile with remote debugging on port 9222, then run:

```sh
node tests/browser/verify.mjs
```

The harness uses Node's built-in WebSocket and Chrome DevTools Protocol. It intercepts external requests and uses clearly isolated fixtures. It does not verify live backend/provider integration or modify real data. Reports and screenshots go under the already ignored `tests/robot/artifacts/` directory. Stop the temporary browser and server after testing.

The existing Robot suite still needs a working Python interpreter, Selenium/Chrome, and the configured backend. Its error locator now uses `[role="alert"]` after the accessibility redesign; successful-login URL and input placeholders are preserved.

## Deployment and future work

Production output remains `dist/`. Build with `npm run build`; preview with `npm run preview`. Configure the existing environment variables at build time. The host must rewrite SPA deep links to `index.html`. No deployment or Git push is performed by this refactor.

Refer to API_INTEGRATION.md for credential migration and live verification limits. Future additions should extend existing feature boundaries, preserve response contracts, and provide empty/loading/error behavior in both themes before adding new abstractions.

## Verification snapshot (October 13, 2026)

- npm run lint: passed.
- npm test: 13 unit/request-contract tests passed.
- npm run build: passed.
- Headless Chrome: 224 combinations (8 existing screens × 14 widths × 2 themes) without document overflow; portrait and a representative landscape check.
- Mocked browser workflows: native validation, login failure/success, session keys, failed-save recovery, confirmed saves, Nutritionix lookup/mapping, actual generated EAN image decoding, AI result confirmation, deletion focus containment/cancellation, registration, wildcard navigation, logout, persistent/system themes.
- Long food names and large nutrition values: checked at 320px.
- Browser JavaScript exceptions: none in the successful verification run.
- Original README content: first 6,863 bytes verified against the audit SHA-256 before and after the approved append.
- Original logo and image assets: retained unchanged.
- Existing Robot suite: retained with its error locator updated; not executed because its virtual environment references an unavailable Python installation.
- Live services: backend unreachable; Nutritionix 401; Gemini 400. See API_INTEGRATION.md.

The browser matrix uses CSS viewport emulation, not physical device certification. Foldable hinges, virtual keyboards, screen readers, and actual iOS/Android browsers still require manual checks. Browser screenshots use intercepted test fixtures and are not real account statistics.

Use Node 22+ for the browser harness's built-in WebSocket support. Add --workflows-only to rerun interaction checks without repeating the viewport matrix; its report is saved separately.
