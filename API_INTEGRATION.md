# API integration

## Contract preservation

Existing Express endpoints, methods, nutrient field names and string values, Nutritionix query formats, bearer header, storage keys, and first-food response behavior are retained. The backend repository and database schema were not changed.

Backend HTTP handling is centralized in `src/services/api/backendClient.js`. Fetch remains the transport for existing backend and text-search requests. Barcode lookup retains Axios through a dedicated Nutritionix instance. This avoids silently changing Fetch error/body behavior merely to standardize libraries.

The client adds no retries, timeout overrides, refresh-token behavior, cookie credentials, or automatic logout on errors. A missing session prevents personal-data requests and displays actionable feedback.

## Environment configuration

| Variable | Purpose |
| --- | --- |
| `VITE_BE_URL` | Existing Express base URL |
| `VITE_NUTRITIONIX_APP_ID` | Existing Nutritionix app header |
| `VITE_NUTRITIONIX_API_KEY` | Existing Nutritionix key header |
| `VITE_GEMINI_API_KEY` | Newly extracted configuration for the formerly hardcoded Gemini credential |

Use `.env.example` for placeholders. Keep real values in ignored local configuration or the hosting provider's build settings. Existing names are unchanged. The original base URL is concatenated with endpoint paths; do not include a trailing slash.

The existing Gemini credential was migrated locally into ignored `.env.local`, and removed from tracked application source. A fresh checkout or hosted build must configure `VITE_GEMINI_API_KEY` explicitly. Without it, the AI screen explains that estimates are unavailable and links to manual entry.

All Vite-prefixed values are exposed in the built browser application. An environment variable does **not** turn a browser key into a private server secret. Restrict provider keys as appropriate and rotate previously exposed credentials. A server-side AI proxy would require separately authorized backend work and has not been invented here.

The configured model remains `gemini-1.5-flash`. Its current availability was not established; provider/model changes require separate live verification rather than an undocumented model migration.

## Express endpoint inventory

All paths below are relative to `VITE_BE_URL`.

| Endpoint | Consumer | Auth | Request and response |
| --- | --- | --- | --- |
| `POST /register` | Registration | None | JSON `{username,email,password}`; success redirects to login; failures display response text |
| `POST /login` | Auth provider | None | JSON `{username,password}`; reads `token`, `userID` |
| `GET /getUser` | Auth provider | Bearer | Reads `username` |
| `GET /apiMongo` | Dashboard/history | Bearer | Reads `items` array |
| `POST /nutrients` | Manual, AI-confirmed, search, barcode saves | Bearer | JSON fields below; reads JSON save response |
| `DELETE /apiMongo/:id` | History | Bearer | No body; accepts success without requiring JSON |

Authenticated headers remain `Authorization: Bearer <token>`. JSON writes retain `Content-Type: application/json`. No `userID` field is added to nutrient payloads; ownership remains the backend's token responsibility.

```json
{
  "name": "Example food",
  "calories": "100",
  "protein": "4",
  "carbohydrates": "12",
  "fat": "2",
  "mealType": "Dinner"
}
```

This is an example payload, not user data. Manual and AI-confirmed optional blanks remain empty strings; no new schema constraints are assumed. Meal choices preserve Breakfast, Lunch, Dinner, and Snacks.

Search/barcode mapping preserves:
- `food_name → name`
- `nf_calories → calories`
- `nf_protein → protein`
- `nf_total_carbohydrate → carbohydrates`
- `nf_total_fat → fat`
- Default `mealType: "Dinner"`

The original response JSON expectation for saves remains. Failed writes retain form data and do not add session cards. History removes a card only after successful deletion.

## Nutritionix

Text search calls `POST https://trackapi.nutritionix.com/v2/natural/nutrients` with JSON `{query}`, `Content-Type: application/json`, `x-app-id`, and `x-app-key`.

Barcode lookup calls `GET https://trackapi.nutritionix.com/v2/search/item` with `upc` query parameter and the same app headers. Its existing `application/x-www-form-urlencoded` content type is retained.

Both read the first element of `foods`. Empty results produce visible feedback; they do not reuse stale results. No backend token is sent to Nutritionix.

The scanner uses Quagga's uploaded-image decoder with EAN and UPC readers, no workers, and an 800px input size. If region detection fails, it attempts a center scanline for flat labels before reporting failure. Browser object URLs are released when the image changes or the page unmounts. Obsolete decoding results are ignored.

## Gemini

The estimate service lazily imports the existing Google Generative AI SDK, uses the existing model and nutrition-description prompt, and reads generated text. This is a text workflow despite the legacy `/predict-image` URL. Numeric input is always user-confirmed before persistence.

## Authentication and failures

The provider preserves localStorage token handling; it does not change the existing session mechanism. Profile errors are visible without silently deleting a token. Local missing-session checks improve feedback but do not replace backend authorization.

Non-success backend responses become displayed errors using response text. Network failures propagate to feature feedback. Sensitive tokens and entire environment objects are no longer logged by the application.

## Verification

Unit/contract tests exercise endpoint methods, payload preservation, bearer headers, missing-token behavior, error propagation, empty delete responses, first-result handling, and Nutritionix mapping without real network access.

The browser harness intercepts external requests to test login, manual save recovery, search, barcode decoding, AI confirmation, history deletion, themes, and layout. Fixtures are never presented as real live API verification.

Before deployment, use a dedicated test account to verify against actual configured services:

1. Register, log in, reload, and confirm the username/session.
2. Search a food, scan a real UPC/EAN image, and inspect returned values.
3. Save each supported intake path and confirm entries persist after reload.
4. Confirm entries belong to the current account; test another account.
5. Delete an entry and confirm it remains deleted after reload.
6. Test invalid/expired credentials, provider errors, and offline failures.
7. Verify the Gemini key/model with the provider and review generated text.
8. Verify Render SPA deep links and build-time environment configuration.

These live workflows require service access and appropriate credentials. No successful frontend build or mocked test result should be interpreted as proof that those services currently work.

## Observed live-service checks (October 13, 2026)

Read-only checks used the locally configured values without printing credentials:

- Backend GET /getUser without credentials: connection failed; backend reachability was not established.
- Nutritionix natural-language lookup for a generic banana: HTTP 401; the configured credentials did not authorize the request.
- Gemini estimate using the unchanged model: HTTP 400; the configured request was rejected.

No real account registration, authenticated save, or deletion was attempted. These failures are external integration limits, not passing live tests. Configure valid provider credentials, start/reach the backend, and complete the dedicated-account checklist above before release.
