# SFS v0.1 Base Engine & Firm U-Lator — Unification Design Document

**Status**: Approved Architecture Specification  
**Version**: 1.1.0  
**Target Systems**: SFS v0.1 ("Super Football Simulator") Base Engine & Firm U-Lator Companion Mod  

---

## 1. Overview & Purpose

This document details the architectural unification between the **SFS v0.1 Base Engine** and **Firm U-Lator**.

Historically, SFS v0.1 operates as an 11-a-side retro football management simulation, while Firm U-Lator was prototyped as a standalone companion app. Under this unified design:
1. SFS v0.1 remains the single authoritative game runtime, calendar clock, and save file host.
2. The 26 clubs across the *Big Time League* (14) and *Up and Comers* (12) are unified.
3. Firm U-Lator operates as an integrated module within the SFS runtime, reading directly from the SFS game state rather than managing an isolated universe.

---

## 2. The Three Bridges

The unification establishes three explicit communication and synchronization bridges between the football club simulation and the terrace firm subculture.

```
       ┌────────────────────────────────────────────────────────────┐
       │                   SFS v0.1 BASE ENGINE                     │
       │  - 26 Football Clubs (Team Interface)                      │
       │  - Calendar Tick (advanceOneDay)                           │
       │  - 11-a-side Weekend Matches (Saturdays)                   │
       │  - Club Bank Treasury & Board Confidence                   │
       └─────────────────────────────┬──────────────────────────────┘
                                     │
         1. CALENDAR BRIDGE          │   3. EVENTS BRIDGE
         Midweek = Clashes           │   MatchResultEvent (W/D/L -> Loyalty)
         Weekend = Football          │   FirmClashEvent (Brawls -> Reputation)
                                     │
         2. ECONOMY BRIDGE           │
         Club Bank != Firm Cash      │
         (Isolated Treasuries)       │
                                     ▼
       ┌────────────────────────────────────────────────────────────┐
       │                    FIRM U-LATOR MOD                        │
       │  - Midweek Street Clashes & Away Infiltration              │
       │  - Pavement Formations (Wedge, Phalanx, Pincer)            │
       │  - Pub Strongholds & Territorial Control                   │
       │  - Firm Cash Treasury (£ for Travel, Flares, Bails)        │
       └────────────────────────────────────────────────────────────┘
```

### 2.1 Bridge 1 — The Calendar Bridge (Midweek Synchronization)
* **The Rule**: Football matches occur on weekends (Saturdays), while **firm clashes occur on midweek days** (e.g. Wednesday or Thursday evenings) when the football team is not playing.
* **Cadence & Execution**:
  - The SFS engine calendar advances daily via `advanceOneDay()`.
  - **Weekend Tick (Matchday)**: Focus is on 11-a-side pitch tactics, team selection, form, and league standings.
  - **Midweek Tick (Clashday)**: Focus switches to terrace operations: planning away day travel routes, pub scouting, station concourse defense, and cobblestone tactical clashes against the upcoming opponent's firm.
  - **Off Days (Monday, Tuesday, Friday)**: Training for football players in SFS; boxing gym sparring, hill sprints, physio recovery, and solicitor consultations for firm lads in Firm U-Lator.
* **Benefits**: Eliminates UI collision and narrative confusion between managing an 11-a-side football game and a street brawl simultaneously.

### 2.2 Bridge 2 — The Economy Bridge (Dual-Economy Isolation)
* **The Rule**: The club bank account and the firm treasury remain strictly separated.
* **Economy Boundaries**:
  - **Football Club Treasury**: £20,000 – £500,000+ managed by the manager and board for player transfers, scout wages, and stadium maintenance.
  - **Firm Treasury (`treasury` in `FirmIntegrationState`)**: £200 – £2,500 cash managed by the Top Boy for chartering minibuses, train specials, purchasing marine purple flares, and retaining 24/7 solicitors for magistrates court bail.
* **Cross-Economy Influences**:
  - Club revenue **cannot** be directly spent on street contraband or bails.
  - However, territorial control of station turnstiles and pub strongholds generates weekly cash revenue directly into the firm treasury.
  - In return, high terrace firm loyalty boosts attendance zeal and hardcore atmosphere, indirectly boosting stadium turnstile gate receipts for the football club.

### 2.3 Bridge 3 — The Events Bridge (Bidirectional Feedback)
* **MatchResultEvent (Football $\rightarrow$ Firm)**:
  - When a weekend match finishes, SFS broadcasts a `MatchResultEvent`.
  - **Home/Away Win**: $+5$ Firm Loyalty (Derby Win: $+10$ Loyalty). Terrace is energized.
  - **Draw**: $0$ Loyalty change (Derby Draw: $+2$ Loyalty).
  - **Defeat**: $-5$ Firm Loyalty (Derby Defeat: $-12$ Loyalty).
  - **Relegation Threat Defeat**: $-10$ Firm Loyalty (angry terrace protests).
* **FirmClashEvent (Firm $\rightarrow$ Club)**:
  - When a midweek street clash concludes, Firm U-Lator emits a `FirmClashEvent`.
  - **Violence & Riot Squad Intervention**: $-10$ SFS Fan Mood, $-5$ Board Confidence.
  - **Heavy Casualties & Mass Arrests**: $-15$ SFS Fan Mood, $-10$ Board Confidence. Local media coverage triggers emergency board inquiries.
  - **Bails & Legal Penalties**: Cost deducted strictly from `firmIntegration.treasury`.

---

## 3. Data Contracts

The shared contracts are defined in `src/types/firmIntegration.ts`:

```typescript
export interface FirmIntegrationState {
  clubId: string;
  firmLoyalty: number;        // 0 - 100: Current terrace loyalty to the club
  territoryControl: number;   // 0 - 100: % of local metro/stadium territory held
  knownRivals: string[];      // Array of rival SFS club IDs
  treasury: number;           // £: Liquid cash for travel, bails, and gear
}

export interface MatchResultEvent {
  matchId: string;
  homeClubId: string;
  awayClubId: string;
  homeScore: number;
  awayScore: number;
  result: 'home_win' | 'away_win' | 'draw';
}

export interface FirmClashEvent {
  clashId: string;
  clubId: string;
  opponentFirmId: string;
  outcome: 'win' | 'loss' | 'draw';
  casualties: number;
  bailsCost: number;
}
```

---

## 4. The SFS Team Interface Extension

The SFS `Team` entity is updated to embed `firmIntegration?: FirmIntegrationState`:

```typescript
export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  region: 'Northern' | 'Midlands' | 'Coastal' | 'Southern';
  leagueTier: 'Big Time League' | 'Up and Comers';
  clubBand: 'Elite' | 'Mid' | 'Underdog';
  primaryColor: string;
  secondaryColor: string;
  stadium: string;
  reputation: number; // 1-100
  fanMood: number; // 0-100
  boardConfidence: number; // 0-100
  clubReputation?: number;
  fanMoodModifier?: number;
  firmIntegration?: FirmIntegrationState;
  players?: any[];
}
```

---

## 5. Save Strategy: Single Master Save

### 5.1 No Independent Mod Save
Firm U-Lator **does not maintain its own separate save file or independent `localStorage` key**.
* All persistent firm attributes (`firmLoyalty`, `territoryControl`, `knownRivals`, `treasury`) are stored inside the `Team.firmIntegration` property of each club in SFS v0.1.
* When SFS v0.1 executes its standard game save (`sfs_save_v1`), all firm progress is serialized automatically as part of the `teams: Team[]` payload.

### 5.2 Loading & Bootstrapping
* When Firm U-Lator renders or updates:
  1. It reads the current player's club from the SFS `teams` collection using `activeTeamId`.
  2. It accesses `activeTeam.firmIntegration`.
  3. If `firmIntegration` is undefined (e.g. on first launch of a legacy save), default values are lazily seeded:
     - `firmLoyalty`: Matching current `fanMood` (typically 75–85)
     - `territoryControl`: 50
     - `knownRivals`: Seeded from regional and derby rivals
     - `treasury`: £750
* Saving happens automatically through SFS's standard save cycle whenever `advanceOneDay()` completes or the user requests a save.

---

## 6. Constraints Verification

* **SFS Match Engine**: Untouched. It continues simulating 11-a-side matches with football metrics and simply emits `MatchResultEvent`.
* **Firm Clash Engine**: Untouched. It continues simulating street confrontations with tactical shouts and simply emits `FirmClashEvent`.
* **Zero Overhead**: Integration is clean, decoupled, and event-driven via strongly typed TypeScript interfaces.
