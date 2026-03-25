# URL Shortener

### By Charles Muldoon for Prokeep Interview

---

## Running the Project

Both the API and UI must be running at the same time.

### Backend (NestJS — port 3000)

```bash
cd url-shortener-api
npm install
npm run start:dev        # watch mode
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
