# 🧭 Vastu Site Camera — सरल, पारदर्शी और कैमरा-फ्रेंडली रीबिल्ड

ये फ़ोल्डर आपकी मौजूदा साइट [rjsarkar83.github.io/vastu_camera](https://rjsarkar83.github.io/vastu_camera/) का **नया, आसान और ज़्यादा भरोसेमंद वर्ज़न** है। इसे खास तौर पर ठीक करने के लिए बनाया गया है:

> ❌ **पुरानी समस्या:** laptop / front camera सपोर्ट न करना, और UI का बहुत ज़्यादा भीड़-भाड़ वाला होना।

---

## 🔍 पुराने कोड में असली कारण क्या था?

मैंने आपका `index.html` पढ़ा। उसमें ये थे:

1. **Camera page load पर अपने आप `startCam()` चलता था** — user gesture के बिना। iOS/Safari और कई laptop browsers में इससे permission/autoplay फेल हो जाता है।
2. **`enumerateDevices()` से `deviceId` लेकर `exact:` लगाया जाता था, वो भी permission से पहले।** Permission से पहले labels अक्सर खाली होते हैं, और `exact deviceId` laptop webcam / front camera पर `OverconstrainedError` देता है।
3. **Fallback सिर्फ `facingMode: { ideal: 'environment' }` था** — यानी सिर्फ पीछे वाला कैमरा। Front camera के लिए कोई रास्ता नहीं था।
4. **Camera switch सिर्फ `camIdx++` करता था**, और कोई clear error recovery नहीं था (`NotAllowedError`, `NotReadableError`, `NotFoundError` सब एक ही generic popup में जाते थे)।
5. **बहुत सारे panels/modes एक ही screen पर थे** — measure, boundary walk, recce, marking, legal size, PIN, PDF… नए user के लिए चलाना मुश्किल था।
6. **External CDN पर निर्भरता** (`jspdf`, Nominatim reverse-geocoding) — network/CORS/rate-limit पर टूट सकता था।
7. **Compass `deviceorientation` के `alpha` को सीधे heading मान लेता था**, जो असली compass heading नहीं होती — इससे “genuine” होने का भरोसा कम होता है।

---

## ✅ नए वर्ज़न में क्या बदला?

### 📷 Camera — अब लैपटॉप, फ्रंट और बैक सब में
- **Welcome screen पर स्पष्ट चुनाव:** `Auto / सामने (Front) / पीछे (Rear)` — start button दबाने से पहले।
- **Permission पहले, device list बाद में** — अब खाली `deviceId` या `exact` constraint से फेल नहीं होता।
- **Fallback ladder:** specific device → `facingMode: user/environment` → simple `{ video: true }` → साफ़ error card.
- **Settings में exact camera picker** — laptop webcam, USB camera, phone front/rear, जो भी मिले।
- **🔄 Switch button** — अगले कैमरे पर जाता है; अगर सिर्फ एक camera है तो front/rear preference toggle करता है।
- **🤳 Front camera mirror** — preview और saved photo दोनों दर्पण जैसी, toggle के साथ।
- **🖼️ Upload fallback** — अगर camera permission न मिले, कोई camera न हो, या कोई दूसरी app camera use कर रही हो, तब भी आप मौजूदा फ़ोटो अपलोड करके **पूरी stamp + report + sharing** सुविधा पा सकते हैं।
- **HTTPS / secure-context check** और नाम-वार error messages (permission blocked, camera busy, no camera, unsupported browser)।

### 🧭 Direction — ईमानदार और आसान
- **8 बड़े direction buttons** (N, NE, E, SE, S, SW, W, NW) — laptop पर यही सबसे भरोसेमंद तरीका है।
- **डिग्री fine-tune slider** (−45° से +45°)।
- **Optional phone sensor** — सिर्फ तभी “Live sensor” कहता है जब सच में `webkitCompassHeading` या `deviceorientationabsolute` मिले। वरना साफ़ लिखा जाता है **“मैनुअल”**।
- **180° flip option** अगर sensor उल्टी दिशा दिखाए।
- फ़ोटो पर **हमेशा** लिखा जाता है कि दिशा sensor से आई है या मैनुअल चुनी गई है।

### 🎨 UI / UX — पहले से कहीं सरल
- **3-step onboarding:** Camera → Direction → Capture.
- **एक मुख्य camera screen**, बाकी सब एक **साइट पैनल** में — mobile पर bottom sheet, laptop पर right sidebar.
- **बड़े touch targets, high contrast, हिंदी + English toggle**, safe-area support, landscape/desktop responsive.
- **कम लेकिन काम के फीचर्स:** live Vastu guidance, site details, stamped photos, gallery, HTML report, CSV, share.
- **कोई external script/CDN नहीं** — पूरा ऐप एक `index.html` में, offline-friendly PWA के साथ।

### ⚪ v4 — सफ़ेद थीम + हर डिवाइस पर तेज़ (नया अपडेट)
यूज़र के फ़ीडबैक के बाद पूरा UI **light / monochrome** किया गया है:

- **सफ़ेद space, काला font, ग्रे buttons** — primary actions सिर्फ dark-grey/black।
- **लाल रंग का न्यूनतम इस्तेमाल** — सिर्फ shutter के बीच छोटा dot, delete/error की पतली border, और “वर्जित” वाली line का marker। हरा/पीला/संतरी रंग हटा दिए गए।
- Compass, stamped photo, HTML report और app icon — सब उसी neutral palette में।

**Performance / lag-free के लिए किए गए बदलाव:**
- सभी `backdrop-filter: blur()` और भारी shadows हटाए — low-end Android पर ये सबसे ज़्यादा lag करते हैं।
- **IndexedDB अब दो stores में:** `meta` (छोटा, startup पर तुरंत load) + `blobs` (फ़ोटो खोलते समय lazy load)। पुराने `photos` store से automatic migration भी है। 100+ फ़ोटो होने पर भी ऐप तेज़ खुलता है।
- **GPS one-shot `getCurrentPosition()`** — अब लगातार `watchPosition` background में नहीं चलता; टैप करने पर fresh fix मिलता है।
- **Sensor/slider updates `requestAnimationFrame` से throttled** — 60Hz compass events पर बार-बार पूरा DOM redraw नहीं होता।
- Gallery `DocumentFragment` + `loading="lazy" decoding="async"` images, `passive` resize listener, `prefers-reduced-motion` support।
- **Global `error` / `unhandledrejection` guards** — कोई अनजान async fail चुपचाप ऐप तोड़े नहीं।
- Service worker **v4 network-first** — update तुरंत दिखे, stale cache न रहे।

**सभी devices:** mobile portrait/landscape, tablet, laptop/desktop, notch safe-area, `dvh` fallback, 48px+ touch targets, `touch-action: manipulation` (300ms delay खत्म), कोई CDN नहीं।

### 🔒 भरोसा / “Genuine” होना
- डेटा **सिर्फ आपके डिवाइस** में (IndexedDB + localStorage) — कोई server, login या upload नहीं।
- GPS/compass वास्तविक browser APIs से; न मिले तो **“बंद / मैनुअल”** स्पष्ट दिखता है — कोई नकली डेटा नहीं।
- हर फ़ोटो और report में disclaimer: **ये कानूनी सर्वेक्षण, रजिस्ट्री नाप या structural safety certificate नहीं है।**
- “100% working” का मतलब हमने **robust error handling + fallback** रखा है — लेकिन कोई भी web app हर पुराने browser/OS/hardware पर 100% guarantee नहीं दे सकता। इसलिए हम झूठा वादा नहीं करते; हमने हर fail होने वाली जगह पर दूसरा रास्ता दिया है।

### 🇮🇳 “First platform in India” वाली बात
आपने “पहला प्लेटफ़ॉर्म इंडिया में” चाहा। ईमानदारी से कहूँ: **बिना प्रमाण के “पहला” का दावा करना सही नहीं है**, और असली भरोसेमंद platform वही है जो सच बोले। इसलिए टैगलाइन रखी है:

> **“भारत के लिए बनाया गया • पारदर्शी और सरल”** / *“Made for India • transparent and simple”*

अगर आपके पास कोई पंजीकरण, प्रकाशन, प्रेस कवरेज या डोमेन/ट्रेडमार्क proof है, तो `index.html` में `madeIn` वाली टैगलाइन बदलकर उस आधार पर “भारत का पहला …” किया जा सकता है। Help modal में भी ये बात लिखी है।

---

## 📁 फ़ाइलें

| File | काम |
|---|---|
| `index.html` | **पूरा ऐप** — inline CSS + JS, कोई external dependency नहीं |
| `manifest.json` | PWA install / home-screen icon |
| `sw.js` | Network-first offline cache (update तुरंत दिखता है) |
| `icon.svg`, `icon-192.png`, `icon-512.png` | App icons |
| `README.md` | ये फ़ाइल |

---

## 🚀 अपनी GitHub Pages साइट पर कैसे लगाएँ

आपका repo है `RjSarkar83/vastu_camera` और Pages उसी repo की (दिख रही branch **`rj`**) root से serve हो रही है।

1. ऊपर दिए **सारे files** डाउनलोड करें (या नीचे दिया zip)।
2. अपने GitHub repo में उस branch में जाएँ जिससे GitHub Pages चल रही है (`rj` / `main` — जो भी Settings → Pages में हो)।
3. **पुराना `index.html` replace करें** और बाकी नई files add करें:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon.svg`
   - `icon-192.png`
   - `icon-512.png`
4. Commit करें। 30–60 सेकंड बाद खोलें:
   **https://rjsarkar83.github.io/vastu_camera/**
5. **Purana cache हटाने के लिए** पहली बार site खोलकर hard-refresh करें (`Ctrl+Shift+R` / mobile पर browser cache clear)। नया `sw.js` network-first है, इसलिए आगे updates तुरंत दिखेंगे।

> ℹ️ Arena में इस समय **GitHub connector उपलब्ध नहीं है**, इसलिए मैं सीधे आपके repo में push नहीं कर सकता। इसीलिए नीचे **ready-to-upload **`vastu-camera-github-final-v4.zip`**** बना दिया गया है — बस उसे डाउनलोड करके repo में डाल दें।

---

## 🧪 Local testing

```bash
cd vastu-camera
python3 -m http.server 4173 --bind 0.0.0.0
```

फिर खोलें `http://localhost:4173` — **localhost पर camera allowed होता है**। Production में हमेशा `https://` लिंक use करें।

अगर आपके पास Chrome/Edge है तो camera test के लिए ये flags भी काम आते हैं:

```bash
google-chrome --use-fake-device-for-media-stream --use-fake-ui-for-media-stream https://rjsarkar83.github.io/vastu_camera/
```

---

## 🛠️ Troubleshooting (user के लिए भी ऐप में मौजूद)

| Problem | Fix |
|---|---|
| Camera permission popup नहीं आता | `https://` लिंक खोलें; address bar 🔒/🎥 → Camera = Allow |
| “कैमरा व्यस्त है” | Zoom / Meet / WhatsApp / दूसरा tab बंद करें |
| iPhone में compass/camera काम न करे | Settings → Safari → Camera + Motion & Orientation Access ON |
| लैपटॉप में direction गलत लगे | कोई sensor नहीं है — 8 direction buttons से मैनुअल चुनें, fine-tune करें |
| कोई camera ही नहीं | “फ़ोटो अपलोड” दबाएँ — बाकी सब वैसा ही चलेगा |
| फ़ोटो उल्टी / mirror लगे | Settings → “सामने कैमरा दर्पण” बंद करें |

---

## ⚠️ Disclaimer

ये ऐप **पारंपरिक वास्तु सुझाव** देता है और site photos पर दिशा/समय/GPS/site details stamp करता है। यह **legal survey, registry measurement, structural safety certificate या किसी विशेषज्ञ की सलाह का विकल्प नहीं** है। दिशा phone sensor या मैनुअल selection से आती है; GPS browser की accuracy (±5–20 m) पर निर्भर है। किसी भी निर्णय से पहले पटवारी/सर्वेयर/आर्किटेक्ट/वास्तु विशेषज्ञ से पुष्टि कराएँ।

---

बनाया गया: 27 अक्टूबर 2026 • **v4 light/performance build** • Single-file, dependency-free, browser-based Vastu camera.
