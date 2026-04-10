/**
 * ui.js — Boot screen, ceas, panel rezervare, toast, navigare
 */

/* ── BOOT ── */
const BOOT_LOGS = [
  'SE INIȚIALIZEAZĂ MOTORUL 3D...',
  'SE ÎNCARCĂ DATELE DE TEREN...',
  'SE CONSTRUIESC CLĂDIRILE CLUJ...',
  'SE APLICĂ TEXTURILE DETALIATE...',
  'SE CALIBREAZĂ CAMERA...',
  'SE CONECTEAZĂ LA SENZORI...',
  'SISTEM PORNIT',
];

(function runBoot() {
  let pct = 0, msgIdx = 0;
  const fill = document.getElementById('b-fill');
  const log  = document.getElementById('b-log');
  const pctEl = document.getElementById('b-pct');

  const iv = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 15 + 5);
    fill.style.width = pct + '%';
    pctEl.textContent = Math.floor(pct) + '%';
    if (msgIdx < BOOT_LOGS.length) log.textContent = BOOT_LOGS[msgIdx++];

    if (pct >= 100) {
      clearInterval(iv);
      pctEl.textContent = '100%';
      setTimeout(() => {
        const boot = document.getElementById('boot');
        boot.style.transition = 'opacity .8s';
        boot.style.opacity = '0';
        setTimeout(() => { boot.style.display = 'none'; }, 800);
      }, 600);
    }
  }, 330);
})();

/* ── CEAS ── */
function tick() {
  const n = new Date();
  document.getElementById('clk').textContent =
    String(n.getHours()).padStart(2, '0') + ':' +
    String(n.getMinutes()).padStart(2, '0') + ':' +
    String(n.getSeconds()).padStart(2, '0');

  const DAYS  = ['DUM', 'LUN', 'MAR', 'MIE', 'JOI', 'VIN', 'SAM'];
  const MONTHS = ['IAN','FEB','MAR','APR','MAI','IUN','IUL','AUG','SEP','OCT','NOV','DEC'];
  document.getElementById('dt').textContent =
    DAYS[n.getDay()] + ' ' + n.getDate() + ' ' + MONTHS[n.getMonth()] + ' ' + n.getFullYear();
}
tick();
setInterval(tick, 1000);

/* ── PANEL ── */
let currentSpot = null;

function openPanel(spot) {
  spinning = false;
  currentSpot = spot;

  document.getElementById('p-badge').textContent = 'IDENTIFICATOR · LOC #' + spot.id;
  document.getElementById('p-title').textContent = 'LOC #' + spot.id;
  document.getElementById('p-addr').textContent  = spot.addr;
  document.getElementById('p-price').textContent = spot.price;
  document.getElementById('p-hours').textContent = spot.hours;

  const statEl = document.getElementById('p-stat');
  statEl.textContent   = spot.free ? 'LIBER' : 'OCUPAT';
  statEl.style.color      = spot.free ? '#00ff88' : '#ff3c50';
  statEl.style.textShadow = spot.free
    ? '0 0 14px rgba(0,255,136,.6)'
    : '0 0 14px rgba(255,60,80,.6)';

  const btn = document.getElementById('p-btn');
  btn.textContent = spot.free ? 'REZERVA ACUM' : 'NOTIFICĂ-MĂ';
  btn.className   = spot.free ? 'book free' : 'book occ';

  document.getElementById('pover').style.display = 'block';
  document.getElementById('panel').classList.add('open');

  map.flyTo({
    center: [spot.lng, spot.lat + 0.0006],
    zoom: 17.5,
    pitch: 78,
    duration: 1200,
    easing: t => 1 - Math.pow(1 - t, 3),
  });
}

function closePanel() {
  document.getElementById('panel').classList.remove('open');
  document.getElementById('pover').style.display = 'none';
  currentSpot = null;
}

function doBook() {
  if (!currentSpot || !currentSpot.free) return;

  document.getElementById('t-sub').textContent =
    'LOC ' + currentSpot.id + ' · ' + currentSpot.price + ' LEI/ORA';

  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);

  closePanel();
}

/* ── NAVIGARE ── */
function setNav(el) {
  document.querySelectorAll('.ni').forEach(n => n.classList.remove('act'));
  el.classList.add('act');
}
