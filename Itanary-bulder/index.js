/*
  NorthWind Kashmir - Package Creator
  index.js
*/

// ============================================================
// STORAGE LAYER
// Replace these functions with fetch() calls to add a backend.
// ============================================================

const STORAGE_KEY = 'nwk_packages';
const COST_LIBRARY_KEY = 'nwk_cost_presets';
const HOTEL_DB_KEY = 'nwk_hotel_db';
const RATE_STALE_DAYS = 45;
const ADMIN_USERNAME = 'northwindkashmir';
const ADMIN_PASSWORD = 'nwt@0080';
const ADMIN_SESSION_KEY = 'nwk_admin_session';
const ADMIN_SESSION_DURATION = 8 * 60 * 60 * 1000;

function isAdminSessionActive() {
  var expiresAt = parseInt(sessionStorage.getItem(ADMIN_SESSION_KEY) || '0', 10);
  return expiresAt > Date.now();
}

function setAdminSession() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, String(Date.now() + ADMIN_SESSION_DURATION));
}

function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function setAppAccess(isAuthenticated) {
  var loginScreen = document.getElementById('loginScreen');
  if (loginScreen) loginScreen.classList.toggle('is-hidden', isAuthenticated);
  document.body.classList.toggle('is-locked', !isAuthenticated);
}

var loginForm = document.getElementById('loginForm');
var loginError = document.getElementById('loginError');
if (loginForm) {
  setAppAccess(isAdminSessionActive());
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var username = document.getElementById('loginUsername').value.trim();
    var password = document.getElementById('loginPassword').value;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdminSession();
      loginError.textContent = '';
      loginForm.reset();
      setAppAccess(true);
      return;
    }
    loginError.textContent = 'Incorrect username or password.';
  });
}

var topLogoutButtons = document.querySelectorAll('#btnTopLogout, #btnTopLogoutMobile');
topLogoutButtons.forEach(function (logoutButton) {
  logoutButton.addEventListener('click', function () {
    clearAdminSession();
    setAppAccess(false);
    document.getElementById('loginUsername').focus();
  });
});

var menuBtn = document.getElementById('menu-btn');
var mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', function () {
    var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    mobileMenu.classList.toggle('max-h-0', isOpen);
    mobileMenu.classList.toggle('opacity-0', isOpen);
    mobileMenu.classList.toggle('max-h-[calc(100svh-5rem)]', !isOpen);
    mobileMenu.classList.toggle('sm:max-h-[calc(100svh-5rem)]', !isOpen);
    mobileMenu.classList.toggle('opacity-100', !isOpen);
  });
}

const DEFAULT_INCLUSIONS = ['Airport Pickup and Drop', 'Hotel Accommodation', 'Breakfast', 'Private Vehicle', 'Driver', 'Sightseeing'];
const DEFAULT_EXCLUSIONS = ['Flight Tickets', 'Gondola Tickets', 'Pony Rides', 'Lunch', 'Personal Expenses', 'Travel Insurance', 'Anything Not Mentioned'];

const INC_EXC_TEMPLATES = {
  honeymoon: {
    label: 'Honeymoon',
    inclusions: ['Airport Pickup and Drop', 'Hotel Accommodation', 'Breakfast', 'Dinner', 'Private Vehicle', 'Driver', 'Sightseeing', 'Welcome Flowers', 'Shikara Ride'],
    exclusions: ['Flight Tickets', 'Gondola Tickets', 'Pony Rides', 'Lunch', 'Personal Expenses', 'Travel Insurance', 'Anything Not Mentioned']
  },
  family: {
    label: 'Family',
    inclusions: ['Airport Pickup and Drop', 'Hotel Accommodation', 'Breakfast', 'Dinner', 'Private Vehicle', 'Driver', 'Sightseeing', 'Toll and Parking'],
    exclusions: ['Flight Tickets', 'Gondola Tickets', 'Pony Rides', 'Lunch', 'Adventure Activities', 'Personal Expenses', 'Anything Not Mentioned']
  },
  luxury: {
    label: 'Luxury',
    inclusions: ['Airport Pickup and Drop', 'Hotel Accommodation', 'Breakfast', 'Dinner', 'Private Vehicle', 'Driver', 'Sightseeing', 'Welcome Flowers', 'Shikara Ride', 'Toll and Parking'],
    exclusions: ['Flight Tickets', 'Gondola Tickets', 'Pony Rides', 'Lunch', 'Personal Expenses', 'Anything Not Mentioned']
  },
  adventure: {
    label: 'Adventure',
    inclusions: ['Airport Pickup and Drop', 'Hotel Accommodation', 'Breakfast', 'Private Vehicle', 'Driver', 'Sightseeing', 'Toll and Parking'],
    exclusions: ['Flight Tickets', 'Gondola Tickets', 'Pony Rides', 'Lunch', 'Travel Insurance', 'Adventure Activities', 'Personal Expenses', 'Anything Not Mentioned']
  }
};

const DEFAULT_COST_PRESETS = [
  { id: 'spring_family_sgr_glm', name: 'Spring Family Srinagar-Gulmarg', season: 'Spring', destinations: ['Srinagar', 'Gulmarg'], hotel: 32000, transport: 12000, activities: 4500, other: 2000, markup: 9000, note: 'Balanced spring family costing with moderate hotel rates.' },
  { id: 'summer_honeymoon_full', name: 'Summer Honeymoon Premium', season: 'Summer', destinations: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Dal Lake'], hotel: 52000, transport: 17000, activities: 9000, other: 3500, markup: 18000, note: 'Premium honeymoon pricing for peak summer demand.' },
  { id: 'autumn_group_mix', name: 'Autumn Group Explorer', season: 'Autumn', destinations: ['Srinagar', 'Pahalgam', 'Sonamarg'], hotel: 41000, transport: 19000, activities: 7000, other: 3000, markup: 13000, note: 'Group-focused autumn mix with long-route transport buffer.' },
  { id: 'winter_snow_escape', name: 'Winter Snow Escape', season: 'Winter', destinations: ['Srinagar', 'Gulmarg', 'Dal Lake'], hotel: 45000, transport: 16000, activities: 11000, other: 3500, markup: 15000, note: 'Includes higher winter activity and logistics costs.' },
  { id: 'peak_holiday_luxury', name: 'Peak Holiday Luxury', season: 'Peak Holiday', destinations: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonamarg'], hotel: 68000, transport: 22000, activities: 12000, other: 5000, markup: 24000, note: 'Peak holiday surge pricing for premium inventory.' }
];

function ensurePackageDefaults(pkg) {
  var safePkg = pkg || {};
  var defaultValidity = new Date(Date.now() + (7 * 86400000)).toISOString().split('T')[0];
  var inclusions = Array.isArray(safePkg.inclusions) ? safePkg.inclusions : DEFAULT_INCLUSIONS.slice();
  var exclusions = Array.isArray(safePkg.exclusions) ? safePkg.exclusions : DEFAULT_EXCLUSIONS.slice();
  var pricing = safePkg.pricing || {};
  var quoteVersion = parseInt(safePkg.quoteVersion, 10);
  if (!quoteVersion || quoteVersion < 1) quoteVersion = 1;

  return Object.assign({}, safePkg, {
    customer: Object.assign({ name: '', whatsapp: '', email: '', country: '', requests: '' }, safePkg.customer || {}),
    destinations: Array.isArray(safePkg.destinations) ? safePkg.destinations : [],
    itinerary: Array.isArray(safePkg.itinerary) ? safePkg.itinerary : [],
    hotels: Array.isArray(safePkg.hotels) ? safePkg.hotels : [],
    roomType: safePkg.roomType || 'Double',
    vehicleType: safePkg.vehicleType || 'Sedan',
    season: safePkg.season || 'Summer',
    quoteGroupId: safePkg.quoteGroupId || safePkg.id,
    quoteVersion: quoteVersion,
    versionSourceId: safePkg.versionSourceId || '',
    versionChangeSummary: safePkg.versionChangeSummary || '',
    appliedTemplates: Object.assign({ incExc: '', costPreset: '' }, safePkg.appliedTemplates || {}),
    inclusions: inclusions,
    exclusions: exclusions,
    pricing: Object.assign({
      hotel: 0,
      transport: 0,
      activities: 0,
      other: 0,
      markup: 0,
      discount: 0,
      totalCost: 0,
      finalPrice: 0,
      perPerson: 0,
      note: '',
      presetId: ''
    }, pricing),
    policies: Object.assign({
      validityDate: defaultValidity,
      paymentSchedule: '40% advance to confirm booking, 40% before check-in, 20% on arrival.',
      cancellationPolicy: 'Free cancellation up to 15 days before arrival. Charges apply for late cancellation.',
      terms: 'Rates are subject to availability and final confirmation at the time of booking.',
      includeSignature: true,
      includeSeal: true
    }, safePkg.policies || {})
  });
}

function ensureHotelDefaults(hotel) {
  var safeHotel = hotel || {};
  var score = parseFloat(safeHotel.reliabilityScore);
  if (!score || score < 1 || score > 5) score = 4;
  return Object.assign({}, safeHotel, {
    roomType: safeHotel.roomType || 'Standard',
    pricePerNight: safeHotel.pricePerNight || safeHotel.price || 0,
    contact: safeHotel.contact || '',
    contactPerson: safeHotel.contactPerson || '',
    notes: safeHotel.notes || '',
    reliabilityScore: score,
    lastRateUpdate: safeHotel.lastRateUpdate || '',
    lastUsedAt: safeHotel.lastUsedAt || '',
    lastQuotedRate: safeHotel.lastQuotedRate || 0,
    notesHistory: Array.isArray(safeHotel.notesHistory) ? safeHotel.notesHistory : []
  });
}

function getAllPackages() {
  try {
    var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(data)) return [];
    return data.map(ensurePackageDefaults);
  } catch {
    return [];
  }
}

function saveAllPackages(packages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify((packages || []).map(ensurePackageDefaults)));
}

function getCostPresets() {
  var presets = [];
  try {
    presets = JSON.parse(localStorage.getItem(COST_LIBRARY_KEY) || '[]');
  } catch {
    presets = [];
  }
  if (!Array.isArray(presets) || presets.length === 0) {
    return DEFAULT_COST_PRESETS.slice();
  }

  var byId = {};
  DEFAULT_COST_PRESETS.concat(presets).forEach(function (p) {
    byId[p.id] = p;
  });
  return Object.keys(byId).map(function (k) { return byId[k]; });
}

function saveCostPresets(presets) {
  localStorage.setItem(COST_LIBRARY_KEY, JSON.stringify(presets || []));
}

function savePackage(pkg) {
  const packages = getAllPackages();
  const idx = packages.findIndex(p => p.id === pkg.id);
  if (idx >= 0) { packages[idx] = pkg; } else { packages.push(pkg); }
  saveAllPackages(packages);
}

function deletePackage(id) {
  saveAllPackages(getAllPackages().filter(p => p.id !== id));
}

function generateId() {
  const all = getAllPackages();
  const year = new Date().getFullYear();
  const yearPrefix = 'NWK-' + year + '-';

  let maxSerial = 0;
  all.forEach(function (pkg) {
    if (!pkg || !pkg.id || pkg.id.indexOf(yearPrefix) !== 0) return;
    const serialPart = pkg.id.slice(yearPrefix.length);
    const serialNum = parseInt(serialPart, 10);
    if (!isNaN(serialNum) && serialNum > maxSerial) {
      maxSerial = serialNum;
    }
  });

  let nextSerial = maxSerial + 1;
  let candidate = yearPrefix + String(nextSerial).padStart(4, '0');
  const existingIds = new Set(all.map(function (p) { return p.id; }));
  while (existingIds.has(candidate)) {
    nextSerial += 1;
    candidate = yearPrefix + String(nextSerial).padStart(4, '0');
  }
  return candidate;
}

// ============================================================
// APP STATE
// ============================================================

let editingId = null;
let pendingDeleteId = null;
let viewingPackage = null;
let activeIncExcTemplate = '';
let activeCostPresetId = '';
let simpleModeEnabled = true;

// ============================================================
// DOM REFERENCES
// ============================================================

const btnNewPackage = document.getElementById('btnNewPackage');
const formSection = document.getElementById('formSection');
const listSection = document.getElementById('listSection');
const packageForm = document.getElementById('packageForm');
const formTitle = document.getElementById('formTitle');
const pkgId = document.getElementById('pkgId');
const pkgStartDate = document.getElementById('pkgStartDate');
const pkgEndDate = document.getElementById('pkgEndDate');
const pkgDuration = document.getElementById('pkgDuration');
const pkgAdults = document.getElementById('pkgAdults');
const pkgChildren = document.getElementById('pkgChildren');
const itineraryHint = document.getElementById('itineraryHint');
const itineraryContainer = document.getElementById('itineraryContainer');
const hotelContainer = document.getElementById('hotelContainer');
const packageGrid = document.getElementById('packageGrid');
const packageCount = document.getElementById('packageCount');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const toast = document.getElementById('toast');

// ============================================================
// UTILITIES
// ============================================================

function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return 'Rs. 0';
  return 'Rs. ' + Number(amount).toLocaleString('en-IN');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function calcDuration(start, end) {
  if (!start || !end) return '';
  const diff = Math.round((new Date(end) - new Date(start)) / 86400000);
  if (diff < 0) return 'Invalid dates';
  return (diff + 1) + 'D / ' + diff + 'N';
}

function showToast(message, type) {
  toast.textContent = message;
  toast.className = 'toast show ' + (type || 'success');
  setTimeout(function () { toast.className = 'toast'; }, 3200);
}

function applySimpleModeUI() {
  document.body.classList.toggle('simple-mode', !!simpleModeEnabled);
  var toggleBtn = document.getElementById('btnToggleSimpleMode');
  if (toggleBtn) {
    toggleBtn.textContent = simpleModeEnabled ? 'Simple Mode: ON' : 'Simple Mode: OFF';
  }
}

function setDefaultValidityDate() {
  var validityInput = document.getElementById('pkgValidityDate');
  if (!validityInput || validityInput.value) return;
  validityInput.value = new Date(Date.now() + (7 * 86400000)).toISOString().split('T')[0];
}

function ensureChecklistOption(listId, value, checked) {
  var list = document.getElementById(listId);
  if (!list) return;
  var existing = Array.from(list.querySelectorAll('input[type="checkbox"]')).find(function (cb) { return cb.value === value; });
  if (existing) {
    existing.checked = !!checked;
    return;
  }
  var label = document.createElement('label');
  label.innerHTML = '<input type="checkbox" value="' + value + '"' + (checked ? ' checked' : '') + ' /> ' + value;
  list.appendChild(label);
}

function applyChecklistTemplate(key) {
  var tpl = INC_EXC_TEMPLATES[key];
  if (!tpl) {
    showToast('Please choose a valid template.', 'error');
    return;
  }
  document.querySelectorAll('#inclusionsList input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
  document.querySelectorAll('#exclusionsList input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });

  tpl.inclusions.forEach(function (item) { ensureChecklistOption('inclusionsList', item, true); });
  tpl.exclusions.forEach(function (item) { ensureChecklistOption('exclusionsList', item, true); });
  activeIncExcTemplate = key;
  showToast('Applied ' + tpl.label + ' inclusions/exclusions template.', 'success');
}

function renderCostPresetOptions(selectedId) {
  var select = document.getElementById('costPresetSelect');
  if (!select) return;
  var options = ['<option value="">Select preset...</option>'];
  getCostPresets().forEach(function (preset) {
    options.push('<option value="' + preset.id + '">' + preset.name + ' (' + preset.season + ')</option>');
  });
  select.innerHTML = options.join('');
  if (selectedId) select.value = selectedId;
}

function applyCostPreset(preset) {
  if (!preset) return;
  document.getElementById('costHotel').value = preset.hotel || 0;
  document.getElementById('costTransport').value = preset.transport || 0;
  document.getElementById('costActivities').value = preset.activities || 0;
  document.getElementById('costOther').value = preset.other || 0;
  document.getElementById('costMarkup').value = preset.markup || 0;
  if (!document.getElementById('pkgPricingNote').value.trim()) {
    document.getElementById('pkgPricingNote').value = preset.note || '';
  }
  activeCostPresetId = preset.id;
  var select = document.getElementById('costPresetSelect');
  if (select) select.value = preset.id;
  recalcPrice();
}

function suggestCostPreset() {
  var season = document.getElementById('pkgSeason') ? document.getElementById('pkgSeason').value : '';
  var destinations = getDestinations();
  var presets = getCostPresets();
  if (!presets.length) return null;

  var best = null;
  var bestScore = -1;
  presets.forEach(function (preset) {
    var score = 0;
    if (preset.season === season) score += 4;
    (preset.destinations || []).forEach(function (dest) {
      if (destinations.includes(dest)) score += 2;
    });
    if (score > bestScore) {
      bestScore = score;
      best = preset;
    }
  });
  return best;
}

function buildVersionDiffSummary(prevPkg, nextPkg) {
  if (!prevPkg || !nextPkg) return '';
  var changes = [];
  var prevPrice = (prevPkg.pricing || {}).finalPrice || 0;
  var nextPrice = (nextPkg.pricing || {}).finalPrice || 0;
  if (prevPrice !== nextPrice) {
    var delta = nextPrice - prevPrice;
    changes.push('Price ' + (delta > 0 ? 'increased' : 'reduced') + ' by ' + formatCurrency(Math.abs(delta)));
  }
  if ((prevPkg.duration || '') !== (nextPkg.duration || '')) {
    changes.push('Duration changed to ' + nextPkg.duration);
  }
  if ((prevPkg.hotels || []).length !== (nextPkg.hotels || []).length) {
    changes.push('Hotel plan updated');
  }
  if ((prevPkg.itinerary || []).length !== (nextPkg.itinerary || []).length) {
    changes.push('Itinerary days revised');
  }
  return changes.slice(0, 3).join(' | ') || 'Minor adjustments from previous version';
}

function getGroupHighestVersion(groupId) {
  var all = getAllPackages().filter(function (p) { return p.quoteGroupId === groupId; });
  if (all.length === 0) return 1;
  return all.reduce(function (max, p) {
    var ver = parseInt(p.quoteVersion, 10) || 1;
    return ver > max ? ver : max;
  }, 1);
}

function daysSince(dateStr) {
  if (!dateStr) return Number.MAX_SAFE_INTEGER;
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return Number.MAX_SAFE_INTEGER;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

// ============================================================
// PRICING
// ============================================================

function recalcPrice() {
  var hotel = parseFloat(document.getElementById('costHotel').value) || 0;
  var transport = parseFloat(document.getElementById('costTransport').value) || 0;
  var activities = parseFloat(document.getElementById('costActivities').value) || 0;
  var other = parseFloat(document.getElementById('costOther').value) || 0;
  var markup = parseFloat(document.getElementById('costMarkup').value) || 0;
  var discount = parseFloat(document.getElementById('costDiscount').value) || 0;
  var adults = parseInt(pkgAdults.value) || 1;
  var children = parseInt(pkgChildren.value) || 0;
  var total = adults + children || 1;
  var totalCost = hotel + transport + activities + other;
  var finalPrice = totalCost + markup - discount;
  document.getElementById('calcTotalCost').textContent = formatCurrency(totalCost);
  document.getElementById('calcMarkup').textContent = formatCurrency(markup);
  document.getElementById('calcDiscount').textContent = formatCurrency(discount);
  document.getElementById('calcFinal').textContent = formatCurrency(finalPrice);
  document.getElementById('calcPerPerson').textContent = formatCurrency(Math.round(finalPrice / total));
}

['costHotel', 'costTransport', 'costActivities', 'costOther', 'costMarkup', 'costDiscount'].forEach(function (id) {
  document.getElementById(id).addEventListener('input', recalcPrice);
});
pkgAdults.addEventListener('input', recalcPrice);
pkgChildren.addEventListener('input', recalcPrice);

// ============================================================
// DURATION
// ============================================================

pkgStartDate.addEventListener('change', function () { pkgDuration.value = calcDuration(pkgStartDate.value, pkgEndDate.value); });
pkgEndDate.addEventListener('change', function () { pkgDuration.value = calcDuration(pkgStartDate.value, pkgEndDate.value); });

// ============================================================
// ITINERARY BUILDER & AUTO-GENERATOR
// ============================================================

var dayCount = 0;

function addDay(data) {
  data = data || {};
  dayCount++;
  if (itineraryHint) itineraryHint.style.display = 'none';
  var div = document.createElement('div');
  div.className = 'itinerary-day';
  div.innerHTML =
    '<div class="itinerary-day-header">' +
    '<span class="day-num">' + dayCount + '</span>' +
    '<span>Day ' + dayCount + '</span>' +
    '<input type="date" class="day-date" value="' + (data.date || '') + '" style="margin-left:10px;width:auto;padding:4px 8px;font-size:0.82rem;border:1px solid #ccc;border-radius:4px;">' +
    '<div class="day-actions">' +
    '<button type="button" class="btn btn-sm" onclick="removeDayBlock(this)" style="background:#fef2f2;color:#e74c3c;border:1px solid #fecaca;border-radius:4px;padding:3px 8px;cursor:pointer;">Remove</button>' +
    '</div>' +
    '</div>' +
    '<div class="itinerary-day-body">' +
    '<div class="form-group"><label>Day Title</label><input type="text" class="day-title" placeholder="e.g. Arrival Srinagar" value="' + (data.title || '').replace(/"/g, '&quot;') + '"></div>' +
    '<div class="form-group"><label>Route</label><input type="text" class="day-route" placeholder="e.g. Srinagar to Gulmarg" value="' + (data.route || '').replace(/"/g, '&quot;') + '"></div>' +
    '<div class="form-group"><label>Hotel Stay</label><input type="text" class="day-hotel" placeholder="Hotel name" value="' + (data.hotel || '').replace(/"/g, '&quot;') + '"></div>' +
    '<div class="form-group"><label>Meals</label><input type="text" class="day-meals" placeholder="e.g. Breakfast + Dinner" value="' + (data.meals || '').replace(/"/g, '&quot;') + '"></div>' +
    '<div class="form-group full-w"><label>Activities / Places</label><input type="text" class="day-activities" placeholder="e.g. Dal Lake, Mughal Gardens" value="' + (data.activities || '').replace(/"/g, '&quot;') + '"></div>' +
    '<div class="form-group full-w"><label>Description</label><textarea class="day-description" rows="2" placeholder="Describe this day...">' + (data.description || '') + '</textarea></div>' +
    '</div>';
  itineraryContainer.appendChild(div);
  renumberDays();
}

function removeDayBlock(btn) {
  btn.closest('.itinerary-day').remove();
  renumberDays();
  if (itineraryContainer.children.length === 0) {
    if (itineraryHint) itineraryHint.style.display = '';
    dayCount = 0;
  }
}

function renumberDays() {
  var days = itineraryContainer.querySelectorAll('.itinerary-day');
  days.forEach(function (d, i) {
    d.querySelector('.day-num').textContent = i + 1;
    d.querySelectorAll('.itinerary-day-header span')[1].textContent = 'Day ' + (i + 1);
  });
}

function getItineraryData() {
  var days = [];
  itineraryContainer.querySelectorAll('.itinerary-day').forEach(function (d, i) {
    days.push({
      day: i + 1,
      date: d.querySelector('.day-date').value,
      title: d.querySelector('.day-title').value,
      route: d.querySelector('.day-route').value,
      hotel: d.querySelector('.day-hotel').value,
      meals: d.querySelector('.day-meals').value,
      activities: d.querySelector('.day-activities').value,
      description: d.querySelector('.day-description').value
    });
  });
  return days;
}

function addDaysToDateStr(baseDateStr, daysToAdd) {
  if (!baseDateStr) return '';
  var d = new Date(baseDateStr);
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().split('T')[0];
}

// ITINERARY TEMPLATES REPOSITORY
var ITINERARY_TEMPLATES = {
  '5d_classic': {
    name: '5D/4N Classic Kashmir Highlights',
    destinations: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Dal Lake'],
    hotels: [
      { location: 'Srinagar', name: 'Deluxe Hotel Srinagar', category: '4 Star', nights: 2 },
      { location: 'Pahalgam', name: 'Pahalgam Valley Resort', category: '4 Star', nights: 1 },
      { location: 'Srinagar (Dal Lake)', name: 'Premium Houseboat', category: 'Houseboat', nights: 1 }
    ],
    days: [
      {
        title: 'Arrival in Srinagar & Sunset Shikara Ride on Dal Lake',
        route: 'Srinagar Airport (SXR) to Hotel / Houseboat (15 km / 35 mins)',
        hotel: 'Srinagar Deluxe Hotel / Houseboat',
        meals: 'Welcome Kehwa & Dinner',
        activities: 'Dal Lake, 1-Hour Shikara Ride, Boulevard Road, Floating Gardens, Nehru Park',
        description: 'Warm welcome upon arrival at Srinagar Airport. Transfer to your accommodation. In the evening, enjoy a relaxing sunset Shikara ride on Dal Lake surrounded by the majestic Zabarwan mountain range. Overnight stay in Srinagar.'
      },
      {
        title: 'Srinagar to Gulmarg Day Excursion (Meadow of Flowers & Gondola Ride)',
        route: 'Srinagar to Gulmarg (51 km / 1.5 hrs each way)',
        hotel: 'Srinagar Deluxe Hotel',
        meals: 'Breakfast & Dinner',
        activities: 'Gulmarg Gondola (Phase 1 Kungdoor & Phase 2 Apharwat Peak), Snow Activities, Golf Course',
        description: 'After breakfast, drive to Gulmarg through dense pine forests. Experience the famous Gulmarg Gondola ride up to Apharwat Peak (13,780 ft) for breathtaking snow views and winter sports. Return to Srinagar in the evening for dinner and stay.'
      },
      {
        title: 'Srinagar to Pahalgam (Valley of Shepherds & Lidder River)',
        route: 'Srinagar to Pahalgam via Pampore & Apple Orchards (90 km / 2.5 hrs)',
        hotel: 'Pahalgam Valley Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Pampore Saffron Fields, Apple Orchards, Avantipura Ruins, Lidder River Bank, Pahalgam Market',
        description: 'Scenic journey to Pahalgam. Enroute visit world-famous Pampore saffron fields and historical Avantipura ruins. Enjoy the gushing Lidder river and scenic valley walks. Check into hotel for a serene evening by the river.'
      },
      {
        title: 'Pahalgam Valleys Sightseeing & Return to Srinagar Houseboat',
        route: 'Pahalgam Local Sightseeing to Srinagar (90 km / 2.5 hrs)',
        hotel: 'Deluxe Dal Lake Houseboat',
        meals: 'Breakfast & Dinner',
        activities: 'Betaab Valley, Aru Valley, Chandanwari, Baisaran (Mini Switzerland by Pony)',
        description: 'Morning excursion to Betaab Valley, Aru Valley, and Chandanwari. Optional pony ride to Baisaran meadow. In the afternoon, drive back to Srinagar and check into a traditional Kashmiri Houseboat on Dal Lake.'
      },
      {
        title: 'Srinagar Mughal Gardens Tour & Airport Departure',
        route: 'Houseboat to Mughal Gardens & Srinagar Airport (15 km)',
        hotel: 'Check-out / Journey Home',
        meals: 'Breakfast',
        activities: 'Nishat Bagh, Shalimar Bagh, Chashme Shahi, Shankaracharya Temple, Saffron/Dry Fruit Shopping, Airport Drop',
        description: 'Visit the historic Mughal Gardens (Nishat, Shalimar) and Shankaracharya Temple for panoramic views. Complete souvenir shopping and transfer to Srinagar Airport with sweet memories of Kashmir.'
      }
    ]
  },
  '6d_honeymoon': {
    name: '6D/5N Romantic Kashmir Honeymoon',
    destinations: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Dal Lake', 'Betaab Valley'],
    hotels: [
      { location: 'Srinagar (Dal Lake)', name: 'Luxury Royal Houseboat', category: 'Houseboat', nights: 1 },
      { location: 'Gulmarg', name: 'Gulmarg Alpine Resort', category: '4 Star', nights: 1 },
      { location: 'Pahalgam', name: 'Pahalgam River View Resort', category: '4 Star', nights: 2 },
      { location: 'Srinagar', name: 'Grand Palace Srinagar', category: '5 Star', nights: 1 }
    ],
    days: [
      {
        title: 'Romantic Welcome in Srinagar & Sunset Shikara Ride on Dal Lake',
        route: 'Srinagar Airport to Luxury Houseboat (15 km / 35 mins)',
        hotel: 'Luxury Royal Houseboat (Dal Lake)',
        meals: 'Welcome Kashmiri Kehwa, Flower Bouquet & Candlelight Dinner',
        activities: 'Dal Lake, Private Decorated Shikara Ride, Floating Flower Market, Sunset Photography',
        description: 'Warm traditional Kashmiri welcome for the couple. Check-in to a luxury houseboat. Enjoy a romantic 2-hour private Shikara cruise across the tranquil Dal Lake with lotus flowers and sunset reflections. Special candlelight dinner included.'
      },
      {
        title: 'Srinagar to Gulmarg (The Snowy Paradise & Gondola Cable Car)',
        route: 'Srinagar to Gulmarg (51 km / 1.5 hrs)',
        hotel: 'Gulmarg Alpine Resort',
        meals: 'Breakfast & Romantic Dinner',
        activities: 'Gulmarg Gondola Ride (Phase 1 & Phase 2), Apharwat Snow Peak, St. Mary Church, Strawberry Valley',
        description: 'Drive through pine-clad hills to Gulmarg. Take the world-famous Gondola Cable Car to snow-covered Apharwat Peak for couple photography and snow fun. Evening stay in a cozy snow-view resort.'
      },
      {
        title: 'Gulmarg to Pahalgam (Valley of Shepherds & Saffron Valleys)',
        route: 'Gulmarg to Pahalgam (140 km / 3.5 hrs)',
        hotel: 'Pahalgam River View Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Pampore Saffron Farms, Apple Tree Valleys, Avantipura Sun Temple, Lidder River Walk',
        description: 'Scenic road trip to Pahalgam through blooming apple orchards and saffron fields. Stroll hand-in-hand along the turquoise waters of the Lidder river. Overnight stay amidst the whispering pine trees.'
      },
      {
        title: 'Pahalgam Romance & Scenic Valley Tour (Betaab, Aru & Baisaran)',
        route: 'Pahalgam Local Valleys Circuit',
        hotel: 'Pahalgam River View Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Betaab Valley (Bollywood Spot), Aru Valley Meadows, Chandanwari, Baisaran Valley (Mini Switzerland)',
        description: 'Explore the famous Betaab Valley surrounded by snow peaks and pine forests. Visit Aru Valley and take a horse ride up to Baisaran meadow for breathtaking couple portraits. Relaxing evening by the riverside.'
      },
      {
        title: 'Pahalgam to Srinagar & Mughal Gardens Romance',
        route: 'Pahalgam to Srinagar (90 km / 2.5 hrs)',
        hotel: 'Grand Palace Srinagar',
        meals: 'Breakfast & Special Dinner',
        activities: 'Nishat Bagh (Garden of Pleasure), Shalimar Bagh (Abode of Love), Chashme Shahi, Shankaracharya Hill',
        description: 'Drive back to Srinagar and visit the royal Mughal Gardens designed by Emperor Jahangir for Queen Nur Jahan. Visit Shankaracharya temple overlooking Dal Lake. Enjoy luxury stay and shopping in Srinagar.'
      },
      {
        title: 'Souvenir Shopping & Srinagar Airport Departure',
        route: 'Hotel to Srinagar Airport (15 km)',
        hotel: 'Check-out / Journey Home',
        meals: 'Breakfast',
        activities: 'Pashmina Shawl & Kashmiri Saffron Shopping, Dry Fruits, Airport Drop',
        description: 'Enjoy a leisurely breakfast. Shop for authentic Kashmiri handicrafts, dry fruits, and Pashmina shawls. Airport drop with cherished romantic honeymoon memories.'
      }
    ]
  },
  '7d_grand': {
    name: '7D/6N Grand Kashmir Explorer',
    destinations: ['Srinagar', 'Sonamarg', 'Gulmarg', 'Pahalgam', 'Doodhpathri', 'Dal Lake'],
    hotels: [
      { location: 'Srinagar', name: 'Deluxe Srinagar Hotel', category: '4 Star', nights: 2 },
      { location: 'Pahalgam', name: 'Pahalgam Valley Resort', category: '4 Star', nights: 2 },
      { location: 'Gulmarg', name: 'Gulmarg Snow Resort', category: '4 Star', nights: 1 },
      { location: 'Srinagar (Dal Lake)', name: 'Premium Houseboat', category: 'Houseboat', nights: 1 }
    ],
    days: [
      {
        title: 'Arrival in Srinagar & Dal Lake Sunset Shikara',
        route: 'Srinagar Airport to Hotel (15 km)',
        hotel: 'Deluxe Srinagar Hotel',
        meals: 'Dinner',
        activities: 'Dal Lake, Shikara Cruise, Boulevard Road, Nehru Park',
        description: 'Airport pickup and check-in. Evening Shikara ride on Dal Lake. Dinner and overnight stay in Srinagar.'
      },
      {
        title: 'Srinagar to Sonamarg Excursion (Meadow of Gold & Thajiwas Glacier)',
        route: 'Srinagar to Sonamarg (80 km / 2.5 hrs along Sindh River)',
        hotel: 'Deluxe Srinagar Hotel',
        meals: 'Breakfast & Dinner',
        activities: 'Sindh Valley, Thajiwas Glacier, Zero Point, Snow Sledging, Trout Fishing Streams',
        description: 'Full day trip to Sonamarg. Hike or take a pony to Thajiwas Glacier where snow lasts all year. Return to Srinagar for dinner.'
      },
      {
        title: 'Srinagar to Gulmarg (Gondola Cable Car & Apharwat Peak)',
        route: 'Srinagar to Gulmarg (51 km / 1.5 hrs)',
        hotel: 'Gulmarg Snow Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Gondola Ride Phase 1 & 2, Apharwat Peak (13,780 ft), Snow Sledging, Golf Course',
        description: 'Drive to Gulmarg and experience the highest cable car in Asia. Enjoy alpine scenery and stay overnight in Gulmarg.'
      },
      {
        title: 'Gulmarg to Pahalgam (Valley of Shepherds & Lidder River)',
        route: 'Gulmarg to Pahalgam (140 km / 3.5 hrs)',
        hotel: 'Pahalgam Valley Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Pampore Saffron Fields, Apple Orchards, Avantipura Ruins, Lidder River',
        description: 'Travel through the Kashmir valley to Pahalgam. Evening free to relax by the Lidder river.'
      },
      {
        title: 'Pahalgam Local Valleys (Betaab, Aru & Chandanwari)',
        route: 'Pahalgam Local Sightseeing Circuit',
        hotel: 'Pahalgam Valley Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Betaab Valley, Aru Valley, Chandanwari, Baisaran Meadow (Mini Switzerland)',
        description: 'Explore the stunning valleys of Pahalgam, crystal clear streams, and pine forest trails.'
      },
      {
        title: 'Pahalgam to Doodhpathri Excursion & Srinagar Houseboat',
        route: 'Pahalgam to Doodhpathri to Srinagar (110 km / 3 hrs)',
        hotel: 'Premium Houseboat (Dal Lake)',
        meals: 'Breakfast & Dinner',
        activities: 'Doodhpathri (Valley of Milk), Shaliganga River, Pine Meadows, Houseboat Stay',
        description: 'Visit the pristine, untouched meadow of Doodhpathri with gushing streams. Evening check into a traditional houseboat on Dal Lake.'
      },
      {
        title: 'Srinagar Mughal Gardens & Airport Departure',
        route: 'Houseboat to Mughal Gardens to Srinagar Airport (15 km)',
        hotel: 'Check-out / Journey Home',
        meals: 'Breakfast',
        activities: 'Nishat Bagh, Shalimar Bagh, Chashme Shahi, Shankaracharya Temple, Airport Drop',
        description: 'Sightseeing of world-famous Mughal Gardens and historic temples before transfer to Srinagar Airport.'
      }
    ]
  },
  '4d_snow': {
    name: '4D/3N Winter Snow & Shikara Quick Getaway',
    destinations: ['Srinagar', 'Gulmarg', 'Dal Lake'],
    hotels: [
      { location: 'Srinagar', name: 'Deluxe Srinagar Hotel', category: '4 Star', nights: 2 },
      { location: 'Srinagar (Dal Lake)', name: 'Heritage Houseboat', category: 'Houseboat', nights: 1 }
    ],
    days: [
      {
        title: 'Arrival in Srinagar & Dal Lake Shikara Ride',
        route: 'Srinagar Airport to Hotel (15 km)',
        hotel: 'Deluxe Srinagar Hotel',
        meals: 'Dinner',
        activities: 'Dal Lake, Sunset Shikara Ride, Boulevard Road',
        description: 'Welcome to winter wonderland Srinagar. Evening Shikara ride on Dal Lake.'
      },
      {
        title: 'Full Day Gulmarg Snow Experience & Gondola Ride',
        route: 'Srinagar to Gulmarg (51 km / 1.5 hrs)',
        hotel: 'Deluxe Srinagar Hotel',
        meals: 'Breakfast & Dinner',
        activities: 'Gulmarg Gondola Ride (Phase 1 & 2), Apharwat Snow Peak, Skiing & Snow Sledging',
        description: 'Full day skiing, snow activities, and Gondola ride up to Apharwat peak in Gulmarg.'
      },
      {
        title: 'Srinagar Heritage, Mughal Gardens & Houseboat Stay',
        route: 'Srinagar City Tour to Dal Lake Houseboat',
        hotel: 'Heritage Houseboat (Dal Lake)',
        meals: 'Breakfast & Dinner',
        activities: 'Nishat Bagh, Shalimar Bagh, Shankaracharya Temple, Houseboat Stay',
        description: 'Explore Srinagar Mughal gardens and check in to a traditional heated houseboat.'
      },
      {
        title: 'Souvenir Shopping & Airport Departure',
        route: 'Houseboat to Srinagar Airport',
        hotel: 'Check-out',
        meals: 'Breakfast',
        activities: 'Saffron & Dry Fruit Shopping, Airport Drop',
        description: 'Morning shopping and transfer to Srinagar airport for departure.'
      }
    ]
  },
  '6d_valleys': {
    name: '6D/5N Valleys & Meadows Explorer',
    destinations: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Doodhpathri'],
    hotels: [
      { location: 'Srinagar', name: 'Deluxe Srinagar Hotel', category: '4 Star', nights: 3 },
      { location: 'Pahalgam', name: 'Pahalgam Valley Resort', category: '4 Star', nights: 2 }
    ],
    days: [
      {
        title: 'Arrival in Srinagar & Dal Lake Shikara Ride',
        route: 'Airport to Hotel (15 km)',
        hotel: 'Deluxe Srinagar Hotel',
        meals: 'Dinner',
        activities: 'Dal Lake Shikara Ride, Boulevard Road',
        description: 'Arrival in Srinagar, check-in, and sunset Shikara ride.'
      },
      {
        title: 'Srinagar to Gulmarg Gondola Excursion',
        route: 'Srinagar to Gulmarg (51 km / 1.5 hrs)',
        hotel: 'Deluxe Srinagar Hotel',
        meals: 'Breakfast & Dinner',
        activities: 'Gondola Ride (Phase 1 & 2), Apharwat Peak, Snow Activities',
        description: 'Excursion to the alpine paradise of Gulmarg.'
      },
      {
        title: 'Srinagar to Pahalgam (Valley of Shepherds)',
        route: 'Srinagar to Pahalgam (90 km / 2.5 hrs)',
        hotel: 'Pahalgam Valley Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Saffron Fields, Apple Orchards, Lidder River',
        description: 'Scenic transfer to Pahalgam with stops at saffron fields and apple gardens.'
      },
      {
        title: 'Pahalgam Sightseeing (Betaab, Aru & Chandanwari Valleys)',
        route: 'Pahalgam Local Circuit',
        hotel: 'Pahalgam Valley Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Betaab Valley, Aru Valley, Chandanwari, Baisaran Meadow',
        description: 'Full day exploring the lush valleys and pine forests of Pahalgam.'
      },
      {
        title: 'Pahalgam to Doodhpathri Excursion & Return to Srinagar',
        route: 'Pahalgam to Doodhpathri to Srinagar (110 km / 3 hrs)',
        hotel: 'Deluxe Srinagar Hotel',
        meals: 'Breakfast & Dinner',
        activities: 'Doodhpathri Meadows, Shaliganga River, Pine Trails',
        description: 'Visit the emerald pastures and milky river of Doodhpathri.'
      },
      {
        title: 'Mughal Gardens Tour & Srinagar Departure',
        route: 'Hotel to Mughal Gardens & Airport (15 km)',
        hotel: 'Check-out',
        meals: 'Breakfast',
        activities: 'Nishat Bagh, Shalimar Bagh, Airport Drop',
        description: 'Sightseeing of Mughal gardens and airport drop.'
      }
    ]
  },
  '8d_complete': {
    name: '8D/7N Complete Kashmir Paradise Tour',
    destinations: ['Srinagar', 'Sonamarg', 'Gulmarg', 'Pahalgam', 'Doodhpathri', 'Yusmarg', 'Dal Lake'],
    hotels: [
      { location: 'Srinagar', name: 'Grand Palace Srinagar', category: '5 Star', nights: 2 },
      { location: 'Gulmarg', name: 'Gulmarg Alpine Resort', category: '4 Star', nights: 1 },
      { location: 'Pahalgam', name: 'Pahalgam River View Resort', category: '4 Star', nights: 2 },
      { location: 'Srinagar', name: 'Deluxe Srinagar Hotel', category: '4 Star', nights: 1 },
      { location: 'Srinagar (Dal Lake)', name: 'Royal Houseboat', category: 'Houseboat', nights: 1 }
    ],
    days: [
      {
        title: 'Arrival in Srinagar & Sunset Shikara Ride on Dal Lake',
        route: 'Srinagar Airport to Hotel (15 km)',
        hotel: 'Grand Palace Srinagar',
        meals: 'Dinner',
        activities: 'Dal Lake, Shikara Cruise, Boulevard Road',
        description: 'Grand welcome in Srinagar and sunset Shikara cruise.'
      },
      {
        title: 'Srinagar to Sonamarg Excursion (Meadow of Gold & Thajiwas Glacier)',
        route: 'Srinagar to Sonamarg (80 km / 2.5 hrs)',
        hotel: 'Grand Palace Srinagar',
        meals: 'Breakfast & Dinner',
        activities: 'Sindh River Valley, Thajiwas Glacier, Zero Point',
        description: 'Full day glacier and alpine mountain excursion in Sonamarg.'
      },
      {
        title: 'Srinagar to Gulmarg (Gondola Cable Car & Snow Stay)',
        route: 'Srinagar to Gulmarg (51 km / 1.5 hrs)',
        hotel: 'Gulmarg Alpine Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Gondola Ride Phase 1 & 2, Apharwat Peak, St. Mary Church',
        description: 'Drive to Gulmarg, Gondola ride to high peak, overnight in Gulmarg.'
      },
      {
        title: 'Gulmarg to Pahalgam (Valley of Shepherds & Lidder River)',
        route: 'Gulmarg to Pahalgam (140 km / 3.5 hrs)',
        hotel: 'Pahalgam River View Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Pampore Saffron Fields, Apple Orchards, Lidder River',
        description: 'Scenic road trip across Kashmir to the pine valleys of Pahalgam.'
      },
      {
        title: 'Pahalgam Scenic Tour (Betaab Valley, Aru Valley & Chandanwari)',
        route: 'Pahalgam Local Valleys Circuit',
        hotel: 'Pahalgam River View Resort',
        meals: 'Breakfast & Dinner',
        activities: 'Betaab Valley, Aru Valley, Chandanwari, Baisaran Pony Trek',
        description: 'Full day sightseeing of famous Bollywood locations and valleys.'
      },
      {
        title: 'Pahalgam to Doodhpathri Excursion to Srinagar',
        route: 'Pahalgam to Doodhpathri to Srinagar (110 km / 3 hrs)',
        hotel: 'Deluxe Srinagar Hotel',
        meals: 'Breakfast & Dinner',
        activities: 'Doodhpathri Meadows, Shaliganga River, Pine Woods',
        description: 'Visit the pristine meadow of Doodhpathri with foaming white streams.'
      },
      {
        title: 'Excursion to Yusmarg (Meadow of Jesus) & Dal Lake Houseboat Check-in',
        route: 'Srinagar to Yusmarg (47 km / 1.5 hrs) to Dal Lake',
        hotel: 'Royal Houseboat (Dal Lake)',
        meals: 'Breakfast & Dinner',
        activities: 'Yusmarg Meadows, Nilnag Lake, Doodh Ganga River, Houseboat Stay',
        description: 'Day trip to tranquil Yusmarg. Evening check-in to a luxury Dal Lake houseboat.'
      },
      {
        title: 'Mughal Gardens Tour & Srinagar Airport Departure',
        route: 'Houseboat to Mughal Gardens & Airport Drop',
        hotel: 'Check-out / Journey Home',
        meals: 'Breakfast',
        activities: 'Nishat Bagh, Shalimar Bagh, Shankaracharya Temple, Airport Drop',
        description: 'Visit historic Mughal Gardens and transfer to Srinagar Airport.'
      }
    ]
  }
};

// APPLY AN ITINERARY TEMPLATE
function applyItineraryTemplate(templateKey) {
  var tpl = ITINERARY_TEMPLATES[templateKey];
  if (!tpl) return;

  var startDate = pkgStartDate.value || '';
  var numDays = tpl.days.length;

  // If start date is set, automatically update End Date and Duration
  if (startDate) {
    var endDateStr = addDaysToDateStr(startDate, numDays - 1);
    pkgEndDate.value = endDateStr;
    pkgDuration.value = calcDuration(startDate, endDateStr);
  } else {
    pkgDuration.value = numDays + 'D / ' + (numDays - 1) + 'N';
  }

  // Clear existing itinerary
  itineraryContainer.innerHTML = '';
  dayCount = 0;

  // Add template days
  tpl.days.forEach(function (d, index) {
    var dayDate = startDate ? addDaysToDateStr(startDate, index) : '';
    addDay({
      date: dayDate,
      title: d.title,
      route: d.route,
      hotel: d.hotel,
      meals: d.meals,
      activities: d.activities,
      description: d.description
    });
  });

  // Check matching destination chips
  if (tpl.destinations && tpl.destinations.length > 0) {
    document.querySelectorAll('#destinationsGrid input[type="checkbox"]').forEach(function (cb) {
      if (tpl.destinations.includes(cb.value)) {
        cb.checked = true;
      }
    });
  }

  // Add hotel rows if currently empty
  if (hotelContainer.children.length === 0 && tpl.hotels && tpl.hotels.length > 0) {
    tpl.hotels.forEach(function (h) {
      addHotel(h);
    });
  }

  showToast('Applied ' + tpl.name + ' (' + numDays + ' Days)!', 'success');
  var bar = document.getElementById('itineraryTemplateBar');
  if (bar) bar.style.display = 'none';
}

// DYNAMIC AUTO-GENERATION BASED ON DATES & SELECTED DESTINATIONS
function autoGenerateItinerary() {
  var startDate = pkgStartDate.value;
  var endDate = pkgEndDate.value;
  var selectedDests = getDestinations();
  var pkgType = document.getElementById('pkgType').value;

  var totalDays = 5; // default
  if (startDate && endDate) {
    var diff = Math.round((new Date(endDate) - new Date(startDate)) / 86400000);
    if (diff > 0) {
      totalDays = diff + 1;
    }
  } else if (!startDate) {
    // If no start date, prompt today or set default
    var today = new Date().toISOString().split('T')[0];
    pkgStartDate.value = today;
    startDate = today;
    var defEnd = addDaysToDateStr(today, 4);
    pkgEndDate.value = defEnd;
    endDate = defEnd;
    pkgDuration.value = calcDuration(startDate, endDate);
    totalDays = 5;
  }

  // Select best matching template or synthesize days
  if (totalDays === 4) {
    applyItineraryTemplate('4d_snow');
    return;
  } else if (totalDays === 5) {
    applyItineraryTemplate('5d_classic');
    return;
  } else if (totalDays === 6) {
    if (pkgType === 'Honeymoon' || pkgType === 'Couple') {
      applyItineraryTemplate('6d_honeymoon');
    } else {
      applyItineraryTemplate('6d_valleys');
    }
    return;
  } else if (totalDays === 7) {
    applyItineraryTemplate('7d_grand');
    return;
  } else if (totalDays >= 8) {
    applyItineraryTemplate('8d_complete');
    return;
  }

  // For custom lengths (e.g. 2, 3, or >8 days)
  itineraryContainer.innerHTML = '';
  dayCount = 0;

  for (var i = 0; i < totalDays; i++) {
    var dayDate = addDaysToDateStr(startDate, i);
    if (i === 0) {
      addDay({
        date: dayDate,
        title: 'Arrival in Srinagar & Dal Lake Sunset Shikara Ride',
        route: 'Srinagar Airport (SXR) to Hotel / Houseboat (15 km / 35 mins)',
        hotel: 'Srinagar Deluxe Hotel / Houseboat',
        meals: 'Welcome Kehwa & Dinner',
        activities: 'Dal Lake, 1-Hour Sunset Shikara Ride, Boulevard Road, Floating Gardens',
        description: 'Warm welcome upon arrival at Srinagar Airport. Transfer to your accommodation. Evening enjoy a relaxing Shikara cruise on Dal Lake.'
      });
    } else if (i === totalDays - 1) {
      addDay({
        date: dayDate,
        title: 'Srinagar Mughal Gardens Tour & Airport Departure',
        route: 'Hotel to Mughal Gardens & Srinagar Airport (15 km)',
        hotel: 'Check-out / Journey Home',
        meals: 'Breakfast',
        activities: 'Nishat Bagh, Shalimar Bagh, Shankaracharya Temple, Saffron Shopping, Airport Drop',
        description: 'Visit the historic Mughal Gardens (Nishat, Shalimar) and Shankaracharya Temple. Transfer to Srinagar Airport with sweet memories of Kashmir.'
      });
    } else {
      // Intermediate days
      var dest = selectedDests[i % selectedDests.length] || 'Gulmarg';
      if (dest === 'Gulmarg') {
        addDay({
          date: dayDate,
          title: 'Srinagar to Gulmarg Excursion (Meadow of Flowers & Gondola Ride)',
          route: 'Srinagar to Gulmarg (51 km / 1.5 hrs)',
          hotel: 'Srinagar Hotel',
          meals: 'Breakfast & Dinner',
          activities: 'Gulmarg Gondola (Phase 1 & 2), Apharwat Peak, Snow Activities',
          description: 'Drive to Gulmarg and experience the world-famous Gondola ride up to Apharwat Peak. Enjoy snow sports and panoramic mountain views.'
        });
      } else if (dest === 'Pahalgam') {
        addDay({
          date: dayDate,
          title: 'Srinagar to Pahalgam (Valley of Shepherds & Lidder River)',
          route: 'Srinagar to Pahalgam (90 km / 2.5 hrs)',
          hotel: 'Pahalgam Valley Resort',
          meals: 'Breakfast & Dinner',
          activities: 'Saffron Fields Pampore, Apple Orchards, Betaab Valley, Aru Valley',
          description: 'Scenic journey to Pahalgam visiting saffron fields and apple gardens. Explore Betaab Valley and the gushing Lidder river.'
        });
      } else if (dest === 'Sonamarg') {
        addDay({
          date: dayDate,
          title: 'Srinagar to Sonamarg Excursion (Meadow of Gold & Thajiwas Glacier)',
          route: 'Srinagar to Sonamarg (80 km / 2.5 hrs)',
          hotel: 'Srinagar Hotel',
          meals: 'Breakfast & Dinner',
          activities: 'Thajiwas Glacier, Zero Point, Sindh River, Snow Sledging',
          description: 'Full day excursion to Sonamarg passing through dramatic gorges and visiting the snow-covered Thajiwas Glacier.'
        });
      } else if (dest === 'Doodhpathri') {
        addDay({
          date: dayDate,
          title: 'Excursion to Doodhpathri (The Valley of Milk & Pine Meadows)',
          route: 'Srinagar to Doodhpathri (42 km / 1.5 hrs)',
          hotel: 'Srinagar Hotel',
          meals: 'Breakfast & Dinner',
          activities: 'Doodhpathri Meadows, Shaliganga River, Pine Forest Walks',
          description: 'Drive to the pristine meadow of Doodhpathri known for its milky foaming rivers and emerald pastures.'
        });
      } else {
        addDay({
          date: dayDate,
          title: 'Sightseeing in ' + dest + ' & Kashmir Scenic Valley Tour',
          route: 'Srinagar to ' + dest,
          hotel: 'Deluxe Hotel',
          meals: 'Breakfast & Dinner',
          activities: dest + ' Sightseeing, Nature Walks, Local Photography',
          description: 'Full day tour exploring the natural beauty, scenic landscapes, and local culture of ' + dest + '.'
        });
      }
    }
  }

  showToast('Auto-generated ' + totalDays + '-Day Itinerary!', 'success');
}

// EVENT LISTENERS FOR ITINERARY CONTROLS
document.getElementById('btnAddDay').addEventListener('click', function () { addDay(); });

var btnAutoItinerary = document.getElementById('btnAutoItinerary');
if (btnAutoItinerary) {
  btnAutoItinerary.addEventListener('click', autoGenerateItinerary);
}

var btnToggleTemplates = document.getElementById('btnToggleTemplates');
if (btnToggleTemplates) {
  btnToggleTemplates.addEventListener('click', function () {
    var bar = document.getElementById('itineraryTemplateBar');
    if (bar) {
      bar.style.display = (bar.style.display === 'none' || !bar.style.display) ? 'block' : 'none';
    }
  });
}

var btnCloseTemplates = document.getElementById('btnCloseTemplates');
if (btnCloseTemplates) {
  btnCloseTemplates.addEventListener('click', function () {
    var bar = document.getElementById('itineraryTemplateBar');
    if (bar) bar.style.display = 'none';
  });
}

document.querySelectorAll('.template-chip').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var tplKey = this.getAttribute('data-tpl');
    applyItineraryTemplate(tplKey);
  });
});

// ============================================================
// HOTEL BUILDER
// ============================================================

function addHotel(data) {
  data = data || {};
  var cats = ['3 Star', '4 Star', '5 Star', 'Houseboat', 'Resort', 'Budget'];
  var catOpts = cats.map(function (c) { return '<option' + (data.category === c ? ' selected' : '') + '>' + c + '</option>'; }).join('');
  var div = document.createElement('div');
  div.className = 'hotel-entry';
  div.innerHTML =
    '<div class="form-group"><label>Location</label><input type="text" class="hotel-location" placeholder="e.g. Srinagar" value="' + (data.location || '') + '"></div>' +
    '<div class="form-group"><label>Hotel Name</label><input type="text" class="hotel-name" placeholder="Hotel name" value="' + (data.name || '') + '"></div>' +
    '<div class="form-group"><label>Category</label><select class="hotel-cat">' + catOpts + '</select></div>' +
    '<div class="form-group"><label>Nights</label><input type="number" class="hotel-nights" min="1" value="' + (data.nights || 1) + '"></div>' +
    '<div><label>&nbsp;</label><button type="button" class="btn-remove-hotel" onclick="this.closest(\'.hotel-entry\').remove()" title="Remove">X</button></div>';
  hotelContainer.appendChild(div);
}

function getHotelData() {
  return Array.from(hotelContainer.querySelectorAll('.hotel-entry')).map(function (h) {
    return {
      location: h.querySelector('.hotel-location').value,
      name: h.querySelector('.hotel-name').value,
      category: h.querySelector('.hotel-cat').value,
      nights: h.querySelector('.hotel-nights').value
    };
  });
}

document.getElementById('btnAddHotel').addEventListener('click', function () { addHotel(); });

// ============================================================
// INCLUSIONS / EXCLUSIONS
// ============================================================

function getChecked(listId) {
  return Array.from(document.getElementById(listId).querySelectorAll('input[type="checkbox"]:checked')).map(function (cb) { return cb.value; });
}

function addCustomItem(inputId, listId) {
  var input = document.getElementById(inputId);
  var val = input.value.trim();
  if (!val) return;
  var label = document.createElement('label');
  label.innerHTML = '<input type="checkbox" value="' + val + '" checked /> ' + val;
  document.getElementById(listId).appendChild(label);
  input.value = '';
}

document.getElementById('btnAddInclusion').addEventListener('click', function () { addCustomItem('customInclusion', 'inclusionsList'); });
document.getElementById('btnAddExclusion').addEventListener('click', function () { addCustomItem('customExclusion', 'exclusionsList'); });
document.getElementById('customInclusion').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addCustomItem('customInclusion', 'inclusionsList'); } });
document.getElementById('customExclusion').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); addCustomItem('customExclusion', 'exclusionsList'); } });

document.getElementById('btnApplyIncExcTemplate').addEventListener('click', function () {
  var key = document.getElementById('incExcTemplate').value;
  applyChecklistTemplate(key);
});

document.getElementById('btnApplyCostPreset').addEventListener('click', function () {
  var presetId = document.getElementById('costPresetSelect').value;
  if (!presetId) {
    showToast('Please choose a cost preset.', 'error');
    return;
  }
  var preset = getCostPresets().find(function (p) { return p.id === presetId; });
  applyCostPreset(preset);
  showToast('Cost preset applied.', 'success');
});

document.getElementById('btnSuggestCostPreset').addEventListener('click', function () {
  var preset = suggestCostPreset();
  if (!preset) {
    showToast('No preset available to suggest.', 'error');
    return;
  }
  applyCostPreset(preset);
  showToast('Suggested preset: ' + preset.name, 'success');
});

document.getElementById('btnSaveCostPreset').addEventListener('click', function () {
  var name = document.getElementById('newCostPresetName').value.trim();
  if (!name) {
    showToast('Enter preset name first.', 'error');
    return;
  }
  var season = document.getElementById('pkgSeason').value;
  var preset = {
    id: 'custom_' + Date.now(),
    name: name,
    season: season,
    destinations: getDestinations(),
    hotel: parseFloat(document.getElementById('costHotel').value) || 0,
    transport: parseFloat(document.getElementById('costTransport').value) || 0,
    activities: parseFloat(document.getElementById('costActivities').value) || 0,
    other: parseFloat(document.getElementById('costOther').value) || 0,
    markup: parseFloat(document.getElementById('costMarkup').value) || 0,
    note: document.getElementById('pkgPricingNote').value.trim(),
    updatedAt: new Date().toISOString()
  };
  var presets = getCostPresets().concat([preset]);
  saveCostPresets(presets);
  activeCostPresetId = preset.id;
  renderCostPresetOptions(preset.id);
  document.getElementById('newCostPresetName').value = '';
  showToast('Cost preset saved.', 'success');
});

// ============================================================
// DESTINATIONS
// ============================================================

function getDestinations() {
  var checked = Array.from(document.getElementById('destinationsGrid').querySelectorAll('input:checked')).map(function (cb) { return cb.value; });
  var other = document.getElementById('pkgOtherDest').value.trim();
  if (other) checked = checked.concat(other.split(',').map(function (s) { return s.trim(); }).filter(Boolean));
  return checked;
}

/// ============================================================
// THEMES & BACKGROUNDS
// ============================================================

function getSelectedTheme() {
  var checked = document.querySelector('input[name="pkgTheme"]:checked');
  return checked ? checked.value : 'classic';
}

function setSelectedTheme(theme) {
  theme = theme || 'classic';
  var radio = document.querySelector('input[name="pkgTheme"][value="' + theme + '"]');
  if (radio) radio.checked = true;
  document.querySelectorAll('.theme-card').forEach(function (card) {
    if (card.getAttribute('data-theme') === theme) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
  var customGroup = document.getElementById('customBgGroup');
  if (customGroup) {
    customGroup.style.display = theme === 'custom' ? 'block' : 'none';
  }
}

document.querySelectorAll('.theme-card').forEach(function (card) {
  card.addEventListener('click', function () {
    var theme = this.getAttribute('data-theme');
    setSelectedTheme(theme);
  });
});

function getSuggestedThemeForType(type) {
  switch (type) {
    case 'Honeymoon':
    case 'Couple':
      return 'honeymoon';
    case 'Luxury':
    case 'Premium':
      return 'luxury';
    case 'Adventure':
      return 'adventure';
    case 'Family':
    case 'Group':
      return 'pine';
    case 'Budget':
      return 'sunset';
    default:
      return 'classic';
  }
}

var pkgTypeSelect = document.getElementById('pkgType');
if (pkgTypeSelect) {
  pkgTypeSelect.addEventListener('change', function () {
    var suggested = getSuggestedThemeForType(this.value);
    setSelectedTheme(suggested);
  });
}

// ============================================================
// SHOW / HIDE FORM
// ============================================================

function showForm() {
  formSection.style.display = '';
  listSection.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideForm() {
  formSection.style.display = 'none';
  listSection.style.display = '';
}

function resetForm() {
  packageForm.reset();
  itineraryContainer.innerHTML = '';
  hotelContainer.innerHTML = '';
  dayCount = 0;
  editingId = null;
  activeIncExcTemplate = '';
  activeCostPresetId = '';
  if (itineraryHint) itineraryHint.style.display = '';
  formTitle.textContent = 'Create New Package';
  pkgId.value = generateId();
  setSelectedTheme('classic');
  var customBgInput = document.getElementById('pkgCustomBg');
  if (customBgInput) customBgInput.value = '';
  if (document.getElementById('incExcTemplate')) document.getElementById('incExcTemplate').value = '';
  if (document.getElementById('costPresetSelect')) document.getElementById('costPresetSelect').value = '';
  if (document.getElementById('pkgIncludeSignature')) document.getElementById('pkgIncludeSignature').value = 'yes';
  if (document.getElementById('pkgIncludeSeal')) document.getElementById('pkgIncludeSeal').value = 'yes';
  setDefaultValidityDate();
  renderCostPresetOptions('');
  recalcPrice();
  document.querySelectorAll('#destinationsGrid input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
  document.querySelectorAll('#inclusionsList input[type="checkbox"]').forEach(function (cb) { cb.checked = DEFAULT_INCLUSIONS.includes(cb.value); });
  document.querySelectorAll('#exclusionsList input[type="checkbox"]').forEach(function (cb) { cb.checked = DEFAULT_EXCLUSIONS.includes(cb.value); });
}

btnNewPackage.addEventListener('click', function () { resetForm(); showForm(); });
document.getElementById('btnCancelForm').addEventListener('click', hideForm);
document.getElementById('btnCancelForm2').addEventListener('click', hideForm);
var btnToggleSimpleMode = document.getElementById('btnToggleSimpleMode');
if (btnToggleSimpleMode) {
  btnToggleSimpleMode.addEventListener('click', function () {
    simpleModeEnabled = !simpleModeEnabled;
    applySimpleModeUI();
  });
}

// ============================================================
// FORM SUBMIT
// ============================================================

packageForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('pkgName').value.trim();
  var type = document.getElementById('pkgType').value;
  var startDate = pkgStartDate.value;
  var endDate = pkgEndDate.value;
  var custName = document.getElementById('custName').value.trim();
  var custWa = document.getElementById('custWhatsApp').value.trim();
  var adults = parseInt(pkgAdults.value);

  if (!name) { showToast('Please enter a Package Name.', 'error'); return; }
  if (!type) { showToast('Please select a Package Type.', 'error'); return; }
  if (!startDate) { showToast('Please enter Start Date.', 'error'); return; }
  if (!endDate) { showToast('Please enter End Date.', 'error'); return; }
  if (new Date(endDate) < new Date(startDate)) { showToast('End date cannot be before start date.', 'error'); return; }
  if (!custName) { showToast('Please enter Customer Name.', 'error'); return; }
  if (!custWa) { showToast('Please enter WhatsApp number.', 'error'); return; }
  if (!adults || adults < 1) { showToast('At least 1 adult required.', 'error'); return; }

  var hotel = parseFloat(document.getElementById('costHotel').value) || 0;
  var transport = parseFloat(document.getElementById('costTransport').value) || 0;
  var activities = parseFloat(document.getElementById('costActivities').value) || 0;
  var other = parseFloat(document.getElementById('costOther').value) || 0;
  var markup = parseFloat(document.getElementById('costMarkup').value) || 0;
  var discount = parseFloat(document.getElementById('costDiscount').value) || 0;
  var totalCost = hotel + transport + activities + other;
  var finalPrice = totalCost + markup - discount;
  var children = parseInt(pkgChildren.value) || 0;
  var totalPeople = adults + children || 1;

  var customBgVal = document.getElementById('pkgCustomBg') ? document.getElementById('pkgCustomBg').value.trim() : '';
  var now = new Date().toISOString();
  var allPackages = getAllPackages();
  var existing = editingId ? allPackages.find(function (p) { return p.id === editingId; }) : null;

  if (!activeIncExcTemplate && document.getElementById('incExcTemplate')) {
    activeIncExcTemplate = document.getElementById('incExcTemplate').value || '';
  }
  if (!activeCostPresetId && document.getElementById('costPresetSelect')) {
    activeCostPresetId = document.getElementById('costPresetSelect').value || '';
  }

  var quoteGroupId = existing ? existing.quoteGroupId : pkgId.value;
  var quoteVersion = existing ? (parseInt(existing.quoteVersion, 10) || 1) : 1;
  var versionSourceId = existing ? (existing.versionSourceId || '') : '';

  var pkg = {
    id: editingId || pkgId.value,
    name: name,
    type: type,
    season: document.getElementById('pkgSeason').value,
    theme: getSelectedTheme(),
    customBg: customBgVal,
    status: document.getElementById('pkgStatus').value,
    startDate: startDate,
    endDate: endDate,
    duration: calcDuration(startDate, endDate),
    adults: adults,
    children: children,
    roomType: document.getElementById('pkgRoomType').value,
    vehicleType: document.getElementById('pkgVehicleType').value,
    mealPlan: document.getElementById('pkgMeal').value,
    customer: {
      name: custName,
      whatsapp: custWa,
      email: document.getElementById('custEmail').value.trim(),
      country: document.getElementById('custCountry').value.trim(),
      requests: document.getElementById('custRequests').value.trim()
    },
    destinations: getDestinations(),
    itinerary: getItineraryData(),
    hotels: getHotelData(),
    inclusions: getChecked('inclusionsList'),
    exclusions: getChecked('exclusionsList'),
    appliedTemplates: {
      incExc: activeIncExcTemplate,
      costPreset: activeCostPresetId
    },
    pricing: {
      hotel: hotel, transport: transport, activities: activities, other: other,
      markup: markup, discount: discount, totalCost: totalCost, finalPrice: finalPrice,
      perPerson: Math.round(finalPrice / totalPeople),
      note: document.getElementById('pkgPricingNote').value.trim(),
      presetId: activeCostPresetId
    },
    policies: {
      validityDate: document.getElementById('pkgValidityDate').value,
      paymentSchedule: document.getElementById('pkgPaymentSchedule').value.trim(),
      cancellationPolicy: document.getElementById('pkgCancellationPolicy').value.trim(),
      terms: document.getElementById('pkgTerms').value.trim(),
      includeSignature: document.getElementById('pkgIncludeSignature').value === 'yes',
      includeSeal: document.getElementById('pkgIncludeSeal').value === 'yes'
    },
    quoteGroupId: quoteGroupId,
    quoteVersion: quoteVersion,
    versionSourceId: versionSourceId,
    versionChangeSummary: existing ? (existing.versionChangeSummary || '') : '',
    internalNotes: document.getElementById('pkgInternalNotes').value.trim(),
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now
  };

  if (pkg.versionSourceId) {
    var baseVersion = allPackages.find(function (p) { return p.id === pkg.versionSourceId; });
    pkg.versionChangeSummary = buildVersionDiffSummary(baseVersion, pkg);
  }

  savePackage(pkg);
  updateHotelUsageFromPackage(pkg);
  showToast(editingId ? 'Package updated!' : 'Package saved!', 'success');
  hideForm();
  renderPackageList();
});

// ============================================================
// RENDER PACKAGE LIST
// ============================================================

function renderPackageList() {
  var all = getAllPackages();
  var search = searchInput.value.toLowerCase();
  var statusFilter = filterStatus.value;

  var filtered = all.filter(function (pkg) {
    var matchSearch = !search ||
      pkg.name.toLowerCase().includes(search) ||
      pkg.customer.name.toLowerCase().includes(search) ||
      pkg.id.toLowerCase().includes(search);
    var matchStatus = !statusFilter || pkg.status === statusFilter;
    return matchSearch && matchStatus;
  });

  filtered.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  packageCount.textContent = filtered.length;
  packageGrid.innerHTML = '';

  if (filtered.length === 0) { emptyState.style.display = 'block'; return; }
  emptyState.style.display = 'none';

  filtered.forEach(function (pkg) {
    var card = document.createElement('div');
    card.className = 'pkg-card';
    var statusClass = 'status-' + pkg.status.toLowerCase().replace(/ /g, '');
    var destTags = (pkg.destinations || []).slice(0, 4).map(function (d) { return '<span class="dest-tag">' + d + '</span>'; }).join('');
    if ((pkg.destinations || []).length > 4) destTags += '<span class="dest-tag">+' + ((pkg.destinations || []).length - 4) + ' more</span>';

    var themeLabel = (pkg.theme || 'classic').toUpperCase();
    var versionLabel = 'V' + (pkg.quoteVersion || 1);
    var versionMeta = pkg.versionChangeSummary ? '<span class="version-change">' + pkg.versionChangeSummary + '</span>' : '';

    card.innerHTML =
      '<div class="pkg-card-header">' +
      '<div class="pkg-card-id">' + pkg.id + '</div>' +
      '<div class="pkg-card-name">' + pkg.name + '</div>' +
      '<div class="pkg-card-type">' + pkg.type + ' Package &bull; <small style="opacity:0.8">' + themeLabel + ' THEME</small></div>' +
      '<div class="pkg-version-row"><span class="version-badge">Quote ' + versionLabel + '</span>' + versionMeta + '</div>' +
      '<span class="status-badge ' + statusClass + '">' + pkg.status + '</span>' +
      '</div>' +
      '<div class="pkg-card-body">' +
      '<div class="pkg-meta">' +
      '<div class="pkg-meta-item"><span class="pkg-meta-label">Customer</span><span class="pkg-meta-value">' + pkg.customer.name + '</span></div>' +
      '<div class="pkg-meta-item"><span class="pkg-meta-label">Duration</span><span class="pkg-meta-value">' + (pkg.duration || 'N/A') + '</span></div>' +
      '<div class="pkg-meta-item"><span class="pkg-meta-label">Travel Date</span><span class="pkg-meta-value">' + formatDate(pkg.startDate) + '</span></div>' +
      '<div class="pkg-meta-item"><span class="pkg-meta-label">Travellers</span><span class="pkg-meta-value">' + pkg.adults + ' Adult' + (pkg.adults > 1 ? 's' : '') + (pkg.children > 0 ? ' + ' + pkg.children + ' Child' : '') + '</span></div>' +
      '</div>' +
      (destTags ? '<div class="pkg-destinations">' + destTags + '</div>' : '') +
      '<div class="pkg-price"><span class="pkg-price-label">Package Price</span><span class="pkg-price-value">' + formatCurrency(pkg.pricing.finalPrice) + '</span><span class="pkg-price-pp">pp: ' + formatCurrency(pkg.pricing.perPerson) + '</span></div>' +
      '</div>' +
      '<div class="pkg-card-actions">' +
      '<button class="btn btn-sm btn-primary" onclick="viewQuotation(\'' + pkg.id + '\')">View</button>' +
      '<button class="btn btn-sm btn-outline" onclick="editPackage(\'' + pkg.id + '\')">Edit</button>' +
      '<button class="btn btn-sm btn-outline advanced-only" onclick="createPackageVersion(\'' + pkg.id + '\')">New Version</button>' +
      '<button class="btn btn-sm btn-outline advanced-only" onclick="duplicatePackage(\'' + pkg.id + '\')">Duplicate</button>' +
      '<button class="btn btn-sm" style="background:#fef2f2;color:#e74c3c;border:1.5px solid #fecaca;border-radius:6px;" onclick="confirmDelete(\'' + pkg.id + '\')">Delete</button>' +
      '</div>';
    packageGrid.appendChild(card);
  });
}

searchInput.addEventListener('input', renderPackageList);
filterStatus.addEventListener('change', renderPackageList);

// ============================================================
// EDIT PACKAGE
// ============================================================

function editPackage(id) {
  var pkg = getAllPackages().find(function (p) { return p.id === id; });
  if (!pkg) return;
  resetForm();
  editingId = id;
  formTitle.textContent = 'Edit Package: ' + pkg.name;
  pkgId.value = pkg.id;
  document.getElementById('pkgName').value = pkg.name;
  document.getElementById('pkgType').value = pkg.type;
  if (document.getElementById('pkgSeason')) document.getElementById('pkgSeason').value = pkg.season || 'Summer';
  setSelectedTheme(pkg.theme || getSuggestedThemeForType(pkg.type));
  if (document.getElementById('pkgCustomBg')) {
    document.getElementById('pkgCustomBg').value = pkg.customBg || '';
  }
  document.getElementById('pkgStatus').value = pkg.status;
  pkgStartDate.value = pkg.startDate;
  pkgEndDate.value = pkg.endDate;
  pkgDuration.value = pkg.duration;
  pkgAdults.value = pkg.adults;
  pkgChildren.value = pkg.children;
  document.getElementById('pkgRoomType').value = pkg.roomType || 'Double';
  document.getElementById('pkgVehicleType').value = pkg.vehicleType || 'Sedan';
  document.getElementById('pkgMeal').value = pkg.mealPlan;
  document.getElementById('custName').value = pkg.customer.name;
  document.getElementById('custWhatsApp').value = pkg.customer.whatsapp;
  document.getElementById('custEmail').value = pkg.customer.email;
  document.getElementById('custCountry').value = pkg.customer.country;
  document.getElementById('custRequests').value = pkg.customer.requests;

  var standardDests = Array.from(document.querySelectorAll('#destinationsGrid input[type="checkbox"]')).map(function (cb) { return cb.value; });
  document.querySelectorAll('#destinationsGrid input[type="checkbox"]').forEach(function (cb) { cb.checked = (pkg.destinations || []).includes(cb.value); });
  var otherDests = (pkg.destinations || []).filter(function (d) { return !standardDests.includes(d); });
  document.getElementById('pkgOtherDest').value = otherDests.join(', ');

  (pkg.itinerary || []).forEach(function (d) { addDay(d); });
  (pkg.hotels || []).forEach(function (h) { addHotel(h); });

  document.querySelectorAll('#inclusionsList input[type="checkbox"]').forEach(function (cb) { cb.checked = (pkg.inclusions || []).includes(cb.value); });
  document.querySelectorAll('#exclusionsList input[type="checkbox"]').forEach(function (cb) { cb.checked = (pkg.exclusions || []).includes(cb.value); });

  activeIncExcTemplate = (pkg.appliedTemplates || {}).incExc || '';
  if (document.getElementById('incExcTemplate')) {
    document.getElementById('incExcTemplate').value = activeIncExcTemplate;
  }

  document.getElementById('costHotel').value = pkg.pricing.hotel;
  document.getElementById('costTransport').value = pkg.pricing.transport;
  document.getElementById('costActivities').value = pkg.pricing.activities;
  document.getElementById('costOther').value = pkg.pricing.other;
  document.getElementById('costMarkup').value = pkg.pricing.markup;
  document.getElementById('costDiscount').value = pkg.pricing.discount;
  document.getElementById('pkgPricingNote').value = pkg.pricing.note || '';
  activeCostPresetId = (pkg.pricing.presetId || (pkg.appliedTemplates || {}).costPreset || '');
  renderCostPresetOptions(activeCostPresetId);
  if (document.getElementById('pkgValidityDate')) document.getElementById('pkgValidityDate').value = (pkg.policies || {}).validityDate || '';
  if (document.getElementById('pkgPaymentSchedule')) document.getElementById('pkgPaymentSchedule').value = (pkg.policies || {}).paymentSchedule || '';
  if (document.getElementById('pkgCancellationPolicy')) document.getElementById('pkgCancellationPolicy').value = (pkg.policies || {}).cancellationPolicy || '';
  if (document.getElementById('pkgTerms')) document.getElementById('pkgTerms').value = (pkg.policies || {}).terms || '';
  if (document.getElementById('pkgIncludeSignature')) document.getElementById('pkgIncludeSignature').value = (pkg.policies || {}).includeSignature === false ? 'no' : 'yes';
  if (document.getElementById('pkgIncludeSeal')) document.getElementById('pkgIncludeSeal').value = (pkg.policies || {}).includeSeal === false ? 'no' : 'yes';
  document.getElementById('pkgInternalNotes').value = pkg.internalNotes || '';
  recalcPrice();
  showForm();
}

function createPackageVersion(id) {
  var base = getAllPackages().find(function (p) { return p.id === id; });
  if (!base) return;

  var nextVersion = getGroupHighestVersion(base.quoteGroupId || base.id) + 1;
  var newId = generateId();
  var now = new Date().toISOString();
  var versionedName = (base.name || '').replace(/\s*\(V\d+\)$/i, '') + ' (V' + nextVersion + ')';

  var copy = JSON.parse(JSON.stringify(base));
  copy.id = newId;
  copy.name = versionedName;
  copy.status = 'Draft';
  copy.quoteGroupId = base.quoteGroupId || base.id;
  copy.quoteVersion = nextVersion;
  copy.versionSourceId = base.id;
  copy.versionChangeSummary = 'Version created from ' + base.id;
  copy.createdAt = now;
  copy.updatedAt = now;

  savePackage(copy);
  showToast('New quote version created: V' + nextVersion, 'success');
  renderPackageList();
  editPackage(copy.id);
}

function duplicatePackage(id) {
  var pkg = getAllPackages().find(function (p) { return p.id === id; });
  if (!pkg) return;
  var copy = JSON.parse(JSON.stringify(pkg));
  copy.id = generateId();
  copy.name = pkg.name + ' (Copy)';
  copy.status = 'Draft';
  copy.quoteGroupId = copy.id;
  copy.quoteVersion = 1;
  copy.versionSourceId = '';
  copy.versionChangeSummary = '';
  copy.createdAt = new Date().toISOString();
  copy.updatedAt = new Date().toISOString();
  savePackage(copy);
  showToast('Package duplicated!', 'success');
  renderPackageList();
}

function confirmDelete(id) {
  pendingDeleteId = id;
  document.getElementById('deleteModal').style.display = 'flex';
}

document.getElementById('btnConfirmDelete').addEventListener('click', function () {
  if (pendingDeleteId) {
    deletePackage(pendingDeleteId);
    pendingDeleteId = null;
    document.getElementById('deleteModal').style.display = 'none';
    showToast('Package deleted.', 'error');
    renderPackageList();
  }
});

document.getElementById('btnCancelDelete').addEventListener('click', function () {
  pendingDeleteId = null;
  document.getElementById('deleteModal').style.display = 'none';
});

// ============================================================
// QUOTATION MODAL
// ============================================================

function viewQuotation(id) {
  var pkg = getAllPackages().find(function (p) { return p.id === id; });
  if (!pkg) return;
  viewingPackage = pkg;
  var activeTheme = pkg.theme || 'classic';
  var themeSelect = document.getElementById('modalThemeSelect');
  if (themeSelect) {
    themeSelect.value = activeTheme;
  }
  document.getElementById('quotationContent').innerHTML = buildQuotationHTML(pkg, activeTheme);
  document.getElementById('quotationModal').style.display = 'flex';
}

var modalThemeSelect = document.getElementById('modalThemeSelect');
if (modalThemeSelect) {
  modalThemeSelect.addEventListener('change', function () {
    if (!viewingPackage) return;
    var newTheme = this.value;
    viewingPackage.theme = newTheme;
    document.getElementById('quotationContent').innerHTML = buildQuotationHTML(viewingPackage, newTheme);
  });
}

function buildQuotationHTML(pkg, themeOverride) {
  var theme = themeOverride || pkg.theme || 'classic';
  var logoImg = '<img src="assets/images/logo/logo.png" alt="NorthWind Kashmir" style="width:200px;height:auto;display:block;margin:0 auto 10px;object-fit:contain;">';
  var destStr = (pkg.destinations || []).join(' &bull; ');
  var quotDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  var policies = pkg.policies || {};
  var policyHTML =
    '<div class="quot-policy-grid">' +
    (policies.validityDate ? '<div class="quot-policy-item"><div class="quot-policy-title">Validity</div><div class="quot-policy-value">Valid till ' + formatDate(policies.validityDate) + '</div></div>' : '') +
    (policies.paymentSchedule ? '<div class="quot-policy-item"><div class="quot-policy-title">Payment Schedule</div><div class="quot-policy-value">' + policies.paymentSchedule + '</div></div>' : '') +
    (policies.cancellationPolicy ? '<div class="quot-policy-item"><div class="quot-policy-title">Cancellation Policy</div><div class="quot-policy-value">' + policies.cancellationPolicy + '</div></div>' : '') +
    (policies.terms ? '<div class="quot-policy-item"><div class="quot-policy-title">Terms &amp; Conditions</div><div class="quot-policy-value">' + policies.terms + '</div></div>' : '') +
    '</div>';

  var signatureHTML = '';
  if (policies.includeSignature || policies.includeSeal) {
    signatureHTML = '<div class="quot-signature-grid">' +
      (policies.includeSignature ? '<div class="quot-sign-box"><div class="quot-sign-title">Authorized Signature</div><div class="quot-sign-line">North Wind Kashmir</div></div>' : '') +
      (policies.includeSeal ? '<div class="quot-sign-box"><div class="quot-sign-title">Company Seal</div><div class="quot-sign-line">Official Stamp Area</div></div>' : '') +
      '</div>';
  }

  var itineraryHTML = '';
  if (pkg.itinerary && pkg.itinerary.length > 0) {
    itineraryHTML = pkg.itinerary.map(function (d) {
      return '<div class="quot-day">' +
        '<div class="quot-day-title">Day ' + d.day + (d.date ? ' &ndash; ' + formatDate(d.date) : '') + (d.title ? ': ' + d.title : '') + '</div>' +
        '<div class="quot-day-details">' +
        (d.route ? '<strong>Route:</strong> ' + d.route + '<br>' : '') +
        (d.activities ? '<strong>Places:</strong> ' + d.activities + '<br>' : '') +
        (d.hotel ? '<strong>Stay:</strong> ' + d.hotel + '<br>' : '') +
        (d.meals ? '<strong>Meals:</strong> ' + d.meals + '<br>' : '') +
        (d.description ? d.description : '') +
        '</div></div>';
    }).join('');
  } else {
    itineraryHTML = '<p style="color:#8a9ab5;font-size:0.85rem;font-style:italic">No itinerary added.</p>';
  }

  var hotelsHTML = '';
  if (pkg.hotels && pkg.hotels.length > 0) {
    hotelsHTML = pkg.hotels.map(function (h) {
      return '<div class="quot-hotel"><span>&#127968;</span><div>' +
        '<div class="quot-hotel-name">' + (h.name || 'Hotel TBD') + (h.category ? ' (' + h.category + ')' : '') + '</div>' +
        '<div class="quot-hotel-detail">' + (h.location || '') + (h.nights ? ' &ndash; ' + h.nights + ' night(s)' : '') + '</div>' +
        '</div></div>';
    }).join('');
  } else {
    hotelsHTML = '<p style="color:#8a9ab5;font-size:0.85rem;font-style:italic">Hotel details TBC.</p>';
  }

  var inclHTML = (pkg.inclusions || []).map(function (i) { return '<li>' + i + '</li>'; }).join('');
  var exclHTML = (pkg.exclusions || []).map(function (i) { return '<li>' + i + '</li>'; }).join('');

  var customBgStyle = '';
  if (theme === 'custom' && pkg.customBg) {
    customBgStyle = 'style="background-image:linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(\'' + pkg.customBg + '\');background-size:cover;background-position:center;"';
  }

  return '<div class="quotation-wrapper theme-' + theme + '" ' + customBgStyle + '>' +
    '<div class="quot-watermark"></div>' +
    '<div class="quot-content-layer">' +

    '<div class="quot-brand">' +
    logoImg +
    '<div class="quot-number">Ref: ' + pkg.id + ' &nbsp;|&nbsp; Date: ' + quotDate + '</div>' +
    '</div>' +

    '<div class="quot-section"><div class="quot-section-title">Package Overview</div>' +
    '<div class="quot-info-grid">' +
    '<div class="quot-info-item"><span class="quot-info-label">Package</span><span class="quot-info-value">' + pkg.name + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Type</span><span class="quot-info-value">' + pkg.type + ' Package</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Customer</span><span class="quot-info-value">' + pkg.customer.name + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">WhatsApp</span><span class="quot-info-value">' + pkg.customer.whatsapp + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Travel Dates</span><span class="quot-info-value">' + formatDate(pkg.startDate) + ' to ' + formatDate(pkg.endDate) + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Duration</span><span class="quot-info-value">' + pkg.duration + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Travellers</span><span class="quot-info-value">' + pkg.adults + ' Adult(s)' + (pkg.children > 0 ? ' + ' + pkg.children + ' Child' : '') + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Room Type</span><span class="quot-info-value">' + (pkg.roomType || '-') + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Vehicle Type</span><span class="quot-info-value">' + (pkg.vehicleType || '-') + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Meal Plan</span><span class="quot-info-value">' + pkg.mealPlan + '</span></div>' +
    (destStr ? '<div class="quot-info-item" style="grid-column:1/-1"><span class="quot-info-label">Destinations</span><span class="quot-info-value">' + destStr + '</span></div>' : '') +
    '</div></div>' +

    '<div class="quot-section"><div class="quot-section-title">Day-by-Day Itinerary</div>' + itineraryHTML + '</div>' +
    '<div class="quot-section"><div class="quot-section-title">Hotels / Accommodation</div>' + hotelsHTML + '</div>' +
    '<div class="quot-section"><div class="quot-section-title">Inclusions</div><ul class="quot-list">' + (inclHTML || '<li style="color:#8a9ab5">None specified.</li>') + '</ul></div>' +
    '<div class="quot-section"><div class="quot-section-title">Exclusions</div><ul class="quot-list exclusions">' + (exclHTML || '<li style="color:#8a9ab5">None specified.</li>') + '</ul></div>' +

    '<div class="quot-section"><div class="quot-section-title">Terms &amp; Policies</div>' + policyHTML + signatureHTML + '</div>' +

    '<div class="quot-price-box">' +
    '<div class="quot-price-label">Total Package Price</div>' +
    '<div class="quot-price-amount">' + formatCurrency(pkg.pricing.finalPrice) + '</div>' +
    '<div class="quot-price-pp">Per Person: ' + formatCurrency(pkg.pricing.perPerson) + '</div>' +
    (pkg.pricing.note ? '<div class="quot-price-note">' + pkg.pricing.note + '</div>' : '') +
    '</div>' +

    (pkg.customer.requests ? '<div class="quot-section"><div class="quot-section-title">Special Requests</div><p style="font-size:0.88rem;color:#4a5568">' + pkg.customer.requests + '</p></div>' : '') +

    '<div class="quot-section"><div class="quot-section-title">Contact Us</div>' +
    '<div class="quot-contact">' +
    '<div class="quot-contact-item"><span class="quot-contact-label">Company</span><span class="quot-contact-value">North Wind Kashmir Tour &amp; Travel</span></div>' +
    '<div class="quot-contact-item"><span class="quot-contact-label">WhatsApp</span><span class="quot-contact-value">+91 9541615419 | +91 7006431517</span></div>' +
    '<div class="quot-contact-item"><span class="quot-contact-label">Email</span><span class="quot-contact-value">northwindkashmir@gmail.com</span></div>' +
    '<div class="quot-contact-item"><span class="quot-contact-label">Website</span><span class="quot-contact-value">northwindkashmir.com</span></div>' +
    '<div class="quot-contact-item"><span class="quot-contact-label">Office</span><span class="quot-contact-value">Chandilora, Tangmarg, Gulmarg</span></div>' +
    '</div>' +
    '<a href="https://wa.me/919541615419" target="_blank" class="quot-wa-btn">Chat on WhatsApp</a></div>' +

    '<div class="quot-footer">This quotation is subject to availability. Prices are inclusive of all listed items.<br>North Wind Kashmir &mdash; EXPLORE. TRAVEL. REPEAT</div>' +
    '</div>' +
    '</div>';
}

document.getElementById('btnCloseModal').addEventListener('click', function () { document.getElementById('quotationModal').style.display = 'none'; });

document.getElementById('btnPrint').addEventListener('click', function () {
  if (!viewingPackage) return;
  printQuotation(viewingPackage);
});

function printQuotation(pkg, themeOverride) {
  var theme = themeOverride || pkg.theme || 'classic';
  var quotDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  var destStr = (pkg.destinations || []).join(' \u2022 ');
  var policies = pkg.policies || {};

  // Build itinerary HTML for print
  var iHTML = '';
  if (pkg.itinerary && pkg.itinerary.length > 0) {
    iHTML = pkg.itinerary.map(function (d) {
      return '<div class="quot-day">' +
        '<div class="quot-day-title">Day ' + d.day + (d.date ? ' \u2014 ' + formatDate(d.date) : '') + (d.title ? ': ' + d.title : '') + '</div>' +
        '<div class="quot-day-details">' +
        (d.route ? '<strong>Route:</strong> ' + d.route + '<br>' : '') +
        (d.activities ? '<strong>Places/Activities:</strong> ' + d.activities + '<br>' : '') +
        (d.hotel ? '<strong>Stay:</strong> ' + d.hotel + '<br>' : '') +
        (d.meals ? '<strong>Meals:</strong> ' + d.meals + '<br>' : '') +
        (d.description ? d.description : '') +
        '</div></div>';
    }).join('');
  } else { iHTML = '<p style="color:#8a9ab5;font-size:0.85rem;font-style:italic">No itinerary added.</p>'; }

  // Hotels
  var hHTML = '';
  if (pkg.hotels && pkg.hotels.length > 0) {
    hHTML = pkg.hotels.map(function (h) {
      return '<div class="quot-hotel"><div>' +
        '<div class="quot-hotel-name">' + (h.name || 'TBD') + (h.category ? ' (' + h.category + ')' : '') + '</div>' +
        '<div class="quot-hotel-detail">' + (h.location || '') + (h.nights ? ' \u2014 ' + h.nights + ' night(s)' : '') + '</div>' +
        '</div></div>';
    }).join('');
  } else { hHTML = '<p style="color:#8a9ab5;font-style:italic;font-size:0.85rem">Hotel details TBC.</p>'; }

  var inclHTML = (pkg.inclusions || []).map(function (i) { return '<li>' + i + '</li>'; }).join('');
  var exclHTML = (pkg.exclusions || []).map(function (i) { return '<li>' + i + '</li>'; }).join('');
  var policyHTML =
    '<div class="quot-policy-grid">' +
    (policies.validityDate ? '<div class="quot-policy-item"><div class="quot-policy-title">Validity</div><div class="quot-policy-value">Valid till ' + formatDate(policies.validityDate) + '</div></div>' : '') +
    (policies.paymentSchedule ? '<div class="quot-policy-item"><div class="quot-policy-title">Payment Schedule</div><div class="quot-policy-value">' + policies.paymentSchedule + '</div></div>' : '') +
    (policies.cancellationPolicy ? '<div class="quot-policy-item"><div class="quot-policy-title">Cancellation Policy</div><div class="quot-policy-value">' + policies.cancellationPolicy + '</div></div>' : '') +
    (policies.terms ? '<div class="quot-policy-item"><div class="quot-policy-title">Terms &amp; Conditions</div><div class="quot-policy-value">' + policies.terms + '</div></div>' : '') +
    '</div>';
  var signatureHTML = '';
  if (policies.includeSignature || policies.includeSeal) {
    signatureHTML = '<div class="quot-signature-grid">' +
      (policies.includeSignature ? '<div class="quot-sign-box"><div class="quot-sign-title">Authorized Signature</div><div class="quot-sign-line">North Wind Kashmir</div></div>' : '') +
      (policies.includeSeal ? '<div class="quot-sign-box"><div class="quot-sign-title">Company Seal</div><div class="quot-sign-line">Official Stamp Area</div></div>' : '') +
      '</div>';
  }

  // Resolve logo path relative to the document
  var logoPath = window.location.href.replace(/\/[^\/]*$/, '/') + 'assets/images/logo/logo.png';

  var customBgStyle = '';
  if (theme === 'custom' && pkg.customBg) {
    customBgStyle = 'style="background-image:linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(\'' + pkg.customBg + '\');background-size:cover;background-position:center;"';
  }

  var body = '<div class="print-quotation quotation-wrapper theme-' + theme + '" id="printQuotDoc" ' + customBgStyle + '>' +
    '<div class="quot-watermark"></div>' +
    '<div class="quot-content-layer">' +

    // BRAND HEADER
    '<div class="quot-brand">' +
    '<img src="' + logoPath + '" alt="NorthWind Kashmir" style="width:160px;height:auto;display:block;margin:0 auto 10px">' +
    '<div class="quot-number">Ref: ' + pkg.id + ' \u00a0|\u00a0 Date: ' + quotDate + '</div>' +
    '</div>' +

    // OVERVIEW
    '<div class="quot-section"><div class="quot-section-title">Package Overview</div>' +
    '<div class="quot-info-grid">' +
    '<div class="quot-info-item"><span class="quot-info-label">Package</span><span class="quot-info-value">' + pkg.name + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Type</span><span class="quot-info-value">' + pkg.type + ' Package</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Customer</span><span class="quot-info-value">' + pkg.customer.name + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">WhatsApp</span><span class="quot-info-value">' + pkg.customer.whatsapp + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Travel Dates</span><span class="quot-info-value">' + formatDate(pkg.startDate) + ' \u2013 ' + formatDate(pkg.endDate) + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Duration</span><span class="quot-info-value">' + pkg.duration + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Travellers</span><span class="quot-info-value">' + pkg.adults + ' Adult(s)' + (pkg.children > 0 ? ' + ' + pkg.children + ' Child' : '') + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Room Type</span><span class="quot-info-value">' + (pkg.roomType || '-') + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Vehicle Type</span><span class="quot-info-value">' + (pkg.vehicleType || '-') + '</span></div>' +
    '<div class="quot-info-item"><span class="quot-info-label">Meal Plan</span><span class="quot-info-value">' + pkg.mealPlan + '</span></div>' +
    (destStr ? '<div class="quot-info-item" style="grid-column:1/-1"><span class="quot-info-label">Destinations</span><span class="quot-info-value">' + destStr + '</span></div>' : '') +
    '</div></div>' +

    // ITINERARY
    '<div class="quot-section"><div class="quot-section-title">Day-by-Day Itinerary</div>' + iHTML + '</div>' +

    // HOTELS
    '<div class="quot-section"><div class="quot-section-title">Hotels / Accommodation</div>' + hHTML + '</div>' +

    // INCLUSIONS
    '<div class="quot-section"><div class="quot-section-title">Inclusions</div><ul class="quot-list">' + (inclHTML || '<li style="color:#8a9ab5">None specified.</li>') + '</ul></div>' +

    // EXCLUSIONS
    '<div class="quot-section"><div class="quot-section-title">Exclusions</div><ul class="quot-list exclusions">' + (exclHTML || '<li style="color:#8a9ab5">None specified.</li>') + '</ul></div>' +

    // TERMS
    '<div class="quot-section"><div class="quot-section-title">Terms &amp; Policies</div>' + policyHTML + signatureHTML + '</div>' +

    // PRICE
    '<div class="quot-price-box">' +
    '<div class="quot-price-label">Total Package Price</div>' +
    '<div class="quot-price-amount">' + formatCurrency(pkg.pricing.finalPrice) + '</div>' +
    '<div class="quot-price-pp">Per Person: ' + formatCurrency(pkg.pricing.perPerson) + '</div>' +
    (pkg.pricing.note ? '<div class="quot-price-note">' + pkg.pricing.note + '</div>' : '') +
    '</div>' +

    (pkg.customer.requests ? '<div class="quot-section"><div class="quot-section-title">Special Requests</div><p style="font-size:0.85rem;color:#4a5568">' + pkg.customer.requests + '</p></div>' : '') +

    // CONTACT
    '<div class="quot-section"><div class="quot-section-title">Contact Us</div>' +
    '<div class="quot-contact">' +
    '<div class="quot-contact-item"><span class="quot-contact-label">Company</span><span class="quot-contact-value">North Wind Kashmir Tour &amp; Travel</span></div>' +
    '<div class="quot-contact-item"><span class="quot-contact-label">WhatsApp</span><span class="quot-contact-value">+91 9541615419 &nbsp;|&nbsp; +91 7006431517</span></div>' +
    '<div class="quot-contact-item"><span class="quot-contact-label">Email</span><span class="quot-contact-value">northwindkashmir@gmail.com</span></div>' +
    '<div class="quot-contact-item"><span class="quot-contact-label">Website</span><span class="quot-contact-value">northwindkashmir.com</span></div>' +
    '<div class="quot-contact-item"><span class="quot-contact-label">Office</span><span class="quot-contact-value">Chandilora, Tangmarg, Gulmarg</span></div>' +
    '</div></div>' +

    '<div class="quot-footer">This quotation is subject to availability. Prices are inclusive of all listed items.<br>North Wind Kashmir Tour &amp; Travel &mdash; EXPLORE. TRAVEL. REPEAT</div>' +
    '</div>' +
    '</div>';

  var cssLink = window.location.href.replace(/\/[^\/]*$/, '/') + 'index.css';
  var win = window.open('', '_blank', 'width=940,height=800');
  win.document.write('<!DOCTYPE html><html><head>' +
    '<meta charset="UTF-8">' +
    '<title>Quotation - ' + pkg.name + '</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">' +
    '<link rel="stylesheet" href="' + cssLink + '">' +
    '<style>' +
    'body { margin: 0; background: #eaedf2; font-family: Inter, sans-serif; }' +
    '.print-bar { position: sticky; top: 0; z-index: 999; background: #1a3a5c; color: white; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }' +
    '.print-bar select { padding: 6px 12px; font-size: 0.85rem; font-weight: 600; border-radius: 6px; border: 1px solid rgba(255,255,255,0.3); background: white; color: #1a3a5c; outline: none; cursor: pointer; }' +
    '.print-bar-btn { background: #c0392b; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-size: 0.88rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }' +
    '.print-bar-btn:hover { background: #e74c3c; }' +
    '.print-paper-container { max-width: 840px; margin: 24px auto; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }' +
    '@media print { body { background: white !important; } .no-print { display: none !important; } .print-paper-container { max-width: 100% !important; margin: 0 !important; box-shadow: none !important; } }' +
    '</style>' +
    '</head><body>' +
    '<div class="print-bar no-print">' +
    '<div style="display:flex;align-items:center;gap:10px;">' +
    '<span style="font-weight:700;letter-spacing:0.05em;">NORTH WIND KASHMIR</span>' +
    '<span style="opacity:0.6;font-size:0.8rem;">| PDF Export Preview</span>' +
    '</div>' +
    '<div style="display:flex;align-items:center;gap:12px;">' +
    '<label style="font-size:0.82rem;font-weight:600;">🎨 Background Theme:</label>' +
    '<select id="themeDropdown" onchange="setPrintTheme(this.value)">' +
    '<option value="classic"' + (theme === 'classic' ? ' selected' : '') + '>Classic Navy</option>' +
    '<option value="snow"' + (theme === 'snow' ? ' selected' : '') + '>🏔️ Gulmarg Snow</option>' +
    '<option value="sunset"' + (theme === 'sunset' ? ' selected' : '') + '>🛶 Dal Lake Sunset</option>' +
    '<option value="pine"' + (theme === 'pine' ? ' selected' : '') + '>🌲 Pahalgam Pines</option>' +
    '<option value="autumn"' + (theme === 'autumn' ? ' selected' : '') + '>🍁 Autumn Chinar</option>' +
    '<option value="honeymoon"' + (theme === 'honeymoon' ? ' selected' : '') + '>💖 Honeymoon Rose</option>' +
    '<option value="luxury"' + (theme === 'luxury' ? ' selected' : '') + '>👑 Royal Mughal</option>' +
    '<option value="adventure"' + (theme === 'adventure' ? ' selected' : '') + '>⚡ Adventure Slate</option>' +
    '</select>' +
    '<button class="print-bar-btn" onclick="window.print()">&#128424; Print / Save as PDF</button>' +
    '</div>' +
    '</div>' +
    '<div class="print-paper-container">' +
    body +
    '</div>' +
    '<script>' +
    'function setPrintTheme(t) {' +
    'var doc = document.getElementById("printQuotDoc");' +
    'if (doc) {' +
    'doc.className = "print-quotation quotation-wrapper theme-" + t;' +
    '}' +
    '}' +
    '<\/script>' +
    '</body></html>');
  win.document.close();
}

// ============================================================
// WHATSAPP
// ============================================================

document.getElementById('btnWhatsApp').addEventListener('click', function () {
  if (!viewingPackage) return;
  var pkg = viewingPackage;
  var theme = pkg.theme || 'classic';

  // Theme-specific headers and icons
  var themeIcon = '🏔️';
  var themeTitle = 'NORTH WIND KASHMIR';
  if (theme === 'snow') {
    themeIcon = '❄️';
    themeTitle = '🏔️ NORTH WIND KASHMIR (Winter & Snow Edition)';
  } else if (theme === 'sunset') {
    themeIcon = '🛶';
    themeTitle = '🌅 NORTH WIND KASHMIR (Dal Lake & Sunset Edition)';
  } else if (theme === 'pine') {
    themeIcon = '🌲';
    themeTitle = '🌲 NORTH WIND KASHMIR (Pahalgam & Nature Edition)';
  } else if (theme === 'autumn') {
    themeIcon = '🍁';
    themeTitle = '🍂 NORTH WIND KASHMIR (Golden Autumn Edition)';
  } else if (theme === 'honeymoon') {
    themeIcon = '💖';
    themeTitle = '🌹 NORTH WIND KASHMIR (Romantic Honeymoon Edition)';
  } else if (theme === 'luxury') {
    themeIcon = '👑';
    themeTitle = '✨ NORTH WIND KASHMIR (Royal Mughal Luxury Edition)';
  } else if (theme === 'adventure') {
    themeIcon = '⚡';
    themeTitle = '🧗 NORTH WIND KASHMIR (Adventure & Trekking Edition)';
  }

  var lines = [];
  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(themeTitle);
  lines.push('TOUR & TRAVEL — EXPLORE. TRAVEL. REPEAT');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push('✨ ' + pkg.name.toUpperCase());
  lines.push('📌 Quotation Reference: ' + pkg.id);
  lines.push('');
  lines.push('👤 Customer: ' + pkg.customer.name);
  lines.push('📅 Travel Dates: ' + formatDate(pkg.startDate) + ' to ' + formatDate(pkg.endDate));
  lines.push('⏳ Duration: ' + pkg.duration);
  lines.push('👥 Travellers: ' + pkg.adults + ' Adult(s)' + (pkg.children > 0 ? ' + ' + pkg.children + ' Child' : ''));
  lines.push('🛏️ Room Type: ' + (pkg.roomType || '-'));
  lines.push('🚐 Vehicle Type: ' + (pkg.vehicleType || '-'));
  lines.push('🍽️ Meal Plan: ' + pkg.mealPlan);
  if ((pkg.destinations || []).length > 0) {
    lines.push('📍 Destinations: ' + pkg.destinations.join(' • '));
  }
  lines.push('');

  if (pkg.itinerary && pkg.itinerary.length > 0) {
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('🗺️ DAY-BY-DAY ITINERARY');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    pkg.itinerary.forEach(function (d) {
      lines.push('');
      lines.push('🗓️ Day ' + d.day + (d.title ? ': ' + d.title : ''));
      if (d.route) lines.push('  🚗 Route: ' + d.route);
      if (d.activities) lines.push('  🏞️ Places: ' + d.activities);
      if (d.hotel) lines.push('  🏨 Stay: ' + d.hotel);
      if (d.meals) lines.push('  🍴 Meals: ' + d.meals);
    });
    lines.push('');
  }

  if (pkg.hotels && pkg.hotels.length > 0) {
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('🏨 HOTELS & ACCOMMODATION');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    pkg.hotels.forEach(function (h) {
      lines.push('• ' + (h.name || 'TBD') + ' (' + h.category + ')' + (h.location ? ' - ' + h.location : '') + (h.nights ? ' [' + h.nights + ' Night(s)]' : ''));
    });
    lines.push('');
  }

  if ((pkg.inclusions || []).length > 0) {
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('✅ INCLUSIONS');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    pkg.inclusions.forEach(function (i) { lines.push('✔ ' + i); });
    lines.push('');
  }

  if ((pkg.exclusions || []).length > 0) {
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('❌ EXCLUSIONS');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━');
    pkg.exclusions.forEach(function (i) { lines.push('✖ ' + i); });
    lines.push('');
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('💰 PACKAGE PRICING');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('🏷️ Total Selling Price: ' + formatCurrency(pkg.pricing.finalPrice));
  lines.push('👤 Price Per Person: ' + formatCurrency(pkg.pricing.perPerson));
  if (pkg.pricing.note) lines.push('📝 Note: ' + pkg.pricing.note);
  if (pkg.policies && pkg.policies.validityDate) lines.push('📅 Valid Till: ' + formatDate(pkg.policies.validityDate));
  if (pkg.policies && pkg.policies.paymentSchedule) lines.push('💳 Payment: ' + pkg.policies.paymentSchedule);
  lines.push('');

  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('📞 CONTACT & BOOKING');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('📱 WhatsApp: +91 9541615419 / +91 7006431517');
  lines.push('✉️ Email: northwindkashmir@gmail.com');
  lines.push('🌐 Website: northwindkashmir.com');
  lines.push('📍 Office: Chandilora, Tangmarg, Gulmarg');
  lines.push('');
  lines.push('✨ North Wind Kashmir — EXPLORE. TRAVEL. REPEAT');

  document.getElementById('waText').value = lines.join('\n');
  document.getElementById('quotationModal').style.display = 'none';
  document.getElementById('waModal').style.display = 'flex';
});

document.getElementById('btnCopyWa').addEventListener('click', function () {
  var ta = document.getElementById('waText');
  ta.select();
  try {
    navigator.clipboard.writeText(ta.value);
    showToast('Copied to clipboard!', 'success');
  } catch (e) {
    document.execCommand('copy');
    showToast('Copied!', 'success');
  }
});

document.getElementById('btnOpenWa').addEventListener('click', function () {
  var text = encodeURIComponent(document.getElementById('waText').value);
  var custNum = '';
  if (viewingPackage && viewingPackage.customer && viewingPackage.customer.whatsapp) {
    custNum = viewingPackage.customer.whatsapp.replace(/[^\d]/g, '');
    if (custNum.charAt(0) === '0') custNum = '91' + custNum.slice(1);
    if (custNum.length === 10) custNum = '91' + custNum;
  }
  var url = custNum
    ? 'https://wa.me/' + custNum + '?text=' + text
    : 'https://wa.me/?text=' + text;
  window.open(url, '_blank');
});

document.getElementById('btnCloseWa').addEventListener('click', function () { document.getElementById('waModal').style.display = 'none'; });

// Close modals on overlay click
['quotationModal', 'waModal', 'deleteModal', 'hotelDBModal'].forEach(function (id) {
  document.getElementById(id).addEventListener('click', function (e) { if (e.target === this) this.style.display = 'none'; });
});

// ============================================================
// INIT
// ============================================================

function init() {
  applySimpleModeUI();
  renderCostPresetOptions('');
  setDefaultValidityDate();
  renderPackageList();
}

init();

// ============================================================
// HOTEL DATABASE
// ============================================================

var editingHotelId = null; // null = adding new hotel

// -- Storage helpers --
function getAllHotelsDB() {
  try {
    var data = JSON.parse(localStorage.getItem(HOTEL_DB_KEY) || '[]');
    if (!Array.isArray(data)) return [];
    return data.map(ensureHotelDefaults);
  } catch {
    return [];
  }
}
function saveHotelDB(hotel) {
  var hotels = getAllHotelsDB();
  var idx = hotels.findIndex(function (h) { return h.id === hotel.id; });
  var safeHotel = ensureHotelDefaults(hotel);
  if (idx >= 0) { hotels[idx] = safeHotel; } else { hotels.push(safeHotel); }
  localStorage.setItem(HOTEL_DB_KEY, JSON.stringify(hotels));
}
function deleteHotelDB(id) {
  var hotels = getAllHotelsDB().filter(function (h) { return h.id !== id; });
  localStorage.setItem(HOTEL_DB_KEY, JSON.stringify(hotels));
}
function generateHotelId() {
  return 'HTL-' + Date.now();
}

// -- Render hotel list in modal --
function renderHotelDBItems(searchVal) {
  var all = getAllHotelsDB();
  var q = (searchVal || '').toLowerCase();
  var filtered = q ? all.filter(function (h) {
    return h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || (h.contactPerson || '').toLowerCase().includes(q);
  }) : all;

  var container = document.getElementById('hotelDBItems');
  var emptyEl = document.getElementById('hotelDBEmpty');
  container.innerHTML = '';

  if (filtered.length === 0) { emptyEl.style.display = 'block'; return; }
  emptyEl.style.display = 'none';

  filtered.forEach(function (h) {
    var staleDays = daysSince(h.lastRateUpdate);
    var isStale = staleDays > RATE_STALE_DAYS;
    var ratingText = 'Reliability ' + Number(h.reliabilityScore).toFixed(1) + '/5';
    var div = document.createElement('div');
    div.className = 'hotel-db-item';
    div.innerHTML =
      '<div>' +
      '<div class="hotel-db-item-name">' + h.name + '</div>' +
      '<div class="hotel-db-item-meta">' + h.location + ' &bull; ' + h.category + (h.roomType ? ' &bull; ' + h.roomType : '') + '</div>' +
      (h.pricePerNight ? '<div class="hotel-db-item-price">Rs. ' + Number(h.pricePerNight).toLocaleString('en-IN') + ' / night</div>' : '') +
      (h.contact ? '<div class="hotel-db-item-meta" style="margin-top:2px">&#128222; ' + h.contact + '</div>' : '') +
      (h.contactPerson ? '<div class="hotel-db-item-meta">Person: ' + h.contactPerson + '</div>' : '') +
      '<div class="hotel-db-rating">' + ratingText + '</div>' +
      (isStale ? '<div class="hotel-db-stale">Rate update overdue (' + staleDays + ' days)</div>' : '') +
      (h.lastUsedAt ? '<div class="hotel-db-item-meta">Last used: ' + formatDate(h.lastUsedAt) + '</div>' : '') +
      '</div>' +
      '<div class="hotel-db-item-actions">' +
      '<button class="btn btn-sm btn-outline" onclick="editHotelDB(\'' + h.id + '\')">Edit</button>' +
      '<button class="btn btn-sm" style="background:#fef2f2;color:#e74c3c;border:1.5px solid #fecaca;border-radius:6px;" onclick="removeHotelDB(\'' + h.id + '\')">Delete</button>' +
      '</div>';
    container.appendChild(div);
  });
}

// -- Open hotel DB modal --
document.getElementById('btnHotelDB').addEventListener('click', function () {
  document.getElementById('hotelDBForm').style.display = 'none';
  document.getElementById('hotelDBList').style.display = '';
  document.getElementById('hotelDBSearch').value = '';
  renderHotelDBItems('');
  document.getElementById('hotelDBModal').style.display = 'flex';
});
document.getElementById('btnCloseHotelDB').addEventListener('click', function () {
  document.getElementById('hotelDBModal').style.display = 'none';
});

// -- Search --
document.getElementById('hotelDBSearch').addEventListener('input', function () {
  renderHotelDBItems(this.value);
});

// -- Show add form --
document.getElementById('btnAddHotelDB').addEventListener('click', function () {
  editingHotelId = null;
  clearHotelForm();
  document.getElementById('hotelDBFormTitle').textContent = 'Add New Hotel';
  document.getElementById('hotelDBForm').style.display = '';
  document.getElementById('hotelDBList').style.display = 'none';
});

function clearHotelForm() {
  document.getElementById('hdb_name').value = '';
  document.getElementById('hdb_location').value = '';
  document.getElementById('hdb_category').value = '3 Star';
  document.getElementById('hdb_roomType').value = 'Standard';
  document.getElementById('hdb_price').value = '';
  document.getElementById('hdb_contact').value = '';
  document.getElementById('hdb_contactPerson').value = '';
  document.getElementById('hdb_reliability').value = '4';
  document.getElementById('hdb_rateUpdated').value = new Date().toISOString().split('T')[0];
  document.getElementById('hdb_notes').value = '';
}

// -- Edit hotel --
function editHotelDB(id) {
  var h = getAllHotelsDB().find(function (x) { return x.id === id; });
  if (!h) return;
  editingHotelId = id;
  document.getElementById('hdb_name').value = h.name;
  document.getElementById('hdb_location').value = h.location;
  document.getElementById('hdb_category').value = h.category;
  document.getElementById('hdb_roomType').value = h.roomType || 'Standard';
  document.getElementById('hdb_price').value = h.pricePerNight || '';
  document.getElementById('hdb_contact').value = h.contact || '';
  document.getElementById('hdb_contactPerson').value = h.contactPerson || '';
  document.getElementById('hdb_reliability').value = h.reliabilityScore || 4;
  document.getElementById('hdb_rateUpdated').value = h.lastRateUpdate || '';
  document.getElementById('hdb_notes').value = h.notes || '';
  document.getElementById('hotelDBFormTitle').textContent = 'Edit Hotel';
  document.getElementById('hotelDBForm').style.display = '';
  document.getElementById('hotelDBList').style.display = 'none';
}

// -- Delete hotel --
function removeHotelDB(id) {
  if (!confirm('Delete this hotel from the database?')) return;
  deleteHotelDB(id);
  renderHotelDBItems(document.getElementById('hotelDBSearch').value);
  showToast('Hotel deleted from database.', 'error');
  refreshHotelPickerDropdowns();
}

// -- Cancel form --
document.getElementById('btnCancelHotelForm').addEventListener('click', function () {
  document.getElementById('hotelDBForm').style.display = 'none';
  document.getElementById('hotelDBList').style.display = '';
  renderHotelDBItems(document.getElementById('hotelDBSearch').value);
});

// -- Save hotel --
document.getElementById('btnSaveHotelDB').addEventListener('click', function () {
  var name = document.getElementById('hdb_name').value.trim();
  var location = document.getElementById('hdb_location').value.trim();
  if (!name) { showToast('Please enter hotel name.', 'error'); return; }
  if (!location) { showToast('Please enter location.', 'error'); return; }

  var oldHotel = editingHotelId ? getAllHotelsDB().find(function (x) { return x.id === editingHotelId; }) : null;
  var notesText = document.getElementById('hdb_notes').value.trim();
  var oldNotes = oldHotel ? (oldHotel.notes || '') : '';
  var notesHistory = oldHotel && Array.isArray(oldHotel.notesHistory) ? oldHotel.notesHistory.slice() : [];
  if (notesText && notesText !== oldNotes) {
    notesHistory.push({ at: new Date().toISOString(), note: notesText });
  }

  var hotel = {
    id: editingHotelId || generateHotelId(),
    name: name,
    location: location,
    category: document.getElementById('hdb_category').value,
    roomType: document.getElementById('hdb_roomType').value,
    pricePerNight: document.getElementById('hdb_price').value || 0,
    contact: document.getElementById('hdb_contact').value.trim(),
    contactPerson: document.getElementById('hdb_contactPerson').value.trim(),
    reliabilityScore: parseFloat(document.getElementById('hdb_reliability').value) || 4,
    lastRateUpdate: document.getElementById('hdb_rateUpdated').value,
    lastUsedAt: oldHotel ? (oldHotel.lastUsedAt || '') : '',
    lastQuotedRate: oldHotel ? (oldHotel.lastQuotedRate || 0) : 0,
    notes: notesText,
    notesHistory: notesHistory
  };

  saveHotelDB(hotel);
  showToast(editingHotelId ? 'Hotel updated!' : 'Hotel saved to database!', 'success');
  document.getElementById('hotelDBForm').style.display = 'none';
  document.getElementById('hotelDBList').style.display = '';
  renderHotelDBItems('');
  refreshHotelPickerDropdowns();
  editingHotelId = null;
});

// ============================================================
// HOTEL PICKER IN PACKAGE FORM
// ============================================================

function markHotelUsage(hotelId, quotedRate) {
  if (!hotelId) return;
  var hotels = getAllHotelsDB();
  var idx = hotels.findIndex(function (h) { return h.id === hotelId; });
  if (idx < 0) return;
  hotels[idx].lastUsedAt = new Date().toISOString();
  hotels[idx].lastQuotedRate = quotedRate || hotels[idx].lastQuotedRate || hotels[idx].pricePerNight || 0;
  localStorage.setItem(HOTEL_DB_KEY, JSON.stringify(hotels));
}

function updateHotelUsageFromPackage(pkg) {
  if (!pkg || !pkg.hotels || pkg.hotels.length === 0) return;
  var hotelsDB = getAllHotelsDB();
  var dbByName = {};
  hotelsDB.forEach(function (h) { dbByName[(h.name || '').toLowerCase()] = h.id; });

  pkg.hotels.forEach(function (h) {
    var id = dbByName[(h.name || '').toLowerCase()];
    if (id) markHotelUsage(id, h.ratePerNight || 0);
  });
}

// Build dropdown options from hotel DB
function buildHotelPickerOptions() {
  var hotels = getAllHotelsDB();
  if (hotels.length === 0) return '<option value="">-- No saved hotels yet --</option>';
  return '<option value="">-- Pick from saved hotels --</option>' +
    hotels.map(function (h) {
      var staleDays = daysSince(h.lastRateUpdate);
      var staleTag = staleDays > RATE_STALE_DAYS ? ' [Rate stale]' : '';
      return '<option value="' + h.id + '">' + h.name + ' (' + h.location + ' | ' + h.category + ')' + staleTag + '</option>';
    }).join('');
}

// Refresh all hotel picker dropdowns in the package form
function refreshHotelPickerDropdowns() {
  var opts = buildHotelPickerOptions();
  document.querySelectorAll('.hotel-db-picker select').forEach(function (sel) {
    sel.innerHTML = opts;
  });
}

// Override addHotel to include DB picker row
var _originalAddHotel = addHotel;
addHotel = function (data) {
  data = data || {};
  var cats = ['3 Star', '4 Star', '5 Star', 'Houseboat', 'Resort', 'Budget'];
  var catOpts = cats.map(function (c) { return '<option' + (data.category === c ? ' selected' : '') + '>' + c + '</option>'; }).join('');
  var div = document.createElement('div');
  div.className = 'hotel-entry';

  // Build the hotel entry including the DB picker row
  div.innerHTML =
    '<div class="hotel-db-picker" style="grid-column:1/-1;padding-bottom:8px;margin-bottom:4px;border-top:none;border-bottom:1px dashed #dde3ed;">' +
    '<label>Pick from DB:</label>' +
    '<select class="hotel-picker-select">' + buildHotelPickerOptions() + '</select>' +
    '</div>' +
    '<div class="form-group"><label>Location</label><input type="text" class="hotel-location" placeholder="e.g. Srinagar" value="' + (data.location || '') + '"></div>' +
    '<div class="form-group"><label>Hotel Name</label><input type="text" class="hotel-name" placeholder="Hotel name" value="' + (data.name || '') + '"></div>' +
    '<div class="form-group"><label>Category</label><select class="hotel-cat">' + catOpts + '</select></div>' +
    '<div class="form-group"><label>Nights</label><input type="number" class="hotel-nights" min="1" value="' + (data.nights || 1) + '"></div>' +
    '<div><label>&nbsp;</label><button type="button" class="btn-remove-hotel" onclick="this.closest(\'.hotel-entry\').remove()" title="Remove">X</button></div>';

  hotelContainer.appendChild(div);

  // Wire up the picker dropdown
  var pickerSel = div.querySelector('.hotel-picker-select');
  pickerSel.addEventListener('change', function () {
    var id = this.value;
    if (!id) return;
    var h = getAllHotelsDB().find(function (x) { return x.id === id; });
    if (!h) return;
    div.querySelector('.hotel-location').value = h.location;
    div.querySelector('.hotel-name').value = h.name;
    div.querySelector('.hotel-cat').value = h.category;
    markHotelUsage(id, h.pricePerNight || 0);
    // Reset picker so it shows -- pick -- again
    this.value = '';
    showToast('Hotel details filled from database!', 'success');
  });
};
