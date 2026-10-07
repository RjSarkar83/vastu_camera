# 🧭 Vastu Site Camera — वास्तु साइट कैमरा

**Online Vastu Camera Web App** for Construction & Real Estate professionals.
Koi app install karne ki zaroorat NAHI — browser me hi chalti hai (PWA), photos par **live compass direction, GPS, mini-map, Vastu analysis, measurement aur price** stamp karti hai.

![Compass Icon](icon-192.png)

---

## ✨ Features (मुख्य फीचर्स)

### 📷 Camera + Direction
- 🧭 **Live compass overlay** (N/NE/E/SE/S/SW/W/NW + degrees) — device ke real compass sensor se
- 🟢🟠🔴 **Live Vastu zone analysis** — camera ghumate hi 8 zones ka ✅ उत्तम / ⛔ वर्जित data real-time
- 📸 Har photo par permanently stamp: **दिशा°, तारीख-समय, GPS coordinates, address, mini-map inset, project/client details, remark, digital signature**

### 📏 Measurement & Survey
- **📏 Measure Mode** — phone height + angle se दूरी → चौड़ाई (A/B points) → लंबाई → automatic **क्षेत्रफल** (sq.ft / गज / sq.m)
- **🎯 Laser/Tep exact input** — laser meter ya measuring tape ki exact reading डालो, सब calculation exact
- **📝 Manual / LEGAL Size** — registry/patwari/govt naksha ki asli naap apne haath se daalo (feet/meter/गज में L×B ya सीधा area) + स्रोत select karo (पटवारी नाप, Registry naksha, Tape आदि) → photo par **golden "📝 Legal Size" line** चhapegi, approx measurement से bilkul अलग — dispute-proof record!
- **🚶 Boundary Walk Mode** — plot ke kono par chalo, GPS se **परिधि + क्षेत्रफल + boundary shape diagram** record
- **💰 Rate Calculator** — rate set karo (₹/sq.ft ya ₹/गज), area ke saath **automatic कीमत photo par print**

### 💼 Business Tools
- **📁 Client-wise Folders** — Active Project set karo; har project ki apni photos, PDF, CSV (top chip tap se **quick switch** + 📷 count)
- **📄 PDF Report** — 1-tap professional A4 report (cover page + summary + signature + har photo ka page with map-link)
- **🧾 CSV Export** — saari survey data Excel me (manual legal size ke alag columns ke saath)
- **💬 WhatsApp Quick-Send** — photo capture hote hi share sheet; **📤 Share-All** se pure project ki saari photos ek saath
- **🖊️ Digital Signature** — ungli se sign, har photo + PDF par stamp
- **🏷️ Quick Remark Tags** — 1-tap pre-made tags (Main door / NE corner / Nal / Road facing / Dosh...) turant photo par stamp

### ⚡ Professional Workflow
- **⚡ Fast Capture Mode** — photo लेते ही instant save (panel interruption-free) — site par rapid shooting
- **🎥 Camera Quality Select** — HD / Full HD / QHD (storage vs quality aapke control me)
- **📝 Manual-Size Live Chip** — legal size active hone par screen par gold chip dikhti hai (tap = clear)
- **🔔 Smart Toasts** — हर action ka instant confirmation, kaam ruk-tok nahi hota
- **🔒 PIN Lock** — app खोलने पर PIN
- **💾 Auto-Save + Backup/Restore** — data phone me hi save (IndexedDB), 1-tap JSON backup

### ☀️ Extra
- **Sun position tracker** (sunrise/sunset + live azimuth) — compass verify karne ka tarika
- **📐 Level checker** • **▦ Photo grid** • Manual direction fallback (compass na ho to)
- **🔌 Offline support (PWA)** — ek baar load hone ke baad bina internet ke camera/GPS work karta hai

---

## 🚀 GitHub Pages par Deploy karo (FREE + HTTPS)

Camera API sirf **HTTPS** par chalti hai — GitHub Pages isliye perfect hai:

1. ⚙️ GitHub par **nayi repository** banao (name: `vastu-site-camera`)
2. 📤 Is ZIP ki saari files **upload** kar do (ya `git push` karo)
3. Repo → **Settings** → **Pages** → Source: `Deploy from a branch` → Branch: `main` → folder: `/ (root)` → **Save**
4. ⏳ 1–2 minute wait karo — aapki app live hogi:
   ```
   https://<your-username>.github.io/vastu-site-camera/
   ```
5. 📱 Link apne **phone browser** me kholo, permissions Allow karo, aur **"Add to Home Screen"** se app ki tarah install kar lo ✅

> 💡 Custom domain chahiye to Settings → Pages → Custom domain me apna domain set kar sakte ho.

---

## 📱 Kaise Use Karein (Quick Start)

1. Link kholo → **Camera, Location, Compass** permissions **Allow**
2. ⚙️ Settings → Project naam, Plot no., Rate डालो → Signature बनाओ → **Save**
3. Phone site ki taraf ghumao → 🔴 red button = photo (sab stamp ho jayega)
4. 📏 ya 🚶 mode se maap lo → area + कीमत automatic
5. 📄 PDF banao ya 💬 WhatsApp par bhejo

**Tips:**
- Compass galat lage to phone ko "8" (∞) ke aakar me 5–6 baar ghumao (calibration)
- Metal mobile cover compass kharab karta hai — nikaal ke use karo
- iPhone: pehli baar "🧭 कम्पास चालू करें" button tap karna zaroori hai

---

## ⚠️ Important Notes

- **Angle/GPS-based sizes approximate hain (±10–15%)** — legal naksha/final measurement ke liye tape ya laser meter use karein. Laser reading input diya hai, use karo to exact.
- GPS boundary survey **legal survey ka substitute NAHI** hai — patwari/surveyor se verify karayein.
- Saara data **aapke phone me hi** rehta hai (koi server upload nahi) — privacy safe ✅
- Vastu guidance traditional beliefs par based hai, scientific proof nahi.

---

## 🛠️ Tech Stack (Developers ke liye)

Pure **HTML + CSS + vanilla JavaScript** — single `index.html` file, koi build step nahi.

| Browser API | Use |
|---|---|
| `getUserMedia` | Rear camera access |
| `DeviceOrientation` (incl. `webkitCompassHeading` / `deviceorientationabsolute`) | Live compass heading + tilt |
| `Geolocation` (watchPosition) | GPS + boundary walking |
| Canvas 2D | Photo stamping, banners, polygon drawing |
| IndexedDB | Offline photo storage |
| Web Share API (Level 2) | Photo directly WhatsApp/anywhere share |
| Service Worker + Manifest | PWA install + offline |
| jsPDF (CDN) | PDF report |
| OpenStreetMap tiles + Nominatim | Mini-map images + reverse geocode |
| SunCalc math (pure JS) | Sun azimuth, sunrise/sunset |

---

## 📁 File Structure

```
├── index.html        # Pura app (single file)
├── manifest.json     # PWA manifest
├── sw.js             # Service worker (offline cache)
├── icon-192.png      # App icons
├── icon-512.png
└── .nojekyll         # GitHub Pages config
```

---

*Made for builders, brokers & site engineers — Bharat ke real estate professionals ke liye* 🇮🇳
