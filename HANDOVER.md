# Firm U lator v0.1 — Project Handover

**Date**: 2026-10-17
**Project**: Firm U lator (Football Firm Management Simulator — SFS v0.1 Companion Mod)
**Purpose**: A complete context document for fresh AI sessions or engineers continuing work on Firm U lator.

---

## 1. What Firm U lator is

Firm U lator is a tactics-based football firm management simulation structured identically to a premier retro sports management sim (such as *Championship Manager* / *Football Manager*), but where **football matches become tactical terrace clashes**. It is designed specifically as the companion hooligan subculture mod for the **SFS v0.1 ("Super Football Simulator")** codebase, supporting all 26 clubs across the two SFS leagues (*Big Time League* & *Up and Comers*).

The player manages "The Lads" — balancing physical combat attributes, mental courage ("Bottle"), street smarts ("Nouse"), Met Police surveillance ("Legal Heat"), fan loyalty tiers, and treasury funds. On matchdays, the player plans away day logistics (coaches, trains, infiltration timing, contraband supplies), sets tactical formations, and commands real-time street clashes.

---

## 2. Architecture at a Glance

Stack: **React 19 + TypeScript + Vite 8 + Tailwind CSS 4**. Built on port 3000.
Type checking: `npm run lint` (`tsc --noEmit`). Build: `npm run build`.

```
/
├── STATE.md                 # Current operational state & immediate gotchas
├── HANDOVER.md              # This document: full architecture, subsystems & roadmap
├── MANUAL.md                # The Player's Manual: complete game reference guide
├── index.html               # Applet entry point
├── metadata.json            # AI Studio applet configuration
├── package.json             # Manifest & dependencies
├── src/
│   ├── App.tsx              # Central state orchestrator, round progression & storage
│   ├── main.tsx             # React DOM root
│   ├── index.css            # Tailwind CSS entry
│   ├── types/
│   │   └── game.ts          # Strongly typed domain model (Lads, Firms, Tactics, Travel)
│   ├── data/
│   │   └── initialData.ts   # 26 SFS clubs, initial lads, season fixtures, territories
│   ├── services/
│   │   └── sound.ts         # Synthesized Web Audio API sound service
│   ├── utils/
│   │   └── confetti.ts      # Zero-dependency canvas particle celebration
│   └── components/
│       ├── Navbar.tsx       # 3-zone contract compliant top bar with live firm tickers
│       ├── OfficeView.tsx   # Manager's desk: match preview, loyalty index, dispatches
│       ├── SquadView.tsx    # "The Lads" roster, attributes, traits, gym & legal defense
│       ├── TacticsView.tsx  # Interactive tactics pitch, formations & directives
│       ├── AwayTravelPlanner.tsx # Transport routes, watering holes, contraband kits
│       ├── LeagueView.tsx   # Casuals Division 1 table, club dossiers & fixtures
│       ├── PubHqView.tsx    # Territorial stronghold, pub defense & recruitment
│       ├── ClashEngine.tsx  # Live tactical street clash match engine with shouts
│       ├── PostClashReport.tsx # Sunday Gazette match report with casualties & bails
│       ├── ClubSelectModal.tsx # 26 SFS clubs selector with tier/region filters
│       └── FirmPhoneCallOverlay.tsx # SFS v0.1 Top Boy phone call wire interface
```

---

## 3. Subsystems & Mechanics

### 3.1 The Clash Engine (`src/components/ClashEngine.tsx`)
- **Simulation Loop**: Step-based and real-time interval simulation ($0'$ to $90'$ minute clock) with $1\times$, $2\times$, and instant completion.
- **2D Street Canvas**: Visualized pitch with positional tokens for Home and Away fighters.
- **Commentary Feed**: Generates live play-by-play narrative with timestamps (frontline collisions, bottle cracks, flank runs, police sirens).
- **Touchline Shouts**:
  - `PUSH THE LINE!`: Increases damage and momentum at small stamina cost.
  - `HOLD THE GROUND!`: Tightens defensive perimeter, recovers team bottle (+12%).
  - `TARGET THEIR TOP BOY!`: Focuses attacks on enemy leader to crack rival resolve.
  - `POP PURPLE FLARE!`: Consumes 1 flare, drops enemy accuracy and provides smoke cover.
  - `DISPERSE!`: Sounds retreat whistle before police riot vans arrive.
- **Police Vanguard Radius**: Approaches from 100% to 0%. At $<30\%$, sirens blast; at $0\%$, riot vans disperse the melee.

### 3.2 SFS Firm Roles & Stats (`src/types/game.ts`)
- **Roles**:
  - `top_boy`: Firm leader. Radiates bottle aura (+12% to nearby lads).
  - `face`: Charismatic operator. Smooth-talks police, handles phone calls and negotiations.
  - `minder`: Heavyweight bruiser. Absorbs charge impact, protects the leaders.
  - `runner`: High pace flanker. Delivers calling cards, outruns police cordons.
  - `nutter`: Terrace berserker. Explosive striking power; prone to high legal heat.
- **Attributes**:
  - `hardness`: Physical combat strike and block capability (1–100).
  - `bottle`: Mental courage under pressure before breaking rank (1–100).
  - `pace`: Sprint speed across alleys and flank agility (1–100).
  - `streetSmarts (nouse)`: Avoiding police ambushes, spotting CCTV and escape routes (1–100).
  - `loyalty`: Commitment to the firm (1–100).
  - `health & stamina`: Condition and damage threshold before injury.
  - `legalHeat`: Police surveillance score; high heat triggers Section 60 bails.

### 3.3 Away Day Travel Logistics (`src/components/AwayTravelPlanner.tsx`)
- **Transport Modes**:
  1. *The Football Special* (Rail): High numbers (+20 loyalty), low stealth, police terminal risk.
  2. *Chartered Minibuses*: Flexible, balanced stealth (45%), motorway service station ambushes.
  3. *Sneak Convoy (Private Cars)*: Extreme stealth (70%), infiltrates directly into enemy pub territory.
  4. *Official Supporters Coach*: High safety, zero stealth, direct police escort to turnstiles.
- **Pre-Match Pub Strategy**: *Neutral Spoons*, *The Enemy Local Stronghold* (+80 respect, extreme danger), *Station Platform Tap*, *Private Fortress Lock-In*.
- **Contraband Supplies**: Marine purple flares, trauma first aid kits, spotter scouts, 24/7 retained solicitors.

### 3.4 SFS v0.1 Universe & Clubs (`src/data/initialData.ts`)
- All 26 clubs from the SFS universe are supported:
  - **Big Time League (14)**: Northwood United, Kingsbridge Ath., Westport City, Riverside FC, Eastgate Rovers, Stonebridge Park, Highbury Olympic, Southbank Town, Crown Heights, Ashford Town, Harbourview FC, Redcliffe Albion, Greystone Athletic, Blackwood Forest.
  - **Up and Comers (12)**: Millwall Cross, Oakwood Athletic, Portside Rangers, Ironforge City, Valley United, Brookline FC, Hilltop Wanderers, Docklands Celtic, Meadow Vale, Sunbury Rovers, Heathfield Town, Bayview Park.
- **Regions**: Northern (direct powerhouses), Midlands (balanced grid), Coastal (wind defenders), Southern (mobile station specialists).

### 3.5 Firm Phone Call Wire Overlay (`src/components/FirmPhoneCallOverlay.tsx`)
- Recreates the SFS v0.1 phone call mechanic where the Top Boy rings with critical matchday decisions (ambushing visiting coaches, dealing with Section 60 cordons, or accepting industrial estate challenges).

---

## 4. Verification & Status

- **Type Check**: `npm run lint` (`tsc --noEmit`) passes with **0 errors**.
- **Compilation**: `npm run build` succeeds cleanly via Vite.
- **Runtime Display**: Fully verified with zero-dependency canvas confetti and responsive layout.
- **Dev Server**: Running on port 3000 (`http://localhost:3000`).

---

## 5. Roadmap & What Comes Next

1. **Expanded 26-Club Roster Generation**: Add seeded individual rosters for all 26 clubs so each rival firm has named fighters and leaders when playing long careers.
2. **Motorway Service Station Ambush Minigame**: Add an optional en-route encounter when traveling via Minibus or Unmarked Convoy.
3. **Police Magistrates Court Minigame**: When lads are arrested under Section 60, allow the retained solicitor to argue technical bail violations in court.
4. **Export / Import Save Data**: Add JSON save file import/export alongside local storage.
