# TireaPark 🅿️

> Hartă 3D ultra-detaliată pentru parcări în municipiul Cluj-Napoca.  
> Construită cu **Mapbox GL JS**, CSS pur și JavaScript vanilla — fără framework-uri.

![Preview](docs/preview.png)

---

## ✨ Features

- 🏙 **Hartă 3D** cu clădiri extrudate și iluminat cinematic
- 📍 **Markeri live** colorați după disponibilitate (verde = liber, roșu = ocupat)
- 📋 **Panel detalii** cu preț, program și buton de rezervare
- 🔄 **Moduri de vedere**: 3D · TOP · TILT · Stradă · Auto-spin
- 📡 **Localizare GPS** pentru a naviga la poziția ta
- ⏱ **Ceas live** și statistici în timp real
- 🎬 **Fly-in cinematic** la pornire

---

## 🚀 Pornire rapidă

```bash
# Clonează repo-ul
git clone https://github.com/utilizatorul-tau/tireapark.git
cd tireapark

# Nu e nevoie de build — deschide direct în browser
open index.html
# sau folosește un server local:
npx serve .
```

---

## 🔑 Configurare token Mapbox

1. Creează un cont gratuit pe [mapbox.com](https://www.mapbox.com/)
2. Copiază **Access Token**-ul din dashboard
3. În `src/map.js`, înlocuiește:
   ```js
   mapboxgl.accessToken = 'MAPBOX_TOKEN_HERE';
   ```
   cu token-ul tău real.

> **⚠️ Nu comite niciodată token-ul real în Git!**  
> Adaugă `.env` în `.gitignore` și folosește o variabilă de mediu la build.

---

## 📁 Structura proiectului

```
tireapark/
├── index.html          # Entry point — markup și referințe la scripturi
├── src/
│   ├── style.css       # Toate stilurile (UI cyberpunk + Mapbox overrides)
│   ├── data.js         # Date locuri parcare + funcții helper
│   ├── map.js          # Inițializare hartă, 3D, markeri, moduri vedere
│   └── ui.js           # Boot screen, ceas, panel, toast, navigare
├── public/             # Assets statice (favicon, icoane viitoare)
├── docs/               # Documentație și capturi de ecran
└── .github/
    └── ISSUE_TEMPLATE/ # Template-uri GitHub Issues
```

---

## 🗺 Roadmap

- [ ] Conectare la API real de senzori (MQTT / WebSocket)
- [ ] Autentificare utilizator + istoric rezervări
- [ ] Plată online integrată (Stripe / Revolut Pay)
- [ ] Notificări push când un loc se eliberează
- [ ] Suport multi-oraș (Brașov, Timișoara, București)
- [ ] Dark/light mode toggle
- [ ] PWA — instalabil pe telefon

---

## 🤝 Contribuie

1. Fork → branch nou (`git checkout -b feature/nume-feature`)
2. Commit cu mesaj clar (`git commit -m "feat: adaugă filtrare după tarif"`)
3. Push + deschide Pull Request

---

## 📄 Licență

MIT © 2025 TireaPark
