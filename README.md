# 🧭 Vastu Site Camera — सरल, पारदर्शी और कैमरा-फ्रेंडली रीबिल्ड

ये फ़ोल्डर आपकी मौजूदा साइट [rjsarkar83.github.io/vastu_camera](https://rjsarkar83.github.io/vastu_camera/) का **नया, आसान और ज़्यादा भरोसेमंद वर्ज़न** है। इसे खास तौर पर ठीक करने के लिए बनाया गया है:

> ❌ **पुरानी समस्या:** laptop / front camera सपोर्ट न करना, और UI का बहुत ज़्यादा भीड़-भाड़ वाला होना।

> 📷 **v7 (latest):** अब ऐप में **2 अलग कैमरे** हैं — **① Architecture & Construction Vastu Camera** (पूरा वास्तु ऐप: दिशा, डिग्री, GPS, compass, report) और **② Branding Recce Camera** (साफ़ फ़ोटो — सिर्फ लाइन ड्राइंग मार्किंग + साइज़/मटेरियल caption, कोई वास्तु जानकारी नहीं)। Welcome screen पर चुनें, top bar से बदलें। विस्तार नीचे v7 सेक्शन में है।

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

### 🎯 v5 — Option 4: Branding Recce (लाल हाइलाइट)
नया **4th option** साइड पैनल में जोड़ा गया है — लाल border + लाल `4` badge के साथ, ताकि वो तुरंत नज़र आए:

**किन कामों के लिए:** Retail Store · Outdoor Advertisement · Office · In-shop Branding · Event Decoration · Exhibition Branding।

**क्या-क्या सेव होता है:**
- **Category select** + **साइट का नाम** + **साइज़ (W × H)** + **unit (ft / m / in)** + **Use Material** (Vinyl, Flex, ACP, Fabric…)।
- **Recce मोड ON** करने पर हर नई फ़ोटो की stamp में ये लाइनें अपने आप छप जाती हैं:
  `रेक्की: Outdoor Advertisement · Shri Ram Nagar` / `साइज़: 12 × 6 ft · मटेरियल: Vinyl`।
- **आसान मार्किंग:** “मार्किंग शुरू करें” → फ़ोटो पर टैप/क्लिक करके numbered points जोड़ें, हर point के लिए छोटा नोट लिखें → **Save**। Markers फ़ोटो पर permanently burn हो जाते हैं और metadata में भी सेव होते हैं।
- **फ़ाइल का नाम** अब उसी क्रम में बनता है: `vastu_<site>_<size>_<material>_<timestamp>.jpg`  
  उदाहरण: `vastu_Shri_Ram_Nagar_12_6_ft_Vinyl_2026-10-27-07-06-24.jpg`
- **Photo modal, Gallery card, HTML report और CSV** सभी में recce category, site, size, material और marker count दिखता/export होता है।

> ⚠️ **v7 अपडेट:** ये Option 4 अब साइड पैनल के अंदर नहीं है — ऊपर वाले v7 सेक्शन के अनुसार ये **अलग Branding Recce Camera** बन गया है। लाल हाइलाइट वैसी ही रखी गई है।

### 🖼️ v6 — ArtVision ब्रांड लोगो और नया ऐप आइकॉन
आपके द्वारा भेजे गए **Primary Logo.png** और **LogoMark.png** अब पूरे ऐप में लगे हैं:

- **Welcome screen** — बड़ा ArtVision primary wordmark + `Vastu Site Camera · by ArtVision`।
- **Top bar** — compact LogoMark (infinity + gold stroke + red pointer), साथ में Hindi/English short title।
- **हर stamped फ़ोटो** — ऊपर दाएँ कोने में सफ़ेद ArtVision wordmark (`logo-primary-white.png`) + app नाम; अगर image कभी load न हो तो text watermark fallback।
- **HTML report / print** — header में embedded primary logo (data URI, यानी report **offline / अकेली HTML फ़ाइल** में भी लोगो दिखता है), footer में `· ArtVision`।
- **WhatsApp / Share text** — `ArtVision Vastu Site Camera` से शुरू होता है।
- **PWA icons** — `icon-192.png`, `icon-512.png`, `icon.svg` अब LogoMark से बने हैं (सफ़ेद maskable-safe background पर)। `manifest.json` name/short_name/theme भी ArtVision के अनुसार।
- Service worker **v6** network-first — shell में तीनों logo files भी cache हैं, इसलिए offline होने पर भी branding नहीं गायब होती।

> **रंग:** लोगो में मौजूद लाल और gold gradient ब्रांड का हिस्सा हैं; बाकी ऐप की minimal-red, सफ़ेद-काला-ग्रे थीम जस की तस है।

### 📷 v7 — अब 2 अलग कैमरे (Recce अंदर से बाहर)
यूज़र ने कहा: *“isme 2 camera hai ek architecture and construction vastu camera, dusra Branding Recce camera — andar se hatao, ye alag chij hai.”* अब ऐसा ही है:

**Welcome screen पर 2 बड़े कार्ड** (बिना page reload के mode switch, top bar में “कैमरा बदलें” से वापस):

| # | कैमरा | क्या करता है |
|---|---|---|
| 1 | **Architecture & Construction Vastu Camera** | पूरा वास्तु ऐप — 8 दिशाएँ, डिग्री, GPS, compass, साइट डिटेल्स, वास्तु सुझाव, stamped फ़ोटो, HTML report, CSV |
| 2 | **Branding Recce Camera** (लाल कार्ड/पैनल) | **साफ़ कैमरा** — अलग पैनल, अलग गैलरी, अलग report/CSV |

**Branding Recce कैमरे की फ़ोटो पर कोई जानकारी नहीं जाती** — दिशा, डिग्री, GPS, तारीख, कम्पास, साइट डिटेल्स या disclaimer में से कुछ भी नहीं छपता। सिर्फ:

- **लाइन ड्राइंग मार्किंग** — फ़ोटो लेते ही marking editor अपने आप खुलता है: **पेन, लाइन, तीर (arrow), बॉक्स, पॉइंट + नोट**, 4 रंग, मोटाई slider, Undo, Clear। सारे निशान full-resolution JPEG में permanently burn होते हैं और metadata में vector data के रूप में भी सेव होते हैं।
- नीचे **एक छोटी caption**: `12 × 6 ft | Vinyl` (साइज़ | मटेरियल)।
- ऊपर दाएँ छोटा **ArtVision लोगो** — पैनल में switch से बंद किया जा सकता है।

**फ़ाइल नाम** (site → size → material → timestamp):
`Shri_Ram_Nagar_12x6ft_Vinyl_2026-10-27-082657.jpg`

सेव होते ही फ़ोटो उसी नाम से **auto-download** भी होती है (पैनल में switch से बंद कर सकते हैं)। साइट, साइज़ और मटेरियल gallery, photo modal, recce HTML report और `recce_photos_*.csv` में भी सेव होते हैं। Recce report में कोई वास्तु/दिशा/GPS डेटा नहीं होता।

> पुराना **Option 4 (साइड पैनल के अंदर)** अब हटा दिया गया है — वो अब **कैमरा नं. 2** है, पूरी तरह अलग। पुरानी v5/v6 की recce फ़ोटो अपने आप इस नए कैमरे की गैलरी में migrate हो जाती हैं।

### 🌐 v8 — सभी devices / सभी OS के लिए user-friendly optimization
ये final build **हर डिवाइस टाइप और हर ऑपरेटिंग सिस्टम** पर चलने के लिए ट्यून किया गया है:

**टेस्ट किए गए platforms / engines**
- **iOS / iPadOS** — iPhone 13, iPad Pro (WebKit / Safari engine)
- **Android** — phone, tablet, 320px छोटा phone, landscape 844×390 (Chromium / Chrome, Samsung Internet, MI Browser detection)
- **Desktop / Laptop** — Windows, macOS, Linux, ChromeOS (Chrome, Edge, Firefox, Opera)
- **Engine compatibility** — Chromium, **WebKit (Safari)**, **Firefox** और **old WebView जहाँ `PointerEvent` नहीं है** — चारों में upload + marking + filename flow टेस्ट हुआ।
- **Touch input** — असली `touchstart/touchmove/touchend` drag से pen stroke ड्रॉ करके JPEG सेव टेस्ट किया।

**क्या-क्या जोड़ा / सुधारा**
- **Welcome पर “सिस्टम चेक” bar** — device type, OS, browser, HTTPS, Camera API, storage, low-RAM mode और installed-PWA status के छोटे chips; साथ में **OS-specific help** (iOS Safari settings, Android site settings, Windows/macOS privacy, Firefox/Edge permissions)। अगर HTTPS या Camera API missing हो तो तुरंत लाल warning।
- **Keyboard shortcuts** (laptop/desktop): `Space`/`Enter` = फ़ोटो, `1`–`8` = दिशा, `M` = पैनल, `G` = GPS, `?` = मदद, `Esc` = बंद। Input fields में टाइप करते वक्त shortcuts अपने आप बंद हो जाते हैं।
- **PWA Install** — Chromium में `beforeinstallprompt` से “ऐप इनस्टॉल करें” बटन; iOS Safari पर “Share → Add to Home Screen” hint।
- **iOS zoom fix** — touch devices पर सारे inputs **16px+**, इसलिए field टैप करने पर Safari zoom नहीं करता। `focus-visible` outline, `aria-label` और keyboard focus states।
- **Welcome scroll fix** — lambi screen (320px / landscape) पर logo कटता नहीं; `margin:auto` + scrollable container।
- **Top bar wrap** — 320–600px phones पर direction pill दूसरी row में जाती है, बटनें shrink होती हैं; कोई horizontal overflow नहीं।
- **Marking compatibility** — `PointerEvent` न होने पर **mouse + touch fallback**; `requestAnimationFrame` throttling से कम RAM पर भी smooth drawing; editor अब base64 `toDataURL` की जगह **blob URL** इस्तेमाल करता है (कम memory) और URL cleanup होती है।
- **Low-RAM auto mode** — `deviceMemory ≤ 2 GB` या `hardwareConcurrency ≤ 2` होने पर camera अपने आप **720p** पर cap हो जाता है ताकि lag न हो (Settings में बदल सकते हैं)।
- **Storage / Private mode** — IndexedDB बंद होने पर ऐप चलता रहता है (in-memory) और एक साफ़ warning देता है: “फ़ोटो सिर्फ इस सेशन में रहेंगी, डाउनलोड कर लें।”
- **Older browsers** — `canvas.toBlob` न होने पर data-URL fallback; `ctx.roundRect` fallback; कोई external CDN/script नहीं; service worker **v8 network-first**।
- Landscape, notch safe-area, `overscroll-behavior`, `prefers-reduced-motion`, 44px+ touch targets — सब बरकरार।

### 🔋 v9 — पूरे store की लंबी रेक्की बिना डिवाइस गरम किए
**समस्या:** एक साइट की कई फ़ोटो लेनी होती हैं — पहले साइज़/डिटेल्स, फिर फ़ोटो, फिर marking और सेव। पूरे समय कैमरा चालू रहने से फ़ोन गर्म होता है, बैटरी जल्दी खत्म होती है, पुराने devices पर ऐप slow/crash हो सकता है।

**समाधान — “एक बार सेटअप, कई फ़ोटो, कैमरा सिर्फ फ़ोटो के समय”:**

1. **सेटअप Welcome screen पर, कैमरा चालू करने से पहले** — Recce card चुनते ही साइट का नाम, कैटेगरी, **साइज़ (W × H)**, **Use Material** और **माप / नोट** का form Welcome पर ही दिखता है। ये सब **एक बार** भरें; फिर “कैमरा शुरू करें” दबाएँ। (Form अपने आप side panel में चला जाता है — duplicate fields नहीं।)
2. **Session** — हर store के लिए एक सेशन अपने आप बन जाता है। **Reload/page बंद होने के बाद भी सेशन और फ़ोटो बने रहते हैं** (localStorage + IndexedDB)। Counter + thumbnail strip दिखता है “सेशन 12 फ़ोटो”। नए store के लिए “सेशन खत्म / नया store” दबाएँ — पुरानी फ़ोटो सुरक्षित रहती हैं।
3. **Camera auto-pause (पावर-सेव)** — फ़ोटो लेते ही marking editor खुलने से **पहले कैमरा बंद** हो जाता है। आप 5–10 मिनट marking करें, तब तक camera sensor/CPU/बैटरी इस्तेमाल नहीं होते। सेव होते ही कैमरा **अपने आप वापस चालू** हो जाता है — अगली फ़ोटो के लिए ready।
   - 1 मिनट कोई फ़ोटो न लें → **idle auto-pause**।
   - Tab background में जाए → **visibility auto-pause**, वापस आते ही resume।
   - Bottom bar में **पॉज़** बटन (manual), और pause overlay पर **“कैमरा चालू करें / अगली फ़ोटो”** — एक टैप में resume।
   - Photo modal में **“अगली फ़ोटो →”** और panel में **“अगली फ़ोटो”** — डिटेल्स दोबारा भरने की ज़रूरत नहीं।
   - Settings/options में **पावर-सेव मोड** switch (default ON) — चाहें तो बंद करें।
4. **Memory-safe for 50+ फ़ोटो** — हर save के बाद पुराने full-res canvases/blobs और object URLs तुरंत release होते हैं (सिर्फ current photo memory में रहती है)। IndexedDB से photos lazy-load होती हैं, इसलिए 100+ फ़ोटो पर भी ऐप नहीं फंसता।
5. **कम हीट के लिए 720p** — low-RAM/Dual-core devices पर camera अपने आप 720p पर cap (पहले से मौजूद v8 optimization)।
6. **हर फ़ोटो का अपना नाम** — marking editor में optional **“एरिया / शॉट”** (Front fascia, Entry gate…) जो filename, gallery, CSV और report में जाता है: `Central_Mall_Store_12x6ft_Vinyl_Front_fascia_2026-10-27-102841.jpg`। खाली छोड़ें तो पुराना `site_size_material_timestamp.jpg` ही रहता है।
7. **पूरे store की एक फ़ाइल** — **“सेशन रिपोर्ट (सभी फ़ोटो)”** एक offline HTML बनाता है जिसमें सेशन की **सभी full-resolution marked फ़ोटो**, हर फ़ोटो का download button, साइज़/मटेरियल/माप/एरिया/मार्किंग डिटेल्स — सब एक जगह। साथ में session CSV। Report में कोई Vastu/दिशा/GPS जानकारी नहीं होती।

> नतीजा: 30–40 फ़ोटो के लंबे recce में कैमरा सिर्फ उन 30–40 छोटे capture moments में चालू रहता है, बाकी पूरा समय बंद — डिवाइस ठंडा, बैटरी बची, ऐप responsive।

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
| `icon.svg`, `icon-192.png`, `icon-512.png` | App icons — आपके LogoMark से बने |
| `logo-primary.png` | ArtVision primary wordmark (welcome / report) |
| `logo-primary-white.png` | Dark photo watermark के लिए सफ़ेद वर्ज़न |
| `logo-mark.png` | Compact infinity mark (top bar) |
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
   - `logo-primary.png`
   - `logo-primary-white.png`
   - `logo-mark.png`
4. Commit करें। 30–60 सेकंड बाद खोलें:
   **https://rjsarkar83.github.io/vastu_camera/**
5. **Purana cache हटाने के लिए** पहली बार site खोलकर hard-refresh करें (`Ctrl+Shift+R` / mobile पर browser cache clear)। नया `sw.js` network-first है, इसलिए आगे updates तुरंत दिखेंगे।

> ℹ️ Arena में इस समय **GitHub connector उपलब्ध नहीं है**, इसलिए मैं सीधे आपके repo में push नहीं कर सकता। इसीलिए नीचे **ready-to-upload **`vastu-camera-github-final-v9.zip`**** बना दिया गया है — बस उसे डाउनलोड करके repo में डाल दें।

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

बनाया गया: 27 अक्टूबर 2026 • **v9 — long recce sessions (power-safe) final build** (v8 all-devices + v7 दोनों कैमरों के ऊपर) (Architecture Vastu + Branding Recce, ऊपर v6 ArtVision branding) • Single-file, dependency-free, browser-based Vastu camera.
