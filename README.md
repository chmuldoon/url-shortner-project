# URL Shortener

### By Charles Muldoon for Prokeep Interview

---

## Running the Project

Both the API and UI must be running at the same time.

### Backend (NestJS — port 3000)

```bash
cd url-shortener-api
npm install
# or
npm run start            # single run
# or
npm run start:withSeeds  # start with seeded URLs
```

### Frontend (Vite + React — port 5173)

```bash
cd url-shortener-ui
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Running Tests

```bash
cd url-shortener-api
npm run test        # unit tests
```

---

## How It Works

1. Paste a long URL on the **Create** page — the API returns a short URL pointing at `localhost:5173`.
2. Clicking a short URL loads a **Redirecting…** page on the frontend, which calls `GET /resolve/:shortCode` on the API.
3. The API increments the redirect count and returns the long URL; the browser navigates there directly.
4. Invalid short codes show a **404** page with a link back to Create.

## Assumptions

1. For brevity sake, the short url when appeneded to the frontend's base url simply checks the backend for redirects then redirects the user to that url if it exists, in production, these services could share the same base url
2. Opted to use Snowflake ID for best possibly scaling with base62 encoding
3. Kept strict frontend validation for links so save time, however would Ideally allow for inputs to not include https:// for simpler user experience

## Additions

-I wanted to include redirect counts, however I did not have enough time to fully implement, I would say it is about 90% finished. Did not have enough time to ensure that the redirect count increment works correctly with frontend url redirection
