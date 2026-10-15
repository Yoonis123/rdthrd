# RdThrd

A social map for discovering places in London. Save the cafés, bars, restaurants and shops you love
as pins on your own map, tag them with vibes, and (soon) follow friends.

This is **stage 1**: the map, search, place details, saving with vibe tags and notes, and the
"My places" list. Saved places live on your phone (in the browser) for now – accounts come in stage 2.

---

## Putting it online (plain-English guide)

You'll do three things: get a Google Maps key, put the app on Vercel (free hosting), and add the
key to Vercel. Allow about 20–30 minutes the first time.

### Part 1 – Get a Google Maps API key

An "API key" is a password that lets the app use Google Maps.

1. Go to <https://console.cloud.google.com> and sign in with a Google account.
2. At the top, click the project picker → **New project**. Name it `RdThrd` → **Create**. Make
   sure the new project is selected at the top.
3. Turn on billing: menu (☰) → **Billing** → link a billing account (you'll need a card).
   Google gives a free monthly allowance; a personal test app normally stays inside it. To be safe,
   go to **Billing → Budgets & alerts** and create a budget of e.g. £10 so you get an email if
   spending ever starts.
4. Turn on the two Google services the app uses. Menu → **APIs & Services → Library**, then search
   for and **Enable** each of these:
   - **Maps JavaScript API**
   - **Places API (New)** (make sure it says "(New)")
5. Menu → **APIs & Services → Credentials** → **Create credentials → API key**. Copy the key that
   appears (a long string starting with `AIza…`) and keep it somewhere safe.
6. Still on that key, click **Edit API key** (or its name) and lock it down so nobody else can use it:
   - **Application restrictions** → **Websites** → **Add** → type the web address Vercel gives you
     in Part 2 with `/*` at the end, e.g. `https://rdthrd.vercel.app/*`.
     (You can come back and do this after Part 2. Until you do, the key works everywhere.)
   - **API restrictions** → **Restrict key** → tick **Maps JavaScript API** and **Places API (New)**.
   - **Save**.

*Optional – your own map style:* Menu → **Google Maps Platform → Map management → Create map ID**
(type: JavaScript, Vector). Copy the Map ID. If you skip this the app uses Google's demo map ID,
which works fine.

### Part 2 – Put the app on Vercel

1. Go to <https://vercel.com> → **Sign up** → **Continue with GitHub** (use the GitHub account that
   has the `rdthrd` repository).
2. Click **Add New… → Project**. Find **rdthrd** in the list → **Import**.
   (If it isn't listed, click **Adjust GitHub App Permissions** and give Vercel access to it.)
3. On the "Configure Project" screen, open **Environment Variables** and add:
   - **Key:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` **Value:** your `AIza…` key from Part 1
   - (optional) **Key:** `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` **Value:** your Map ID
4. Click **Deploy** and wait a minute or two. When it says **Congratulations**, click the preview
   to open your app. Your web address is shown on the project page (something like
   `https://rdthrd.vercel.app`).
5. Go back to Part 1, step 6 and add that address to the key's website restrictions.

Vercel builds from the repository's main branch. Every time new code is merged into `main`, Vercel
updates the app automatically.

### Adding or changing the key later

Vercel → your project → **Settings → Environment Variables** → add or edit
`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` → **Save**. Then go to **Deployments**, click the **⋯** next to the
newest one → **Redeploy**. (The key is built into the app, so changes only appear after a redeploy.)

### Installing it on your iPhone

1. Open your Vercel web address in **Safari** on your iPhone.
2. Tap the **Share** button (square with an arrow) → **Add to Home Screen** → **Add**.
3. Open RdThrd from your home screen. It opens full screen, like a normal app.
4. When it asks to use your location, tap **Allow** to see yourself on the map.

### If something goes wrong

- **"Almost there…" screen** – the API key isn't set on Vercel, or you didn't redeploy after adding it.
- **"Google said no to our key"** – billing isn't on, one of the two APIs isn't enabled, or the
  website restriction doesn't match your Vercel address exactly (it must end in `/*`).
- **Search shows nothing** – check **Places API (New)** is enabled (not just the old "Places API").
- **No blue location dot** – on iPhone: Settings → Privacy & Security → Location Services →
  Safari Websites → **While Using the App**.
- **Saved places disappeared** – in stage 1 they're stored in the browser on that one phone.
  The home-screen app and Safari keep separate copies. Accounts in stage 2 fix this.

---

## For developers

```bash
npm install
cp .env.example .env.local   # then paste your key into .env.local
npm run dev                  # http://localhost:3000
npm run build                # production build (also type-checks)
```

See `CLAUDE.md` for architecture, Google data rules and the stage plan.
