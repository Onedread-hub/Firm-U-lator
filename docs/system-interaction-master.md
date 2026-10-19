# Firm U-Lator & SFS v0.1 — System Interaction Master Document

**Document Version**: 2.0.0  
**Target Systems**: Super Football Simulator (SFS v0.1) & Firm U-Lator  
**Classification**: Master Architecture, Subsystem Interactions & Data Pipeline Specification  

---

## 1. Executive System Overview

**Firm U-Lator** is the off-pitch terrace culture, nightlife, and hooligan simulation companion to the **SFS v0.1** retro football management engine. While SFS simulates 11v11 tactical football on Saturday matchdays, Firm U-Lator models the mid-week underground economy, black market contraband transit, nightclub door control, territorial urban dominance, and street clashes across 26 English football clubs.

### 1.1 High-Level Component Topology

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SFS v0.1 BASE ENGINE                                   │
│  - 26 Football Clubs (Tier 1 & Tier 2)           - Saturday 15:00 Match Engine         │
│  - League Table & Form Standings                 - Team Persistence & Save File        │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │ Unified State (firmIntegration)
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               FIRM U-LATOR COMPANION MOD                               │
│                                                                                        │
│   ┌────────────────────────┐  ┌─────────────────────────┐  ┌────────────────────────┐  │
│   │   THE LADS & TACTICS   │  │   AWAY CARGO & TRADING  │  │   THE CITY & NIGHTLIFE │  │
│   │ - 5 Casual Roles       │  │ - 50-Unit Cargo Manifest│  │ - 6 Urban Districts     │  │
│   │ - Hardness/Bottle/Pace │  │ - Contraband Smuggling  │  │ - Dynamic Growth Tiers │  │
│   │ - Wedge/Phalanx/Pincer │  │ - Motorway/Rail Routes  │  │ - Housing Estate Draft │  │
│   └───────────┬────────────┘  └────────────┬────────────┘  └───────────┬────────────┘  │
│               │                            │                           │               │
│               ▼                            ▼                           ▼               │
│   ┌────────────────────────┐  ┌─────────────────────────┐  ┌────────────────────────┐  │
│   │    MATCHDAY CLASH      │  │    AWAY CITY MARKET     │  │     DOOR SECURITY      │  │
│   │ - 3D ASCII Renderer    │  │ - Underworld Exchange   │  │ - Door Minders (£150/w)│  │
│   │ - Raycast Cobblestones │  │ - Heat Accumulation     │  │ - Weekly Door Cut (£)  │  │
│   │ - 2D Tactical Pitch    │  │ - Police Raid Trigger   │  │ - Takeovers & Incidents│  │
│   └───────────┬────────────┘  └────────────┬────────────┘  └───────────┬────────────┘  │
│               │                            │                           │               │
│               └────────────────────────────┼───────────────────────────┘               │
│                                            ▼                                           │
│                              ┌───────────────────────────┐                             │
│                              │    TERRITORY WARS (MAP)   │                             │
│                              │ - 5 Urban Zones           │                             │
│                              │ - Dominance Percentages   │                             │
│                              │ - 3-Day War Campaigns     │                             │
│                              └───────────────────────────┘                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Three Unification Bridges

Firm U-Lator does not exist in isolation; it synchronizes bidirectionally with SFS across three deterministic bridges:

### 2.1 The Calendar Bridge
* **Saturday 15:00**: SFS Football Matchday. The football team plays its league fixture.
* **Midweek (Tuesday–Thursday)**: Firm operational window. Contraband trading runs, door minding operations, and multi-day territorial war clashes execute when the main football team is off the pitch.
* **Sunday Morning**: The Weekly Settlement Tick (`handleReturnToOffice`). Sunday sport gazettes report casualties, hospitalizations, bails, door revenues, and city economic prosperity updates.

### 2.2 The Economy Bridge
* **Unified Club Treasury**: Liquid capital (£) is shared between club operations and firm resources.
* **Income Vectors**:
  1. *Matchday Commercial Revenue*: Driven by SFS league tier and fan mood.
  2. *Nightlife Door Takes*: Generated weekly by controlled pubs and clubs.
  3. *Black Market Contraband Arbitrage*: Selling smuggled goods in away cities.
  4. *Territory Revenue*: Upgraded stronghold pubs and transit arches.
* **Expense Vectors**:
  1. *Door Minder Wages*: Fixed at £150 / lad / week.
  2. *Away Day Logistics & Travel*: Train charters, private convoys, and kit.
  3. *Legal Bails & Solicitors*: Clearing Section 60 heat and magistrates court bails.
  4. *Proceeds of Crime Act Confiscation*: 50% treasury forfeiture if heat exceeds 50 during a police raid.

### 2.3 The Events Bridge
* **`MatchResultEvent`**: Emitted by SFS match engine.
  * Club win: $+15\%$ Fan Loyalty, $+4$ City Prosperity Index.
  * Club loss: $-10\%$ Fan Loyalty, increases street tension.
* **`FirmClashEvent`**: Emitted by Firm U-Lator clash resolution.
  * Firm win: $+35$ Street Respect, $+10\%$ Loyalty, expands terrace perimeter.
  * Firm loss / dispersal: Hospitalized lads, $-20$ Respect, legal heat increases.

---

## 3. Subsystem Deep-Dive & Interaction Logic

### 3.1 The SFS ASCII 3D Renderer Integration

The SFS base engine features a real-time ASCII 3D rendering pipeline (`src/renderers/asciiLibRenderer.ts`) that is repurposed directly for street clashes:

| Feature | SFS Football Engine | Firm U-Lator Street Clash |
|---|---|---|
| **Ground Plane** | 2.5D Green Turf (`.`, ` `, `:`) | Raycast Cobblestones (`=`, `:`) / Station Rails / Pub Carpet |
| **Entities** | 22 Footballers with kits | 16–20 Casuals in Stone Island jackets and dark trousers |
| **Centerpiece** | Football | Purple Marine Smoke Flare / Objective Standoff Line |
| **Skyline** | Stadium floodlights & stands | Victorian rowhouses, factory chimneys, and rainy skies |
| **Camera Modes** | Broadcast, Follow, Sideline | **Hero** (locked to Top Boy), **Broadcast**, **Follow** |
| **Output Target** | Terminal / Monospace Viewport | `<AsciiClashViewport />` with live toggle to 2D tactical pitch |

* **Projection Math**: Pinhole camera transforms 3D world space coordinates $(X, Y, Z)$ into a 2D depth-buffered terminal grid ($80 \times 24$). Scanline raycasting computes cobblestone joint lines and wet rain sheens dynamically.

### 3.2 Black Market Trading & Away Day Smuggling Loop

1. **Cargo Acquisition**:
   * Before away fixtures, players access the **Cargo** sub-tab in `AwayTravelPlanner`.
   * Manifest capacity: Max 50 units.
   * Goods Categories:
     * *Bootleg* (Pirate Derby Tapes, Silk Scarves, White-Label Vinyl): Low cost (£12–£22), low heat (+4–6), steady margin.
     * *Contraband* (Vintage Tracktops, Smuggled Belgian Trappist Lager, Marine Flares): Medium cost (£32–£48), medium heat (+12–16), $2.5\times$ profit.
     * *Premium* (Deadstock 1988 Designer Coats, Swiss Chronographs): High cost (£95–£145), extreme heat (+22–28), $3\times$ payout.
2. **Transit Route Choice**:
   * *Motorway M-Ways*: Fast, high volume, moderate police highway patrol stops.
   * *A-Roads*: Slower, higher stealth, avoids motorway cameras.
   * *Train Network*: High group camaraderie, severe Transport Police station checkpoints.
   * Random *Travel Events* trigger en route (e.g. roadside vehicle check, sniffer dogs, bribe opportunities).
3. **Away City Underworld Exchange**:
   * Upon arrival in the away city, `<AwayMarketModal />` opens.
   * Cargo sold deposits cash directly into the firm treasury.
   * Selling cargo accumulates `awayCityHeat` based on item heat ratings.
4. **The Clash Police Raid Threshold (>50 Heat)**:
   * When `awayCityHeat > 50`, plain-clothes spotters pinpoint the firm assembly.
   * On clash launch, **Operation Tactical Sweep** triggers automatically:
     * The matchday clash is **CANCELLED**.
     * **50% of liquid firm treasury is confiscated** under the Proceeds of Crime Act.
     * $-25$ Street Respect and $-10\%$ Loyalty penalty.

### 3.3 The City & Dynamic Urban Ecology

* **District Types**:
  1. *Pubs & Alehouses*: Traditional pre-match assembly points.
  2. *Nightclubs & Raves*: High revenue nightlife doors; heavy rave culture.
  3. *Caffs & Bistros*: Meeting spots for firm reconnaissance and breakfast briefings.
  4. *Council Housing Estates*: Heartland for recruiting raw, fearless Casuals.
  5. *Posh Quarters*: High-end boutiques, luxury sports cars, designer clothing outlets.
  6. *Industrial Sidings*: Secluded battlegrounds for arranged clashes away from police.
* **Club Football Success Growth Link**:
  * As the SFS club wins matches, `prosperityScore` (0–100) advances through 5 tiers:
    * *Tier 1: Gritty Mill Town*
    * *Tier 2: Developing Industrial Hub*
    * *Tier 3: Booming Regional Centre*
    * *Tier 4: Prosperous Metro*
    * *Tier 5: Cosmopolitan Football Capital*
  * Higher tiers unlock commercial nightlife venues, upscale wine bars, and boost overall district cash flow.

### 3.4 Door Security — The Night Job

* **Venue Status**:
  * *Uncontrolled*: Neutral territory; no income, rival firms operate freely.
  * *Controlled*: Firm minders run the ropes; collects weekly door cut (`weeklyTake`).
  * *Contested*: Rival firm is actively challenging ownership.
* **Takeover Mechanics**:
  * **Hostile Takeover**: Triggers an immediate street brawl to eject the current minders.
  * **Bribing the Owner**: Costs £450 from treasury; peaceful legal transfer of door contract.
  * **Intimidating the Owner**: Requires $\ge 450$ Street Respect; owner surrenders keys due to fear.
* **Staffing Operations**:
  * Casuals are assigned from the active squad as **Door Minders**.
  * Critical attributes: **Hardness (STR)** and **Bottle (Courage)**.
  * Each active minder earns a fixed wage of **£150 / week** deducted during Sunday settlement.
* **Door Incident Engine (`DoorEventModal.tsx`)**:
  * *The Unruly Punter*: Rival drunks attempt entry. Choices: Turn him away (Bottle $\ge 65$ check), let him in ($-20$ respect), or alley lesson (+30 respect, triggers brawl).
  * *The Police Licensing Raid*: Vice squad inspection. Choices: Bribe sergeant (£500, $-15$ heat), refuse entry without warrant (+20 heat, +20 respect), or stall for time.
  * *Rival Top Boy Confrontation*: Rival crew attempts a hostile takeover. Choices: Stand ground (trigger major clash), back down (lose door), or pay tribute (£400).

### 3.5 Territory Wars — The Map

The city is partitioned into 5 strategic zones:
1. **The Stadium Quarter**: Matchday epicenter (+25% Home matchday advantage & fan loyalty).
2. **The High Street**: Commercial retail spine (+£350 weekly door revenue).
3. **The Station Approach**: Transit bottleneck (+20 Stealth on away days; intercepts away fans).
4. **The Docks**: Waterfront container yards (+30% Contraband cargo capacity & lower buy prices).
5. **The Council Estate**: Concrete residential flats (-30% Recruitment cost for minders & nutters).

* **Territory Dominance**:
  * Dominance percentage (0–100%) is calculated from controlled venues and assigned lads in that sector.
  * Dominance $> 50\%$ grants full territory control.
* **Declaring a Territory War**:
  * Cost: **+100 Police Heat spike** across the borough.
  * Selection: Commit up to 20 Casuals from your roster.
* **The 3-Day War Campaign**:
  * **Day 1: Street Skirmishes**: 1v1 scout duels down back alleys.
  * **Day 2: Industrial Brawl**: 8v8 arranged rumble in warehouse container yards.
  * **Day 3: Primary Pub Raid**: Frontline storming of the rival firm's primary taproom.
* **Campaign Resolution**:
  * Winning 2 of 3 days secures the territory.
  * **Victory Rewards**: Permanent ownership, +75 Street Respect, +15% Loyalty, +20% permanent revenue boost to all venues in that territory.
  * **Defeat Penalties**: $-40$ Respect, $-15\%$ Loyalty, committed lads sustain injuries or hospitalizations.

---

## 4. Weekly Advance Lifecycle (`handleReturnToOffice`)

When the user clicks the iconic FM-style **"CONTINUE >>"** button or returns from a matchday clash, the following deterministic settlement executes:

```
[1. ADVANCE ROUND] ────────► currentRound += 1
[2. MATCH RESULT]  ────────► Apply SFS score to Fan Loyalty & Club Reputation
[3. FINANCES]      ────────► Net Cash = Territory Revenue
                                       + City District Revenue
                                       + Gross Door Takes
                                       - (£150 * Total Active Minders)
[4. HEAT DECAY]    ────────► Police Heat decays by -8 (floor: 15%)
[5. CITY EXPANSION]────────► Prosperity Score updates based on match victory
                                       Tier progression unlocks new venues
[6. DOOR INCIDENTS]────────► 35% random roll triggers a Door Event
                                       on a randomly selected controlled venue
[7. WAR STATUS]    ────────► Active Territory War campaign updates days or settles
```

---

## 5. Save State Synchronization & Schema

All firm dynamics persist inside the SFS save data (`localStorage.getItem('firm_u_lator_save_sfs_v2')`).

```typescript
export interface FirmIntegrationState {
  clubId: string;
  firmLoyalty: number;       // 0-100: Fan loyalty index
  territoryControl: number;  // 0-100: Percentage of city controlled
  knownRivals: string[];     // Array of rival club IDs
  treasury: number;          // Liquid cash (£)
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  region: SfsRegion;
  leagueTier: 'Big Time League' | 'Up and Comers';
  clubBand: 'Elite' | 'Mid' | 'Underdog';
  primaryColor: string;
  secondaryColor: string;
  stadium: string;
  reputation: number;
  fanMood: number;
  boardConfidence: number;
  firmIntegration?: FirmIntegrationState; // SFS v0.1 Team Extension
}
```

---

## 6. Verification & Test Harnesses

* **Linter Status**: `npm run lint` (`tsc --noEmit`) passes with **0 errors**.
* **Compiler Status**: `compile_applet` builds cleanly.
* **ASCII Spike Harness**: `Scripts/spike-clash-ascii.ts` verifies:
  * Pinhole camera math and scanline raycast rendering.
  * 3D skeletal casual figure projection with Stone Island apparel.
  * Camera position interpolation and tracking.
