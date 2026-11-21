// Acts 01-05 (00.00s - 38.45s): Rainy Neon Cassette, Summer Sea Train, Soda Stardust, Golden Seawall, Ferris Fireworks
window.SUMMER = window.SUMMER || {};

(function (S) {
  const {
    W, H,
    clamp, lerp, invLerp, smoothstep, easeOutCubic, easeInCubic, easeInOutQuad,
    hash, lerpColor, rgba,
    drawSkyGradient, drawStarfield, drawCumulusCloud, drawOcean,
    drawAnimeBoy, drawAnimeGirl, drawRetroCassette, drawPaperPlane,
    drawSodaBottle, drawFerrisWheel, drawSeaTrain, drawCinemaFirework, drawAudioWaveAccent
  } = S;

  // Helper: Delicate 4-point anime star flare
  function drawSparkleStar(ctx, x, y, r, col, alpha) {
    if (alpha <= 0.01 || r <= 0.5) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = rgba(col, alpha);
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.14, -r * 0.14, r, 0);
    ctx.quadraticCurveTo(r * 0.14, r * 0.14, 0, r);
    ctx.quadraticCurveTo(-r * 0.14, r * 0.14, -r, 0);
    ctx.quadraticCurveTo(-r * 0.14, -r * 0.14, 0, -r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // ACT 01 (00.00 - 09.10s): Midnight Neon Rain Window & Spinning Retro Cassette
  // =========================================================================
  function renderAct1(ctx, t, beat, kBeat) {
    drawSkyGradient(ctx, [
      [0, '#080d20'],
      [0.46, '#131b3c'],
      [0.80, '#22224d'],
      [1, '#11122a']
    ]);

    // Layered distant city skyline with rooftop antennas, neon signs & warm windows
    ctx.save();
    for (let i = 0; i < 28; i++) {
      const bx = i * 50 - 14;
      const bw = 36 + hash(i * 7.3) * 32;
      const bh = 95 + hash(i * 13.7) * 205;
      const topY = H - 135 - bh;
      ctx.fillStyle = i % 2 === 0 ? '#0b1026' : '#0f1633';
      ctx.fillRect(bx, topY, bw, bh + 135);

      // Rooftop radio spire & red aviation beacon on taller towers
      if (bh > 215) {
        ctx.fillStyle = '#182246';
        ctx.fillRect(bx + bw * 0.48, topY - 26, 2, 26);
        const blink = 0.45 + 0.55 * Math.sin(t * 3.4 + i);
        ctx.fillStyle = `rgba(255, 84, 128, ${blink * 0.85})`;
        ctx.beginPath();
        ctx.arc(bx + bw * 0.48 + 1, topY - 26, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Distant glowing office/apartment window grid
      for (let w = 0; w < 8; w++) {
        if (hash(i * 19 + w * 5.7) > 0.48) {
          ctx.fillStyle = w % 3 === 0
            ? 'rgba(255, 198, 132, 0.34)'
            : w % 3 === 1
              ? 'rgba(105, 218, 255, 0.28)'
              : 'rgba(255, 140, 196, 0.24)';
          ctx.fillRect(bx + 5 + (w % 3) * 10, topY + 12 + Math.floor(w / 3) * 18, 5, 8);
        }
      }
    }
    ctx.restore();

    // Dreamy out-of-focus city neon Bokeh circles breathing smoothly on beat
    ctx.save();
    const bokehCols = ['#ff6ba9', '#5ed8ff', '#ffb86c', '#b78cff', '#ff5b84'];
    for (let i = 0; i < 38; i++) {
      const bx = hash(i * 17.3 + 2) * W;
      const by = 85 + hash(i * 29.1 + 5) * 520;
      const baseR = 14 + hash(i * 9.7) * 44;
      const r = baseR * (1 + beat.pulse * 0.12 * kBeat);
      const col = bokehCols[i % bokehCols.length];
      const a = (0.11 + hash(i * 4.3) * 0.17) * (0.74 + beat.pulse * 0.52 * kBeat);
      const g = ctx.createRadialGradient(bx, by, r * 0.1, bx, by, r);
      g.addColorStop(0, rgba(col, a * 1.15));
      g.addColorStop(0.75, rgba(col, a * 0.62));
      g.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Subtle concentric audio halo behind cassette
    ctx.save();
    for (let ring = 0; ring < 3; ring++) {
      const rr = 168 + ring * 52 + beat.pulse * (18 + ring * 8) * kBeat;
      ctx.strokeStyle = rgba(ring % 2 === 0 ? '#67d8f5' : '#ff7eb6', (0.22 - ring * 0.055) * (0.65 + beat.pulse * 0.7));
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.49, rr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Hero Translucent Retro Cassette Tape floating gently
    const floatY = Math.sin(t * 2.0) * 8.5;
    const tilt = Math.sin(t * 1.35) * 0.022 + (beat.beatInBar % 2 === 0 ? 1 : -1) * beat.pulse * 0.011 * kBeat;
    ctx.save();
    ctx.translate(W * 0.5, H * 0.48 + floatY);
    ctx.rotate(tilt);
    drawRetroCassette(ctx, 0, 0, 1.08, t, { ...beat, pulse: beat.pulse * kBeat });
    ctx.restore();

    // Detailed Raindrop Glass Pane (slanted background streaks + refracted glowing beads with specular pinpoints)
    ctx.save();
    // Fine diagonal rain lines outside window
    ctx.strokeStyle = 'rgba(180, 222, 255, 0.12)';
    ctx.lineWidth = 1.0;
    for (let i = 0; i < 48; i++) {
      const rx = hash(i * 41.3 + 5) * W;
      const ry = ((hash(i * 67.1) * H + t * (280 + hash(i * 8.1) * 160)) % (H + 60)) - 30;
      ctx.beginPath();
      ctx.moveTo(rx, ry); ctx.lineTo(rx - 5, ry + 26);
      ctx.stroke();
    }
    // Larger sliding foreground window droplets with rim shadow + neon refraction + white highlight!
    for (let i = 0; i < 44; i++) {
      const rx = hash(i * 37.1) * W;
      const speed = 28 + hash(i * 11.9) * 58;
      const ry = ((hash(i * 53.3) * H + t * speed) % (H + 60)) - 30;
      const dr = 2.0 + hash(i * 7.7) * 4.2;
      // Wet slide trail
      ctx.strokeStyle = 'rgba(200, 228, 255, 0.13)';
      ctx.lineWidth = dr * 0.55;
      ctx.beginPath();
      ctx.moveTo(rx, ry - dr * 10);
      ctx.lineTo(rx, ry);
      ctx.stroke();
      // Subtle dark glass rim
      ctx.fillStyle = 'rgba(10, 16, 36, 0.35)';
      ctx.beginPath();
      ctx.ellipse(rx + 0.5, ry + 1.0, dr * 0.85, dr * 1.25, 0, 0, Math.PI * 2);
      ctx.fill();
      // Refracted neon droplet fill
      ctx.fillStyle = i % 3 === 0 ? 'rgba(255, 195, 228, 0.52)' : 'rgba(190, 238, 255, 0.52)';
      ctx.beginPath();
      ctx.ellipse(rx, ry, dr * 0.80, dr * 1.18, 0, 0, Math.PI * 2);
      ctx.fill();
      // Crisp specular highlight dot on upper edge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.beginPath();
      ctx.arc(rx - dr * 0.22, ry - dr * 0.38, dr * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Elegant Opening Title Card overlay (0.3s - 3.8s)
    if (t >= 0.3 && t <= 3.8) {
      const aIn = smoothstep(invLerp(0.3, 1.0, t));
      const aOut = 1 - smoothstep(invLerp(2.8, 3.8, t));
      ctx.save();
      ctx.globalAlpha = aIn * aOut;
      ctx.textAlign = 'center';
      ctx.font = '300 18px "Microsoft YaHei", sans-serif';
      ctx.fillStyle = 'rgba(178, 234, 255, 0.88)';
      ctx.fillText('L A S T   S U M M E R   ·   M U S I C   F I L M', W * 0.5, 118);
      ctx.restore();
    }
  }

  // =========================================================================
  // ACT 02 (09.10 - 18.25s): Shinkai Summer Sky, Painterly Cumulus & Sea-Skimming Train
  // =========================================================================
  function renderAct2(ctx, t, beat, kBeat) {
    const local = t - 9.10;
    drawSkyGradient(ctx, [
      [0, '#0e52ad'],
      [0.36, '#2a8ae0'],
      [0.64, '#79c6f5'],
      [0.78, '#d4effc'],
      [1, '#fef7ea']
    ]);

    // Brilliant upper-right summer sun halo
    const sunX = W * 0.80, sunY = 122;
    const sg = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 360);
    sg.addColorStop(0, 'rgba(255, 254, 240, 0.96)');
    sg.addColorStop(0.24, 'rgba(255, 245, 200, 0.54)');
    sg.addColorStop(1, 'rgba(255, 240, 200, 0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 360, 0, Math.PI * 2);
    ctx.fill();

    // Painterly Makoto Shinkai cumulonimbus clouds drifting majestically
    const drift = local * 10;
    drawCumulusCloud(ctx, 290 - drift * 0.45, 315, 1.48, { lightCol: '#ffffff', midCol: '#dfeffc', shadeCol: '#7ca3d4', rimCol: '#fff8de' });
    drawCumulusCloud(ctx, 945 - drift * 0.65, 285, 1.72, { lightCol: '#ffffff', midCol: '#d9ecfc', shadeCol: '#6e97cc', rimCol: '#fff8dc' });
    drawCumulusCloud(ctx, 640 - drift * 0.28, 355, 1.12, { lightCol: '#fffefa', midCol: '#e4f2fc', shadeCol: '#88add8', alpha: 0.9 });

    // Distant white coastal seagulls soaring gracefully across summer sky
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    for (let g = 0; g < 5; g++) {
      const gx = (180 + g * 185 + local * (18 + g * 3)) % (W + 80) - 40;
      const gy = 148 + (g % 3) * 34 + Math.sin(t * 2.2 + g) * 6;
      const flap = Math.sin(t * 5.2 + g * 1.7) * 5;
      const span = 10 + (g % 2) * 3;
      ctx.beginPath();
      ctx.moveTo(gx - span, gy - flap);
      ctx.quadraticCurveTo(gx - span * 0.4, gy - 5 - flap * 0.3, gx, gy);
      ctx.quadraticCurveTo(gx + span * 0.4, gy - 5 - flap * 0.3, gx + span, gy - flap);
      ctx.stroke();
    }
    ctx.restore();

    // Sparkling summer ocean
    const horizonY = 428;
    drawOcean(ctx, horizonY, t, {
      topCol: '#1f7fd4',
      midCol: '#1560b5',
      botCol: '#0d3e80',
      glitterCol: '#fffbe0',
      sunX,
      glitterSpread: 380,
      shimmerAlpha: 0.95,
      beatPulse: beat.pulse * kBeat
    });

    // Detailed Concrete Sea Viaduct Trestle Deck, Parapet Rail & Piers
    const railY = 508;
    const pierStep = 140;
    const pierOff = -((local * 340) % pierStep);
    for (let px = pierOff - pierStep; px < W + pierStep; px += pierStep) {
      // Concrete pier column with sunlit right edge
      ctx.fillStyle = '#142f54';
      ctx.fillRect(px, railY + 12, 18, H - railY);
      ctx.fillStyle = 'rgba(130, 195, 240, 0.28)';
      ctx.fillRect(px + 15, railY + 12, 3, H - railY);
      // Shimmering water reflection below pier
      ctx.fillStyle = 'rgba(12, 32, 66, 0.35)';
      ctx.fillRect(px + 2, railY + 46, 14, 72);
    }
    // Viaduct concrete beam + top sunlit deck lip + steel safety rail
    ctx.fillStyle = '#1b3e68';
    ctx.fillRect(0, railY, W, 14);
    ctx.fillStyle = 'rgba(218, 244, 255, 0.55)';
    ctx.fillRect(0, railY, W, 2);
    ctx.fillStyle = '#102646';
    ctx.fillRect(0, railY + 11, W, 4);

    // Coastal summer train gliding smoothly across the sea!
    const trainX = lerp(-430, 410, smoothstep(invLerp(9.1, 18.25, t)));
    const bob = beat.pulse * 1.6 * kBeat;
    // Soft mirrored water reflection of train below viaduct
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.translate(0, railY * 2 + 22);
    ctx.scale(1, -0.52);
    drawSeaTrain(ctx, trainX, railY, 1.0, false);
    ctx.restore();

    drawSeaTrain(ctx, trainX, railY - bob, 1.0, false);

    // Overhead twin catenary wires (contact wire aligned right at train pantograph height ~408!)
    ctx.strokeStyle = 'rgba(18, 38, 68, 0.58)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 408); ctx.lineTo(W, 408); // contact wire
    ctx.moveTo(0, 380); ctx.quadraticCurveTo(W * 0.5, 402, W, 380); // sagging messenger wire
    ctx.stroke();

    // Fast-passing foreground sleek coastal catenary steel masts for speed depth
    const poleStep = 560;
    const poleOff = -((local * 620) % poleStep);
    for (let x = poleOff; x < W + poleStep; x += poleStep) {
      ctx.fillStyle = 'rgba(18, 34, 62, 0.80)';
      ctx.fillRect(x, 224, 6.5, H - 224);
      ctx.fillStyle = 'rgba(125, 178, 224, 0.25)';
      ctx.fillRect(x + 5, 224, 1.5, H - 224);
      ctx.fillStyle = 'rgba(18, 34, 62, 0.80)';
      ctx.fillRect(x - 24, 377, 54, 3.5);
      ctx.fillRect(x - 16, 406, 42, 2.5);
      // Ceramic insulators along crossarm
      ctx.fillStyle = '#dcefff';
      ctx.fillRect(x - 20, 374, 3, 4);
      ctx.fillRect(x + 22, 374, 3, 4);
      // Slender diagonal cantilever tension rod
      ctx.strokeStyle = 'rgba(18, 34, 62, 0.72)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x + 3, 350); ctx.lineTo(x + 24, 378);
      ctx.stroke();
    }

    // Origami white paper airplane soaring gracefully across the sunny sky!
    const planeP = invLerp(11.4, 17.9, t);
    if (planeP > 0 && planeP < 1) {
      const px = lerp(-60, W + 80, planeP);
      const py = 270 - Math.sin(planeP * Math.PI * 1.35) * 95 + Math.sin(t * 4) * 8;
      const pRot = -0.18 + Math.cos(planeP * Math.PI * 1.35) * -0.18;
      // Tapered luminous vapor ribbon trail behind paper plane
      ctx.save();
      for (let s = 0; s < 22; s++) {
        const sp0 = Math.max(0, planeP - s * 0.011);
        const sp1 = Math.max(0, planeP - (s + 1) * 0.011);
        const x0 = lerp(-60, W + 80, sp0);
        const y0 = 270 - Math.sin(sp0 * Math.PI * 1.35) * 95 + Math.sin((t - s * 0.065) * 4) * 8;
        const x1 = lerp(-60, W + 80, sp1);
        const y1 = 270 - Math.sin(sp1 * Math.PI * 1.35) * 95 + Math.sin((t - (s + 1) * 0.065) * 4) * 8;
        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - s / 22) * 0.62})`;
        ctx.lineWidth = (1 - s / 22) * 3.0;
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      ctx.restore();
      drawPaperPlane(ctx, px, py, 1.35, pRot, 0.85);
    }

    // Warm sun lens-flare orbs diagonally across frame
    ctx.save();
    [[0.62, 0.30, 32, '#fff5cc', 0.22], [0.46, 0.45, 58, '#8be2ff', 0.14], [0.30, 0.62, 22, '#ffc4de', 0.20]].forEach(([fx, fy, fr, fc, fa]) => {
      ctx.fillStyle = rgba(fc, fa * (0.82 + beat.pulse * 0.35 * kBeat));
      ctx.beginPath();
      ctx.arc(W * fx, H * fy, fr, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // =========================================================================
  // ACT 03 (18.25 - 24.30s): Zero-Gravity Starlight & Emptying Ramune Soda Bottle
  // =========================================================================
  function renderAct3(ctx, t, beat, kBeat) {
    drawSkyGradient(ctx, [
      [0, '#090d24'],
      [0.45, '#171f4a'],
      [0.82, '#2b2459'],
      [1, '#121530']
    ]);
    drawStarfield(ctx, t, 0.95, 95, H - 60);

    // Expanding neon soundwave rings radiating gently from bottle
    const cx = W * 0.5, cy = H * 0.49;
    ctx.save();
    for (let i = 0; i < 4; i++) {
      const rp = (t * 0.82 + i * 0.25) % 1;
      const rr = 80 + rp * 380;
      const a = (1 - rp) * (0.26 + beat.pulse * 0.30 * kBeat);
      ctx.strokeStyle = rgba(i % 2 === 0 ? '#6ce0ff' : '#ff88be', a);
      ctx.lineWidth = 2.2 * (1 - rp * 0.5);
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Floating authentic Ramune Soda Bottle slowly emptying ("却总是被一次掏空") into glowing stardust!
    const fillLevel = lerp(0.86, 0.08, smoothstep(invLerp(19.6, 23.9, t)));
    const bottleTilt = Math.sin(t * 1.8) * 0.075 + smoothstep(invLerp(21.0, 23.8, t)) * 0.26;
    const bottleY = cy + Math.sin(t * 2.2) * 11;
    const bottleScale = 1.12 + beat.pulse * 0.025 * kBeat;

    ctx.save();
    ctx.translate(cx, bottleY);
    ctx.rotate(bottleTilt);
    drawSodaBottle(ctx, 0, 0, bottleScale, t, fillLevel, { ...beat, pulse: beat.pulse * kBeat });
    ctx.restore();

    // Compute exact world position of tilted Ramune bottle mouth for escaping effervescent stardust!
    const mouthX = cx + Math.sin(bottleTilt) * 188 * bottleScale;
    const mouthY = bottleY - Math.cos(bottleTilt) * 188 * bottleScale;

    // Soft glowing fizzy vapor mist rising right out of the bottle mouth
    const spill = smoothstep(invLerp(19.4, 23.6, t));
    const mistG = ctx.createRadialGradient(mouthX, mouthY, 4, mouthX, mouthY - 26, 95 + spill * 45);
    mistG.addColorStop(0, `rgba(195, 246, 255, ${0.42 + spill * 0.25})`);
    mistG.addColorStop(0.5, `rgba(255, 178, 224, ${0.18 + spill * 0.14})`);
    mistG.addColorStop(1, 'rgba(130, 224, 255, 0)');
    ctx.fillStyle = mistG;
    ctx.beginPath();
    ctx.arc(mouthX, mouthY - 22, 95 + spill * 45, 0, Math.PI * 2);
    ctx.fill();

    // Escaping golden/cyan memory stardust & 4-point diamond sparkles drifting out from bottle mouth!
    ctx.save();
    for (let i = 0; i < 72; i++) {
      const life = ((t * (0.25 + hash(i * 5.7) * 0.22) + hash(i * 19.1)) % 1);
      const ang = -Math.PI * 0.5 + bottleTilt + (hash(i * 11.3) - 0.5) * 2.2 + Math.sin(t * 1.5 + i) * 0.22;
      const dist = 16 + easeOutCubic(life) * (250 + spill * 290);
      const sx = mouthX + Math.cos(ang) * dist;
      const sy = mouthY + Math.sin(ang) * dist * 0.78;
      const a = Math.sin(life * Math.PI) * (0.38 + spill * 0.62);
      const col = i % 3 === 0 ? '#ffd98a' : i % 3 === 1 ? '#7de6ff' : '#ff95c8';
      const r = (1.6 + hash(i * 3.9) * 3.6) * (1 + beat.pulse * 0.28 * kBeat);
      if (i % 5 === 0) {
        drawSparkleStar(ctx, sx, sy, r * 2.4, col, a);
      } else {
        ctx.fillStyle = rgba(col, a);
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    drawAudioWaveAccent(ctx, t, { ...beat, pulse: beat.pulse * kBeat }, H - 122, '#7de6ff', 0.42);
  }

  // =========================================================================
  // ACT 04 (24.30 - 31.15s): Golden Hour Seawall — The Little Promise & Fading Silhouette
  // =========================================================================
  function renderAct4(ctx, t, beat, kBeat) {
    drawSkyGradient(ctx, [
      [0, '#2c295c'],
      [0.24, '#7d4675'],
      [0.48, '#d96f7b'],
      [0.70, '#ffab73'],
      [0.86, '#ffe0a3'],
      [1, '#fff0c4']
    ]);

    // Soft painterly sunset clouds glowing rose & gold
    drawCumulusCloud(ctx, 210, 235, 1.02, { lightCol: '#ffe6b8', midCol: '#f29b91', shadeCol: '#8a527a', rimCol: '#fff4cc', alpha: 0.85 });
    drawCumulusCloud(ctx, 1080, 215, 1.12, { lightCol: '#ffe3b2', midCol: '#ed928e', shadeCol: '#7f4c76', rimCol: '#fff2c4', alpha: 0.82 });

    // Huge molten golden sun resting on the ocean horizon + subtle volumetric sunbeams
    const horizonY = 445;
    const sunX = W * 0.5, sunY = horizonY - 26;
    const sunHalo = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 360);
    sunHalo.addColorStop(0, 'rgba(255, 250, 224, 0.96)');
    sunHalo.addColorStop(0.28, 'rgba(255, 205, 132, 0.65)');
    sunHalo.addColorStop(0.62, 'rgba(255, 134, 146, 0.25)');
    sunHalo.addColorStop(1, 'rgba(255, 120, 140, 0)');
    ctx.fillStyle = sunHalo;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 360, 0, Math.PI * 2);
    ctx.fill();

    // Delicate radial golden hour light rays fanning out softly behind horizon
    ctx.save();
    for (let r = 0; r < 7; r++) {
      const ang = -Math.PI + (r + 0.5) * (Math.PI / 7) + Math.sin(t * 0.4 + r) * 0.03;
      const rg = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(ang) * 520, sunY + Math.sin(ang) * 520);
      rg.addColorStop(0, 'rgba(255, 240, 192, 0.14)');
      rg.addColorStop(1, 'rgba(255, 220, 175, 0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sunX + Math.cos(ang - 0.045) * 520, sunY + Math.sin(ang - 0.045) * 520);
      ctx.lineTo(sunX + Math.cos(ang + 0.045) * 520, sunY + Math.sin(ang + 0.045) * 520);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = '#fff5cf';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 74, 0, Math.PI * 2);
    ctx.fill();

    // Molten sunset sea
    drawOcean(ctx, horizonY, t, {
      topCol: '#cf6d72',
      midCol: '#8d4868',
      botCol: '#38254a',
      glitterCol: '#ffe8a8',
      sunX,
      glitterSpread: 320,
      shimmerAlpha: 0.95,
      beatPulse: beat.pulse * kBeat
    });

    // Detailed Seaside Concrete Seawall Coping & Multi-Bar Steel Guardrail
    const railTopY = 548;
    // Concrete seawall body + subtle stone joint lines
    const wallGrad = ctx.createLinearGradient(0, 616, 0, H);
    wallGrad.addColorStop(0, '#221c38');
    wallGrad.addColorStop(1, '#120e21');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 618, W, H - 618);
    // Coping ledge lip with warm backlit sun rim
    ctx.fillStyle = '#2d2445';
    ctx.fillRect(0, 614, W, 7);
    ctx.fillStyle = 'rgba(255, 212, 148, 0.45)';
    ctx.fillRect(0, 614, W, 1.5);
    ctx.strokeStyle = 'rgba(10, 8, 22, 0.45)';
    ctx.lineWidth = 1.5;
    for (let sx = 80; sx < W; sx += 160) {
      ctx.beginPath(); ctx.moveTo(sx, 621); ctx.lineTo(sx, H); ctx.stroke();
    }

    // Horizontal steel pipes & slender tension cables
    ctx.strokeStyle = '#241e3d';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(0, railTopY); ctx.lineTo(W, railTopY);
    ctx.stroke();
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(0, railTopY + 24); ctx.lineTo(W, railTopY + 24);
    ctx.moveTo(0, railTopY + 46); ctx.lineTo(W, railTopY + 46);
    ctx.stroke();
    // Warm sunlit top highlight along guardrail pipe
    ctx.strokeStyle = 'rgba(255, 218, 158, 0.65)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, railTopY - 2); ctx.lineTo(W, railTopY - 2);
    ctx.stroke();
    // Stanchion posts with base anchor plates
    for (let x = 44; x < W; x += 116) {
      ctx.fillStyle = '#1b1630';
      ctx.fillRect(x, railTopY - 2, 7, 68);
      ctx.fillStyle = 'rgba(255, 206, 148, 0.42)';
      ctx.fillRect(x + 5.5, railTopY, 1.5, 66);
      ctx.fillStyle = '#151126';
      ctx.fillRect(x - 4, 610, 15, 5);
    }

    // Boy & Girl standing together against the blazing golden sun!
    // Precisely calibrated so reaching hands meet at (W*0.5, 468)!
    const reachP = smoothstep(invLerp(26.1, 27.9, t));
    const fadeGirl = 1 - smoothstep(invLerp(29.1, 30.85, t));

    const boyX = lerp(W * 0.445, W * 0.459, reachP);
    const girlX = lerp(W * 0.555, W * 0.541, reachP) + (1 - fadeGirl) * 48;

    drawAnimeBoy(ctx, boyX, 634, 1.38, {
      fillCol: '#171329',
      rimCol: '#ffd89e',
      shirtCol: '#ffe2cc',
      t,
      facing: 1,
      armRaise: reachP * 0.72
    });

    if (fadeGirl > 0.02) {
      drawAnimeGirl(ctx, girlX, 634, 1.35, {
        fillCol: '#1e1532',
        rimCol: '#ffd4e2',
        dressCol: '#ffe6ef',
        t,
        facing: -1,
        armRaise: reachP * 0.72,
        alpha: fadeGirl
      });
    }

    // Promise 4-point star flare right between their fingertips (27.3 - 29.7s)
    if (t >= 27.3 && t <= 29.7) {
      const sp = Math.sin(invLerp(27.3, 29.7, t) * Math.PI);
      const px = W * 0.5, py = 468;
      const pg = ctx.createRadialGradient(px, py, 2, px, py, 78 * sp);
      pg.addColorStop(0, `rgba(255, 255, 242, ${0.95 * sp})`);
      pg.addColorStop(0.36, `rgba(255, 214, 148, ${0.58 * sp})`);
      pg.addColorStop(1, 'rgba(255, 180, 140, 0)');
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.arc(px, py, 78 * sp, 0, Math.PI * 2);
      ctx.fill();
      drawSparkleStar(ctx, px, py, 34 * sp, '#fffdf0', 0.92 * sp);
    }

    // Girl dissolving into warm wind-blown embers & star motes as she walks away (28.85 - 31.15s)
    if (t >= 28.85) {
      const dp = invLerp(28.85, 31.15, t);
      ctx.save();
      for (let i = 0; i < 56; i++) {
        const px = W * 0.54 + hash(i * 13.1) * 55 + dp * (80 + hash(i * 7.3) * 270);
        const py = 415 + hash(i * 23.7) * 200 - dp * (42 + hash(i * 9.1) * 145) + Math.sin(t * 4 + i) * 8;
        const a = Math.sin(clamp(dp * 1.15, 0, 1) * Math.PI) * (0.45 + 0.55 * hash(i * 3.7));
        const r = 1.8 + hash(i * 5.9) * 3.8;
        const col = i % 2 === 0 ? '#ffd89e' : '#ffa8cc';
        if (i % 6 === 0) {
          drawSparkleStar(ctx, px, py, r * 2.5, col, a);
        } else {
          ctx.fillStyle = rgba(col, a);
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  // =========================================================================
  // ACT 05 (31.15 - 38.45s): DJ CHORUS DROP — Steel-Lattice Ferris Wheel & Hanabi Fireworks!
  // =========================================================================
  function renderAct5(ctx, t, beat, kBeat) {
    drawSkyGradient(ctx, [
      [0, '#070b1e'],
      [0.42, '#12193e'],
      [0.72, '#251d4f'],
      [1, '#141130']
    ]);
    drawStarfield(ctx, t, 0.9, 85, 445);

    // Beat-timed Multi-Tier Summer Hanabi Fireworks bursting across the coast!
    const fwSchedule = [
      { t0: 31.20, dur: 2.35, x: W * 0.24, y: 195, r: 215, cols: ['#ff7eb6', '#ffd68a', '#ffffff'], big: true },
      { t0: 32.18, dur: 2.25, x: W * 0.78, y: 175, r: 198, cols: ['#6ce0ff', '#c2f0ff', '#a89cff'], big: false },
      { t0: 33.16, dur: 2.45, x: W * 0.51, y: 162, r: 245, cols: ['#ffd470', '#ff88b8', '#fff4cc'], big: true },
      { t0: 34.14, dur: 2.15, x: W * 0.17, y: 268, r: 168, cols: ['#c38fff', '#ff8ac0', '#e8d4ff'], big: false },
      { t0: 35.12, dur: 2.45, x: W * 0.73, y: 212, r: 238, cols: ['#ff6fa6', '#72e4ff', '#ffe29c'], big: true },
      { t0: 36.10, dur: 2.30, x: W * 0.35, y: 174, r: 215, cols: ['#70e0ff', '#ffd67a', '#ffffff'], big: false },
      { t0: 37.08, dur: 2.10, x: W * 0.62, y: 185, r: 228, cols: ['#ff88bc', '#ffe08a', '#9ee8ff'], big: true }
    ];
    fwSchedule.forEach((fw) => {
      const p = (t - fw.t0) / fw.dur;
      if (p > 0 && p < 1) {
        drawCinemaFirework(ctx, fw.x, fw.y, p, fw.cols, fw.r, fw.big);
      }
    });

    // Distant illuminated coastal Ferris wheel with steel lattice truss & windowed gondolas
    const horizonY = 478;
    drawFerrisWheel(ctx, W * 0.66, 338, 138, t, { ...beat, pulse: beat.pulse * kBeat });

    // Coastal bay water reflecting neon wheel & fireworks
    drawOcean(ctx, horizonY, t, {
      topCol: '#1b2048',
      midCol: '#12183a',
      botCol: '#090c20',
      glitterCol: beat.beatInBar % 2 === 0 ? '#ff94c4' : '#7ae2ff',
      sunX: W * 0.66,
      glitterSpread: 380,
      shimmerAlpha: 0.78,
      beatPulse: beat.pulse * kBeat
    });

    // Shimmering colored ocean reflections directly beneath every active hanabi firework!
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    fwSchedule.forEach((fw) => {
      const p = (t - fw.t0) / fw.dur;
      if (p > 0.04 && p < 0.92) {
        const fade = p < 0.48 ? smoothstep(p / 0.16) : 1 - smoothstep(invLerp(0.48, 0.92, p));
        const col = fw.cols[0];
        const reflW = fw.r * (0.45 + 0.55 * easeOutCubic(p));
        const rg = ctx.createRadialGradient(fw.x, horizonY + 18, 6, fw.x, horizonY + 86, reflW);
        rg.addColorStop(0, rgba(col, 0.34 * fade));
        rg.addColorStop(0.55, rgba(fw.cols[1] || col, 0.14 * fade));
        rg.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = rg;
        ctx.fillRect(fw.x - reflW, horizonY, reflW * 2, H - horizonY);
        // Horizontal rippled reflection streaks on the sea
        for (let row = 0; row < 10; row++) {
          const ry = horizonY + 8 + row * row * 2.1;
          const rw = (36 + (10 - row) * 8) * fade * (0.65 + 0.35 * Math.sin(t * 7 + row * 2.1 + fw.x));
          const rx = fw.x + Math.sin(t * 4.5 + row * 1.8) * 14;
          ctx.fillStyle = rgba(row % 2 === 0 ? col : (fw.cols[1] || col), 0.36 * fade * (1 - row / 12));
          ctx.beginPath();
          ctx.roundRect(rx - rw * 0.5, ry, rw, 2.2 + row * 0.25, 2);
          ctx.fill();
        }
      }
    });
    ctx.restore();

    // Distant coastal harbor skyline, lighthouse beacon & glowing promenade strip along horizon
    ctx.save();
    ctx.fillStyle = '#0d122b';
    ctx.fillRect(0, horizonY - 14, W, 16);
    // Low harbor buildings silhouette
    for (let b = 0; b < 22; b++) {
      const bx = b * 62 + hash(b * 3.1) * 16;
      const bw = 24 + hash(b * 9.7) * 28;
      const bh = 12 + hash(b * 13.3) * 26;
      ctx.fillRect(bx, horizonY - 12 - bh, bw, bh);
    }
    // Promenade warm/neon streetlamps + subtle reflection dots
    for (let i = 0; i < 68; i++) {
      const lx = hash(i * 17.7) * W;
      const ly = horizonY - 7 - hash(i * 5.3) * 10;
      const col = i % 3 === 0 ? '#ffd88a' : i % 3 === 1 ? '#ff7eb6' : '#6ce0ff';
      ctx.fillStyle = col;
      ctx.fillRect(lx, ly, 3.5, 3.5);
      // Soft water glint underneath lamp
      ctx.fillStyle = rgba(col, 0.26);
      ctx.fillRect(lx - 1, horizonY + 4 + (i % 5) * 4, 5.5, 1.5);
    }
    ctx.restore();

    // Subtle dark shoreline stone embankment at left foreground
    ctx.fillStyle = '#090c1c';
    ctx.beginPath();
    ctx.moveTo(0, 636);
    ctx.lineTo(445, 646);
    ctx.lineTo(485, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(beat.beatInBar % 2 === 0 ? '#ff94c4' : '#7ae2ff', 0.35);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 636); ctx.lineTo(445, 646);
    ctx.stroke();

    // Sculpted anime boy silhouette standing alone at left shoreline watching the fireworks
    drawAnimeBoy(ctx, W * 0.24, 646, 1.32, {
      fillCol: '#0c1024',
      rimCol: beat.beatInBar % 2 === 0 ? '#ff9ec8' : '#8ce8ff',
      shirtCol: '#2e4074',
      t,
      facing: 1,
      armRaise: 0
    });

    drawAudioWaveAccent(ctx, t, { ...beat, pulse: beat.pulse * kBeat }, H - 122, '#ff8ac2', 0.52);
  }

  Object.assign(S, { renderAct1, renderAct2, renderAct3, renderAct4, renderAct5 });
})(window.SUMMER);
