/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SFS Clash Renderer Adapter
 * Maps Firm U-Lator clash engine state (lads, tokens, actions, venues)
 * into the SFS 3D ASCII Lib Renderer format (ray-cast ground slab, pinhole camera,
 * depth-buffered skeletal casuals, and tactical objectives).
 */

import {
  Vector3D,
  CameraMode,
  GroundTexture,
  Figure3D,
  Objective3D,
  SkeletalPose,
  FigureStyle,
  AsciiBlitter,
  Camera3D,
  renderRaycastGround,
  drawSkeletalFigure,
  drawObjectiveEntity,
  AsciiCell
} from '../renderers/asciiLibRenderer';
import { Lad, Firm, Tactics, AwayTravelPlan } from '../types/game';

export interface ClashLadInput {
  id: string;
  name: string;
  isPlayer: boolean;
  role: string;
  personality?: string;
  xPercent: number; // 0-100 from tactical 2D
  yPercent: number; // 0-100 from tactical 2D
  hp: number;
  maxHp: number;
  bottle: number;
  isPanicking: boolean;
  action?: 'idle' | 'guard' | 'punch' | 'kick' | 'run' | 'knocked_down';
}

export interface ClashSceneState {
  lads: ClashLadInput[];
  venueType: GroundTexture;
  cameraMode: CameraMode;
  smokeActive: boolean;
  policeDistance: number;
  minute: number;
  playerFirm: Firm;
  rivalFirm: Firm;
  heroLadId?: string;
}

export interface RenderedClashFrame {
  plainText: string;
  cells: AsciiCell[][];
  cameraPosition: Vector3D;
  cameraTarget: Vector3D;
  figuresCount: number;
  objectivesCount: number;
}

/**
 * Coordinate Mapping:
 * Tactical 2D grid uses 0-100% coordinates.
 * Pinhole 3D Engine uses real-world meters relative to origin:
 * X: -8.0m (left pavement) to +8.0m (right pavement)
 * Y: 0.0m (ground slab plane)
 * Z: -8.0m (player firm rear line) to +12.0m (rival firm rear line / police barrier)
 */
export function map2DToWorld3D(xPercent: number, yPercent: number): Vector3D {
  const worldX = ((xPercent - 50) / 50) * 8.0; // [-8, +8]
  const worldZ = ((yPercent - 50) / 50) * 10.0; // [-10, +10]
  return {
    x: Math.round(worldX * 100) / 100,
    y: 0,
    z: Math.round(worldZ * 100) / 100
  };
}

/**
 * Compute skeletal pose and facing from lad action and tactical status
 */
export function computeSkeletalPose(lad: ClashLadInput, frameIndex: number = 0): SkeletalPose {
  if (lad.hp <= 20) {
    return {
      stance: 'knocked_down',
      actionFrame: 0,
      facingAngle: lad.isPlayer ? 0 : Math.PI
    };
  }

  if (lad.isPanicking) {
    return {
      stance: 'run',
      actionFrame: frameIndex % 4,
      facingAngle: lad.isPlayer ? Math.PI : 0 // running back
    };
  }

  if (lad.action) {
    return {
      stance: lad.action,
      actionFrame: frameIndex % 4,
      facingAngle: lad.isPlayer ? 0 : Math.PI
    };
  }

  // Melee clash zone (near centre Z ~ 0)
  const zPos = ((lad.yPercent - 50) / 50) * 10.0;
  if (Math.abs(zPos) < 2.5) {
    const actionRoll = (frameIndex + Math.abs(Math.floor(lad.xPercent))) % 18;
    const stance = actionRoll < 5 ? 'punch' : actionRoll < 10 ? 'kick' : 'guard';
    return {
      stance,
      actionFrame: frameIndex % 4,
      facingAngle: lad.isPlayer ? 0 : Math.PI
    };
  }

  return {
    stance: 'idle',
    actionFrame: 0,
    facingAngle: lad.isPlayer ? 0 : Math.PI
  };
}

/**
 * Determine attire and styling for the 3D figure
 */
export function computeFigureStyle(
  lad: ClashLadInput,
  playerColor: string = '#1e3a8a',
  rivalColor: string = '#991b1b'
): FigureStyle {
  const jacketColor = lad.isPlayer ? (playerColor || '#1e3a8a') : (rivalColor || '#991b1b');
  const headColor = lad.isPlayer ? '#fed7aa' : '#fcd34d';
  const badgeColor = lad.isPlayer ? '#facc15' : undefined; // Stone Island yellow compass badge
  const jeansColor = lad.role === 'top_boy' ? '#0f172a' : '#1e293b';

  let label = lad.name.split(' ')[0];
  if (lad.role === 'top_boy') label = 'TOP BOY';

  return {
    jacketColor,
    jeansColor,
    headColor,
    badgeColor,
    label
  };
}

/**
 * Map clash lads into SFS Figure3D entities
 */
export function adaptLadsToFigures(
  lads: ClashLadInput[],
  playerColor: string,
  rivalColor: string,
  frameIndex: number = 0
): Figure3D[] {
  return lads.map(lad => {
    const position = map2DToWorld3D(lad.xPercent, lad.yPercent);
    const pose = computeSkeletalPose(lad, frameIndex);
    const style = computeFigureStyle(lad, playerColor, rivalColor);

    return {
      id: lad.id,
      position,
      style,
      pose,
      role: lad.role
    };
  });
}

/**
 * Adapt tactical objectives (smoke flares, police riot line, banners)
 */
export function adaptObjectives(
  smokeActive: boolean,
  policeDistance: number,
  focalZ: number = 0
): Objective3D[] {
  const objectives: Objective3D[] = [];

  // Purple Marine Flare
  if (smokeActive) {
    objectives.push({
      id: 'flare_purple_center',
      position: { x: 0, y: 0, z: focalZ },
      char: '*',
      color: '#e879f9',
      type: 'flare'
    });
    objectives.push({
      id: 'flare_purple_left',
      position: { x: -3.5, y: 0, z: focalZ + 0.8 },
      char: '░',
      color: '#c084fc',
      type: 'flare'
    });
    objectives.push({
      id: 'flare_purple_right',
      position: { x: 3.5, y: 0, z: focalZ - 0.5 },
      char: '░',
      color: '#c084fc',
      type: 'flare'
    });
  }

  // Tactical Riot Police Barrier if police within critical proximity
  if (policeDistance < 40) {
    const policeZ = 8.0 + (policeDistance / 40.0) * 12.0;
    objectives.push({
      id: 'barrier_police_1',
      position: { x: -4.0, y: 0, z: policeZ },
      char: '=',
      color: '#ef4444',
      type: 'police_barrier'
    });
    objectives.push({
      id: 'barrier_police_2',
      position: { x: 0, y: 0, z: policeZ },
      char: '=',
      color: '#ef4444',
      type: 'police_barrier'
    });
    objectives.push({
      id: 'barrier_police_3',
      position: { x: 4.0, y: 0, z: policeZ },
      char: '=',
      color: '#ef4444',
      type: 'police_barrier'
    });
  }

  return objectives;
}

/**
 * Determine Ground Slab texture from away plan strategy or settings
 */
export function resolveGroundTexture(awayPlan?: AwayTravelPlan, override?: GroundTexture): GroundTexture {
  if (override) return override;
  if (!awayPlan) return 'cobblestone';
  if (awayPlan.transportMode === 'train_special') return 'railway_station';
  if (awayPlan.pubStrategy === 'enemy_local' || awayPlan.pubStrategy === 'lock_in_fortress') return 'pub_carpet';
  return 'cobblestone';
}

/**
 * Clash State Adapter Class
 * Encapsulates the adapter logic and feeds the SFS ASCII renderer.
 */
export class ClashRendererAdapter {
  public blitter: AsciiBlitter;
  public camera: Camera3D;
  private frameCount: number = 0;

  constructor(
    width: number = 84,
    height: number = 26,
    initialCameraMode: CameraMode = 'hero'
  ) {
    this.blitter = new AsciiBlitter(width, height);
    this.camera = new Camera3D({
      position: { x: 0, y: 7.0, z: -14.0 },
      target: { x: 0, y: 1.0, z: 0 },
      fov: 62,
      mode: initialCameraMode,
      aspectRatioCorrection: 2.1
    });
  }

  public setCameraMode(mode: CameraMode): void {
    this.camera.mode = mode;
  }

  public renderFrame(state: ClashSceneState): RenderedClashFrame {
    this.frameCount++;
    const playerColor = state.playerFirm.primaryColor || '#1e3a8a';
    const rivalColor = state.rivalFirm.primaryColor || '#991b1b';

    // 1. Map lads to 3D skeletal figures
    const figures = adaptLadsToFigures(state.lads, playerColor, rivalColor, this.frameCount);

    // 2. Map tactical objectives
    const objectives = adaptObjectives(state.smokeActive, state.policeDistance, 0);

    // 3. Compute camera anchor
    let anchor: Vector3D = { x: 0, y: 0, z: 0 };
    if (this.camera.mode === 'hero') {
      const hero = figures.find(f => f.id === state.heroLadId) || figures.find(f => f.id.includes('top_boy')) || figures[0];
      if (hero) anchor = hero.position;
    } else {
      let sumX = 0;
      let sumZ = 0;
      let count = 0;
      for (const fig of figures) {
        sumX += fig.position.x;
        sumZ += fig.position.z;
        count++;
      }
      if (count > 0) {
        anchor = { x: sumX / count, y: 0, z: sumZ / count };
      }
    }

    // 4. Update camera
    this.camera.update(anchor, 0.016);

    // 5. Clear frame buffer
    this.blitter.clear();

    // 6. Pass A: Ray-cast ground plane (slab at Y=0)
    renderRaycastGround(this.blitter, this.camera, state.venueType);

    // 7. Pass B: 3D Tactical Objectives
    for (const obj of objectives) {
      drawObjectiveEntity(this.blitter, this.camera, obj);
    }

    // 8. Pass C: 3D Skeletal Figures (depth sorted)
    const sortedFigures = [...figures].sort((a, b) => {
      const distA = Math.hypot(a.position.x - this.camera.position.x, a.position.z - this.camera.position.z);
      const distB = Math.hypot(b.position.x - this.camera.position.x, b.position.z - this.camera.position.z);
      return distB - distA; // Furthest back rendered first
    });

    for (const fig of sortedFigures) {
      drawSkeletalFigure(this.blitter, this.camera, fig);
    }

    return {
      plainText: this.blitter.renderToPlainText(),
      cells: this.blitter.getBuffer().map(row => [...row]),
      cameraPosition: { ...this.camera.position },
      cameraTarget: { ...this.camera.target },
      figuresCount: figures.length,
      objectivesCount: objectives.length
    };
  }
}
