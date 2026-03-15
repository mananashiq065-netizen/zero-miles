# 🍽️ Zero Miles Grill & Cafe — Direct Ordering System

A premium restaurant ordering website + admin panel that lets customers order directly via WhatsApp — **zero commission, zero third-party apps.**

---

## 📁 Project Structure

```
zero-miles/
├── server.js               ← Express backend (API + static server)
├── package.json
├── .env.example            ← Rename to .env and configure
├── data/
│   └── menu.json           ← Live menu database (auto-created)
└── public/
    ├── index.html          ← 🌐 Customer website
    ├── uploads/            ← Uploaded food images stored here
    └── admin/
        └── index.html      ← 🔧 Admin dashboard
```

---

## ⚡ Quick Start (Run Locally)

### 1. Prerequisites
- Node.js v16+ ([download](https://nodejs.org))
- A terminal / command prompt

### 2. Install Dependencies

```bash
cd zero-miles
npm install
```

### 3. Configure WhatsApp Number

Open `public/index.html` and find this line near the top of the `<script>` tag:

```js
const WA_NUMBER = '917889XXXXXX'; // ← REPLACE WITH ACTUAL WHATSAPP NUMBER
```

Replace with the restaurant's WhatsApp number in international format:
- For India: `91` + 10-digit number
- Example: `919876543210`

Also update the same number in all `href="https://wa.me/..."` links in the HTML (search for `7889XXXXXX`).

### 4. (Optional) Change Admin Password

Copy `.env.example` to `.env` and edit:

```bash
cp .env.example .env
```

```env
PORT=3000
ADMIN_USER=admin
ADMIN_PASS=your_secure_password_here
```

### 5. Start the Server

```bash
npm start
```

Or with auto-reload during development:

```bash
npm run dev
```

### 6. Open in Browser

| URL | What it is |
|-----|------------|
| `http://localhost:3000` | 🌐 Customer Website |
| `http://localhost:3000/admin` | 🔧 Admin Panel |

**Default admin login:**
- Username: `admin`
- Password: `zeromiles2024`

---

## 🔧 Admin Panel Guide

### Login
Go to `http://localhost:3000/admin` and sign in.

### Add a Menu Item
1. Click **Add Item** in the sidebar
2. Fill in name, category, price, description
3. Upload a food photo or paste an image URL
4. Click **Add to Menu** — it appears live on the website instantly!

### Edit / Delete Items
1. Go to **Menu Items** tab
2. Click **Edit** to modify any item
3. Click **Hide** to temporarily remove from customer view (without deleting)
4. Click **Del** to permanently delete

### Manage Categories
- Go to **Categories** tab
- Add new categories (e.g. "Desserts", "Kebabs")
- Remove unused categories

### Image Upload Tips
- Upload JPG/PNG/WEBP up to 5MB
- Or paste a direct image URL (e.g. from Google Drive, Cloudinary)
- Images are stored in `public/uploads/` on your server

---

## 🌐 How WhatsApp Ordering Works

1. Customer browses the menu on the website
2. They click the **"Order"** button on any dish
3. Their phone opens WhatsApp with a pre-filled message:
   > "Hello, I want to order *Chicken Biryani* (₹280) from Zero Miles Grill & Cafe. Please confirm!"
4. They tap Send → You receive it → Reply to confirm
5. **No commission. No third party. Direct revenue.**

---

## 🚀 Deployment Options

### Option A: Deploy on Railway (Recommended — Free)

1. Create account at [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub Repo**
3. Push your code to a GitHub repo first:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/zero-miles.git
   git push -u origin main
   ```
4. In Railway, connect the repo
5. Set environment variables in Railway dashboard:
   - `ADMIN_USER` = admin
   - `ADMIN_PASS` = your_password
6. Railway auto-detects Node.js and deploys
7. Get your live URL (e.g. `https://zero-miles.railway.app`)

### Option B: Deploy on Render (Free Tier)

1. Create account at [render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables
6. Deploy!

### Option C: VPS / Linux Server

```bash
# On your server
git clone YOUR_REPO_URL
cd zero-miles
npm install
npm install -g pm2

# Start with PM2 (keeps running after logout)
pm2 start server.js --name "zero-miles"
pm2 save
pm2 startup

# Optional: Nginx reverse proxy
# Proxy localhost:3000 → yourdomain.com
```

### Option D: Hostinger / cPanel Node.js Hosting

1. Upload all files via FTP (exclude `node_modules/`)
2. In cPanel → Node.js App Manager
3. Set startup file: `server.js`
4. Run `npm install` from terminal
5. Start the application

---

## 📱 Custom Domain Setup

After deploying to any platform:

1. Buy a domain (e.g. `zeromileshandwara.com`) from GoDaddy / Namecheap
2. Point DNS to your hosting provider
3. Update the WhatsApp links in `index.html` with your real number

---

## 🔒 Security Notes for Production

1. **Change admin password** — never use `zeromiles2024` in production
2. Use **HTTPS** — all major platforms provide this free via Let's Encrypt
3. The admin token is Base64 — fine for a small restaurant, sufficient for this use case
4. Consider backing up `data/menu.json` regularly

---

## 🎨 Customization

### Colors
In `public/index.html`, find the `:root` CSS block and change:
```css
--gold: #E4A853;    /* Primary accent color */
--red:  #C0392B;    /* Secondary accent */
```

### Restaurant Info
Search for `Zero Miles` and `Handwara` in the HTML to update:
- Restaurant name
- Address
- Phone number
- Instagram handle
- Google Maps embed (get embed code from maps.google.com)

### Google Maps Embed
1. Go to [maps.google.com](https://maps.google.com)
2. Search for the exact location
3. Click Share → Embed a map → Copy iframe
4. Replace the `<iframe>` in the Location section

---

## 💡 Tips for the Restaurant Owner

- **Update prices** anytime via the admin panel — changes show instantly
- **Hide items** when they're sold out for the day (use the "Hide" toggle)
- **Add photos** — dishes with real photos get significantly more orders
- **Respond fast** on WhatsApp — customers expect a reply within 5-10 minutes
- Share the website URL on your Instagram bio and Google Business profile

---

Built with ❤️ for Zero Miles Grill & Cafe, Handwara, J&K.
