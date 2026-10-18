/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SFS v0.1 ASCII 3D Engine — Core asciiLibRenderer
 * Provides the canonical pinhole camera, raycast ground plane, 
 * 3D-to-2.5D projection mathematics, depth buffering, and terminal Blitter.
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type CameraMode = 'broadcast' | 'follow' | 'hero';

export interface CameraConfig {
  position: Vector3D;
  target: Vector3D;
  fov?: number; // In degrees, default 60
  mode: CameraMode;
  aspectRatioCorrection?: number; // Terminal glyph ratio (typically ~2.0 height-to-width)
  nearClip?: number;
  farClip?: number;
}

export interface AsciiCell {
  char: string;
  fg: string; // Hex color or ANSI code
  bg: string;
  depth: number; // Z-buffer depth (smaller = closer)
}

export type GroundTexture = 'pitch' | 'cobblestone' | 'railway_station' | 'pub_carpet';

export interface SkeletalPose {
  stance: 'idle' | 'guard' | 'punch' | 'run' | 'knocked_down';
  actionFrame?: number;
  facingAngle?: number; // Radians, 0 = towards +Z
}

export interface FigureStyle {
  jacketColor: string; // Primary apparel (e.g. Stone Island Navy/Olive, or Team Kit)
  jeansColor: string;  // Trousers/shorts
  headColor: string;   // Skin / headwear
  badgeColor?: string; // Stone Island arm compass badge / crest
  label?: string;      // Top Boy name or fighter ID
}

export interface Figure3D {
  id: string;
  position: Vector3D;
  style: FigureStyle;
  pose: SkeletalPose;
  role?: string;
  scale?: number;
}

export interface Objective3D {
  id: string;
  position: Vector3D;
  char: string;
  color: string;
  type: 'ball' | 'weapon' | 'flare' | 'flag' | 'police_barrier';
  scale?: number;
}

/**
 * 2D ASCII Screen Buffer with Depth-Testing (Z-Buffer)
 */
export class AsciiBlitter {
  public readonly width: number;
  public readonly height: number;
  private buffer: AsciiCell[][];

  constructor(width: number = 96, height: number = 32) {
    this.width = width;
    this.height = height;
    this.buffer = [];
    this.clear();
  }

  public clear(bgChar: string = ' ', defaultBg: string = '#090d14'): void {
    this.buffer = [];
    for (let y = 0; y < this.height; y++) {
      const row: AsciiCell[] = [];
      for (let x = 0; x < this.width; x++) {
        row.push({
          char: bgChar,
          fg: '#64748b',
          bg: defaultBg,
          depth: Infinity
        });
      }
      this.buffer.push(row);
    }
  }

  public setCell(x: number, y: number, char: string, fg: string, bg: string, depth: number): boolean {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (ix < 0 || ix >= this.width || iy < 0 || iy >= this.height) return false;

    // Depth test: smaller depth is closer to camera
    if (depth <= this.buffer[iy][ix].depth) {
      this.buffer[iy][ix] = { char, fg, bg, depth };
      return true;
    }
    return false;
  }

  public drawString(x: number, y: number, text: string, fg: string, bg: string, depth: number): void {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    if (iy < 0 || iy >= this.height) return;

    for (let i = 0; i < text.length; i++) {
      const cx = ix + i;
      if (cx >= 0 && cx < this.width) {
        if (depth <= this.buffer[iy][cx].depth) {
          this.buffer[iy][cx] = {
            char: text[i],
            fg,
            bg,
            depth
          };
        }
      }
    }
  }

  public getCell(x: number, y: number): AsciiCell | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.buffer[y][x];
  }

  public getBuffer(): AsciiCell[][] {
    return this.buffer;
  }

  /**
   * Render screen buffer to plain monospaced text.
   */
  public renderToPlainText(): string {
    return this.buffer.map(row => row.map(c => c.char).join('')).join('\n');
  }

  /**
   * Render screen buffer with ANSI escape codes for terminal output.
   */
  public renderToAnsi(): string {
    return this.buffer.map(row => {
      let line = '';
      let curFg = '';
      for (const cell of row) {
        if (cell.fg !== curFg) {
          curFg = cell.fg;
          const ansiCode = hexToAnsi(curFg);
          line += ansiCode;
        }
        line += cell.char;
      }
      return line + '\x1b[0m';
    }).join('\n');
  }
}

/**
 * Pinhole 3D Camera with configurable modes
 */
export class Camera3D {
  public position: Vector3D;
  public target: Vector3D;
  public fov: number;
  public mode: CameraMode;
  public aspectRatioCorrection: number;
  public nearClip: number;
  public farClip: number;

  constructor(config: CameraConfig) {
    this.position = { ...config.position };
    this.target = { ...config.target };
    this.fov = config.fov ?? 60;
    this.mode = config.mode;
    this.aspectRatioCorrection = config.aspectRatioCorrection ?? 2.1;
    this.nearClip = config.nearClip ?? 0.5;
    this.farClip = config.farClip ?? 120.0;
  }

  /**
   * Project a 3D world coordinate into 2D screen coordinates with depth testing.
   */
  public project(world: Vector3D, screenWidth: number, screenHeight: number): {
    screenX: number;
    screenY: number;
    depth: number;
    visible: boolean;
    scale: number;
  } {
    // 1. Vector from camera to world point
    const dx = world.x - this.position.x;
    const dy = world.y - this.position.y;
    const dz = world.z - this.position.z;

    // 2. Camera coordinate frame (LookAt transformation)
    // Forward direction
    const fx = this.target.x - this.position.x;
    const fy = this.target.y - this.position.y;
    const fz = this.target.z - this.position.z;
    const fLen = Math.sqrt(fx * fx + fy * fy + fz * fz) || 1;
    const fwdX = fx / fLen;
    const fwdY = fy / fLen;
    const fwdZ = fz / fLen;

    // Up vector (world up is Y+)
    const upX = 0;
    const upY = 1;
    const upZ = 0;

    // Right vector = up x fwd
    let rightX = upY * fwdZ - upZ * fwdY;
    let rightY = upZ * fwdX - upX * fwdZ;
    let rightZ = upX * fwdY - upY * fwdX;
    const rLen = Math.sqrt(rightX * rightX + rightY * rightY + rightZ * rightZ) || 1;
    rightX /= rLen;
    rightY /= rLen;
    rightZ /= rLen;

    // True camera up = fwd x right
    const camUpX = fwdY * rightZ - fwdZ * rightY;
    const camUpY = fwdZ * rightX - fwdX * rightZ;
    const camUpZ = fwdX * rightY - fwdY * rightX;

    // Transform world delta into camera space
    const camX = dx * rightX + dy * rightY + dz * rightZ;
    const camY = dx * camUpX + dy * camUpY + dz * camUpZ;
    const camZ = dx * fwdX + dy * fwdY + dz * fwdZ;

    // Near / far clipping
    if (camZ < this.nearClip || camZ > this.farClip) {
      return { screenX: -1, screenY: -1, depth: camZ, visible: false, scale: 0 };
    }

    // Focal length calculation based on FOV
    const fovRad = (this.fov * Math.PI) / 180;
    const focalLength = (screenHeight / 2) / Math.tan(fovRad / 2);

    // Perspective divide
    const projX = (camX * focalLength) / camZ;
    // Note: terminal glyphs are roughly twice as tall as wide, so apply aspect correction
    const projY = (camY * focalLength * this.aspectRatioCorrection) / camZ;

    const screenX = Math.round(screenWidth / 2 + projX);
    const screenY = Math.round(screenHeight / 2 - projY);
    const scale = focalLength / camZ;

    const visible = screenX >= 0 && screenX < screenWidth && screenY >= 0 && screenY < screenHeight;

    return {
      screenX,
      screenY,
      depth: camZ,
      visible,
      scale
    };
  }

  /**
   * Update camera position based on mode and target anchor
   */
  public update(anchor: Vector3D, deltaTime: number = 0.016): void {
    if (this.mode === 'hero') {
      // Over-the-shoulder hero view
      const targetPos: Vector3D = {
        x: anchor.x - 3.5,
        y: anchor.y + 2.2,
        z: anchor.z - 7.0
      };
      this.position.x += (targetPos.x - this.position.x) * 0.12;
      this.position.y += (targetPos.y - this.position.y) * 0.12;
      this.position.z += (targetPos.z - this.position.z) * 0.12;

      this.target.x += (anchor.x - this.target.x) * 0.15;
      this.target.y += (anchor.y + 1.2 - this.target.y) * 0.15;
      this.target.z += (anchor.z + 4.0 - this.target.z) * 0.15;
    } else if (this.mode === 'follow') {
      // Elevated tactical follow camera behind squad
      const targetPos: Vector3D = {
        x: anchor.x,
        y: anchor.y + 6.5,
        z: anchor.z - 14.0
      };
      this.position.x += (targetPos.x - this.position.x) * 0.08;
      this.position.y += (targetPos.y - this.position.y) * 0.08;
      this.position.z += (targetPos.z - this.position.z) * 0.08;

      this.target.x += (anchor.x - this.target.x) * 0.1;
      this.target.y += (anchor.y - this.target.y) * 0.1;
      this.target.z += (anchor.z + 2.0 - this.target.z) * 0.1;
    } else {
      // Broadcast mode: elevated elevated sideline camera smoothly panning with the centroid
      this.position = { x: 0, y: 11.0, z: -18.0 };
      this.target.x += (anchor.x - this.target.x) * 0.06;
      this.target.y += (anchor.y - this.target.y) * 0.06;
      this.target.z += (anchor.z - this.target.z) * 0.06;
    }
  }
}

/**
 * Ray-cast Ground Renderer
 * Projects rays from camera plane to the Y = 0 horizontal plane,
 * mapping procedural surface patterns and depth fog.
 */
export function renderRaycastGround(
  blitter: AsciiBlitter,
  camera: Camera3D,
  textureType: GroundTexture = 'cobblestone'
): void {
  const width = blitter.width;
  const height = blitter.height;
  const horizonRow = Math.floor(height * 0.38);

  for (let y = horizonRow; y < height; y++) {
    // Row factor from horizon down to bottom
    const scanRatio = (y - horizonRow) / (height - horizonRow);
    // Rough planar depth calculation (inverse perspective)
    const depth = 2.0 + (1.0 - scanRatio) * 35.0;

    for (let x = 0; x < width; x++) {
      // Normalized screen coordinate [-1, 1]
      const nx = (x - width / 2) / (width / 2);
      // World coordinates on ground plane
      const worldX = camera.position.x + nx * depth * 0.85;
      const worldZ = camera.position.z + depth;

      let char = '.';
      let fg = '#475569';
      let bg = '#0f172a';

      if (textureType === 'cobblestone') {
        // Victorian street cobblestones
        const blockX = Math.floor(worldX * 1.8);
        const blockZ = Math.floor(worldZ * 1.2);
        const isJoint = (blockX % 2 === 0 && blockZ % 2 === 0) || Math.abs(worldX) % 1.0 < 0.15;
        const isCurb = Math.abs(worldX - 10) < 0.4 || Math.abs(worldX + 10) < 0.4;
        const isPavementSlab = Math.abs(worldX) > 10;

        if (isCurb) {
          char = '=';
          fg = '#94a3b8';
          bg = '#1e293b';
        } else if (isPavementSlab) {
          char = (blockX + blockZ) % 3 === 0 ? '░' : ' ';
          fg = '#64748b';
          bg = '#141e2e';
        } else if (isJoint) {
          char = ':';
          fg = '#334155';
          bg = '#090d16';
        } else {
          // Wet cobblestone sheen
          const sheen = Math.sin(worldX * 2.2) * Math.cos(worldZ * 1.8);
          if (sheen > 0.6) {
            char = '*';
            fg = '#93c5fd';
            bg = '#162235';
          } else if (sheen > 0.2) {
            char = '░';
            fg = '#475569';
            bg = '#0f172a';
          } else {
            char = '.';
            fg = '#334155';
            bg = '#0a0f18';
          }
        }
      } else if (textureType === 'railway_station') {
        // Train platform and ballast tracks
        const trackDist = Math.abs(worldX);
        const isPlatform = worldX > 4.0 || worldX < -4.0;
        const isYellowWarningLine = Math.abs(worldX - 4.2) < 0.3 || Math.abs(worldX + 4.2) < 0.3;
        const isRail = Math.abs(worldX - 1.6) < 0.2 || Math.abs(worldX + 1.6) < 0.2;
        const isSleeper = Math.floor(worldZ * 2.0) % 2 === 0 && !isPlatform;

        if (isYellowWarningLine) {
          char = '═';
          fg = '#facc15';
          bg = '#713f12';
        } else if (isPlatform) {
          char = (Math.floor(worldX) + Math.floor(worldZ)) % 4 === 0 ? '┼' : ' ';
          fg = '#94a3b8';
          bg = '#1e293b';
        } else if (isRail) {
          char = '║';
          fg = '#cbd5e1';
          bg = '#334155';
        } else if (isSleeper) {
          char = '▬';
          fg = '#78350f';
          bg = '#1c1917';
        } else {
          // Gravel ballast
          char = '·';
          fg = '#57534e';
          bg = '#0c0a09';
        }
      } else if (textureType === 'pub_carpet') {
        // Sticky patterned pub carpet & wood floorboards
        const tile = (Math.floor(worldX * 2) + Math.floor(worldZ * 2)) % 4;
        if (tile === 0) {
          char = '❖';
          fg = '#f59e0b';
          bg = '#450a0a';
        } else if (tile === 1) {
          char = '░';
          fg = '#dc2626';
          bg = '#2a0808';
        } else {
          char = '·';
          fg = '#7f1d1d';
          bg = '#180404';
        }
      } else {
        // Pitch (football grass lines)
        const stripe = Math.floor(worldZ / 5.0) % 2 === 0;
        const isPitchLine = Math.abs(worldX) < 0.2 || Math.abs(worldZ - 30) < 0.2;
        if (isPitchLine) {
          char = '#';
          fg = '#f8fafc';
          bg = '#15803d';
        } else {
          char = stripe ? '░' : ' ';
          fg = '#16a34a';
          bg = stripe ? '#166534' : '#14532d';
        }
      }

      // Distance fog / shading
      if (depth > 28) {
        fg = '#334155';
        bg = '#020617';
        if (char !== ' ') char = '·';
      }

      blitter.setCell(x, y, char, fg, bg, depth);
    }
  }

  // Draw Horizon backdrop / street buildings skyline
  for (let y = 0; y < horizonRow; y++) {
    for (let x = 0; x < width; x++) {
      // Victorian rowhouses / floodlights silhouette
      const houseHeight = 8 + Math.floor(Math.sin(x * 0.15) * 4 + Math.cos(x * 0.4) * 3);
      if (y >= horizonRow - houseHeight) {
        const isWindow = (x % 5 === 2) && (y % 3 === 1) && y < horizonRow - 2;
        blitter.setCell(
          x,
          y,
          isWindow ? '■' : '█',
          isWindow ? '#fef08a' : '#1e293b',
          '#090d16',
          45.0
        );
      } else {
        // Dark rainy night sky
        const isStarOrRain = (x * 7 + y * 13) % 47 === 0;
        blitter.setCell(
          x,
          y,
          isStarOrRain ? '/' : ' ',
          '#38bdf8',
          '#030712',
          100.0
        );
      }
    }
  }
}

/**
 * Draw a 3D Skeletal Casual / Firm Lad into the ASCII Buffer.
 * Uses a distance-scaled skeletal capsule system.
 */
export function drawSkeletalFigure(
  blitter: AsciiBlitter,
  camera: Camera3D,
  fig: Figure3D
): void {
  const proj = camera.project(fig.position, blitter.width, blitter.height);
  if (!proj.visible) return;

  const { screenX, screenY, depth, scale } = proj;

  // Determine size tier based on depth/scale
  // Near (< 8m): Large 5-6 row figure
  // Mid (8-18m): Medium 3-4 row figure
  // Far (> 18m): Small 1-2 row token
  const heightRows = Math.max(2, Math.min(7, Math.round(scale * 1.8)));

  const pose = fig.pose.stance;
  const isPlayerTeam = fig.style.jacketColor !== '#ef4444' && fig.style.jacketColor !== '#dc2626';

  if (heightRows >= 5) {
    // HIGH DETAIL (5-7 lines tall)
    // 1. Head
    blitter.setCell(screenX, screenY - 4, '@', fig.style.headColor, '#000000', depth - 0.2);

    // 2. Torso with Stone Island / Tracktop jacket
    const leftArm = pose === 'punch' ? '━' : pose === 'guard' ? '╱' : '│';
    const rightArm = pose === 'punch' ? '►' : pose === 'guard' ? '╲' : '│';
    blitter.setCell(screenX - 1, screenY - 3, leftArm, '#94a3b8', '#000000', depth - 0.1);
    blitter.setCell(screenX, screenY - 3, '█', fig.style.jacketColor, '#000000', depth - 0.1);
    blitter.setCell(screenX + 1, screenY - 3, rightArm, '#94a3b8', '#000000', depth - 0.1);

    // Stone Island badge on left sleeve!
    if (fig.style.badgeColor) {
      blitter.setCell(screenX - 1, screenY - 2, '◆', fig.style.badgeColor, '#000000', depth - 0.15);
    }

    blitter.setCell(screenX, screenY - 2, '█', fig.style.jacketColor, '#000000', depth - 0.1);

    // 3. Legs (Dark denim / cords)
    const legLeft = pose === 'run' ? '╱' : pose === 'knocked_down' ? '—' : '│';
    const legRight = pose === 'run' ? '╲' : pose === 'knocked_down' ? '—' : '│';
    blitter.setCell(screenX - 1, screenY - 1, legLeft, fig.style.jeansColor, '#000000', depth);
    blitter.setCell(screenX + 1, screenY - 1, legRight, fig.style.jeansColor, '#000000', depth);

    // 4. Trainers / Boots
    blitter.setCell(screenX - 1, screenY, '▲', '#f8fafc', '#000000', depth);
    blitter.setCell(screenX + 1, screenY, '▲', '#f8fafc', '#000000', depth);

    // Name tag above head
    if (fig.style.label) {
      const tag = fig.style.label.slice(0, 10);
      blitter.drawString(screenX - Math.floor(tag.length / 2), screenY - 5, tag, '#facc15', '#000000', depth - 0.3);
    }
  } else if (heightRows >= 3) {
    // MEDIUM DETAIL (3-4 lines)
    blitter.setCell(screenX, screenY - 2, 'O', fig.style.headColor, '#000000', depth - 0.1);
    const armL = pose === 'punch' ? '─' : '│';
    const armR = pose === 'punch' ? '►' : '│';
    blitter.setCell(screenX - 1, screenY - 1, armL, '#94a3b8', '#000000', depth);
    blitter.setCell(screenX, screenY - 1, '▓', fig.style.jacketColor, '#000000', depth);
    blitter.setCell(screenX + 1, screenY - 1, armR, '#94a3b8', '#000000', depth);
    blitter.setCell(screenX, screenY, '∏', fig.style.jeansColor, '#000000', depth);

    if (fig.style.label) {
      blitter.drawString(screenX - 1, screenY - 3, fig.style.label.slice(0, 4), '#facc15', '#000000', depth - 0.2);
    }
  } else {
    // DISTANT FIGURE (1-2 lines)
    const marker = isPlayerTeam ? '▲' : '▼';
    blitter.setCell(screenX, screenY - 1, marker, fig.style.jacketColor, '#000000', depth);
    blitter.setCell(screenX, screenY, 'i', fig.style.jeansColor, '#000000', depth);
  }
}

/**
 * Draw 3D Objective or Weapon (Flag, Purple Flare, Beer Bottle, Baton)
 */
export function drawObjectiveEntity(
  blitter: AsciiBlitter,
  camera: Camera3D,
  obj: Objective3D
): void {
  const proj = camera.project(obj.position, blitter.width, blitter.height);
  if (!proj.visible) return;

  const { screenX, screenY, depth } = proj;

  if (obj.type === 'flare') {
    // Purple Marine Flare with radiant smoke sparks
    blitter.setCell(screenX, screenY, '*', '#f472b6', '#831843', depth - 0.5);
    blitter.setCell(screenX - 1, screenY - 1, '░', '#c084fc', '#581c87', depth - 0.4);
    blitter.setCell(screenX + 1, screenY - 1, '░', '#c084fc', '#581c87', depth - 0.4);
    blitter.setCell(screenX, screenY - 2, '☁', '#e879f9', '#3b0764', depth - 0.4);
  } else if (obj.type === 'flag') {
    // Firm Colors Flag on a pole
    blitter.setCell(screenX, screenY, '│', '#94a3b8', '#000000', depth);
    blitter.setCell(screenX, screenY - 1, '│', '#94a3b8', '#000000', depth);
    blitter.drawString(screenX + 1, screenY - 1, '⚑', obj.color, '#000000', depth - 0.1);
  } else if (obj.type === 'police_barrier') {
    // Steel crowd-control barrier
    blitter.drawString(screenX - 2, screenY, '[====]', '#ef4444', '#450a0a', depth);
  } else {
    // Ball or fist or missile
    blitter.setCell(screenX, screenY, obj.char, obj.color, '#000000', depth);
  }
}

/**
 * Utility: Convert CSS Hex color to ANSI 24-bit TrueColor escape sequence
 */
function hexToAnsi(hex: string): string {
  if (!hex.startsWith('#') || hex.length < 7) {
    return '\x1b[37m'; // Default white
  }
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `\x1b[38;2;${r};${g};${b}m`;
}
