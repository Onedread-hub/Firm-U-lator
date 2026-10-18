/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SFS v0.1 Firm Clash 3D Renderer Service
 * Manages the 60fps tactical melee loop, 3D entity simulation,
 * and calls SFS projection math and AsciiBlitter to render frames.
 */

import {
  AsciiBlitter,
  Camera3D,
  Figure3D,
  Objective3D,
  GroundTexture,
  CameraMode,
  Vector3D,
  renderRaycastGround,
  drawSkeletalFigure,
  drawObjectiveEntity
} from '../renderers/asciiLibRenderer';

export interface ClashEntity3D {
  id: string;
  name: string;
  isPlayer: boolean;
  isPolice?: boolean;
  role: 'top_boy' | 'minder' | 'runner' | 'nutter' | 'face' | 'police_officer';
  position: Vector3D;
  velocity: Vector3D;
  targetPosition: Vector3D;
  hp: number;
  maxHp: number;
  bottle: number;
  isPanicking: boolean;
  figure: Figure3D;
}

export interface ClashSimulationConfig {
  venueType: GroundTexture;
  cameraMode: CameraMode;
  terminalWidth?: number;
  terminalHeight?: number;
  playerPrimaryColor: string;
  rivalPrimaryColor: string;
}

export interface ClashFrameData {
  frameIndex: number;
  timestampMs: number;
  renderedText: string;
  renderedAnsi: string;
  cameraPosition: Vector3D;
  cameraTarget: Vector3D;
  activePlayerCount: number;
  activeRivalCount: number;
  policeDistance: number;
  heroFocusId?: string;
}

export type FrameCallback = (data: ClashFrameData) => void;

/**
 * 60 FPS 3D Clash Simulation & Rendering Engine
 */
export class ClashRendererEngine {
  public blitter: AsciiBlitter;
  public camera: Camera3D;
  public groundType: GroundTexture;
  public entities: ClashEntity3D[];
  public objectives: Objective3D[];

  private isRunning: boolean;
  private animFrameId: number | null;
  private intervalTimer: NodeJS.Timeout | null;
  private frameCount: number;
  private lastTime: number;
  private heroEntityId: string | null;
  private policeDistance: number; // 0 to 100
  private frameListeners: Set<FrameCallback>;

  constructor(config: ClashSimulationConfig) {
    const width = config.terminalWidth ?? 96;
    const height = config.terminalHeight ?? 28;

    this.blitter = new AsciiBlitter(width, height);
    this.groundType = config.venueType;
    this.entities = [];
    this.objectives = [];
    this.isRunning = false;
    this.animFrameId = null;
    this.intervalTimer = null;
    this.frameCount = 0;
    this.lastTime = 0;
    this.heroEntityId = null;
    this.policeDistance = 100.0;
    this.frameListeners = new Set();

    // Initialize SFS Pinhole 3D Camera
    this.camera = new Camera3D({
      position: { x: 0, y: 7.0, z: -14.0 },
      target: { x: 0, y: 1.0, z: 0 },
      fov: 62,
      mode: config.cameraMode,
      aspectRatioCorrection: 2.1
    });
  }

  /**
   * Register a frame rendering listener
   */
  public subscribe(cb: FrameCallback): () => void {
    this.frameListeners.add(cb);
    return () => this.frameListeners.delete(cb);
  }

  /**
   * Set Camera Mode
   */
  public setCameraMode(mode: CameraMode): void {
    this.camera.mode = mode;
  }

  /**
   * Set Hero Focus
   */
  public setHeroFocus(entityId: string): void {
    this.heroEntityId = entityId;
  }

  /**
   * Spawn a Casual Lad into the 3D Scene
   */
  public spawnCasual(
    id: string,
    name: string,
    isPlayer: boolean,
    role: 'top_boy' | 'minder' | 'runner' | 'nutter' | 'face',
    initialPos: Vector3D,
    jacketColor: string,
    jeansColor: string = '#1e293b'
  ): ClashEntity3D {
    const figure: Figure3D = {
      id,
      position: { ...initialPos },
      style: {
        jacketColor,
        jeansColor,
        headColor: isPlayer ? '#fed7aa' : '#fcd34d',
        badgeColor: isPlayer ? '#facc15' : undefined,
        label: role === 'top_boy' ? `TOP BOY` : name.split(' ')[0]
      },
      pose: {
        stance: 'idle',
        facingAngle: isPlayer ? 0 : Math.PI
      },
      role
    };

    const entity: ClashEntity3D = {
      id,
      name,
      isPlayer,
      role,
      position: { ...initialPos },
      velocity: { x: 0, y: 0, z: 0 },
      targetPosition: { ...initialPos },
      hp: 100,
      maxHp: 100,
      bottle: 85,
      isPanicking: false,
      figure
    };

    this.entities.push(entity);

    if (role === 'top_boy' && isPlayer && !this.heroEntityId) {
      this.heroEntityId = id;
    }

    return entity;
  }

  /**
   * Spawn Tactical Riot Police Squad
   */
  public spawnPoliceSquad(count: number = 3, zDepth: number = 24.0): void {
    for (let i = 0; i < count; i++) {
      const xPos = -4.0 + (i * 4.0);
      const id = `police_${Date.now()}_${i}`;
      const figure: Figure3D = {
        id,
        position: { x: xPos, y: 0, z: zDepth },
        style: {
          jacketColor: '#0f172a', // High-vis / riot gear
          jeansColor: '#1e293b',
          headColor: '#38bdf8',  // Riot helmet visor
          badgeColor: '#38bdf8',
          label: 'POLICE'
        },
        pose: {
          stance: 'guard',
          facingAngle: Math.PI
        },
        role: 'police_officer'
      };

      this.entities.push({
        id,
        name: `Met Riot PC ${100 + i}`,
        isPlayer: false,
        isPolice: true,
        role: 'police_officer',
        position: { x: xPos, y: 0, z: zDepth },
        velocity: { x: 0, y: 0, z: -0.4 },
        targetPosition: { x: xPos, y: 0, z: 2.0 },
        hp: 150,
        maxHp: 150,
        bottle: 100,
        isPanicking: false,
        figure
      });
    }

    // Spawn barricade objective
    this.objectives.push({
      id: `barrier_${Date.now()}`,
      position: { x: 0, y: 0, z: zDepth - 1.0 },
      char: '=',
      color: '#ef4444',
      type: 'police_barrier'
    });
  }

  /**
   * Spawn Purple Marine Flare Objective
   */
  public deployPurpleFlare(position: Vector3D): void {
    this.objectives.push({
      id: `flare_${Date.now()}`,
      position: { ...position },
      char: '*',
      color: '#e879f9',
      type: 'flare'
    });
  }

  /**
   * 60 FPS Game Loop Step
   */
  public tick(deltaTime: number = 0.016): void {
    this.frameCount++;

    // 1. Update 3D Entity Physics & Melee AI
    for (const ent of this.entities) {
      if (ent.isPolice) {
        // Police slowly advance from background towards foreground
        ent.position.z = Math.max(2.0, ent.position.z - 0.04);
        ent.figure.position = { ...ent.position };
        continue;
      }

      // Natural standoff jitter & forward push
      const jitterX = (Math.sin(this.frameCount * 0.15 + ent.position.x) * 0.03);
      const forwardPush = ent.isPlayer ? 0.012 : -0.012;

      ent.position.x += jitterX;
      ent.position.z += forwardPush;

      // Restrict to street bounds
      ent.position.x = Math.max(-9.0, Math.min(9.0, ent.position.x));
      ent.position.z = Math.max(-12.0, Math.min(18.0, ent.position.z));

      // Sync visual figure position
      ent.figure.position = { ...ent.position };

      // Dynamic pose animation
      if (Math.abs(ent.position.z) < 2.5) {
        ent.figure.pose.stance = (this.frameCount + ent.position.x * 10) % 20 < 8 ? 'punch' : 'guard';
      } else {
        ent.figure.pose.stance = 'idle';
      }
    }

    // 2. Camera Anchor Selection
    let cameraAnchor: Vector3D = { x: 0, y: 0, z: 0 };
    if (this.camera.mode === 'hero' && this.heroEntityId) {
      const hero = this.entities.find(e => e.id === this.heroEntityId);
      if (hero) cameraAnchor = hero.position;
    } else {
      // Centroid of all active fighters
      let sumX = 0;
      let sumZ = 0;
      let count = 0;
      for (const ent of this.entities) {
        sumX += ent.position.x;
        sumZ += ent.position.z;
        count++;
      }
      if (count > 0) {
        cameraAnchor = { x: sumX / count, y: 0, z: sumZ / count };
      }
    }

    // 3. Update Pinhole Camera
    this.camera.update(cameraAnchor, deltaTime);

    // 4. Render Pipeline
    this.blitter.clear();

    // Pass A: Ray-cast Ground (Cobblestones / Railway Sleepers / Pub Carpet)
    renderRaycastGround(this.blitter, this.camera, this.groundType);

    // Pass B: 3D Objectives (Flares, Barriers, Banners)
    for (const obj of this.objectives) {
      drawObjectiveEntity(this.blitter, this.camera, obj);
    }

    // Pass C: 3D Casual Figures (sorted back-to-front with Z-buffer depth test)
    // Sort entities by distance to camera
    const sortedEntities = [...this.entities].sort((a, b) => {
      const distA = Math.hypot(a.position.x - this.camera.position.x, a.position.z - this.camera.position.z);
      const distB = Math.hypot(b.position.x - this.camera.position.x, b.position.z - this.camera.position.z);
      return distB - distA; // Furthest first
    });

    for (const ent of sortedEntities) {
      drawSkeletalFigure(this.blitter, this.camera, ent.figure);
    }

    // 5. Emit Frame Output
    const frameData: ClashFrameData = {
      frameIndex: this.frameCount,
      timestampMs: Date.now(),
      renderedText: this.blitter.renderToPlainText(),
      renderedAnsi: this.blitter.renderToAnsi(),
      cameraPosition: { ...this.camera.position },
      cameraTarget: { ...this.camera.target },
      activePlayerCount: this.entities.filter(e => e.isPlayer && !e.isPanicking).length,
      activeRivalCount: this.entities.filter(e => !e.isPlayer && !e.isPolice && !e.isPanicking).length,
      policeDistance: this.policeDistance,
      heroFocusId: this.heroEntityId ?? undefined
    };

    for (const listener of this.frameListeners) {
      listener(frameData);
    }
  }

  /**
   * Start 60fps Animation Loop
   */
  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = Date.now();

    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      const loop = () => {
        if (!this.isRunning) return;
        const now = Date.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;
        this.tick(dt);
        this.animFrameId = window.requestAnimationFrame(loop);
      };
      this.animFrameId = window.requestAnimationFrame(loop);
    } else {
      // Node.js fallback (e.g. CLI test harness)
      this.intervalTimer = setInterval(() => {
        this.tick(0.016);
      }, 16);
    }
  }

  /**
   * Stop loop
   */
  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.intervalTimer !== null) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
  }

  /**
   * Render single frame synchronously (for headless test spikes)
   */
  public renderSingleFrame(): ClashFrameData {
    this.tick(0.016);
    return {
      frameIndex: this.frameCount,
      timestampMs: Date.now(),
      renderedText: this.blitter.renderToPlainText(),
      renderedAnsi: this.blitter.renderToAnsi(),
      cameraPosition: { ...this.camera.position },
      cameraTarget: { ...this.camera.target },
      activePlayerCount: this.entities.filter(e => e.isPlayer && !e.isPanicking).length,
      activeRivalCount: this.entities.filter(e => !e.isPlayer && !e.isPolice && !e.isPanicking).length,
      policeDistance: this.policeDistance,
      heroFocusId: this.heroEntityId ?? undefined
    };
  }
}
