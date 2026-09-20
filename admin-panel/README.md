# Infyn Movies Admin Panel (Standalone)

A lightweight, standalone administration dashboard built with **Node.js, Express, HTML, CSS, and Vanilla JavaScript** to manage Infyn's protected movies and episode download links in **Google Cloud Firestore**.

---

## 🚀 Features

- **100% Standalone**: Can be run locally on your machine or deployed separately to any hosting provider (Render, Railway, VPS, Vercel).
- **Direct Firestore Admin Access**: Uses `firebase-admin` and `serviceAccountKey.json` to safely bypass public read/write rules while keeping private keys off client devices.
- **Full CRUD Capabilities**:
  - **Create**: Add new movies or web series with full metadata (ratings, genres, cast, trailer, poster).
  - **Read**: Live search by title, slug, genre, director, or cast members.
  - **Update**: Edit any movie metadata or episode details on the fly.
  - **Delete**: Permanently remove titles from Firestore with a safety confirmation prompt.
- **Dynamic Episode Builder**: Add, remove, and update individual episodes with custom Google Drive download links and file sizes.
- **Protected by Admin Key**: Write operations require a secret passkey (`ADMIN_SECRET`), configurable via `.env`.

---

## 🛠️ Quick Start (Run Locally)

### 1. Install Dependencies
Open a terminal in the `admin-panel/` directory:
```bash
cd admin-panel
npm install
```

### 2. Configure Credentials
The admin panel looks for `serviceAccountKey.json` in:
1. `admin-panel/serviceAccountKey.json`
2. `../serviceAccountKey.json` (the root project directory)
3. Or the `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable.

You can create a `.env` file from the example:
```bash
cp .env.example .env
```

Contents of `.env`:
```env
PORT=4000
ADMIN_SECRET=admin123
FIREBASE_SERVICE_ACCOUNT_PATH=../serviceAccountKey.json
```

### 3. Start the Server
```bash
npm start
```
Or with auto-restart on changes:
```bash
npm run dev
```

Visit **`http://localhost:4000`** in your browser.

---

## 🌐 Deploying Separately (Render / Railway / VPS)

Because this panel is self-contained in its own folder, you can push it to a separate repository or deploy it independently:

### Option A: Deploy to Render or Railway
1. Set the build command: `npm install`
2. Set the start command: `node server.js`
3. In your host's Environment Variables dashboard, set:
   - `ADMIN_SECRET`: Your custom secure admin password.
   - `FIREBASE_SERVICE_ACCOUNT_KEY`: Paste the raw JSON content of your `serviceAccountKey.json`.

### Option B: Run on a VPS with PM2
```bash
cd admin-panel
npm install
pm2 start server.js --name "infyn-admin"
```

---

## 🔒 Security Best Practices
- Never commit `serviceAccountKey.json` to public Git repositories (it is listed in `.gitignore`).
- Change `ADMIN_SECRET` in your `.env` file before exposing the panel on the public internet.
