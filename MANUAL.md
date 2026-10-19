# Firm U lator v0.1 — The Player's Manual

> A complete tactical guide to football firm management, away day logistics, fan loyalty, and street clash strategy.  
> Official Hooligan Companion Mod for **SFS v0.1 ("Super Football Simulator")**.

---

## Table of Contents

- [Part 1 — Introduction](#part-1--introduction)
  - [1.1 What Firm U lator is](#11-what-firm-u-lator-is)
  - [1.2 The Core Loop](#12-the-core-loop)
  - [1.3 The 26 SFS Football Clubs](#13-the-26-sfs-football-clubs)
- [Part 2 — The Roster: The Lads](#part-2--the-roster-the-lads)
  - [2.1 The SFS Firm Roles](#21-the-sfs-firm-roles)
  - [2.2 Combat & Street Attributes](#22-combat--street-attributes)
  - [2.3 Special Traits](#23-special-traits)
  - [2.4 Training, Physical Rehabilitation & Solicitors](#24-training-physical-rehabilitation--solicitors)
- [Part 3 — Tactics Board & Formations](#part-3--tactics-board--formations)
  - [3.1 The Five Formations](#31-the-five-formations)
  - [3.2 Terrace Directives & Sliders](#32-terrace-directives--sliders)
  - [3.3 Weapon & Flare Doctrines](#33-weapon--flare-doctrines)
  - [3.4 Frontline Selection](#34-frontline-selection)
- [Part 4 — Away Game Travel Planning](#part-4--away-game-travel-planning)
  - [4.1 Modes of Transport](#41-modes-of-transport)
  - [4.2 Pre-Match Watering Holes & Territory Choice](#42-pre-match-watering-holes--territory-choice)
  - [4.3 Arrival Timing](#43-arrival-timing)
  - [4.4 Contraband & Logistics Kit](#44-contraband--logistics-kit)
- [Part 5 — The Matchday Clash Engine](#part-5--the-matchday-clash-engine)
  - [5.1 Clash Phases](#51-clash-phases)
  - [5.2 The 2D Tactical Pitch](#52-the-2d-tactical-pitch)
  - [5.3 Live Commentary Feed](#53-live-commentary-feed)
  - [5.4 Touchline & Pavement Shouts](#54-touchline--pavement-shouts)
  - [5.5 The Police Vanguard Radar](#55-the-police-vanguard-radar)
  - [5.6 Resolution & The Sunday Gazette Report](#56-resolution--the-sunday-gazette-report)
  - [5.7 SFS 3D ASCII Renderer Integration](#57-sfs-3d-ascii-renderer-integration)
- [Part 6 — Terrace Culture & Fan Loyalty](#part-6--terrace-culture--fan-loyalty)
  - [6.1 Loyalty Tiers](#61-loyalty-tiers)
  - [6.2 Street Respect Points](#62-street-respect-points)
  - [6.3 Police Tactical Heat](#63-police-tactical-heat)
  - [6.4 The Top Boy Phone Wire](#64-the-top-boy-phone-wire)
- [Part 7 — The Stronghold & Territories](#part-7--the-stronghold--territories)
  - [7.1 Territorial Control Points](#71-territorial-control-points)
  - [7.2 Fortifying Defenses](#72-fortifying-defenses)
  - [7.3 Scouting & Recruiting Casuals](#73-scouting--recruiting-casuals)
- [Part 8 — Black Market & Contraband Trading](#part-8--black-market--contraband-trading)
  - [8.1 Cargo Manifest & Goods Types](#81-cargo-manifest--goods-types)
  - [8.2 Transit Routes & Travel Police Stops](#82-transit-routes--travel-police-stops)
  - [8.3 The Away Market & Heat Accumulation](#83-the-away-market--heat-accumulation)
  - [8.4 Police Raid & Asset Confiscation (>50 Heat)](#84-police-raid--asset-confiscation-50-heat)
- [Part 9 — The City & Urban Ecology](#part-9--the-city--urban-ecology)
  - [9.1 The Six Urban Districts](#91-the-six-urban-districts)
  - [9.2 Club Success & Dynamic Growth Tiers](#92-club-success--dynamic-growth-tiers)
  - [9.3 Council Housing Estate Recruitment](#93-council-housing-estate-recruitment)
- [Part 10 — Door Security: The Night Job](#part-10--door-security-the-night-job)
  - [10.1 Venue Control States & Takeovers](#101-venue-control-states--takeovers)
  - [10.2 Assigning Door Minders & Wages](#102-assigning-door-minders--wages)
  - [10.3 Resolving Nightlife Door Events](#103-resolving-nightlife-door-events)
- [Part 11 — Territory Wars: The Map](#part-11--territory-wars-the-map)
  - [11.1 The Five City Zones & Dominance](#111-the-five-city-zones--dominance)
  - [11.2 Declaring a War (100 Heat Cost)](#112-declaring-a-war-100-heat-cost)
  - [11.3 The 3-Day War Campaign](#113-the-3-day-war-campaign)
  - [11.4 Victory Perks & Defeat Fallout](#114-victory-perks--defeat-fallout)
- [Part 12 — Appendices](#part-12--appendices)
  - [Appendix A: SFS Club & Firm Reference](#appendix-a-sfs-club--firm-reference)
  - [Appendix B: Formation Cheat Sheet](#appendix-b-formation-cheat-sheet)
  - [Appendix C: Subsystem Interaction Matrix](#appendix-c-subsystem-interaction-matrix)

---

# Part 1 — Introduction

## 1.1 What Firm U lator is

In the retro football management simulation **SFS v0.1**, you manage tactics, formations, and pitch results inside the stadium. **Firm U lator** is the other half of the matchday experience: you manage the football firm that follows the club across England.

Matches between clubs become clashes between their respective firms. Winning a clash earns street respect, elevates terrace fan loyalty, and claims territory around railway stations and pubs. Losing damages firm morale, lands lads in the hospital, and invites police scrutiny.

## 1.2 The Core Loop

A typical matchday cycle follows four distinct phases:

```
  ┌─────────────────────────────────────────────────────────┐
  │ 1. THE OFFICE & ROSTER                                  │
  │    Check police surveillance, train lads in the gym,    │
  │    rehabilitate injuries, and answer phone wire calls.  │
  └────────────────────────────┬────────────────────────────┘
                               │
  ┌────────────────────────────▼────────────────────────────┐
  │ 2. TACTICS & AWAY PLANNING                              │
  │    Set your formation (Wedge, Phalanx, Pincer), select  │
  │    aggression, charter minibuses or trains, and pack     │
  │    marine purple smoke flares.                          │
  └────────────────────────────┬────────────────────────────┘
                               │
  ┌────────────────────────────▼────────────────────────────┐
  │ 3. THE MATCHDAY CLASH                                   │
  │    Deploy on the cobblestones. Shouting tactical orders │
  │    while keeping an eye on approaching police sirens.   │
  └────────────────────────────┬────────────────────────────┘
                               │
  ┌────────────────────────────▼────────────────────────────┐
  │ 4. THE SUNDAY GAZETTE                                   │
  │    Read the newspaper report, treat casualties, bail    │
  │    detained lads, and collect pub territory profits.    │
  └─────────────────────────────────────────────────────────┘
```

## 1.3 The 26 SFS Football Clubs

Firm U lator features all **26 clubs** from SFS v0.1, divided into two leagues:
- **Big Time League (Tier 1, 14 Clubs)**: Northwood United, Kingsbridge Ath., Westport City, Riverside FC, Eastgate Rovers, Stonebridge Park, Highbury Olympic, Southbank Town, Crown Heights, Ashford Town, Harbourview FC, Redcliffe Albion, Greystone Athletic, Blackwood Forest.
- **Up and Comers (Tier 2, 12 Clubs)**: Millwall Cross, Oakwood Athletic, Portside Rangers, Ironforge City, Valley United, Brookline FC, Hilltop Wanderers, Docklands Celtic, Meadow Vale, Sunbury Rovers, Heathfield Town, Bayview Park.

You can switch your managed firm to any of the 26 clubs at any time via the **"Switch Club"** button.

---

# Part 2 — The Roster: The Lads

Your squad consists of fighters with distinct roles, attributes, and traits.

## 2.1 The SFS Firm Roles

| Role | Nickname | Function on the Pavement |
|---|---|---|
| **Top Boy** | Commander | The firm's leader. Nearby lads receive a $+12\%$ Bottle aura. Directs tactical shouts during clashes. |
| **Face** | The Diplomat | Smooth-talking operator. Handles phone wires, scouts rival pubs, and mitigates police interrogation heat. |
| **Minder** | The Shield | Heavyweight enforcer. Absorbs initial collision momentum and prevents leaders from being swarmed. |
| **Runner** | The Scout | High sprint pace. Delivers calling cards, cuts off enemy flank retreats, and outruns police kettles. |
| **Nutter** | The Berserker | Volatile fighter with massive strike power. Can shatter enemy lines, but accumulates high legal heat. |

## 2.2 Combat & Street Attributes

- **Hardness (1–100)**: Physical combat strength, punch impact, and resistance to being knocked down.
- **Bottle (1–100)**: Mental courage under pressure. When Bottle falls below $20\%$, a lad panics and steps backward.
- **Pace (1–100)**: Running speed across alleys and speed of flank encirclements.
- **Street Smarts / Nouse (1–100)**: Ability to spot plain-clothes police spotters, evade CCTV, and navigate backstreets.
- **Loyalty (1–100)**: Dedication to the firm. High loyalty prevents lads from defecting or staying home on rainy away days.
- **Health (0–100%)**: Current physical state. Lads below $40\%$ become bruised or hospitalised and require medical care.
- **Legal Heat (0–100%)**: Police watch score. Lads above $60\%$ risk Section 60 stop-and-search bails or banning orders.

## 2.3 Special Traits

Each lad carries an authentic personality trait, for example:
- **Commanding Presence**: Boosts firm bottle during standoffs.
- **Iron Jaw**: Reduces damage taken from frontline charges.
- **Alley Sprinter**: Guarantees escape from police cordons.
- **Pavement Anchor**: Immovable on wet cobblestones; prevents forward line collapse.
- **Terrace Chanter**: Intimidates rival firm during the standoff, lowering rival bottle.
- **CCTV Dodger**: Avoids detection cameras, keeping personal legal heat low.

## 2.4 Training, Physical Rehabilitation & Solicitors

From **The Lads** tab, select any lad to access development options:
1. **Boxing Gym (Free)**: Sparring on heavy bags improves Hardness ($+2$) at the cost of stamina.
2. **Hill Sprints (Free)**: Conditioning improves Pace ($+2$) and Stamina ($+3$).
3. **Pub Lock-in (£40)**: Pints with the firm boost Bottle ($+3$) and Loyalty ($+4$).
4. **Private Physio (£90)**: Restores health to $100\%$ without filing records with NHS police hospital logs.
5. **Retain Terrace Solicitor (£180)**: Argues technical bail violations at magistrates court, dropping Legal Heat by $-40\%$ and clearing bail restrictions.

---

# Part 3 — Tactics Board & Formations

## 3.1 The Five Formations

| Formation | Structure | Best Used For |
|---|---|---|
| **The Wedge** | Heavy triangular spearhead with Minders at the point. | Punching directly through enemy frontline centers. |
| **Flat Phalanx** | Evenly spaced wall across the full width of the pavement. | High defensive stability against frontal charges. |
| **Pincer Flank** | Veterans lock the center while fast Runners sweep wide. | Encircling rival flanks in open station squares. |
| **Box Retain** | Tight defensive square protecting injured lads and Top Boy. | Resisting police kettles and holding fortified doors. |
| **Alley Ambush** | Scout lures enemies into a narrow alley chokepoint. | Inflicting devastating surprise damage in tight spaces. |

## 3.2 Terrace Directives & Sliders

- **Aggression Level (1 to 5)**:
  - *1 - Canny & Defensive*: Hold ground, conserve stamina, wait for counter-punch.
  - *3 - Standard Terrace*: Balanced strikes and steady pressure.
  - *5 - Red Mist All-Out*: Relentless forward assault. High damage inflicted and sustained.
- **Line Depth**:
  - *Deep Hold*: Station entrance / pub doorway.
  - *Mid Pavement*: Open street warfare.
  - *High Press*: Forward rush onto rival territory.
- **Retreat Threshold (10% to 60%)**: Team health percentage trigger where the Top Boy sounds the dispersal whistle.

## 3.3 Weapon & Flare Doctrines

- **Strictly Fists & Boots**: Old-school honorable terrace scrap. Maximum pure street respect; lowest legal heat.
- **Pint Glasses & Ashtrays**: Improvised pub weaponry. Stuns enemy frontlines; raises police heat moderately.
- **Smoke Bombs & Marine Flares**: Blinds opposing firm, disorients charges, provides cover for tactical retreats.
- **Heavy Belts & Scaffolding**: Devastating shock strikes. Extreme casualties and immediate riot squad mobilization.

---

# Part 4 — Away Game Travel Planning

## 4.1 Modes of Transport

| Mode | Cost | Stealth | Loyalty | Risk Analysis |
|---|:---:|:---:|:---:|---|
| **The Football Special (Rail)** | £220 | 15% | +20% | High attendance numbers and great camaraderie; heavy Transport Police presence at terminals. |
| **Chartered Minibuses** | £320 | 45% | +15% | Balanced convoy of 4 vans; can stop at motorway service stations for ambush. |
| **Sneak Convoy (Private Cars)** | £450 | 70% | +25% | Unmarked cars in designer casuals; infiltrates straight into enemy pub territory undetected. |
| **Official Supporters Coach** | £180 | 10% | +8% | Safest from brawls, but police escort deposits you into the sterile turnstile pen. |

## 4.2 Pre-Match Watering Holes & Territory Choice

- **Neutral Spoons**: Safe pints, low police profile, modest street respect.
- **The Enemy Local Stronghold**: Storming their home pub! Massive street respect bonus ($+80$ pts) if won, but extreme brawl risk.
- **Railway Station Vaults Tap**: Classic transit battleground with immediate rail escape routes.
- **Private Hired Backroom**: Complete privacy to conduct final pre-match briefings.

## 4.3 Contraband & Logistics Kit

- **Marine Purple Flares (£25/ea)**: Smoke cover that disrupts enemy charges.
- **Trauma First Aid Bags (£20/ea)**: Quick field dressing to reduce post-clash hospitalizations.
- **Spotter Scouts Ahead (£80)**: Advanced lookouts that detect police riot vans early.
- **24/7 Solicitor Standby (£120)**: Immediate station bail assistance if lads are detained.

---

# Part 5 — The Matchday Clash Engine

## 5.1 Clash Phases

1. **The Standoff & Chants (0'–10')**: Firms size each other up. Songs and insults test Bottle.
2. **The Frontline Collision (10'–50')**: Shock punch as formations collide on cobblestones.
3. **The Scramble & Flanks (50'–75')**: Runners attempt encirclement; flares ignite.
4. **Resolution or Dispersal (75'–90')**: One firm breaks and flees, or police sirens force a retreat.

## 5.2 Touchline & Pavement Shouts

As manager, you can shout real-time tactical commands:
- **"PUSH THE LINE!"**: Drives forward strike momentum and forces rival line back.
- **"HOLD THE GROUND!"**: Locks arms, recovering team bottle ($+12\%$).
- **"TARGET THEIR TOP BOY!"**: Directs all attacks at the rival leader to break firm morale.
- **"POP PURPLE FLARE!"**: Detonates a smoke bomb, blinding rival fighters.
- **"DISPERSE!"**: Sounds whistle to scatter down side alleys before riot vans arrive.

## 5.3 The Police Vanguard Radar

A live ETA gauge tracks approaching police vans. When distance drops below $30\%$, two-tone sirens echo down the street. If the timer reaches zero before the clash ends, Tactical Support Units deploy dogs and vans, dispersing the fight and arresting exposed lads.

## 5.7 SFS 3D ASCII Renderer Integration

The matchday clash engine features a real-time **3D ASCII Viewport** adapted directly from the SFS v0.1 base engine (`src/renderers/asciiLibRenderer.ts`):
- **Live View Switcher**: Toggle fluidly between the iconic **SFS 3D ASCII Renderer** and the **2D Tactical Pitch** during live clashes.
- **Raycast Ground Environments**:
  - *High Street Cobbles*: Wet Victorian stone flags with curbs and rain sheens.
  - *Railway Station Platforms*: Steel train tracks, gravel ballast, and platform edges.
  - *Sticky Pub Carpets*: Beer-stained floral tavern patterns and floorboards.
- **3D Casual Figures**: Skeletal capsules represent lads and rivals in dark jeans, trainers, and designer Stone Island coats with shoulder badges.
- **Camera Perspectives**:
  - *Hero Cam*: Locks onto the Top Boy, smoothly following frontline movements.
  - *Broadcast Cam*: Elevated sideline view of the full street battle.
  - *Follow Cam*: Over-the-shoulder chase angle behind the frontline charge.

---

# Part 6 — Terrace Culture & Fan Loyalty

## 6.1 Loyalty Tiers

- **Diehards (Inner Circle)**: Unconditional loyalty. Will never flee or talk to police.
- **Away Day Veterans**: Travel to tough northern trips. High composure under brick barrages.
- **Weekend Casuals**: Turn up for local derbies. Morale drops if the firm loses badly.
- **Youth Ultras**: High energy young casuals eager to prove themselves with flares.

## 6.2 The Top Boy Phone Wire

Periodically, the Top Boy will phone you via the **Firm Phone Call Wire**:
- Urgent situations require your decision: ambushing rival coaches, circumventing Section 60 cordons, or accepting private industrial estate challenges.
- Backing the firm elevates loyalty ($+10\%$) and respect; advising caution protects against legal heat.

---

# Part 7 — The Stronghold & Territories

From **The Stronghold** tab, manage your home pub headquarters:
- **Fortify Properties**: Upgrade defense levels at The Local Pub, Station Platform, and Turnstiles to increase weekly cash yield.
- **Recruit Casuals (£120)**: Bring fresh young blood from local estates into the firm as Runners, Minders, or Nutters.
- **HQ Facilities**: Construct boxing heavy bags, terrace merch printing presses, and spotter networks.

---

# Part 8 — Black Market & Contraband Trading

## 8.1 Cargo Manifest & Goods Types

Before away trips, the firm can conduct high-risk, high-reward black market trading runs from the **Cargo & Black Market** sub-tab in **Away Travel**:
- **Cargo Hold**: The firm van or coach boot holds up to **50 units** of smuggled goods.
- **Three Tiers of Contraband**:
  - **Bootleg Goods**: Pirate Derby tapes, knitted bar scarves, white-label acid house vinyl.
    * *Buy*: £12–£22 | *Sell*: £28–£50 | *Heat*: +4–6 per unit.
    * *Profile*: Low entry cost, high reliability, safe profit margins.
  - **Contraband Goods**: Vintage Italian tracktops (Tacchini & Fila), smuggled Trappist lager crates, surplus marine smoke flares.
    * *Buy*: £32–£48 | *Sell*: £80–£115 | *Heat*: +12–16 per unit.
    * *Profile*: Standard terrace black market items. Triples investment with moderate attention.
  - **Premium Street Contraband**: Deadstock 1988 Stone Island ice coats, imported Swiss chronograph tickers.
    * *Buy*: £95–£145 | *Sell*: £245–£380 | *Heat*: +22–28 per unit.
    * *Profile*: Extreme profit yields; heavy customs and vice squad scrutiny.

## 8.2 Transit Routes & Travel Police Stops

Choose your transport transit route carefully:
- **Motorway (M-Ways)**: Fast transit with standard motorway service station stops. Moderate risk of police traffic patrols.
- **A-Roads**: Backroads and bypasses. Low detection risk and high stealth, but slower transit.
- **Train Network**: British Rail Football Specials. High terrace morale, but heavy British Transport Police presence at terminal platforms.
- **Travel Events**: Random events can trigger on the road (police stop & search, bribing customs sergeants, sniffer dogs, or clean runs).

## 8.3 The Away Market & Heat Accumulation

- Upon arriving at the away city, the **Away Street Market** opens (`<AwayMarketModal />`).
- Unload goods individually or liquidate the entire boot in one click.
- Cash from sales flows directly into the firm treasury.
- Selling smuggled contraband increases **Away City Heat** ($0\text{--}100$).

## 8.4 Police Raid & Asset Confiscation (>50 Heat)

- If Away City Heat exceeds **50/100**, police spotters flag the firm assembly.
- Upon initiating the matchday clash, **Operation Tactical Sweep** triggers automatically:
  - The clash is **CANCELLED** by riot police cordons.
  - **50% of the firm's liquid treasury is confiscated** under the Proceeds of Crime Act.
  - The firm suffers $-25$ Street Respect and $-10\%$ Loyalty.
  - *Manager Rule*: Keep contraband sales measured to stay under the 50 heat threshold before derby matches!

---

# Part 9 — The City & Urban Ecology

## 9.1 The Six Urban Districts

Access **The City** tab to view your club's home metropolitan sprawl across six district sectors:
1. **Pubs & Alehouses**: Traditional assembly points with rowdy taprooms and local ales.
2. **Nightclubs & Raves**: Acid house discotheques, warehouse raves, and high-take door venues.
3. **Caffs & Bistros**: Corner fry-ups, pie & mash shops, and strategy meeting locations.
4. **Council Housing Estates**: Concrete tower blocks; the raw street talent pipeline.
5. **Posh Quarters**: Upscale restaurants, boutiques, and luxury sports car showrooms.
6. **Industrial Sidings**: Canal towpaths, scrap yards, and container depots for secluded rumbles.

## 9.2 Club Success & Dynamic Growth Tiers

The city grows organically as your football club wins matches in SFS v0.1:
- Winning league matches awards $+4$ to the **Urban Prosperity Score** ($0\text{--}100$).
- Advancing through prosperity scores promotes the city across 5 historical stages:
  - *Tier 1: Gritty Mill Town*
  - *Tier 2: Developing Industrial Hub*
  - *Tier 3: Booming Regional Centre*
  - *Tier 4: Prosperous Metro*
  - *Tier 5: Cosmopolitan Football Capital*
- Each tier unlocks new commercial venues, higher weekly revenues, and wealthier away fan targets.

## 9.3 Council Housing Estate Recruitment

Use the **Estate Casuals Draft** shortcut in the Council Estate district to scout young local street fighters into your squad:
- **+ Runner (£80)**: High sprint pace and alley escape instincts.
- **+ Minder (£110)**: Heavyweight street bouncer with natural hardness.
- **+ Nutter (£130)**: Fearless terrace warrior with maximum bottle and punch power.

---

# Part 10 — Door Security: The Night Job

## 10.1 Venue Control States & Takeovers

Under the **Door Security (The Night Job)** sub-tab, the firm manages nightclub and pub door security:
- **Uncontrolled**: Neutral premises; rival firms operate freely; zero door revenue.
- **Controlled**: Your firm minders run the ropes; collects weekly door cut (`weeklyTake`).
- **Contested**: Rival firm is actively trying to muscle into the door take.

### Takeover Methods
1. **Hostile Takeover**: Stage a violent door scrap to eject current security. Instant street clash.
2. **Bribe the Owner (£450)**: Slip a brown envelope to the licensee for an immediate peaceful door contract.
3. **Intimidate the Owner**: Requires $\ge 450$ Street Respect. The owner folds under your firm's reputation.

## 10.2 Assigning Door Minders & Wages

- Assign active Casuals from your squad to work venue doors.
- Key Minder Attributes:
  - **Hardness (STR)**: Resists aggressive punters and controls queues.
  - **Bottle (Courage)**: Stands tall when outnumbered by rival crews.
- **Staff Wages**: Each active minder costs **£150 / week**, automatically deducted from the treasury during Sunday morning settlement.
- **Net Profit**: Total weekly door revenue equals gross venue door cuts minus total minder wages.

## 10.3 Resolving Nightlife Door Events

Controlled doors experience weekly confrontations via the `<DoorEventModal />`:
- **The Unruly Punter**: Drunk rival lad tries pushing past the ropes.
  - *Turn him away*: Requires Bottle $\ge 65$; protects door respect.
  - *Let him in*: Avoids a scrap, but patrons lose respect ($-20$ Respect).
  - *Alley lesson*: Enforces respect with fists (+30 Respect; triggers a mini-brawl).
- **The Police Licensing Inspection**: Local vice squad arrives.
  - *Bribe Sergeant (£500)*: Keeps premises off the radar ($-15$ Police Heat).
  - *Refuse Entry*: Stand on legal rights (+20 Respect; $+20$ Police Heat).
  - *Stall for time*: Hide backroom contraband; neutral outcome.
- **Rival Top Boy Confrontation**: Rival firm lieutenant demands 50% of the door.
  - *Stand Ground*: Calls the lads to meet them head-on; triggers an instant street clash!
  - *Back Down*: Surrender the door; venue reverts to uncontrolled or rival ownership.
  - *Pay Protection (£400)*: Temporary truce payment.

---

# Part 11 — Territory Wars: The Map

## 11.1 The Five City Zones & Dominance

Under the **Territory Wars (The Map)** sub-tab, monitor city dominance across 5 key zones:
1. **The Stadium Quarter**: Turnstiles & matchday epicenter.
   * *Perk*: $+25\%$ Fan loyalty & home matchday advantage.
2. **The High Street**: Busy retail strip & high-take commercial bars.
   * *Perk*: $+£350$ Weekly commercial door revenue bonus.
3. **The Station Approach**: Railway arches & transport choke-points.
   * *Perk*: Early away fan detection ($+20$ Stealth on away trips).
4. **The Docks**: Waterfront container depots & smuggling wharves.
   * *Perk*: $+30\%$ Contraband hold capacity & lower buy prices.
5. **The Council Estate**: High-rise residential precinct.
   * *Perk*: $-30\%$ Recruitment cost for Minders and Nutters.

*Dominance Rule*: Controlling venues and deploying minders increases your dominance percentage ($0\text{--}100\%$). Holding $>50\%$ dominance awards full territorial control and activates the strategic perk.

## 11.2 Declaring a War (100 Heat Cost)

- When targeting a rival-held territory, click **"Declare War"**.
- **Declaration Cost**: Spikes Police Heat by **+100%** across the city.
- **Council of War**: Commit up to **20 Casuals** from your roster to fight the campaign.

## 11.3 The 3-Day War Campaign

Territory Wars are not single scraps; they are multi-day tactical campaigns:
- **Day 1: Street Skirmishes**: Fast-paced 1v1 scout duels down back alleys to break perimeter lookouts.
- **Day 2: Industrial Brawl**: 8v8 arranged rumble in warehouse container yards away from police patrols.
- **Day 3: Primary Pub Raid**: Full-firm storming of the rival stronghold taproom.

## 11.4 Victory Perks & Defeat Fallout

- **Win 2 of 3 Clashes**:
  - The territory is **SEIZED**.
  - Dominance surges to $75\text{--}80\%$; rival presence is shattered.
  - **+75 Street Respect**, **+15% Fan Loyalty**.
  - **+20% Permanent Revenue Boost** to all venues in that territory.
- **Lose 2 of 3 Clashes**:
  - Campaign fails; rival firm cements its grip.
  - $-40$ Street Respect, $-15\%$ Loyalty.
  - Committed lads suffer injuries and hospitalizations.

---

# Part 12 — Appendices

## Appendix A: SFS Club & Firm Reference

| Club | Firm Name | Region | Tier | Stronghold Pub |
|---|---|---|---|---|
| **Northwood United** | Northwood Red Legion | Northern | Tier 1 | The Red Lion (High St) |
| **Kingsbridge Ath.** | Kingsbridge Gold Vanguard | Midlands | Tier 1 | The Crown & Anchor |
| **Westport City** | Westport Dockside Firm | Coastal | Tier 1 | The Quayside Mariner |
| **Riverside FC** | Riverside Blue Patrol | Southern | Tier 1 | The Bridge Tavern |
| **Eastgate Rovers** | Eastgate Rovers Crew | Midlands | Tier 1 | The Locomotive Arms |
| **Stonebridge Park** | Stonebridge Steamers | Midlands | Tier 1 | The Iron Works |
| **Highbury Olympic** | Olympic Highbury Herd | Midlands | Tier 1 | The Olympic Vaults |
| **Southbank Town** | Southbank Town Cutters | Southern | Tier 1 | The Thames Waterman |
| **Crown Heights** | Crown Heights Mob | Southern | Tier 1 | The Sovereign Tap |
| **Ashford Town** | Ashford Northern Anvils | Northern | Tier 1 | The Blacksmiths Arms |
| **Harbourview FC** | Harbourview Pier Cutters | Coastal | Tier 1 | The Old Pier Hotel |
| **Redcliffe Albion** | Redcliffe Albion Miners | Northern | Tier 1 | The Colliery Tavern |
| **Greystone Athletic** | Greystone Quarry Crew | Northern | Tier 1 | The Granite Quarry Inn |
| **Blackwood Forest** | Blackwood Foresters | Northern | Tier 1 | The Royal Oak (Blackwood) |
| **Millwall Cross** | Millwall Cross Bushwackers | Southern | Tier 2 | The Den Bushwacker |
| **Oakwood Athletic** | Oakwood Iron Casuals | Midlands | Tier 2 | The Old Oak Inn |
| **Portside Rangers** | Portside Marine Mob | Southern | Tier 2 | The Navigators Tap |
| **Ironforge City** | Ironforge Steamers | Coastal | Tier 2 | The Blast Furnace |

## Appendix B: Formation Cheat Sheet

- **The Wedge**: Best against open lines; weak against alley ambushes.
- **Flat Phalanx**: Best against frontal charges; weak against dual flank pincers.
- **Pincer Flank**: Best in wide station squares; weak against tight defensive boxes.
- **Box Retain**: Best against superior numbers and police kettles; low forward strike power.
- **Alley Ambush**: Best for baiting aggressive firms into chokepoints.

## Appendix C: Subsystem Interaction Matrix

| Subsystem | Driven By | Outputs / Influences | Key Failure State |
|---|---|---|---|
| **SFS Football Engine** | Tactical board & player form | Fan Loyalty, City Prosperity Index | Club relegation; fan apathy |
| **3D ASCII Clash Renderer** | Pinhole camera & raycasting | Visual battle immersion, Hero tracking | Dispersal by police sirens |
| **Black Market Trading** | Away transit & cargo manifest | Firm treasury, Away City Heat | Police Raid confiscation (>50 heat) |
| **Urban Ecology (City)** | Football team win streaks | Venue unlocks, district prosperity | Stagnant town tier from club losses |
| **Door Security** | Door Minders (Hardness/Bottle) | Weekly door takes minus £150 wages | Door takeover by rival firm |
| **Territory Wars** | Multi-day campaigns (20 Lads) | Sector dominance (50%+), strategic perks | Hospitalized lads, $-40$ respect |

---

*Firm U lator v0.1 — Stand your ground, run the doors, plan your away days, and honor the colors.*

