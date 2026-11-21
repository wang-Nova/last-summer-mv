// Acts 06-10 (38.45s - 79.00s): Four-Season Station, Blooming Orchid & Neon Ride, Split-Time Storm, Dawn Rain, Sunrise Release
window.SUMMER = window.SUMMER || {};

(function (S) {
  const {
    W, H,
    clamp, lerp, invLerp, smoothstep, easeOutCubic, easeInCubic, easeInOutQuad, easeOutBack,
    hash, lerpColor, rgba,
    drawSkyGradient, drawStarfield, drawCumulusCloud, drawOcean,
    drawAnimeBoy, drawAnimeGirl, drawPaperPlane, drawSeaTrain, drawOrchidFlower,
    drawCinemaFirework, drawAudioWaveAccent, drawCinemaFinish,
    renderAct1, renderAct2, renderAct3, renderAct4, renderAct5
  } = S;

  // Helper: 5-pointed tumbling Autumn maple leaf
  function drawMapleLeaf(ctx, x, y, r, rot, col, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = rgba(col, alpha);
    ctx.beginPath();
    const pts = 5;
    for (let i = 0; i < pts * 2; i++) {
      const a = (i / (pts * 2)) * Math.PI * 2 - Math.PI * 0.5;
      const rad = i % 2 === 0 ? r * (i === 0 ? 1.15 : 0.92) : r * 0.40;
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Helper: Crystalline 6-spoke Winter snowflake
  function drawSnowflake(ctx, x, y, r, rot, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = `rgba(238, 248, 255, ${alpha})`;
    ctx.lineWidth = 1.0;
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI;
      const dx = Math.cos(a) * r, dy = Math.sin(a) * r;
      ctx.beginPath();
      ctx.moveTo(-dx, -dy); ctx.lineTo(dx, dy);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // ACT 06 (38.45 - 46.20s): Four-Season Passing Train at Detailed Seaside Station
  // =========================================================================
  function renderAct6(ctx, t, beat, kBeat) {
    // 0: Summer -> 1: Autumn -> 2: Winter -> 3: Next Summer
    const segLen = 1.94;
    const rel = t - 38.45;
    const seasonIdx = Math.min(3, Math.floor(rel / segLen));
    const segP = (rel - seasonIdx * segLen) / segLen;

    const palettes = [
      { sky: [[0, '#1664c0'], [0.55, '#68bef2'], [1, '#e8f7ff']], seaTop: '#2382d6', seaBot: '#0f3f7a', particleCol: '#ffffff', accent: '#2569a8' },
      { sky: [[0, '#4d2b4e'], [0.45, '#bf5a54'], [0.85, '#f29f66'], [1, '#ffe0a8']], seaTop: '#b05958', seaBot: '#3a223a', particleCol: '#ff6e42', accent: '#c24e42' },
      { sky: [[0, '#182442'], [0.55, '#465e85'], [1, '#a9c0db']], seaTop: '#364d70', seaBot: '#18243b', particleCol: '#eef7ff', accent: '#456a96' },
      { sky: [[0, '#0f4fa3'], [0.5, '#3b9be8'], [0.85, '#9cd9fb'], [1, '#f2faff']], seaTop: '#1c77cc', seaBot: '#0d366e', particleCol: '#fff2cc', accent: '#2569a8' }
    ];
    const pal = palettes[seasonIdx];
    drawSkyGradient(ctx, pal.sky);

    if (seasonIdx === 0 || seasonIdx === 3) {
      drawCumulusCloud(ctx, 920, 225, 1.22, { lightCol: '#ffffff', midCol: '#dbeefa', shadeCol: '#7ca3d1' });
    } else if (seasonIdx === 1) {
      drawCumulusCloud(ctx, 880, 235, 1.12, { lightCol: '#ffdfa8', midCol: '#e88b76', shadeCol: '#854965' });
    } else {
      drawStarfield(ctx, t, 0.52, 50, 340);
    }

    // Surging ocean waves behind station platform
    const horizonY = 390;
    drawOcean(ctx, horizonY, t, {
      topCol: pal.seaTop,
      midCol: lerpColor(pal.seaTop, pal.seaBot, 0.5),
      botCol: pal.seaBot,
      glitterCol: seasonIdx === 1 ? '#ffd699' : '#e6f5ff',
      sunX: W * 0.72,
      glitterSpread: 340,
      shimmerAlpha: 0.85,
      beatPulse: beat.pulse * kBeat
    });

    // Low seaside safety railing along far edge of platform
    const platY = 538;
    ctx.strokeStyle = 'rgba(26, 34, 56, 0.78)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, platY - 38); ctx.lineTo(W, platY - 38);
    ctx.moveTo(0, platY - 18); ctx.lineTo(W, platY - 18);
    for (let rx = 24; rx < W; rx += 76) {
      ctx.moveTo(rx, platY - 38); ctx.lineTo(rx, platY);
    }
    ctx.stroke();

    // Textured concrete seaside platform deck & Japanese yellow tactile block strip
    const platGrad = ctx.createLinearGradient(0, platY, 0, H);
    platGrad.addColorStop(0, '#242b42');
    platGrad.addColorStop(0.2, '#1b2034');
    platGrad.addColorStop(1, '#101424');
    ctx.fillStyle = platGrad;
    ctx.fillRect(0, platY, W, H - platY);
    // Concrete curb lip & subtle expansion joint lines
    ctx.fillStyle = 'rgba(215, 232, 255, 0.25)';
    ctx.fillRect(0, platY, W, 2);
    ctx.fillStyle = 'rgba(246, 206, 98, 0.78)';
    for (let bx = 8; bx < W; bx += 22) {
      ctx.fillRect(bx, platY + 8, 17, 5.5);
    }

    // Detailed Japanese Coastal Waiting Shelter: slanted awning roof, steel truss brackets, I-beams & lamp
    ctx.save();
    // Slanted corrugated roof canopy
    ctx.fillStyle = '#151b30';
    ctx.beginPath();
    ctx.moveTo(118, 224);
    ctx.lineTo(626, 236);
    ctx.lineTo(626, 250);
    ctx.lineTo(118, 240);
    ctx.closePath();
    ctx.fill();
    // Sunlit top metal awning trim
    ctx.fillStyle = seasonIdx === 1 ? 'rgba(255, 208, 152, 0.55)' : 'rgba(210, 236, 255, 0.55)';
    ctx.beginPath();
    ctx.moveTo(118, 224); ctx.lineTo(626, 236); ctx.lineTo(626, 238.5); ctx.lineTo(118, 226.5);
    ctx.closePath();
    ctx.fill();
    // Winter snow cap resting on station roof!
    if (seasonIdx === 2) {
      ctx.fillStyle = 'rgba(238, 248, 255, 0.88)';
      ctx.beginPath();
      ctx.moveTo(118, 224); ctx.lineTo(626, 236); ctx.lineTo(624, 229); ctx.lineTo(122, 217);
      ctx.closePath();
      ctx.fill();
    }

    // Riveted steel I-beam shelter pillars + diagonal truss corner brackets + anchor base plates
    [168, 566].forEach((px) => {
      ctx.fillStyle = '#182036';
      ctx.fillRect(px, 242, 13, platY - 242);
      ctx.fillStyle = 'rgba(180, 212, 245, 0.22)';
      ctx.fillRect(px + 9.5, 242, 2.5, platY - 242);
      // Base plate
      ctx.fillStyle = '#101628';
      ctx.fillRect(px - 6, platY - 6, 25, 6);
      // Diagonal structural truss brackets under eaves
      ctx.strokeStyle = '#1e2742';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px + 6, 286); ctx.lineTo(px + 42, 246);
      ctx.moveTo(px + 6, 286); ctx.lineTo(px - 28, 244);
      ctx.stroke();
    });

    // Overhead shelter fluorescent tube lamp (warm glowing pool during Autumn & Winter!)
    ctx.fillStyle = (seasonIdx === 1 || seasonIdx === 2) ? '#fff2cc' : '#8da5c4';
    ctx.fillRect(326, 247, 92, 4);
    if (seasonIdx === 1 || seasonIdx === 2) {
      const lg = ctx.createRadialGradient(372, 252, 8, 372, 295, 210);
      lg.addColorStop(0, 'rgba(255, 236, 182, 0.42)');
      lg.addColorStop(0.55, 'rgba(255, 214, 152, 0.14)');
      lg.addColorStop(1, 'rgba(255, 214, 152, 0)');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.arc(372, 295, 210, 0, Math.PI * 2);
      ctx.fill();
    }

    // Backlit JR-style Coastal Station Signboard ("去年 · 夏" / "晚秋 · 站" / "初冬 · 站" / "今年 · 夏")
    ctx.fillStyle = '#252f4d';
    ctx.fillRect(320, 246, 3, 22);
    ctx.fillRect(420, 246, 3, 22);
    ctx.fillStyle = '#1b243d';
    ctx.beginPath();
    ctx.roundRect(284, 264, 176, 56, 6);
    ctx.fill();
    ctx.fillStyle = '#f6fafe';
    ctx.beginPath();
    ctx.roundRect(288, 268, 168, 48, 4);
    ctx.fill();
    ctx.fillStyle = pal.accent;
    ctx.fillRect(288, 302, 168, 14);
    // Directional station micro-arrows inside colored band
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.font = '600 9px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('◀ 去年', 295, 312);
    ctx.textAlign = 'right';
    ctx.fillText('今年 ▶', 449, 312);
    // Main crisp station name
    ctx.fillStyle = '#151f36';
    ctx.font = '700 19px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    const labels = ['去年 · 夏', '晚秋 · 站', '初冬 · 站', '今年 · 夏'];
    ctx.fillText(labels[seasonIdx], 372, 291);

    // Detailed Slatted Wooden Platform Bench with curved iron legs & backrest!
    const bx = 258, by = 496, bw = 226;
    // Cast-iron legs & backrest stanchions
    ctx.fillStyle = '#151a2e';
    [bx + 18, bx + bw - 26].forEach((lx) => {
      ctx.fillRect(lx, by - 26, 7, 68);
      ctx.fillRect(lx - 4, by + 38, 15, 4);
    });
    // Backrest wooden slats
    ctx.fillStyle = '#382f46';
    ctx.fillRect(bx, by - 24, bw, 7);
    ctx.fillRect(bx, by - 14, bw, 7);
    // Seat wooden slats with top edge highlight
    ctx.fillStyle = '#413650';
    ctx.fillRect(bx - 4, by, bw + 8, 9);
    ctx.fillStyle = 'rgba(255, 232, 204, 0.24)';
    ctx.fillRect(bx - 4, by, bw + 8, 1.8);
    ctx.restore();

    // Sculpted anime silhouettes on platform: together only in Season 0 ("夏去了又回来，而人却已不在")!
    drawAnimeBoy(ctx, 326, 540, 0.94, {
      fillCol: '#14192b',
      rimCol: seasonIdx === 1 ? '#ffc990' : '#bde8ff',
      shirtCol: '#dbe7f8',
      t,
      facing: 1,
      armRaise: 0
    });
    if (seasonIdx === 0) {
      drawAnimeGirl(ctx, 412, 540, 0.92, {
        fillCol: '#1b1830',
        rimCol: '#ffd0e2',
        dressCol: '#fce4ee',
        t,
        facing: -1,
        armRaise: 0
      });
    }

    // Seasonal atmosphere particles (5-point maple leaves / 6-spoke snowflakes / backlit summer light motes)
    ctx.save();
    for (let i = 0; i < 46; i++) {
      const sp = 90 + hash(i * 7.7) * 140;
      const px = ((hash(i * 19.3) * W + t * sp * (seasonIdx === 2 ? -0.35 : -1.15)) % (W + 80) + (W + 80)) % (W + 80) - 40;
      const py = ((hash(i * 31.1) * H + t * (50 + hash(i * 5.1) * 68)) % (H + 60)) - 30;
      if (seasonIdx === 1) {
        const leafCol = i % 3 === 0 ? '#ff6438' : i % 3 === 1 ? '#ffa242' : '#d63e3e';
        drawMapleLeaf(ctx, px, py, 6.5 + hash(i * 3.1) * 4.5, t * 2.8 + i, leafCol, 0.85);
      } else if (seasonIdx === 2) {
        drawSnowflake(ctx, px, py, 3.2 + hash(i * 4.3) * 3.2, t * 1.4 + i, 0.82);
      } else {
        ctx.fillStyle = rgba(pal.particleCol, 0.65);
        ctx.beginPath();
        ctx.arc(px, py, 1.8 + hash(i * 5.7) * 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Express train roaring past across foreground at each season boundary (cinematic natural wipe!)
    if (segP > 0.76 || (seasonIdx > 0 && segP < 0.16)) {
      const wipeP = segP > 0.76 ? invLerp(0.76, 1.0, segP) * 0.65 : 0.65 + invLerp(0, 0.16, segP) * 0.35;
      const tx = lerp(W + 180, -1480, wipeP);
      drawSeaTrain(ctx, tx, 560, 1.85, seasonIdx >= 1);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.24)';
      ctx.lineWidth = 2;
      for (let s = 0; s < 10; s++) {
        const sy = 440 + s * 14;
        ctx.beginPath();
        ctx.moveTo(tx + s * 80, sy);
        ctx.lineTo(tx + s * 80 + 260, sy);
        ctx.stroke();
      }
    }
  }

  // =========================================================================
  // ACT 07 (46.20 - 56.25s): Botanical Moonlit Orchid -> Detailed Neon Coastal Night Bike Ride
  // =========================================================================
  function renderAct7(ctx, t, beat, kBeat) {
    if (t < 50.25) {
      // Part A (46.20 - 50.25s): Poetic Moonlit Blooming Orchid & Curved Translucent Petals
      drawSkyGradient(ctx, [
        [0, '#070c1e'],
        [0.48, '#101d3c'],
        [1, '#1e193d']
      ]);
      drawStarfield(ctx, t, 0.88, 72, H);

      const bloom = smoothstep(invLerp(46.20, 48.05, t));
      const shed = smoothstep(invLerp(48.20, 50.20, t));

      // Botanical arching orchid stem with subtle nodes, flower pedicels, buds & ribbed sword-leaves!
      ctx.save();
      // Main curved stem with sunlit upper-left highlight
      ctx.strokeStyle = '#1c4d5a';
      ctx.lineWidth = 6.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(255, H + 20);
      ctx.bezierCurveTo(370, 515, 560, 340, 815, 198);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(130, 218, 224, 0.42)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(253, H + 18);
      ctx.bezierCurveTo(368, 513, 558, 338, 813, 196);
      ctx.stroke();

      // Delicate flower pedicel stems connecting blooms to main arch
      ctx.strokeStyle = '#255c68';
      ctx.lineWidth = 2.6;
      [[480, 444, 515, 425], [612, 334, 645, 315], [732, 248, 760, 240]].forEach(([x0, y0, x1, y1]) => {
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.quadraticCurveTo(lerp(x0, x1, 0.5), y0 - 8, x1, y1);
        ctx.stroke();
      });

      // 2 delicate unopened pearlescent pink-white orchid buds near tip of branch!
      [[806, 206, 0.9, -0.4], [835, 192, 0.65, -0.25]].forEach(([bx, by, bs, br]) => {
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(br);
        ctx.scale(bs, bs);
        const bg = ctx.createRadialGradient(-3, -2, 2, 0, 0, 16);
        bg.addColorStop(0, '#fff4fa');
        bg.addColorStop(0.65, '#f2b8d8');
        bg.addColorStop(1, '#588296');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.bezierCurveTo(-4, -10, 10, -8, 16, 0);
        ctx.bezierCurveTo(10, 8, -4, 10, -12, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      // Arching botanical sword-like orchid leaves with central rib highlight
      const drawLeaf = (x0, y0, cx1, cy1, x1, y1, col) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(cx1, cy1 - 24, x1, y1);
        ctx.quadraticCurveTo(cx1, cy1 + 14, x0 + 18, y0 + 14);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(135, 224, 232, 0.26)';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x0 + 6, y0 + 5); ctx.quadraticCurveTo(cx1, cy1 - 5, x1, y1);
        ctx.stroke();
      };
      drawLeaf(240, 680, 138, 456, 312, 306, '#143846');
      drawLeaf(268, 695, 205, 515, 430, 470, '#184452');
      drawLeaf(282, 690, 480, 560, 745, 585, '#194756');
      ctx.restore();

      // 3 botanically detailed luminous orchids blooming along the arching branch!
      drawOrchidFlower(ctx, 515, 425, 0.92 * (1 - shed * 0.12), bloom, t, { ...beat, pulse: beat.pulse * kBeat });
      drawOrchidFlower(ctx, 645, 315, 1.25 * (1 - shed * 0.08), clamp(bloom * 1.1, 0, 1), t + 0.5, { ...beat, pulse: beat.pulse * kBeat });
      drawOrchidFlower(ctx, 760, 240, 0.78 * (1 - shed * 0.16), clamp(bloom * 0.95, 0, 1), t + 1.1, { ...beat, pulse: beat.pulse * kBeat });

      // Glowing detached curved orchid petals swirling gracefully across the night ("开了它也会败")
      if (shed > 0.01) {
        ctx.save();
        for (let i = 0; i < 46; i++) {
          const pp = clamp(shed * 1.35 - hash(i * 7.3) * 0.4, 0, 1);
          if (pp <= 0) continue;
          const px = 540 + hash(i * 11.7) * 240 + easeOutCubic(pp) * (240 + hash(i * 5.9) * 540);
          const py = 235 + hash(i * 19.1) * 220 + pp * (80 + hash(i * 13.3) * 145) + Math.sin(t * 4 + i) * 18;
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(t * 2.4 + i * 1.7);
          const sc = 0.75 + hash(i * 3.1) * 0.65;
          ctx.scale(sc, sc * (0.55 + 0.45 * Math.cos(t * 5 + i)));
          ctx.globalAlpha = Math.sin(pp * Math.PI) * 0.92;
          const pg = ctx.createLinearGradient(-12, 0, 14, 0);
          pg.addColorStop(0, i % 2 === 0 ? '#ffcae6' : '#cceeff');
          pg.addColorStop(0.55, '#fff9fc');
          pg.addColorStop(1, '#d6f2ff');
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.moveTo(-12, 0);
          ctx.bezierCurveTo(-4, -9, 8, -7, 14, 0);
          ctx.bezierCurveTo(8, 7, -4, 9, -12, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }
    } else {
      // Part B (50.25 - 56.25s): Exhilarating Neon Coastal Night Cycling through Luminous Petals!
      const local = t - 50.25;
      drawSkyGradient(ctx, [
        [0, '#070b1f'],
        [0.45, '#131d47'],
        [0.78, '#281e54'],
        [1, '#12142b']
      ]);
      drawStarfield(ctx, t, 0.85, 68, 420);

      // Moonlit coastal sea behind highway
      drawOcean(ctx, 415, t, {
        topCol: '#1b2b5e',
        midCol: '#121d44',
        botCol: '#090e26',
        glitterCol: '#8ce6ff',
        sunX: W * 0.78,
        glitterSpread: 320,
        shimmerAlpha: 0.72,
        beatPulse: beat.pulse * kBeat
      });

      // Coastal night highway guardrail along ocean side
      const roadTop = 535;
      ctx.strokeStyle = 'rgba(130, 185, 228, 0.35)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, roadTop - 16); ctx.lineTo(W, roadTop - 16);
      ctx.stroke();
      const postStep = 90;
      const postOff = -((local * 640) % postStep);
      ctx.fillStyle = '#182242';
      for (let px = postOff; px < W + postStep; px += postStep) {
        ctx.fillRect(px, roadTop - 22, 5, 22);
      }

      // Coastal night road asphalt + wet reflections + speeding dashes
      const roadGrad = ctx.createLinearGradient(0, roadTop, 0, H);
      roadGrad.addColorStop(0, '#121830');
      roadGrad.addColorStop(1, '#090d1c');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, roadTop, W, H - roadTop);
      // Glowing cyan curb strip
      ctx.fillStyle = rgba('#6ce0ff', 0.62 + beat.pulse * 0.25 * kBeat);
      ctx.fillRect(0, roadTop, W, 3);

      const dashStep = 180;
      const dashOff = -((local * 720) % dashStep);
      ctx.fillStyle = 'rgba(255, 198, 125, 0.70)';
      for (let x = dashOff; x < W + dashStep; x += dashStep) {
        ctx.fillRect(x, roadTop + 56, 72, 4.5);
      }

      // Fast-passing retro curved-neck coastal streetlights with volumetric cones & wet road reflections!
      const lampStep = 380;
      const lampOff = -((local * 640) % lampStep);
      for (let x = lampOff; x < W + lampStep; x += lampStep) {
        const idx = Math.round((x - lampOff) / lampStep);
        const col = idx % 2 === 0 ? '#ff84ba' : '#6ce0ff';
        // Curved gooseneck streetlamp pole
        ctx.strokeStyle = '#1d2748';
        ctx.lineWidth = 6.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, roadTop);
        ctx.lineTo(x, 286);
        ctx.quadraticCurveTo(x, 260, x + 36, 264);
        ctx.stroke();
        // Lamp head cap
        ctx.fillStyle = '#25335c';
        ctx.beginPath();
        ctx.ellipse(x + 38, 266, 12, 4.5, 0.1, 0, Math.PI * 2);
        ctx.fill();
        // Glowing bulb & radial halo
        const lg = ctx.createRadialGradient(x + 38, 272, 4, x + 38, 272, 130);
        lg.addColorStop(0, '#ffffff');
        lg.addColorStop(0.14, rgba(col, 0.85));
        lg.addColorStop(0.48, rgba(col, 0.22));
        lg.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.arc(x + 38, 272, 130, 0, Math.PI * 2);
        ctx.fill();
        // Wet asphalt reflection shimmer below streetlight
        const rg = ctx.createRadialGradient(x + 38, roadTop + 34, 4, x + 38, roadTop + 34, 90);
        rg.addColorStop(0, rgba(col, 0.20));
        rg.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = rg;
        ctx.fillRect(x - 52, roadTop + 2, 180, 68);
      }

      // Detailed anime cyclist riding a classic Japanese city bicycle fast rightwards!
      const bikeX = W * 0.44 + Math.sin(t * 1.8) * 18;
      const bikeY = roadTop + 44;
      drawNeonCyclist(ctx, bikeX, bikeY, 1.15, t, beat, kBeat);

      // Luminous curved orchid petals rushing past in the night sea breeze
      ctx.save();
      for (let i = 0; i < 38; i++) {
        const px = ((hash(i * 17.1) * W - local * (360 + hash(i * 9.3) * 280)) % (W + 60) + (W + 60)) % (W + 60) - 30;
        const py = 120 + hash(i * 29.7) * 460 + Math.sin(t * 5 + i) * 16;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(-0.4 + Math.sin(t * 4 + i) * 0.5);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 188, 226, 0.86)' : 'rgba(176, 242, 255, 0.84)';
        ctx.beginPath();
        ctx.moveTo(-9, 0);
        ctx.bezierCurveTo(-2, -6, 5, -5, 10, 0);
        ctx.bezierCurveTo(5, 5, -2, 6, -9, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  }

  // =========================================================================
  // Ultra-Detailed Neon Coastal Cyclist & Japanese City Cruiser Bicycle (Act 7 Part B)
  // =========================================================================
  function drawNeonCyclist(ctx, x, y, scale, t, beat, kBeat) {
    const wheelR = 34;
    const bounce = Math.sin(t * 11) * 1.2 - beat.pulse * 2.2 * kBeat;
    const breeze = Math.sin(t * 8.5) * 6.5;
    const ped = t * 9.6;

    ctx.save();
    ctx.translate(x, y + bounce);
    ctx.scale(scale, scale);

    // Subtle soft dark ground shadow & neon reflection pool under bicycle
    const shG = ctx.createRadialGradient(0, 2, 10, 0, 2, 92);
    shG.addColorStop(0, 'rgba(6, 10, 24, 0.72)');
    shG.addColorStop(0.65, 'rgba(105, 224, 255, 0.16)');
    shG.addColorStop(1, 'rgba(6, 10, 24, 0)');
    ctx.fillStyle = shG;
    ctx.beginPath();
    ctx.ellipse(0, 2, 92, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- 1. Detailed Spoked Wheels with Dark Rubber Tires, Neon Alloy Rims & Mudguard Fenders ---
    [-48, 48].forEach((wx) => {
      // Outer dark rubber tire
      ctx.strokeStyle = '#090d1c';
      ctx.lineWidth = 6.5;
      ctx.beginPath();
      ctx.arc(wx, -wheelR, wheelR, 0, Math.PI * 2);
      ctx.stroke();

      // Inner glowing cyan alloy rim
      ctx.strokeStyle = '#7ce6ff';
      ctx.shadowColor = '#67d8f5';
      ctx.shadowBlur = 10 + beat.pulse * 10 * kBeat;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(wx, -wheelR, wheelR - 3.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 10 crisp rotating spokes + center metallic hub
      ctx.strokeStyle = 'rgba(185, 234, 255, 0.42)';
      ctx.lineWidth = 1.1;
      for (let s = 0; s < 10; s++) {
        const a = t * 13.5 + (s / 10) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(wx, -wheelR);
        ctx.lineTo(wx + Math.cos(a) * (wheelR - 4), -wheelR + Math.sin(a) * (wheelR - 4));
        ctx.stroke();
      }
      ctx.fillStyle = '#d6f2ff';
      ctx.beginPath();
      ctx.arc(wx, -wheelR, 4.2, 0, Math.PI * 2);
      ctx.fill();

      // Curved steel mudguard fender hugging upper arc of each wheel!
      ctx.strokeStyle = '#2d3f6b';
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.arc(wx, -wheelR, wheelR + 4.8, wx < 0 ? -Math.PI * 0.92 : -Math.PI * 0.85, wx < 0 ? -Math.PI * 0.14 : -Math.PI * 0.08);
      ctx.stroke();
    });

    // --- 2. Far Pedaling Leg (drawn behind bike frame for authentic depth!) ---
    const hipX = -20, hipY = -wheelR - 49;
    const crankX = -6, crankY = -wheelR + 2;
    const farPedX = crankX + Math.cos(ped + Math.PI) * 11;
    const farPedY = crankY + Math.sin(ped + Math.PI) * 11;
    const farKneeX = lerp(hipX, farPedX, 0.54) + 12;
    const farKneeY = lerp(hipY, farPedY, 0.54) - 8;
    ctx.strokeStyle = '#080c1c';
    ctx.lineWidth = 7.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(hipX, hipY); ctx.lineTo(farKneeX, farKneeY); ctx.lineTo(farPedX, farPedY);
    ctx.stroke();

    // --- 3. Full Japanese City Cruiser Bicycle Frame, Chain, Rack & Wire Front Basket ---
    // Chainring sprocket & drive chain
    ctx.strokeStyle = 'rgba(170, 206, 240, 0.55)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(crankX, crankY, 9.5, 0, Math.PI * 2);
    ctx.moveTo(-48, -wheelR - 4); ctx.lineTo(crankX, crankY - 9);
    ctx.moveTo(-48, -wheelR + 4); ctx.lineTo(crankX, crankY + 9);
    ctx.stroke();

    // Main diamond frame tubes (warm sunlit champagne-gold)
    ctx.strokeStyle = '#ffd5a2';
    ctx.lineWidth = 3.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    // Rear triangle + main triangle
    ctx.moveTo(-48, -wheelR); ctx.lineTo(crankX, crankY);       // chainstay
    ctx.lineTo(29, -wheelR - 38);                               // down tube
    ctx.lineTo(-20, -wheelR - 38);                              // top tube
    ctx.lineTo(-48, -wheelR);                                   // seatstay
    ctx.moveTo(crankX, crankY); ctx.lineTo(-22, -wheelR - 47);  // seat tube
    // Front fork + stem + swept handlebars
    ctx.moveTo(48, -wheelR); ctx.lineTo(26, -wheelR - 53);
    ctx.quadraticCurveTo(28, -wheelR - 60, 41, -wheelR - 58);
    ctx.stroke();

    // Rear luggage rack + glowing ruby taillight
    ctx.strokeStyle = '#6f8ab8';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-58, -wheelR - 38); ctx.lineTo(-26, -wheelR - 38);
    ctx.moveTo(-54, -wheelR - 38); ctx.lineTo(-48, -wheelR);
    ctx.stroke();
    ctx.fillStyle = '#ff4268';
    ctx.shadowColor = '#ff3860';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-60, -wheelR - 37, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ergonomic leather saddle
    ctx.fillStyle = '#1d243d';
    ctx.beginPath();
    ctx.moveTo(-34, -wheelR - 48);
    ctx.quadraticCurveTo(-22, -wheelR - 51, -12, -wheelR - 46);
    ctx.lineTo(-14, -wheelR - 43);
    ctx.lineTo(-32, -wheelR - 44);
    ctx.closePath();
    ctx.fill();

    // Front wire basket carrying a tiny glowing white orchid sprig!
    ctx.strokeStyle = 'rgba(180, 224, 255, 0.72)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(35, -wheelR - 52); ctx.lineTo(54, -wheelR - 52);
    ctx.lineTo(50, -wheelR - 34); ctx.lineTo(34, -wheelR - 34);
    ctx.closePath();
    ctx.moveTo(42, -wheelR - 52); ctx.lineTo(41, -wheelR - 34);
    ctx.moveTo(35, -wheelR - 43); ctx.lineTo(52, -wheelR - 43);
    ctx.stroke();
    // Glowing orchid blossom peeking out of the front wire basket!
    ctx.fillStyle = '#ffe4f4';
    ctx.shadowColor = '#ffa4d2';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(46, -wheelR - 55, 3.8, 0, Math.PI * 2);
    ctx.arc(51, -wheelR - 53, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // --- 4. Forward-Leaning Sculpted Anime Rider + Articulated Near Leg + Flowing Scarf! ---
    // Near pedaling leg (thigh + calf + sneaker synced to crank!)
    const nearPedX = crankX + Math.cos(ped) * 11;
    const nearPedY = crankY + Math.sin(ped) * 11;
    const nearKneeX = lerp(hipX, nearPedX, 0.54) + 14;
    const nearKneeY = lerp(hipY, nearPedY, 0.54) - 9;

    // Crank arm & pedal
    ctx.strokeStyle = '#b4c9e8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(crankX, crankY); ctx.lineTo(nearPedX, nearPedY);
    ctx.stroke();

    // Near thigh & calf trouser
    ctx.strokeStyle = '#111834';
    ctx.lineWidth = 9.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(hipX, hipY); ctx.lineTo(nearKneeX, nearKneeY); ctx.lineTo(nearPedX, nearPedY - 2);
    ctx.stroke();
    // Subtle cyan rim along near knee/shin
    ctx.strokeStyle = 'rgba(130, 232, 255, 0.65)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(nearKneeX + 3, nearKneeY - 2); ctx.lineTo(nearPedX + 3, nearPedY - 3);
    ctx.stroke();
    // Sneaker on pedal
    ctx.fillStyle = '#1a2548';
    ctx.beginPath();
    ctx.roundRect(nearPedX - 5, nearPedY - 4, 15, 6, 3);
    ctx.fill();

    // Long fluttering luminous scarf streaming dynamically behind rider's neck!
    ctx.save();
    const scG = ctx.createLinearGradient(10, -wheelR - 86, -68 - breeze * 2, -wheelR - 72);
    scG.addColorStop(0, '#ff8cc2');
    scG.addColorStop(0.6, '#ff9ed0');
    scG.addColorStop(1, 'rgba(126, 232, 255, 0.72)');
    ctx.strokeStyle = scG;
    ctx.lineWidth = 5.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(11, -wheelR - 86);
    ctx.bezierCurveTo(-12, -wheelR - 92 - breeze * 0.5, -36 - breeze, -wheelR - 74 + breeze * 0.5, -62 - breeze * 1.6, -wheelR - 82 - breeze * 0.4);
    ctx.stroke();
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(10, -wheelR - 84);
    ctx.bezierCurveTo(-10, -wheelR - 80 + breeze * 0.4, -30 - breeze * 0.8, -wheelR - 66 - breeze * 0.4, -50 - breeze * 1.3, -wheelR - 70 + breeze * 0.5);
    ctx.stroke();
    ctx.restore();

    // Leaning torso & billowing open summer jacket tail
    ctx.fillStyle = '#0e142c';
    ctx.beginPath();
    ctx.moveTo(-26, -wheelR - 49);
    ctx.quadraticCurveTo(-8, -wheelR - 74, 12, -wheelR - 88);
    ctx.quadraticCurveTo(22, -wheelR - 88, 25, -wheelR - 76);
    ctx.quadraticCurveTo(10, -wheelR - 58, -6, -wheelR - 42);
    // Wind-fluttering jacket hem billowing behind saddle
    ctx.quadraticCurveTo(-30 - breeze * 0.7, -wheelR - 36, -46 - breeze * 1.35, -wheelR - 48);
    ctx.quadraticCurveTo(-36 - breeze * 0.5, -wheelR - 49, -26, -wheelR - 49);
    ctx.closePath();
    ctx.fill();

    // Bright neon pink rim light along leaning back & collar
    ctx.strokeStyle = '#ff96c8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-26, -wheelR - 49);
    ctx.quadraticCurveTo(-8, -wheelR - 74, 12, -wheelR - 88);
    ctx.stroke();

    // Articulated arm (shoulder -> bent elbow -> hand gripping handlebars!)
    ctx.strokeStyle = '#0f1630';
    ctx.lineWidth = 6.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(14, -wheelR - 79);
    ctx.lineTo(25, -wheelR - 64);
    ctx.lineTo(39, -wheelR - 58);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(130, 232, 255, 0.72)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(15, -wheelR - 81); ctx.lineTo(26, -wheelR - 66); ctx.lineTo(39, -wheelR - 60);
    ctx.stroke();

    // Sculpted anime rider head profile (graceful proportions + sleek wind-swept hair, zero spiky cones!)
    ctx.save();
    ctx.translate(22, -wheelR - 92);
    ctx.scale(0.84, 0.84);
    ctx.translate(-22, wheelR + 92);

    ctx.fillStyle = '#0c1228';
    ctx.beginPath();
    ctx.moveTo(13, -wheelR - 91);
    ctx.bezierCurveTo(6, -wheelR - 101, 9, -wheelR - 117, 21, -wheelR - 119);
    ctx.bezierCurveTo(31, -wheelR - 120, 37, -wheelR - 111, 35.5, -wheelR - 102);
    ctx.lineTo(37.8, -wheelR - 97.6); // petite anime nose
    ctx.lineTo(35.0, -wheelR - 95.6);
    ctx.quadraticCurveTo(33.5, -wheelR - 90.5, 26, -wheelR - 89.5); // chin & jaw
    ctx.closePath();
    ctx.fill();
    // Soft natural wind-swept anime hair layers
    ctx.beginPath();
    ctx.moveTo(18, -wheelR - 119);
    ctx.bezierCurveTo(6, -wheelR - 120, -2 - breeze * 0.45, -wheelR - 112, -8 - breeze * 0.7, -wheelR - 104);
    ctx.quadraticCurveTo(2 - breeze * 0.25, -wheelR - 105, 8, -wheelR - 101);
    ctx.quadraticCurveTo(0 - breeze * 0.45, -wheelR - 96, -3 - breeze * 0.6, -wheelR - 91);
    ctx.quadraticCurveTo(8, -wheelR - 94, 15, -wheelR - 96);
    ctx.closePath();
    ctx.fill();
    // Crisp cyan neon profile & hair crown rim light
    ctx.strokeStyle = '#7ee8ff';
    ctx.lineWidth = 1.85;
    ctx.beginPath();
    ctx.moveTo(15, -wheelR - 119);
    ctx.bezierCurveTo(28, -wheelR - 121, 36.5, -wheelR - 112, 35.5, -wheelR - 102);
    ctx.lineTo(37.8, -wheelR - 97.6);
    ctx.lineTo(35.0, -wheelR - 95.6);
    ctx.stroke();
    ctx.restore();

    // --- 5. Vintage Dynamo Headlight Housing & Multi-Layer Volumetric Light Cone! ---
    ctx.fillStyle = '#2b3b64';
    ctx.beginPath();
    ctx.roundRect(35, -wheelR - 49, 10, 7, 3);
    ctx.fill();
    ctx.fillStyle = '#fff9d8';
    ctx.shadowColor = '#ffe89a';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(45, -wheelR - 45.5, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Soft outer volumetric headlight cone + brighter inner core beam
    const hl = ctx.createLinearGradient(45, -wheelR - 45, 275, -wheelR - 4);
    hl.addColorStop(0, 'rgba(255, 246, 200, 0.56)');
    hl.addColorStop(0.45, 'rgba(255, 238, 185, 0.22)');
    hl.addColorStop(1, 'rgba(255, 236, 180, 0)');
    ctx.fillStyle = hl;
    ctx.beginPath();
    ctx.moveTo(45, -wheelR - 47);
    ctx.lineTo(275, -wheelR - 90);
    ctx.lineTo(275, -wheelR + 26);
    ctx.lineTo(45, -wheelR - 43);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // =========================================================================
  // ACT 08 (56.25 - 64.15s): PEAK DJ CLIMAX — Split-Time Rift & Handwritten Diary Storm!
  // =========================================================================
  function renderAct8(ctx, t, beat, kBeat) {
    const p = invLerp(56.25, 64.15, t);
    const riftShift = Math.sin(t * 2.1) * 16;
    const topX = W * 0.56 + riftShift;
    const botX = W * 0.42 + riftShift;

    // LEFT HALF: Warm Golden "Last Summer 2025.08"
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(topX, 0); ctx.lineTo(botX, H); ctx.lineTo(0, H);
    ctx.closePath();
    ctx.clip();
    drawSkyGradient(ctx, [[0, '#5a3264'], [0.42, '#db727c'], [0.78, '#ffb978'], [1, '#ffe6b0']]);
    drawCumulusCloud(ctx, 210, 290, 1.12, { lightCol: '#fff2cc', midCol: '#f5a694', shadeCol: '#99587a' });
    drawOcean(ctx, 470, t, { topCol: '#cf6f72', midCol: '#8c4866', botCol: '#382145', glitterCol: '#ffe8a8', sunX: 300, shimmerAlpha: 0.9, beatPulse: beat.pulse * kBeat });
    drawAnimeGirl(ctx, lerp(360, 240, p), 648, 1.42, { fillCol: '#241838', rimCol: '#ffe2ad', dressCol: '#ffe6ee', t, facing: -1 });
    ctx.font = '800 54px ui-monospace, Consolas, monospace';
    ctx.fillStyle = 'rgba(255, 244, 214, 0.24)';
    ctx.textAlign = 'left';
    ctx.fillText('2025.08', 68, 140);
    ctx.restore();

    // RIGHT HALF: Cyber Indigo "Now 2026.08"
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(topX, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(botX, H);
    ctx.closePath();
    ctx.clip();
    drawSkyGradient(ctx, [[0, '#070c22'], [0.48, '#132252'], [0.85, '#1d366e'], [1, '#0d1938']]);
    drawStarfield(ctx, t, 0.95, 74, 470);
    drawOcean(ctx, 470, t, { topCol: '#18346e', midCol: '#10224d', botCol: '#081029', glitterCol: '#7be4ff', sunX: 980, shimmerAlpha: 0.85, beatPulse: beat.pulse * kBeat });
    drawAnimeBoy(ctx, lerp(910, 990, p), 648, 1.42, { fillCol: '#0c1229', rimCol: '#7ce6ff', shirtCol: '#36588c', t, facing: -1, armRaise: 0.22 + 0.25 * beat.pulse * kBeat });
    ctx.font = '800 54px ui-monospace, Consolas, monospace';
    ctx.fillStyle = 'rgba(125, 230, 255, 0.24)';
    ctx.textAlign = 'right';
    ctx.fillText('2026.08', W - 68, 140);
    ctx.restore();

    // Radiant Diagonal Time-Rift Crack with crystalline secondary glow & rising rift sparks!
    ctx.save();
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 20 + beat.pulse * 22 * kBeat;
    ctx.strokeStyle = `rgba(255, 250, 240, ${0.86 + beat.pulse * 0.14})`;
    ctx.lineWidth = 3.8 + beat.pulse * 3.8 * kBeat;
    ctx.beginPath();
    ctx.moveTo(topX, 0);
    ctx.lineTo(botX, H);
    ctx.stroke();

    // Fine glowing sparks drifting along the diagonal rift seam
    ctx.shadowBlur = 0;
    for (let s = 0; s < 18; s++) {
      const sp = (t * 0.45 + hash(s * 13.7)) % 1;
      const sx = lerp(botX, topX, sp) + (hash(s * 7.3) - 0.5) * 28;
      const sy = lerp(H - 60, 60, sp);
      ctx.fillStyle = s % 2 === 0 ? 'rgba(255, 224, 165, 0.82)' : 'rgba(145, 236, 255, 0.82)';
      ctx.beginPath();
      ctx.arc(sx, sy, 1.5 + hash(s * 4.1) * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Swirling Realistic Spiral-Notebook Diary Pages & Paper Airplanes ("却把书包中的日记更改")!
    ctx.save();
    for (let i = 0; i < 28; i++) {
      const speed = 0.22 + hash(i * 9.7) * 0.24;
      const lp = (t * speed + hash(i * 23.1)) % 1;
      const px = lerp(-80, W + 80, lp);
      const py = 110 + hash(i * 13.7) * 480 + Math.sin(lp * Math.PI * 3 + i) * 58;
      const rot = lp * 4.6 + i * 1.3;
      const sc = 0.62 + hash(i * 5.3) * 0.72;
      if (i % 4 === 0) {
        drawPaperPlane(ctx, px, py, sc * 0.92, Math.sin(lp * 6 + i) * 0.32, 0.78);
      } else {
        // Detailed torn/curled handwritten notebook sheet with binder holes, pink margin & ink writing!
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        const flipY = 0.48 + 0.52 * Math.abs(Math.cos(t * 3.6 + i));
        ctx.scale(sc, sc * flipY);

        const isWarm = px < lerp(topX, botX, py / H);
        ctx.fillStyle = isWarm ? 'rgba(255, 248, 232, 0.92)' : 'rgba(226, 245, 255, 0.90)';
        ctx.shadowColor = isWarm ? 'rgba(255, 206, 130, 0.75)' : 'rgba(116, 226, 255, 0.75)';
        ctx.shadowBlur = 10;

        // Slightly wind-curled paper sheet polygon
        ctx.beginPath();
        ctx.moveTo(-22, -29);
        ctx.quadraticCurveTo(0, -27, 23, -30);
        ctx.quadraticCurveTo(21, 0, 24, 29);
        ctx.quadraticCurveTo(0, 31, -21, 28);
        ctx.quadraticCurveTo(-23, 0, -22, -29);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Spiral-notebook binder holes along left edge
        ctx.fillStyle = isWarm ? 'rgba(130, 82, 90, 0.45)' : 'rgba(20, 48, 92, 0.45)';
        [-18, -6, 6, 18].forEach((hy) => {
          ctx.beginPath();
          ctx.arc(-17, hy, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });

        // Delicate pink vertical margin line
        ctx.strokeStyle = 'rgba(235, 118, 148, 0.45)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(-11, -26); ctx.lineTo(-11, 26);
        ctx.stroke();

        // Ruled horizontal notebook lines + faint handwritten ink strokes!
        ctx.strokeStyle = 'rgba(95, 125, 168, 0.34)';
        ctx.lineWidth = 0.85;
        for (let ln = -17; ln <= 19; ln += 7.5) {
          ctx.beginPath(); ctx.moveTo(-11, ln); ctx.lineTo(18, ln); ctx.stroke();
        }
        // Organic ink script lines simulating diary entries
        ctx.strokeStyle = isWarm ? 'rgba(65, 52, 74, 0.65)' : 'rgba(28, 52, 92, 0.65)';
        ctx.lineWidth = 1.15;
        for (let row = 0; row < 4; row++) {
          const ly = -18.5 + row * 7.5;
          const endX = 6 + hash(i * 11 + row * 7) * 11;
          ctx.beginPath();
          ctx.moveTo(-8, ly);
          ctx.quadraticCurveTo(lerp(-8, endX, 0.5), ly - 1.5, endX, ly + 0.5);
          ctx.stroke();
        }
        ctx.restore();
      }
    }
    ctx.restore();

    drawAudioWaveAccent(ctx, t, { ...beat, pulse: beat.pulse * kBeat }, H - 122, '#ffd48a', 0.54);
  }

  // =========================================================================
  // ACT 09 (64.15 - 71.25s): Cleansing Dawn Drizzle over Mirror Sea (Blue Hour Transition)
  // =========================================================================
  function renderAct9(ctx, t, beat, kBeat) {
    const p = smoothstep(invLerp(64.15, 71.25, t));
    drawSkyGradient(ctx, [
      [0, lerpColor('#0e1738', '#1d3669', p)],
      [0.42, lerpColor('#21325e', '#4f659c', p)],
      [0.72, lerpColor('#444b78', '#c48a9c', p)],
      [0.90, lerpColor('#76668c', '#f5c2a4', p)],
      [1, lerpColor('#8b7796', '#ffe4bd', p)]
    ]);
    drawStarfield(ctx, t, (1 - p) * 0.75, 58, 340);

    const horizonY = 408;
    // Quantize cloud color transition smoothly (every ~0.04 step) to reuse cached painterly sprites efficiently
    const pq = Math.round(p * 24) / 24;
    drawCumulusCloud(ctx, lerp(340, 260, p), 280, 1.12, {
      lightCol: lerpColor('#9fb5d9', '#ffe8cf', pq),
      midCol: lerpColor('#5c7099', '#d69eb0', pq),
      shadeCol: lerpColor('#2f3d63', '#6b6c94', pq),
      alpha: 0.78
    });
    drawCumulusCloud(ctx, lerp(960, 1040, p), 270, 1.22, {
      lightCol: lerpColor('#a8bede', '#ffebd4', pq),
      midCol: lerpColor('#63759e', '#dca3b3', pq),
      shadeCol: lerpColor('#314066', '#6e6f98', pq),
      alpha: 0.75
    });

    // Seamless rose-gold dawn glow on horizon
    const dawnGlow = ctx.createRadialGradient(W * 0.5, horizonY, 10, W * 0.5, horizonY, 460);
    dawnGlow.addColorStop(0, `rgba(255, 224, 186, ${0.28 + p * 0.56})`);
    dawnGlow.addColorStop(0.5, `rgba(255, 168, 188, ${0.12 + p * 0.22})`);
    dawnGlow.addColorStop(1, 'rgba(255, 168, 188, 0)');
    ctx.fillStyle = dawnGlow;
    ctx.fillRect(0, 0, W, horizonY + 4);

    const mg = ctx.createLinearGradient(0, horizonY, 0, H);
    mg.addColorStop(0, lerpColor('#6b638a', '#f6c7ab', p));
    mg.addColorStop(0.45, lerpColor('#2d3c66', '#6674a3', p));
    mg.addColorStop(1, lerpColor('#111a38', '#20315c', p));
    ctx.fillStyle = mg;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // Seamless radial mirror reflection of dawn glow on shallow sea
    const reflGlow = ctx.createRadialGradient(W * 0.5, horizonY + 12, 16, W * 0.5, horizonY + 80, 420);
    reflGlow.addColorStop(0, `rgba(255, 226, 190, ${0.26 + p * 0.44})`);
    reflGlow.addColorStop(0.55, `rgba(255, 196, 178, ${0.10 + p * 0.18})`);
    reflGlow.addColorStop(1, 'rgba(255, 200, 175, 0)');
    ctx.fillStyle = reflGlow;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // Sculpted anime boy standing on mirror shallows + soft rippling reflection
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.translate(0, 560 * 2);
    ctx.scale(1, -0.78);
    drawAnimeBoy(ctx, W * 0.5, 560, 0.92, { fillCol: '#131b38', rimCol: '#ffd8ba', shirtCol: '#ffe2cc', t, facing: 1, armRaise: 0 });
    ctx.restore();
    // Subtle concentric foot ripple right around his sneakers on the shallow mirror sea!
    ctx.strokeStyle = 'rgba(255, 232, 208, 0.36)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(W * 0.5 + 4, 560, 38 + Math.sin(t * 2.5) * 4, 7.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    drawAnimeBoy(ctx, W * 0.5, 560, 0.92, { fillCol: '#141c38', rimCol: '#ffdfbe', shirtCol: '#ffe6d2', t, facing: 1, armRaise: 0 });

    // Gentle silver dawn rain fading away as the storm clears
    const rainAlpha = (1 - smoothstep(invLerp(68.2, 71.1, t))) * 0.62;
    if (rainAlpha > 0.01) {
      ctx.save();
      ctx.strokeStyle = `rgba(225, 240, 255, ${rainAlpha})`;
      ctx.lineWidth = 1.45;
      for (let i = 0; i < 66; i++) {
        const sp = 420 + hash(i * 11.1) * 200;
        const rx = hash(i * 23.7) * W;
        const ry = ((hash(i * 37.3) * H + t * sp) % (H + 40)) - 20;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 3, ry + 24);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Luminous double-ring concentric raindrop ripples + delicate splash crowns on mirror sea!
    ctx.save();
    for (let i = 0; i < 22; i++) {
      const rp = (t * (0.45 + hash(i * 5.7) * 0.25) + hash(i * 19.9)) % 1;
      const rx = 100 + hash(i * 41.3) * (W - 200);
      const ry = horizonY + 28 + hash(i * 27.1) * (H - horizonY - 115);
      const persp = invLerp(horizonY, H, ry);
      const maxRx = (32 + persp * 84) * (1 + beat.pulse * 0.12 * kBeat);
      const curRx = rp * maxRx;
      const curRy = curRx * 0.24;
      const a = (1 - rp) * (0.76 - p * 0.15);
      const col = i % 2 === 0 ? '#ffe8cc' : '#c8edff';

      // Primary outer ripple ring
      ctx.strokeStyle = rgba(col, a);
      ctx.lineWidth = 1.9 * (1 - rp * 0.45);
      ctx.beginPath();
      ctx.ellipse(rx, ry, curRx, curRy, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary inner trailing ripple ring
      if (rp > 0.18) {
        const irp = rp - 0.18;
        ctx.strokeStyle = rgba(col, a * 0.52);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.ellipse(rx, ry, irp * maxRx * 0.72, irp * maxRx * 0.72 * 0.24, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Delicate vertical droplet splash crown right on impact (rp < 0.14)
      if (rp < 0.14 && rainAlpha > 0.08) {
        const sp = Math.sin((rp / 0.14) * Math.PI);
        ctx.strokeStyle = rgba('#ffffff', sp * 0.72);
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(rx, ry); ctx.lineTo(rx, ry - 9 * sp * (0.6 + persp * 0.6));
        ctx.moveTo(rx - 2, ry); ctx.lineTo(rx - 5 * sp, ry - 6 * sp);
        ctx.moveTo(rx + 2, ry); ctx.lineTo(rx + 5 * sp, ry - 6 * sp);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // =========================================================================
  // ACT 10 (71.25 - 79.00s): Healing Sunrise Finale — Releasing the Paper Plane Into Dawn!
  // =========================================================================
  function renderAct10(ctx, t, beat, kBeat) {
    const p = smoothstep(invLerp(71.25, 77.5, t));

    drawSkyGradient(ctx, [
      [0, lerpColor('#1d4b96', '#1e6ec7', p)],
      [0.34, lerpColor('#4c85c8', '#5cb4eb', p)],
      [0.64, lerpColor('#d4a2a8', '#ffd2aa', p)],
      [0.84, '#ffe8b8'],
      [1, '#fff6d8']
    ]);

    const horizonY = 446;
    const sunX = W * 0.62;
    const sunY = lerp(horizonY + 12, horizonY - 82, p);

    // Sweeping golden dawn halo + delicate radial sunbeams
    const sg = ctx.createRadialGradient(sunX, sunY, 18, sunX, sunY, 460);
    sg.addColorStop(0, 'rgba(255, 254, 238, 0.98)');
    sg.addColorStop(0.24, 'rgba(255, 234, 174, 0.72)');
    sg.addColorStop(0.60, 'rgba(255, 198, 148, 0.24)');
    sg.addColorStop(1, 'rgba(255, 198, 148, 0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 460, 0, Math.PI * 2);
    ctx.fill();

    // Soft morning volumetric god-rays fanning upward into sky
    ctx.save();
    for (let r = 0; r < 6; r++) {
      const ang = -Math.PI * 0.92 + r * 0.32 + Math.sin(t * 0.45 + r) * 0.025;
      const rg = ctx.createLinearGradient(sunX, sunY, sunX + Math.cos(ang) * 560, sunY + Math.sin(ang) * 560);
      rg.addColorStop(0, 'rgba(255, 250, 218, 0.16)');
      rg.addColorStop(1, 'rgba(255, 240, 195, 0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(sunX + Math.cos(ang - 0.04) * 560, sunY + Math.sin(ang - 0.04) * 560);
      ctx.lineTo(sunX + Math.cos(ang + 0.04) * 560, sunY + Math.sin(ang + 0.04) * 560);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.fillStyle = '#fffbe0';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 64, 0, Math.PI * 2);
    ctx.fill();

    drawCumulusCloud(ctx, 220, 215, 1.12, { lightCol: '#fffdf4', midCol: '#ffe4c4', shadeCol: '#a5b5d8', alpha: 0.85 });
    drawCumulusCloud(ctx, 1085, 240, 1.22, { lightCol: '#fffcf0', midCol: '#ffdfb8', shadeCol: '#9cb0d4', alpha: 0.82 });

    // Distant hazy blue-gold coastal headland silhouette across the right bay
    ctx.fillStyle = 'rgba(72, 104, 152, 0.34)';
    ctx.beginPath();
    ctx.moveTo(W * 0.72, horizonY);
    ctx.quadraticCurveTo(W * 0.84, horizonY - 26, W, horizonY - 14);
    ctx.lineTo(W, horizonY);
    ctx.closePath();
    ctx.fill();

    // Sparkling golden morning sea
    drawOcean(ctx, horizonY, t, {
      topCol: '#3687cc',
      midCol: '#2466a8',
      botCol: '#133b6e',
      glitterCol: '#fff5c8',
      sunX,
      glitterSpread: 360,
      shimmerAlpha: 0.96,
      beatPulse: beat.pulse * kBeat
    });

    // Rich layered foreground sunlit grassy coastal meadow cliff with wildflowers!
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 560);
    ctx.quadraticCurveTo(230, 526, 435, 610);
    ctx.lineTo(545, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    const cg = ctx.createLinearGradient(0, 530, 0, H);
    cg.addColorStop(0, '#335d52');
    cg.addColorStop(0.55, '#1f3b3e');
    cg.addColorStop(1, '#11212b');
    ctx.fillStyle = cg;
    ctx.fill();

    // Multi-depth swaying sunlit grass blades & golden meadow highlights along cliff crest
    ctx.lineCap = 'round';
    for (let i = 0; i < 64; i++) {
      const gx = i * 7.2;
      const tCliff = clamp(gx / 435, 0, 1);
      // Quadratic curve matching cliff contour
      const u = 1 - tCliff;
      const gy = u * u * 560 + 2 * u * tCliff * 526 + tCliff * tCliff * 610;
      const sway = Math.sin(t * 2.6 + i * 0.42) * (5 + hash(i * 5.1) * 4);
      const bladeH = 12 + hash(i * 7.1) * 18;
      ctx.strokeStyle = i % 3 === 0 ? '#a8d98c' : i % 3 === 1 ? '#6cad78' : '#3d6e5a';
      ctx.lineWidth = i % 3 === 0 ? 1.5 : 2.1;
      ctx.beginPath();
      ctx.moveTo(gx, gy + 10);
      ctx.quadraticCurveTo(gx + sway * 0.5, gy - bladeH * 0.4, gx + sway, gy - bladeH);
      ctx.stroke();

      // Tiny sunlit white/yellow coastal wildflowers dotting the grass
      if (i % 9 === 2) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 250, 210, 0.92)' : 'rgba(255, 224, 236, 0.88)';
        ctx.beginPath();
        ctx.arc(gx + sway * 0.85, gy - bladeH * 0.85, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Sculpted anime boy on cliff launching the white paper plane into the sunrise!
    const launchP = smoothstep(invLerp(71.8, 73.1, t));
    drawAnimeBoy(ctx, 245, 575, 1.28, {
      fillCol: '#18243a',
      rimCol: '#fff0bd',
      shirtCol: '#fff4de',
      t,
      facing: 1,
      armRaise: lerp(0.25, 0.96, launchP)
    });

    // Paper plane launched smoothly right from his uplifted hand tip (306, 378) toward the rising sun!
    if (t >= 72.4) {
      const fp = easeOutCubic(invLerp(72.4, 78.2, t));
      const startX = 306, startY = 378;
      const px = lerp(startX, W * 0.88, fp);
      const py = lerp(startY, 122, fp) - Math.sin(fp * Math.PI) * 56;
      const pRot = lerp(-0.42, -0.18, fp);

      // Tapered luminous golden-white ribbon trail behind paper plane
      ctx.save();
      for (let s = 0; s < 26; s++) {
        const sp0 = Math.max(0, fp - s * 0.013);
        const sp1 = Math.max(0, fp - (s + 1) * 0.013);
        const x0 = lerp(startX, W * 0.88, sp0);
        const y0 = lerp(startY, 122, sp0) - Math.sin(sp0 * Math.PI) * 56;
        const x1 = lerp(startX, W * 0.88, sp1);
        const y1 = lerp(startY, 122, sp1) - Math.sin(sp1 * Math.PI) * 56;
        ctx.strokeStyle = `rgba(255, 250, 224, ${(1 - s / 26) * 0.72})`;
        ctx.lineWidth = (1 - s / 26) * 3.0;
        ctx.beginPath();
        ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
        ctx.stroke();
      }
      ctx.restore();

      drawPaperPlane(ctx, px, py, lerp(1.22, 0.65, fp), pRot, 1.0);
    }

    // Floating golden morning dust motes
    ctx.save();
    for (let i = 0; i < 40; i++) {
      const mx = (hash(i * 19.7) * W + t * 24) % W;
      const my = (hash(i * 31.3) * 520 - t * 14 + 520) % 520;
      const a = 0.35 + 0.45 * Math.sin(t * 3 + i);
      ctx.fillStyle = `rgba(255, 248, 212, ${a})`;
      ctx.beginPath();
      ctx.arc(mx, my, 1.6 + hash(i * 5.9) * 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Poetic Ending Title Card (75.5s - 78.6s)
    if (t >= 75.5) {
      const ea = smoothstep(invLerp(75.5, 76.6, t));
      ctx.save();
      ctx.globalAlpha = ea;
      ctx.textAlign = 'center';
      ctx.font = '300 42px "PingFang SC", "Microsoft YaHei", serif';
      ctx.fillStyle = '#fffdf7';
      ctx.shadowColor = 'rgba(255, 220, 165, 0.85)';
      ctx.shadowBlur = 18;
      ctx.fillText('去  年  夏  天', W * 0.5, 250);
      ctx.font = '400 14px ui-monospace, Consolas, monospace';
      ctx.fillStyle = 'rgba(255, 244, 224, 0.82)';
      ctx.fillText('LAST SUMMER  ·  THE END', W * 0.5, 290);
      ctx.restore();
    }

    // Silky cinematic fade to black at very end (77.6 - 79.0s)
    if (t >= 77.6) {
      const fb = smoothstep(invLerp(77.6, 78.95, t));
      ctx.fillStyle = `rgba(6, 8, 16, ${fb})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // =========================================================================
  // Master Router + Refined 122 BPM Beat Camera (Default 'soft'!) + Scene Cut Flashes
  // =========================================================================
  const CUT_TIMES = [9.10, 18.25, 24.30, 31.15, 38.45, 46.20, 50.25, 56.25, 64.15, 71.25];

  function renderMasterFrame(ctx, t, state) {
    const beat = S.BEAT.getBeatInfo(t);
    const beatMode = (state && state.beatMode) ? state.beatMode : 'soft';
    const kBeat = beatMode === 'off' ? 0 : beatMode === 'soft' ? 0.42 : 1.0;

    // Refined DJ Beat Camera Breathing & Gentle Chorus Sway
    const isChorus = (t >= 31.15 && t < 64.15);
    const camZoom = 1 + beat.pulse * (isChorus ? 0.015 : 0.008) * kBeat + beat.downPulse * (isChorus ? 0.008 : 0.0035) * kBeat;
    const camRoll = isChorus ? (beat.beatInBar % 2 === 0 ? 1 : -1) * beat.pulse * 0.0032 * kBeat : 0;

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.scale(camZoom, camZoom);
    ctx.rotate(camRoll);
    ctx.translate(-W * 0.5, -H * 0.5);

    let recTag = 'REC  01 · RAINY CASSETTE';
    if (t < 9.10) {
      renderAct1(ctx, t, beat, kBeat);
      recTag = 'REC  ACT 01 · MIDNIGHT CASSETTE';
    } else if (t < 18.25) {
      renderAct2(ctx, t, beat, kBeat);
      recTag = 'REC  ACT 02 · SUMMER SEA TRAIN';
    } else if (t < 24.30) {
      renderAct3(ctx, t, beat, kBeat);
      recTag = 'REC  ACT 03 · STARDUST SODA';
    } else if (t < 31.15) {
      renderAct4(ctx, t, beat, kBeat);
      recTag = 'REC  ACT 04 · GOLDEN SEAWALL';
    } else if (t < 38.45) {
      renderAct5(ctx, t, beat, kBeat);
      recTag = 'REC  ACT 05 · FERRIS FIREWORKS';
    } else if (t < 46.20) {
      renderAct6(ctx, t, beat, kBeat);
      recTag = 'REC  ACT 06 · FOUR SEASONS';
    } else if (t < 56.25) {
      renderAct7(ctx, t, beat, kBeat);
      recTag = t < 50.25 ? 'REC  ACT 07 · ORCHID BLOOM' : 'REC  ACT 07 · NEON COAST RIDE';
    } else if (t < 64.15) {
      renderAct8(ctx, t, beat, kBeat);
      recTag = 'REC  ACT 08 · TIME RIFT STORM';
    } else if (t < 71.25) {
      renderAct9(ctx, t, beat, kBeat);
      recTag = 'REC  ACT 09 · DAWN MIRROR SEA';
    } else {
      renderAct10(ctx, t, beat, kBeat);
      recTag = 'REC  ACT 10 · SUNRISE RELEASE';
    }

    // Interactive Easter Eggs (multi-tier fireworks / origami paper planes on click!)
    if (state && state.bursts && state.bursts.length) {
      state.bursts.forEach((b) => {
        const age = t - b.t0;
        if (age >= 0 && age < 2.4) {
          if (b.kind === 'firework') {
            drawCinemaFirework(ctx, b.x, b.y, age / 2.2, ['#ff80b8', '#ffd87a', '#70e2ff'], 185, false);
          } else {
            const p = easeOutCubic(age / 2.2);
            drawPaperPlane(ctx, b.x + p * 260, b.y - p * 110, 1.15 * (1 - p * 0.4), -0.32, 1 - p);
          }
        }
      });
    }

    ctx.restore();

    // Film-burn soft light flash right on major scene transitions
    let cutFlash = 0;
    for (const ct of CUT_TIMES) {
      const d = Math.abs(t - ct);
      if (d < 0.24) {
        cutFlash = Math.max(cutFlash, (1 - d / 0.24) * (ct === 31.15 || ct === 56.25 ? 0.42 : 0.24));
      }
    }
    if (t < 0.65) {
      ctx.fillStyle = `rgba(6, 8, 16, ${1 - smoothstep(invLerp(0, 0.65, t))})`;
      ctx.fillRect(0, 0, W, H);
    }

    drawCinemaFinish(ctx, t, { ...beat, pulse: beat.pulse * kBeat }, {
      vignette: isChorus ? 0.24 : 0.30,
      recTag,
      flashAlpha: cutFlash
    });
  }

  S.renderMasterFrame = renderMasterFrame;
})(window.SUMMER);
