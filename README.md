# 🏛️ Kadiri Municipality Ward 08 — Electoral Directory & Election War Room Engine

Official Production-Ready Voter Directory, Search Engine, Duplicate Audit System, and Campaign War Room for:
- **Municipality:** Kadiri (కదిరి పురపాలక సంఘం)
- **Ward Number:** Ward 08 (8వ వార్డు)
- **Assembly Constituency:** 161 - Kadiri (161-కదిరి)
- **District:** Sri Sathya Sai District (శ్రీ సత్యసాయి జిల్లా)
- **State:** Andhra Pradesh, India
- **Authority:** Andhra Pradesh State Election Commission (APSEC)
- **Electoral Roll Publication Date:** 22-09-2026 (Qualifying Date: 01-01-2026)

---

## 📊 Strict 100% Mathematical Reconciliation Invariants
Every single elector has been extracted and reconciled against the official 78-page APSEC Photo Voter Roll:
1. **Total Registered Voters:** Exactly **2,013**
2. **Gender Breakdown:**
   - **Male (పు):** **957** (47.54%)
   - **Female (స్త్రీ):** **1,056** (52.46%)
   - **Other (ఇతరులు):** **0**
   - **Sum:** 957 + 1056 = 2,013 (100.0%)
3. **Canonical Localities (4 Areas):**
   - **Adapala Street (అడపాల స్ట్రీట్):** 1,819 Voters (863 Male, 956 Female)
   - **Water Tank Road (వాటర్ ట్యాంక్ రోడ్డు):** 178 Voters (84 Male, 94 Female)
   - **RS Road (ఆర్ ఎస్ రోడ్డు):** 15 Voters (9 Male, 6 Female)
   - **Rajiv Gandhi Nagar (రాజీవ్ గాంధీ నగర్):** 1 Voter (1 Male, 0 Female)
   - **Sum:** 1819 + 178 + 15 + 1 = **2,013**
4. **Households / Doors:** Exactly **1,021** unique households
5. **Assembly Sections:** 23 sections mapped (109, 113, 128, 62, 63, 68, 69, 70, 71, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89)
6. **Unassigned Localities / Doors:** Exactly **0**

---

## 🚀 Key Features

### 1. Live Election War Room Widget (`/dashboard`)
- **Win Probability Gauge:** Real-time winning percentage calculation `(Favored / Decided) * 100%`.
- **Active Living Voters Strength:** Deducts field-reported deceased (Late) voters from registered roll.
- **Target to Win:** `Math.floor(Living / 2) + 1` formula.
- **Tri-color Canvassing Bar:** Real-time visual split between Favored (Emerald), Undecided (Amber), and Unfavored (Rose).
- **4 Canonical Localities Performance Table:** Detailed area-level voter metrics, targets, and lead margins.
- **One-Click Canvassing Simulation:** "⚡ Load Sample Canvassing Survey" button and "🔄 Reset" button.

### 2. Three Interactive Campaign Controls Beside Every Voter Name
- 🕊️ **LATE (చనిపోయినవారు / Deceased):** Strikethroughs name, dims card opacity, and immediately deducts from living electorate.
- ⚠️ **DOUBLE VOTER (డబుల్ ఓటరు):** Flags duplicate enrollment or cross-booth entries.
- 👍 **FAVOR (అనుకూలం) / 👎 UNFAVOR (ప్రతికూలం):** 1-click sentiment toggle with instant persistence to `localStorage` (`ward08_voter_canvassing_tags_v1`) and cross-tab window event broadcasting.

### 3. Comprehensive Electoral Directory (`/voters`)
- Dual view modes: Grid view (VoterCards) and Table view.
- Real-time search across Telugu names, English names, EPIC numbers, door numbers, and serials.
- Sort options: Top Voters Door-wise (decreasing density default), Serial, Age, Name.
- Quick filter chips: All, Favor, Unfavor, Double Voters, Late.
- Dynamic CSV Export matching active filters.

### 4. Elector Dossier (`/voters/[id]`)
- Official verification badge.
- Family members residing at the same door.
- Guardian relation, age, gender, section, and exact source PDF page link.
- Official ECI/APSEC Form 7 (Deletions/Objections) and Form 8 (Corrections/Transposition) links.

### 5. Duplicate & Clean Roll Audit Room (`/double-voters`)
- **Tab 1:** Confirmed Same-Door Double Voters with side-by-side comparison cards.
- **Tab 2:** Campaign Eliminated Voters (electors marked Late/deceased).
- **Tab 3:** Same Name Across Ward (cross-door name clusters).
- One-click CSV export of audit callsets.

### 6. Search & Transliteration Engine (`/search`)
- Unified instant search engine with phonetic suggestions between English and Telugu script.
- Multi-tab results: Voters, Households, and Localities.

### 7. Household Explorer (`/households` & `/houses/[houseId]`)
- 1,021 unique doors ranked by voter count.
- Household member rosters and family relationship graphs.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 App Router with TypeScript
- **Styling:** Tailwind CSS with Emerald/Slate Civic Theme
- **Icons:** Lucide React
- **Typography:** Custom Telugu ligature support (`Noto Sans Telugu`, `Gautami`)
- **Testing:** Pure Node.js unit test runner (`node --test`)
- **Deployment:** Vercel ready

---

## 🧪 Unit Testing & Verification
Run the 13 automated reconciliation tests:
```bash
npm run test
```
All 13 tests verify:
- Exact 2,013 voter count & gender balance
- Locality sums equality
- Household density descending order
- Canvassing math invariant
- Telugu Unicode and English transliteration search

---

## 📦 Deployment to Vercel
1. Push to GitHub:
   ```bash
   git push origin main
   ```
2. Import repository in [Vercel](https://vercel.com).
3. Framework Preset: **Next.js**.
4. Click **Deploy**.
