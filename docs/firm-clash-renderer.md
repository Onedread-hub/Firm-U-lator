# SFS v0.1 ASCII 3D Renderer Integration — Firm Clash Subsystem

**Document Version**: 1.0.0  
**Target Systems**: SFS v0.1 ASCII 3D Engine (`src/renderers/asciiLibRenderer.ts`) & Firm U-Lator  
**Purpose**: Architectural design adapting the SFS 11-a-side pinhole projection and ray-cast ground renderer into the tactical 3D terrace clash renderer.

---

## 1. Architectural Overview

The SFS v0.1 Base Engine features a proprietary 3D ASCII rendering pipeline that projects 3D world entities into an 80×30+ terminal character cell matrix with depth buffering (Z-Buffer). Rather than building an isolated graphics stack for Firm U-Lator, the firm clash visualization directly adopts and re-skins this engine.

```
┌────────────────────────────────────────────────────────────────────────┐
│                         SFS ASCII 3D ENGINE                            │
│  - Pinhole Camera Math (Perspective Divide, Aspect Correction)         │
│  - Ray-cast Planar Ground (Y=0, Inverse Distance Scanlines)            │
│  - Depth-tested ASCII Blitter & Z-Buffer (Occlusion Sorting)           │
│  - Skeletal Capsule Drawing (Head, Torso, Limbs, Distance LOD)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ ADAPTATION & RE-SKIN
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FIRM CLASH 3D ENGINE                            │
│  1. Pitch  ───────────────►  Street Cobblestone / Station / Pub Carpet │
│  2. Footballers ──────────►  Terrace Casuals in Stone Island Jackets  │
│  3. Football ─────────────►  Weapon / Objective (Purple Flare, Flag)  │
│  4. Match Camera ─────────►  Hero (Top Boy Focus) / Sideline Broadcast │
│  5. 60 FPS Loop ──────────►  Real-time Melee Collisions & Frontlines   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The Four Engine Adaptations

### 2.1 The Pitch Becomes Street, Station, or Pub

In the football engine, the raycast ground evaluates football pitch geometry (touchlines, penalty boxes, alternating grass stripes). In the Firm Clash engine, the ground plane texture changes dynamically based on the venue:

1. **The High Street / Cobblestone Alley (`'cobblestone'`)**:
   - Procedural rectangular pavers with mortar joints.
   - Rain sheen reflections mapped through sinusoidal surface noise.
   - Raised granite curbs (`=`) separating the roadway from raised pavement slabs (`░`).
   - Victorian rowhouse and brick factory silhouettes along the horizon.
2. **The Railway Station Platform (`'railway_station'`)**:
   - Parallel steel railway tracks (`║`) laid on wooden sleeper ties (`▬`) with crushed gravel ballast (`·`).
   - Raised concrete platform edge with bright yellow warning demarcation lines (`═`).
3. **The Local Pub Interior (`'pub_carpet'`)**:
   - Retro geometric patterned wool carpet (`❖`, `░`, `·`) with sticky beer sheen.
   - Wooden floorboards, sawdust patches, and fallen bar stools.

### 2.2 The Footballers Become Casuals

The SFS skeletal figure system renders players using a hierarchy of capsules:
- **Head**: Character glyph `@` or `O` with skin/beanie coloring.
- **Torso**: In football, rendered in 2-color club kits. In the firm clash, rendered in authentic 1980s/90s terrace casual apparel:
  - Stone Island weatherproof coats (navy, olive, black, ice jackets).
  - CP Company goggle jackets and Sergio Tacchini tracktops.
  - The iconic **Stone Island compass badge (`◆`)** rendered in yellow/green on the left arm capsule.
- **Legs**: Dark wash denim, corduroy, and gum-soled trainers (`▲`).
- **Dynamic Poses**:
  - `guard`: Arms raised in defensive boxing stance (`╱ ╲`).
  - `punch`: Forward striking punch with lunging arm (`━ ►`).
  - `run`: Flanking sprint with separated legs (`╱ ╲`).
  - `knocked_down`: Grounded casualty awaiting medical attention (`— —`).

### 2.3 The Ball Becomes an Objective / Weapon

In SFS, the primary 3D point entity is the spinning leather football. In a firm clash, this central focus entity shifts according to tactical state:
- **Purple Marine Flare (`'flare'`)**: Emits bright pink/violet light (`*`) surrounded by drifting smoke clouds (`☁`, `░`). Drops visibility and breaks opponent line of sight.
- **Terrace Colors / Firm Flag (`'flag'`)**: High-value trophy held by the Top Boy. If captured or dropped, firm morale shatters.
- **Police Crowd Barrier (`'police_barrier'`)**: Galvanized steel barricade deployed by riot squads to divide streets.
- **Projectiles / Missiles**: Flying beer bottles and calling cards arcing through 3D parabolic trajectories.

### 2.4 The Camera: Hero & Tactical Broadcast

1. **Hero Mode (Top Boy View)**:
   - Locks tightly onto the player's Top Boy from an over-the-shoulder perspective ($X_{offset} = -3.5, Y_{offset} = 2.2, Z_{offset} = -7.0$).
   - Rotates as the player maneuvers, providing immediate immersion into the frontline collision.
2. **Broadcast Mode (Sideline View)**:
   - Elevated perspective overlooking the entire street clash ($Y = 11.0, Z = -18.0$).
   - Smoothly pans ($Lerp$) with the center of gravity between the two opposing frontlines.
3. **Follow Mode (Squad Rear)**:
   - Floats behind the advancing wedge formation, keeping all friendly lads within the primary frustum.

---

## 3. Data Flow & Frame Lifecycle

At 60 frames per second:
1. **Simulation Step**:
   - Fighter positions updated based on formation anchors and frontline forces.
   - Morale, Bottle, and Hardness calculations determine striking range and knockback.
2. **Camera Update**:
   - Camera smoothly interpolates toward the designated anchor (Top Boy or melee centroid).
3. **Ray-cast Ground Pass**:
   - `renderRaycastGround()` fills the `AsciiBlitter` with procedural cobblestone/station tiles and horizon rowhouses.
4. **Entity Rendering Pass**:
   - 3D Casual figures (`drawSkeletalFigure`) sorted and drawn with Z-buffer occlusion.
   - Objectives (flares, barriers) rendered into the scene.
5. **Output Pass**:
   - The blitter outputs to a monospaced terminal element (React `<pre>` container or ANSI stream) without full-page re-renders.

---

## 4. Integration Boundaries

- **Football Simulation Untouched**: The SFS football match engine (`matchEngine.ts`) is completely isolated and unaware of the clash visualizer.
- **Shared Geometry Math**: `clashRenderer.ts` strictly imports `Camera3D`, `AsciiBlitter`, `renderRaycastGround`, and projection mathematics from `src/renderers/asciiLibRenderer.ts`, preventing code duplication.
