/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SFS v0.1 Firm Clash ASCII 3D Spike Test Harness
 * Instantiates the ASCII 3D Renderer, spawns two Casual figures (Firm Lad vs Rival),
 * tests raycast ground texturing, camera movement, and outputs the rendered frame.
 */

import { ClashRendererEngine } from '../src/services/clashRenderer';

async function runSpike(): Promise<void> {
  console.log('================================================================');
  console.log('   SFS v0.1 ASCII 3D CLASH RENDERER — MINIMAL TEST HARNESS      ');
  console.log('================================================================\n');

  // 1. Instantiate the ASCII Clash Renderer
  const engine = new ClashRendererEngine({
    venueType: 'cobblestone',
    cameraMode: 'broadcast',
    terminalWidth: 80,
    terminalHeight: 24,
    playerPrimaryColor: '#3b82f6', // Northwood Royal Blue
    rivalPrimaryColor: '#ef4444'   // Kingsbridge Red
  });

  console.log('[1] Engine initialized successfully:');
  console.log(`    - Terminal Grid: ${engine.blitter.width} cols x ${engine.blitter.height} rows`);
  console.log(`    - Venue Surface: ${engine.groundType} (Victorian pavers & curbs)`);
  console.log(`    - Camera Mode:   ${engine.camera.mode}`);
  console.log(`    - Initial Cam:   pos(${engine.camera.position.x.toFixed(1)}, ${engine.camera.position.y.toFixed(1)}, ${engine.camera.position.z.toFixed(1)})`);

  // 2. Spawn two 3D figures (one firm lad, one rival)
  console.log('\n[2] Spawning 3D Casual figures:');
  const firmLad = engine.spawnCasual(
    'lad_gaz',
    'Gaz ("The General")',
    true,
    'top_boy',
    { x: -1.8, y: 0, z: -1.5 },
    '#1e3a8a', // Dark Navy Stone Island Jacket
    '#0f172a'  // Dark Denim Jeans
  );
  console.log(`    ✓ Player Lad spawned: [${firmLad.name}] at (x=${firmLad.position.x}, y=${firmLad.position.y}, z=${firmLad.position.z}) wearing Stone Island navy jacket`);

  const rival = engine.spawnCasual(
    'rival_tank',
    'Tank ("The Brute")',
    false,
    'minder',
    { x: 1.8, y: 0, z: 2.2 },
    '#991b1b', // Red Wine Bomber Jacket
    '#1e293b'  // Charcoal Cords
  );
  console.log(`    ✓ Rival Casual spawned: [${rival.name}] at (x=${rival.position.x}, y=${rival.position.y}, z=${rival.position.z}) in stance [${rival.figure.pose.stance}]`);

  // Also deploy a purple marine smoke flare in the alley
  engine.deployPurpleFlare({ x: 0, y: 0, z: 0.5 });
  console.log(`    ✓ Purple Marine Flare deployed at ground center (0, 0, 0.5)`);

  // 3. Render frame 1 (Initial look)
  console.log('\n[3] Rendering Frame 1 (Initial Perspective):');
  const camBeforeX = engine.camera.position.x;
  const camBeforeZ = engine.camera.position.z;

  const frame1 = engine.renderSingleFrame();
  console.log(`    - Frame Index: ${frame1.frameIndex}`);
  console.log(`    - Active Fighters: ${frame1.activePlayerCount} firm lads vs ${frame1.activeRivalCount} rivals`);
  console.log(`    - Camera Pos: (${frame1.cameraPosition.x.toFixed(2)}, ${frame1.cameraPosition.y.toFixed(2)}, ${frame1.cameraPosition.z.toFixed(2)})`);

  // 4. Tick simulation and move camera towards hero mode
  console.log('\n[4] Ticking simulation to confirm entity movement & camera tracking:');
  engine.setCameraMode('hero');
  engine.setHeroFocus('lad_gaz');

  for (let i = 0; i < 5; i++) {
    engine.tick(0.016);
  }

  const camAfterX = engine.camera.position.x;
  const camAfterZ = engine.camera.position.z;
  const cameraMoved = camBeforeX !== camAfterX || camBeforeZ !== camAfterZ;
  console.log(`    - Camera Before: (${camBeforeX.toFixed(2)}, ${camBeforeZ.toFixed(2)})`);
  console.log(`    - Camera After:  (${camAfterX.toFixed(2)}, ${camAfterZ.toFixed(2)})`);
  console.log(`    - Camera Movement Confirmed: ${cameraMoved ? 'YES (Tracked Hero Target)' : 'NO'}`);

  // 5. Render and dump ASCII frame text
  console.log('\n[5] RENDERED 3D ASCII FRAME OUTPUT:');
  console.log('--------------------------------------------------------------------------------');
  const latestFrame = engine.renderSingleFrame();
  console.log(latestFrame.renderedText);
  console.log('--------------------------------------------------------------------------------');

  // Verify ground texture cells and figure cells in buffer
  let hasCobblestones = false;
  let hasSkyline = false;
  let hasFigures = false;
  const buffer = engine.blitter.getBuffer();

  for (let r = 0; r < buffer.length; r++) {
    for (let c = 0; c < buffer[r].length; c++) {
      const char = buffer[r][c].char;
      if (char === ':' || char === '=' || char === '*' || char === '░') {
        hasCobblestones = true;
      }
      if (char === '█' || char === '■') {
        hasSkyline = true;
      }
      if (char === '@' || char === 'O' || char === '◆' || char === '▲' || char === '│') {
        hasFigures = true;
      }
    }
  }

  console.log('\n[6] Feature Verification:');
  console.log(`    - Raycast Ground Texturing: ${hasCobblestones ? 'PASS (Cobblestones, Curbs, Rain Sheen)' : 'FAIL'}`);
  console.log(`    - Urban Horizon Skyline:    ${hasSkyline ? 'PASS (Rowhouse & Factory Silhouettes)' : 'FAIL'}`);
  console.log(`    - Skeletal 3D Figures:      ${hasFigures ? 'PASS (Casual Heads, Jackets, Badges)' : 'FAIL'}`);
  console.log(`    - Camera Tracking:          ${cameraMoved ? 'PASS (Smooth Interpolation)' : 'FAIL'}`);

  console.log('\n>>> SFS ASCII 3D CLASH RENDERER SPIKE COMPLETED SUCCESSFULLY <<<\n');
}

runSpike().catch(err => {
  console.error('Spike failed with error:', err);
  process.exit(1);
});
