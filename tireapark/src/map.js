/**
 * map.js — Inițializare hartă Mapbox GL + markeri 3D
 *
 * IMPORTANT: Înlocuiește token-ul de mai jos cu cel din contul tău Mapbox.
 * Nu comite niciodată token-ul real direct în cod — folosește o variabilă
 * de environment sau un fișier .env (vezi README).
 */

// TODO: Mută token-ul în .env și citește-l la build time
mapboxgl.accessToken = 'MAPBOX_TOKEN_HERE';

const MAP_CENTER = [23.5905, 46.7712];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: MAP_CENTER,
  zoom: 13.2,
  pitch: 52,
  bearing: -15,
  antialias: true,
  fadeDuration: 0,
  maxPitch: 85,
});

map.addControl(
  new mapboxgl.NavigationControl({ showCompass: true, showZoom: true }),
  'bottom-right'
);

/* ── Localizare GPS ── */
document.getElementById('btn-loc').addEventListener('click', () => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    map.flyTo({
      center: [pos.coords.longitude, pos.coords.latitude],
      zoom: 17,
      pitch: 72,
      duration: 1500,
    });
  });
});

/* ── Stiluri hartă + clădiri 3D ── */
map.on('load', () => {
  applyMapStyles();
  add3DBuildings();
  addRoadGlow();
  addCityBoundary();
  addAtmosphericFog();
  addParkingMarkers();
  startCinematicFlyIn();
  rotStart();
});

function applyMapStyles() {
  const layers = map.getStyle().layers;
  layers.forEach(l => {
    try {
      if (l.type === 'background') map.setPaintProperty(l.id, 'background-color', '#000a1a');
      if (l.type === 'fill' && l.id.includes('water')) map.setPaintProperty(l.id, 'fill-color', '#001830');
      if (l.type === 'fill' && (l.id.includes('land') || l.id.includes('ground'))) map.setPaintProperty(l.id, 'fill-color', '#020d1e');
      if (l.type === 'fill' && (l.id.includes('park') || l.id.includes('green') || l.id.includes('grass') || l.id.includes('wood')))
        map.setPaintProperty(l.id, 'fill-color', '#001a10');
      if (l.type === 'line') {
        if (l.id.includes('motorway') || l.id.includes('trunk')) map.setPaintProperty(l.id, 'line-color', '#0050a0');
        else if (l.id.includes('primary')) map.setPaintProperty(l.id, 'line-color', '#003878');
        else if (l.id.includes('secondary') || l.id.includes('tertiary')) map.setPaintProperty(l.id, 'line-color', '#002050');
        else if (l.id.includes('road') || l.id.includes('street')) map.setPaintProperty(l.id, 'line-color', '#00142e');
        else if (l.id.includes('path') || l.id.includes('pedestrian')) map.setPaintProperty(l.id, 'line-color', '#001228');
      }
    } catch (e) { /* unele layer-uri nu suportă proprietatea — ignorăm */ }
  });
}

function add3DBuildings() {
  if (!map.getLayer('building-shadow')) {
    map.addLayer({
      id: 'building-shadow',
      type: 'fill-extrusion',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      paint: {
        'fill-extrusion-color': '#000',
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'min_height'],
        'fill-extrusion-opacity': 0.4,
        'fill-extrusion-translate': [4, -4],
      },
    }, 'waterway-label');
  }

  if (map.getLayer('building-extrusion')) {
    map.setPaintProperty('building-extrusion', 'fill-extrusion-color', [
      'interpolate', ['linear'], ['get', 'height'],
      0, '#020d20', 5, '#031628', 15, '#041e35',
      30, '#052442', 60, '#062c54', 100, '#083468',
    ]);
    map.setPaintProperty('building-extrusion', 'fill-extrusion-opacity', 1.0);
    map.setPaintProperty('building-extrusion', 'fill-extrusion-ambient-occlusion-intensity', 0.55);
    map.setPaintProperty('building-extrusion', 'fill-extrusion-ambient-occlusion-radius', 4);
    map.setPaintProperty('building-extrusion', 'fill-extrusion-vertical-gradient', true);
  }
}

function addRoadGlow() {
  map.addLayer({
    id: 'road-glow-outer',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: ['in', 'class', 'primary', 'secondary', 'motorway', 'trunk'],
    paint: {
      'line-color': 'rgba(0,80,180,0.15)',
      'line-width': ['interpolate', ['linear'], ['zoom'], 14, 8, 18, 20],
      'line-blur': 6,
    },
  }, 'road-label');

  map.addLayer({
    id: 'road-glow-inner',
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: ['in', 'class', 'primary', 'secondary', 'motorway', 'trunk'],
    paint: {
      'line-color': 'rgba(0,120,255,0.35)',
      'line-width': ['interpolate', ['linear'], ['zoom'], 14, 2, 18, 4],
    },
  }, 'road-label');
}

function addCityBoundary() {
  map.addSource('cluj-boundary', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [23.4800, 46.7200], [23.4850, 46.7600], [23.5000, 46.8000],
          [23.5200, 46.8200], [23.5500, 46.8350], [23.5800, 46.8400],
          [23.6200, 46.8350], [23.6500, 46.8200], [23.6700, 46.8000],
          [23.6800, 46.7700], [23.6750, 46.7400], [23.6600, 46.7100],
          [23.6400, 46.6900], [23.6100, 46.6750], [23.5800, 46.6700],
          [23.5500, 46.6700], [23.5200, 46.6800], [23.5000, 46.6950],
          [23.4850, 46.7100], [23.4800, 46.7200],
        ]],
      },
    },
  });

  map.addLayer({ id: 'cluj-fill',    type: 'fill', source: 'cluj-boundary', paint: { 'fill-color': 'rgba(0,150,255,0.04)', 'fill-outline-color': 'rgba(0,200,255,0)' } });
  map.addLayer({ id: 'cluj-outline', type: 'line', source: 'cluj-boundary', paint: { 'line-color': 'rgba(0,200,255,0.5)',  'line-width': 1.5, 'line-dasharray': [4, 3], 'line-blur': 1 } });
  map.addLayer({ id: 'cluj-glow',    type: 'line', source: 'cluj-boundary', paint: { 'line-color': 'rgba(0,150,255,0.15)', 'line-width': 8, 'line-blur': 10 } });
}

function addAtmosphericFog() {
  map.setFog({
    color: 'rgba(0,5,18,0.9)',
    'high-color': 'rgba(0,8,25,0.95)',
    'horizon-blend': 0.04,
    'space-color': '#000510',
    'star-intensity': 0.0,
  });
}

function addParkingMarkers() {
  SPOTS.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'mk';
    const c  = s.free ? '#00ff88' : '#ff3c50';
    const cr = s.free ? '0,255,136' : '255,60,80';
    el.style.animationDelay = (i * 0.1) + 's';
    el.innerHTML = `
      <div class="mk-body" style="background:rgba(${cr},.25)">
        <span class="mk-id" style="color:${c}">${s.id}</span>
      </div>
      <div class="mk-ring" style="border:1.5px solid rgba(${cr},.5)"></div>`;
    el.addEventListener('click', () => openPanel(s));
    new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([s.lng, s.lat])
      .addTo(map);
  });
}

function startCinematicFlyIn() {
  setTimeout(() => {
    map.flyTo({
      center: MAP_CENTER,
      zoom: 13.5,
      pitch: 58,
      bearing: 20,
      duration: 5000,
      easing: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    });
  }, 400);
}

/* ── Rotație lentă automată ── */
let spinning = true;
let bear = -15;

function rotStart() {
  function rot() {
    if (!spinning) return;
    bear = (bear + 0.007) % 360;
    map.setBearing(bear);
    requestAnimationFrame(rot);
  }
  setTimeout(() => rot(), 5200);
}

map.on('mousedown',  () => { spinning = false; });
map.on('touchstart', () => { spinning = false; });

/* ── Moduri de vedere ── */
function setView(mode) {
  spinning = false;
  document.querySelectorAll('.vc-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('vc-' + mode).classList.add('active');

  const views = {
    '3d':     { zoom: 13.5, pitch: 58, bearing: 20,  duration: 1400 },
    'top':    { zoom: 13,   pitch: 0,  bearing: 0,   duration: 1400 },
    'tilt':   { zoom: 13.5, pitch: 45, bearing: -10, duration: 1400 },
    'street': { zoom: 16.5, pitch: 82, bearing: 30,  duration: 1800 },
  };

  if (views[mode]) {
    map.flyTo({
      center: MAP_CENTER,
      ...views[mode],
      easing: t => 1 - Math.pow(1 - t, 3),
    });
  }
}

function toggleSpin() {
  spinning = !spinning;
  document.getElementById('spin-ico').textContent = spinning ? '⏸' : '↻';
  document.getElementById('vc-spin').classList.toggle('active', spinning);
  if (spinning) {
    bear = map.getBearing();
    (function rot() {
      if (!spinning) return;
      bear = (bear + 0.007) % 360;
      map.setBearing(bear);
      requestAnimationFrame(rot);
    })();
  }
}
