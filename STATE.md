# Firm U lator v0.1 — State & Architecture Reference

**Last updated**: 2026-10-17
**Project**: Firm U lator (Football Firm Management Simulator — SFS v0.1 Official Hooligan Mod)
**Runtime Environment**: Vite 8 + React 19 + TypeScript + Tailwind 4, port 3000

---

## 1. Project Overview & Current State

Firm U lator is a tactics-based football firm management simulation created as an official companion mod for the **SFS v0.1 ("Super Football Simulator")** universe. Where SFS v0.1 simulates the 11-a-side pitch matchday, Firm U lator simulates the off-pitch terrace culture, away day travel planning, fan loyalty subcultures, territorial pub strongholds, and tactics-based street clashes across the exact **26 SFS football clubs**.

### Core Pillars Implemented:
1. **The Tactical Matchday Clash Engine**:
   - Matches between football clubs become clashes between their respective firms.
   - Interactive 2D tactical street map with animated tokens (Home vs Away) and approaching Police Riot Squad ETA.
   - Real-time minute clock ($0'$ to $90'$), speed controls ($1\times$, $2\times$, Instant).
   - Football Manager style live play-by-play commentary ticker.
   - Touchline/Pavement Shouts: *"PUSH THE LINE!"*, *"HOLD THE GROUND!"*, *"TARGET TOP BOY!"*, *"POP PURPLE FLARE!"*, *"DISPERSE!"*.
2. **Tactics Board & Formations**:
   - 5 Formations: *The Wedge* (spearhead punch), *Flat Phalanx* (pavement wall), *Pincer Flank* (central shield + dual sweep), *Box Retain* (perimeter guard), *Alley Ambush* (chokepoint bait).
   - Sliders: Aggression ($1$ Canny to $5$ Red Mist), Line Depth, Weapon & Flare Doctrine, Priority Target, Dispersal Threshold ($10$–$60\%$).
   - Active Starting 8 lineup selection from the squad.
3. **Away Game Travel Logistics & Planning**:
   - 4 Transport Modes: *The Football Special* (rail), *Chartered Minibuses*, *Sneak Convoy* (unmarked cars), *Official Coach*.
   - 4 Pre-match Pub Strategies: *Neutral Spoons*, *The Enemy Local Stronghold*, *Railway Station Concourse Tap*, *Private Fortress Lock-In*.
   - 3 Arrival Timings: *Dawn Infiltration*, *Midday Matchday March*, *Post-Whistle Turnstiles*.
   - Contraband Kit: Marine flares, trauma first aid kits, spotter scouts, 24/7 retained solicitors.
4. **The City & Urban Ecology System (NEW)**:
   - Dynamic urban sprawl directly tied to SFS football club success and league tier.
   - 6 District Categories:
     - *Pubs & Alehouses*: The Crown & Anchor, Railway Station Vaults (lock-ins, fortify heavy doors).
     - *Nightclubs & Raves*: The Warehouse Vaults (Acid House 92), Club Elysium VIP lounge (bouncer muscle, merch sales).
     - *Restaurants & Caffs*: Mick's All-Day Caff (+15 stamina breakfasts), Golden Anchor Chippy, Luigi's Trattoria (peace summits).
     - *Council Housing Estates*: Harper's Fields High-Rise & Gower Estate (estate casuals scouting, graffiti murals, safehouses).
     - *Posh Quarters*: St. James's Crescent Villas & Marina Lofts (director protests, luxury security rackets).
     - *Industrial Sidings*: Oakhurst Gasworks & Freight Sidings (off-grid 8v8 rumble grounds with zero CCTV).
   - Prosperity Progression: Unlocks new tiers (1 to 5) as the club wins matches and expands city prestige.
5. **SFS v0.1 Universe & Unified Bridge**:
   - Supports all **26 clubs** across the **Big Time League (Tier 1, 14 clubs)** and **Up and Comers (Tier 2, 12 clubs)**.
   - SFS Firm Roles: `Top Boy`, `Face`, `Minder`, `Runner`, `Nutter`.
   - Data Contracts: `FirmIntegrationState`, `MatchResultEvent`, `FirmClashEvent`, and `Team` interface extension.
   - Single Master Save strategy (`firmIntegration` inside `Team`).
6. **The Stronghold (Pub HQ) & Territory Network**:
   - Territory control map: The Local Pub, Station Platform, High Street Underpass, Stadium Turnstiles.
   - Fortify defense levels, collect weekly revenue, recruit promising casuals.
7. **Matchday Gazette & Audio FX**:
   - Sunday newspaper report with headlines, casualty lists, police blotter, and zero-dependency canvas confetti.
   - Web Audio API synthesizer for punches, terrace chants, police sirens, whistles, and flares.
   - Persistence via `localStorage` under key `firm_u_lator_save_sfs_v2`.

---

## 2. File Index

```
docs/
  firm-unification-design.md   # Official SFS v0.1 <-> Firm U-Lator unification blueprint
src/
  App.tsx                      # App root: campaign state, modal routing, storage sync, clash flow
  main.tsx                     # React 19 entry point
  index.css                    # Tailwind CSS entry
  types/
    game.ts                    # Complete TypeScript definitions (Lad, Firm, Tactics, TravelPlan, etc.)
    firmIntegration.ts         # SFS v0.1 shared data contracts, Team interface & bridge events
    city.ts                    # City districts, venues, prosperity tiers, and urban ecology
  data/
    initialData.ts             # 26 SFS clubs, initial lads roster, season fixtures, news, territories
    cityData.ts                # City venues across clubs, pubs, restaurants, estates, posh quarters
  services/
    sound.ts                   # Web Audio API sound synthesizer (hits, sirens, whistles, chants, flares)
  utils/
    confetti.ts                # Zero-dependency HTML5 canvas confetti particle engine
  components/
    Navbar.tsx                 # Top Bar Contract compliant header with stats ticker and City tab
    CityView.tsx               # City & Districts view: pubs, clubs, restaurants, estates, posh quarters
    OfficeView.tsx             # Manager's desk: next match preview, loyalty gauge, news wire, quick actions
    SquadView.tsx              # "The Lads" roster: stats, traits, boxing gym, hill sprints, physio, solicitors
    TacticsView.tsx            # Tactics board: 2D street pitch visualizer, formation presets, directives
    AwayTravelPlanner.tsx      # Away day logistics: transport, pub strategy, timing, contraband
    LeagueView.tsx             # The Casuals Division 1 table, club dossiers, season fixtures schedule
    PubHqView.tsx              # The Stronghold: territory fortification, revenue, and casual recruiting
    ClashEngine.tsx            # Real-time tactical fight engine with commentary ticker & shouts
    PostClashReport.tsx        # Sunday newspaper match report, casualties, arrests, and rewards
    ClubSelectModal.tsx        # 26 SFS clubs selection modal with division and region filters
    FirmPhoneCallOverlay.tsx   # SFS v0.1 incoming Top Boy phone call wire overlay
  assets/images/
    city_districts_map_*.jpg   # Retro pixel/painted map of British industrial football city
    firmulator_hero_banner_*.jpg # Rainy Victorian football stadium matchday banner
    firm_crest_insignia_*.jpg    # Gritty vintage casuals heraldic shield badge
    firm_pub_exterior_*.jpg      # The Red Lion corner pub exterior
```

---

## 3. Context for Next AI Session

- **Save Key**: `firm_u_lator_save_sfs_v2` in browser `localStorage`.
- **Port**: Must stay on 3000 (`vite --port=3000 --host=0.0.0.0`).
- **No external confetti packages**: Use `src/utils/confetti.ts` (avoids ESM CommonJS bundle crashes).
- **Audio Context**: `SoundService` in `src/services/sound.ts` uses lazily initialized Web Audio API.
- **SFS Consistency**: When adding new features or clubs, refer to `Big Time League` (14) and `Up and Comers` (12) from `initialData.ts`.
