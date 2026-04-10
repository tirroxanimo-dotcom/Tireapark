/**
 * data.js — Locuri de parcare TireaPark
 *
 * TODO: Înlocuiește datele statice cu un apel API real:
 *   const res = await fetch('/api/spots');
 *   const SPOTS = await res.json();
 */

const SPOTS = [
  { id: 'A1', lat: 46.7712, lng: 23.5898, addr: 'Str. Mihai Viteazu 7',    price: 5, hours: '08–18', free: true  },
  { id: 'A2', lat: 46.7695, lng: 23.5921, addr: 'Str. Eroilor 14',          price: 4, hours: '09–17', free: true  },
  { id: 'B1', lat: 46.7738, lng: 23.5862, addr: 'Bd. 21 Decembrie 8',       price: 6, hours: '07–19', free: true  },
  { id: 'B2', lat: 46.7748, lng: 23.5942, addr: 'Str. Dorobanților 3',      price: 5, hours: '10–16', free: false },
  { id: 'C1', lat: 46.7680, lng: 23.5875, addr: 'Str. Clinicilor 22',       price: 3, hours: '08–12', free: true  },
  { id: 'C2', lat: 46.7722, lng: 23.5958, addr: 'Str. Napoca 9',            price: 5, hours: '11–20', free: true  },
  { id: 'D1', lat: 46.7762, lng: 23.5878, addr: 'Calea Dorobanților 45',    price: 4, hours: '08–18', free: false },
  { id: 'D2', lat: 46.7698, lng: 23.5912, addr: 'Str. Memorandumului 2',    price: 6, hours: '07–22', free: true  },
  { id: 'E1', lat: 46.7655, lng: 23.5932, addr: 'Str. Observatorului 7',    price: 3, hours: '09–15', free: false },
  { id: 'E2', lat: 46.7730, lng: 23.5885, addr: 'Piața Unirii',             price: 7, hours: '07–23', free: true  },
];

/**
 * Calculează statistici din lista curentă de locuri.
 * @returns {{ free: number, occupied: number, minPrice: number }}
 */
function getStats() {
  const free = SPOTS.filter(s => s.free).length;
  const freeSpots = SPOTS.filter(s => s.free);
  return {
    free,
    occupied: SPOTS.length - free,
    minPrice: freeSpots.length ? Math.min(...freeSpots.map(s => s.price)) : 0,
  };
}
