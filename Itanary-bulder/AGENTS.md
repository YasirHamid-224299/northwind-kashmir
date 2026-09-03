# 🏔️ NorthWind Kashmir - Project Documentation & AI Context (AGENTS.md)

This file tracks the architecture, codebase structure, data models, and features of the **NorthWind Kashmir - Package Creator** project. Any AI assistant or developer working on this codebase should review this document before making modifications.

---

## 📌 Project Overview
- **Application Name**: NorthWind Kashmir - Package Creator
- **Company**: North Wind Kashmir Tour & Travel
- **Tagline**: EXPLORE. TRAVEL. REPEAT
- **Purpose**: A comprehensive single-page web application for creating, managing, quoting, printing (PDF), and WhatsApp-sharing customized Kashmir travel packages and itineraries.
- **Tech Stack**: Vanilla HTML5, CSS3 (Modern Design System with Theme Gradients and SVG Watermarks), Vanilla JavaScript (ES6+), LocalStorage persistence. No build tools or node dependencies required.

### Admin Access
- The builder opens behind a login screen and uses an 8-hour `sessionStorage` session.
- The current demo credentials are `northwindkashmir` / `nwt@0080`; update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `index.js` before sharing the page.
- This is a client-side gate only. Because the builder is static and stores data in browser `localStorage`, it is not suitable for protecting secrets or enforcing server-side authorization. Use hosting authentication or a backend before treating it as secure admin access.

---

## 📂 File Structure & Responsibilities

```
d:/the Package/
├── index.html           # Main UI layout, forms, and modals
├── index.css            # Design tokens, theme classes, print styles, responsive UI
├── index.js             # Application logic, LocalStorage state, DOM rendering, PDF & WhatsApp engine
├── AGENTS.md            # Complete project documentation and AI context guide
└── assets/
    └── images/
        └── logo/
            └── logo.png # Brand logo asset
```

---

## 💾 Data Models & LocalStorage Schema

### 1. Packages (`localStorage.getItem('nwk_packages')`)
Stored as an Array of Package objects:
```json
{
  "id": "NWK-2026-0001",
  "name": "Romantic Gulmarg & Pahalgam Honeymoon",
  "type": "Honeymoon",
  "theme": "honeymoon",
  "customBg": "",
  "status": "Draft",
  "startDate": "2026-09-01",
  "endDate": "2026-09-06",
  "duration": "6D / 5N",
  "adults": 2,
  "children": 0,
  "roomType": "Deluxe",
  "mealPlan": "MAP (Breakfast + Dinner)",
  "customer": {
    "name": "Rahul & Priya Sharma",
    "whatsapp": "+91 9876543210",
    "email": "customer@example.com",
    "country": "Delhi, India",
    "requests": "Flower decoration on arrival"
  },
  "destinations": ["Srinagar", "Gulmarg", "Pahalgam"],
  "itinerary": [
    {
      "day": 1,
      "date": "2026-09-01",
      "title": "Arrival Srinagar & Shikara Ride",
      "route": "Airport to Srinagar Hotel",
      "hotel": "Grand Palace Srinagar",
      "meals": "Dinner",
      "activities": "Dal Lake, Shikara Ride, Boulevard Road",
      "description": "Pick up from Srinagar airport and transfer to hotel."
    }
  ],
  "hotels": [
    {
      "location": "Srinagar",
      "name": "Grand Palace",
      "category": "4 Star",
      "nights": "2"
    }
  ],
  "inclusions": [
    "Airport Pickup and Drop",
    "Hotel Accommodation",
    "Breakfast",
    "Dinner",
    "Private Vehicle",
    "Driver",
    "Sightseeing"
  ],
  "exclusions": [
    "Flight Tickets",
    "Gondola Tickets",
    "Pony Rides",
    "Lunch",
    "Personal Expenses"
  ],
  "pricing": {
    "hotel": 40000,
    "transport": 15000,
    "activities": 0,
    "other": 0,
    "markup": 10000,
    "discount": 0,
    "totalCost": 55000,
    "finalPrice": 65000,
    "perPerson": 32500,
    "note": "Price is inclusive of all taxes and private vehicle.",
    "presetId": "summer_honeymoon_full"
  },
  "season": "Summer",
  "quoteGroupId": "NWK-2026-0001",
  "quoteVersion": 2,
  "versionSourceId": "NWK-2026-0001",
  "versionChangeSummary": "Price reduced by Rs. 2,000",
  "appliedTemplates": {
    "incExc": "honeymoon",
    "costPreset": "summer_honeymoon_full"
  },
  "policies": {
    "validityDate": "2026-08-25",
    "paymentSchedule": "40% advance, 40% before check-in, 20% on arrival.",
    "cancellationPolicy": "Free cancellation up to 15 days before arrival.",
    "terms": "Rates subject to availability.",
    "includeSignature": true,
    "includeSeal": true
  },
  "internalNotes": "Customer requested high floor rooms.",
  "createdAt": "2026-08-18T08:35:00.000Z",
  "updatedAt": "2026-08-18T08:35:00.000Z"
}
```

### 2. Hotel Database (`localStorage.getItem('nwk_hotel_db')`)
Stored as an Array of Hotel objects:
```json
{
  "id": "HTL-1787042000000",
  "name": "Hotel Grand Palace",
  "location": "Srinagar",
  "category": "4 Star",
  "roomType": "Deluxe",
  "pricePerNight": 6500,
  "contact": "+91 9419000000",
  "contactPerson": "Mr. Aamir",
  "reliabilityScore": 4.5,
  "lastRateUpdate": "2026-08-10",
  "lastUsedAt": "2026-08-16T10:12:00.000Z",
  "lastQuotedRate": 6800,
  "notes": "Near Dal Lake gate 2",
  "notesHistory": [
    {
      "at": "2026-08-10T09:10:00.000Z",
      "note": "Updated rate for autumn season"
    }
  ]
}
```

---

## 🎨 Background Themes & Visual System

Packages support 8 built-in Kashmiri aesthetic themes plus custom background image URLs.

| Theme Key | Title | Visual Aesthetics & Colors | Default For |
| :--- | :--- | :--- | :--- |
| `classic` | Classic Navy | Navy (`#1a3a5c`), Gold (`#d4a942`), Ruby Red (`#c0392b`) | Standard / Solo |
| `snow` | Gulmarg Snow | Frost Blue (`#0f2744` to `#38bdf8`), Snowflake watermark | Winter / Skiing / Budget |
| `sunset` | Dal Lake Sunset | Sunset Gold & Terracotta (`#7c2d12` to `#f59e0b`), Ripple watermark | Dal Lake / Houseboat |
| `pine` | Pahalgam Pines | Cedar Emerald (`#064e3b` to `#10b981`), Pine branch watermark | Nature / Family / Group |
| `autumn` | Autumn Chinar | Maple Amber & Terracotta (`#78350f` to `#ea580c`), Chinar leaf watermark | Autumn / Mughal gardens |
| `honeymoon` | Honeymoon Rose | Soft Rose Blush & Burgundy (`#831843` to `#f472b6`), Rose watermark | Honeymoon / Couple |
| `luxury` | Royal Mughal | Midnight Sapphire & Gold Leaf (`#0f172a` to `#d4af37`), Ornate jaal | Luxury / Premium |
| `adventure` | Adventure Slate | Slate Charcoal & Solar Orange (`#18181b` to `#f97316`), Ridge contour | Adventure / Trekking |
| `custom` | Custom Image | User-provided background URL (`customBg`) | Custom branding |

---

## 🔑 Core Subsystems & Logic

### 1. Form & Theme Management (`index.js`)
- `getSelectedTheme()`: Returns current selected theme from `#themePickerGrid`.
- `setSelectedTheme(theme)`: Updates active theme card, radio button, and custom input visibility.
- `getSuggestedThemeForType(type)`: Smart-matches package types to themes (e.g. `Honeymoon` $\rightarrow$ `honeymoon`).
- `resetForm()`: Clears form fields, resets itinerary and hotel entries, sets default inclusions/exclusions.
- `showForm()` / `hideForm()`: Toggles between form section and package list view.

### 2. Auto Day-by-Day Itinerary Engine & Templates (`index.js`)
- `autoGenerateItinerary()`: Dynamically calculates duration from `pkgStartDate` and `pkgEndDate`, analyzes selected destinations (`getDestinations()`) and `pkgType`, and automatically populates sequential days with dates, realistic routes, hotel stays, meal plans, places, and descriptions.
- `applyItineraryTemplate(templateKey)`: 1-click quick-fill templates repository (`ITINERARY_TEMPLATES`):
  - `5d_classic`: 5D/4N Classic Kashmir Highlights
  - `6d_honeymoon`: 6D/5N Romantic Kashmir Honeymoon
  - `7d_grand`: 7D/6N Grand Kashmir Explorer
  - `4d_snow`: 4D/3N Winter Snow & Shikara
  - `6d_valleys`: 6D/5N Valleys & Meadows
  - `8d_complete`: 8D/7N Complete Kashmir Paradise
- Auto-checks matching destination chips and populates suggested hotel rows.

### 3. Pricing Engine
- `recalcPrice()`: Automatically computes `Total Cost`, `Markup`, `Discount`, `Final Selling Price`, and `Price Per Person` live on any input change.

### 3.1 Cost Library & Preset Suggestion
- LocalStorage key `nwk_cost_presets` stores reusable costing presets.
- Supports one-click `Apply Preset`, `Save Preset`, and smart `Suggest` matching by season + selected destinations.
- Applied preset is tracked in package schema (`pricing.presetId`, `appliedTemplates.costPreset`).

### 3.2 Inclusion/Exclusion Templates
- Added quick templates for `honeymoon`, `family`, `luxury`, `adventure`.
- Template apply updates checklist with missing custom entries auto-inserted.

### 4. Quotation Modal
- `#quotationModal`: Displays full preview of the quotation.
- `#modalThemeSelect`: Instant live theme switcher dropdown in the modal header.
- `buildQuotationHTML(pkg, themeOverride)`: Renders HTML with `.quotation-wrapper theme-{theme}`, background watermarks, itinerary, hotels, pricing, and contact info.

### 5. Print / PDF Generation
- `printQuotation(pkg, themeOverride)`: Opens an isolated window formatted for clean PDF rendering.
- Features a sticky `.print-bar.no-print` toolbar with an on-the-fly theme switcher (`#themeDropdown`) and a `Save as PDF / Print` button.
- Uses `-webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;` to ensure all backgrounds, gradients, watermarks, and headers print in full color.
- Includes enhanced policy section: quotation validity, payment schedule, cancellation policy, terms, optional signature block, and optional company seal area.

### 5.1 Multi-Quote Versioning
- Packages now support grouped quote versions through `quoteGroupId` and `quoteVersion`.
- `New Version` action creates a draft next version and links it with `versionSourceId`.
- Change summary (`versionChangeSummary`) tracks key deltas from previous version.

### 6. WhatsApp Sharing Engine
- Formats quotations with custom emoji banners matching the package theme.
- Direct links with customer's WhatsApp number (`https://wa.me/{number}?text={encoded_text}`) and one-click copy to clipboard.

### 7. Hotel Database Modal
- `#hotelDBModal`: Full CRUD interface for managing hotel rates, contacts, and locations.
- Hotel picker integration inside package hotel entries.
- Vendor intelligence fields: contact person, reliability score, last rate update, notes history, last-used timestamp.
- Stale-rate warning badge appears when rate age exceeds configured threshold.

---

## 🗺️ Key DOM Elements & IDs

| DOM ID | Element Type | Purpose |
| :--- | :--- | :--- |
| `btnNewPackage` | `<button>` | Opens form to create package |
| `formSection` | `<section>` | Container for the package creation/edit form |
| `listSection` | `<section>` | Container for the package cards list |
| `packageForm` | `<form>` | Main package editor form |
| `pkgType` | `<select>` | Package category (triggers auto-theme suggestion) |
| `themePickerGrid` | `<div>` | Theme visual cards selection grid |
| `pkgCustomBg` | `<input>` | URL input for custom background image |
| `btnAutoItinerary` | `<button>` | Auto-generates day-by-day itinerary based on dates & destinations |
| `btnToggleTemplates` | `<button>` | Toggles quick Kashmir itinerary templates bar |
| `itineraryTemplateBar`| `<div>` | Container for quick-fill template chips |
| `templateChips` | `<div>` | Pre-made Kashmir itinerary template buttons |
| `costHotel`, `costTransport`, `costMarkup` | `<input>` | Pricing calculation inputs |
| `quotationModal` | `<div>` | Quotation preview modal overlay |
| `modalThemeSelect` | `<select>` | Live theme switcher in quotation header |
| `btnPrint` | `<button>` | Triggers print/PDF window |
| `btnWhatsApp` | `<button>` | Opens WhatsApp formatted message modal |
| `waModal` | `<div>` | WhatsApp message preview modal |
| `btnCopyWa`, `btnOpenWa` | `<button>` | WhatsApp action buttons |
| `hotelDBModal` | `<div>` | Hotel database management modal |

---

## 🛠️ Instructions for Future AI Modifications
1. **Preserve Vanilla Stack**: Do not introduce build tools, webpack/vite, or npm dependencies unless explicitly requested by the user. Keep it runnable directly via static browser load or lightweight server.
2. **Maintain CSS Tokens**: Always use CSS variables (`--brand-blue`, `--whatsapp`, `--theme-p`, etc.) defined in `index.css`.
3. **Print Precision**: Any new elements added to the quotation must include print styles with `page-break-inside: avoid;` and `print-color-adjust: exact`.
4. **LocalStorage Compatibility**: If adding new properties to the `Package` or `Hotel` objects, ensure backward compatibility for packages stored without those fields (use default fallback values).
5. **Update This File**: When adding new features or major UI changes, update `AGENTS.md` accordingly.
