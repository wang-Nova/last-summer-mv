// Cinematic Anime & Retro Summer Film Rendering Core for 《去年夏天》 (1280x720)
// High-craft refined edition: sculpted anime figures, painterly Shinkai clouds,
// multi-tier Japanese hanabi fireworks, authentic Ramune bottle, cassette mechanics,
// truss Ferris wheel, detailed Enoden coastal train & botanical orchids.
window.SUMMER = window.SUMMER || {};

(function (S) {
  const W = 1280;
  const H = 720;

  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const invLerp = (a, b, v) => clamp((v - a) / (b - a), 0, 1);
  const smoothstep = (t) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
  const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
  const easeInCubic = (t) => Math.pow(clamp(t, 0, 1), 3);
  const easeInOutQuad = (t) => { const x = clamp(t, 0, 1); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
  const easeOutBack = (t) => { const x = clamp(t, 0, 1); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

  function hash(n) {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
    return s - Math.floor(s);
  }

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbToHex(r, g, b) {
    const c = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
    return '#' + c(r) + c(g) + c(b);
  }

  function lerpColor(aHex, bHex, t) {
    const a = hexToRgb(aHex), b = hexToRgb(bHex), k = clamp(t, 0, 1);
    return rgbToHex(lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k));
  }

  function rgba(hex, alpha) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r},${g},${b},${clamp(alpha, 0, 1)})`;
  }

  // Deterministic 35mm film grain tile
  let grainCanvas = null;
  function getGrain() {
    if (grainCanvas) return grainCanvas;
    const c = document.createElement('canvas');
    c.width = 180; c.height = 180;
    const g = c.getContext('2d');
    const img = g.createImageData(180, 180);
    for (let i = 0; i < 180 * 180; i++) {
      const v = Math.floor(hash(i * 1.37 + 19) * 255);
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 12;
    }
    g.putImageData(img, 0, 0);
    grainCanvas = c;
    return c;
  }

  function drawSkyGradient(ctx, stops) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    stops.forEach(([pos, col]) => g.addColorStop(pos, col));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawStarfield(ctx, t, alpha = 1, count = 82, maxY = 480) {
    if (alpha <= 0.01) return;
    ctx.save();
    for (let i = 0; i < count; i++) {
      const x = hash(i * 23.1 + 3.4) * W;
      const y = hash(i * 41.7 + 9.2) * maxY;
      const r = 0.65 + hash(i * 11.3) * 1.65;
      const tw = 0.42 + 0.58 * Math.sin(t * (1.7 + hash(i * 6.7) * 2.8) + i * 1.9);
      const a = alpha * tw * (0.38 + 0.62 * hash(i * 5.1));
      ctx.fillStyle = i % 7 === 0 ? `rgba(255,220,242,${a})` : i % 5 === 0 ? `rgba(180,235,255,${a})` : `rgba(255,252,245,${a})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if (i % 11 === 0) {
        const sp = r * 3.8;
        ctx.strokeStyle = `rgba(255,250,240,${a * 0.68})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(x - sp, y); ctx.lineTo(x + sp, y);
        ctx.moveTo(x, y - sp); ctx.lineTo(x, y + sp);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // =========================================================================
  // Painterly Makoto Shinkai Cumulonimbus Cloud (offscreen source-atop composited — zero circle seams!)
  // =========================================================================
  const cloudCache = new Map();
  function getPaintedCloudSprite(lightCol, midCol, shadeCol, rimCol) {
    const key = `${lightCol}|${midCol}|${shadeCol}|${rimCol}`;
    if (cloudCache.has(key)) return cloudCache.get(key);
    if (cloudCache.size > 28) {
      // Keep cache bounded when interpolating colors in Act 9
      const firstKey = cloudCache.keys().next().value;
      cloudCache.delete(firstKey);
    }

    const cw = 540, ch = 330;
    const ox = 270, oy = 196;
    const c = document.createElement('canvas');
    c.width = cw; c.height = ch;
    const g = c.getContext('2d');

    // Richly sculpted cauliflower cumulonimbus lobes + flat warm atmospheric base
    const silhouetteLobes = [
      // Towering upper crown
      { x: -18, y: -102, r: 52 },
      { x: 32, y: -92, r: 48 },
      { x: -64, y: -66, r: 62 },
      { x: 4, y: -62, r: 78 },
      { x: 74, y: -52, r: 62 },
      // Mid billowing shoulders
      { x: -124, y: -22, r: 64 },
      { x: -58, y: -12, r: 76 },
      { x: 24, y: -6, r: 80 },
      { x: 108, y: -12, r: 64 },
      { x: 162, y: 18, r: 48 },
      { x: -176, y: 20, r: 48 },
      // Flat stratus lower base (aligned cleanly at y=42..46 so nothing pokes below the flat bottom!)
      { x: -140, y: 40, r: 38 },
      { x: -78, y: 42, r: 40 },
      { x: 0, y: 42, r: 42 },
      { x: 78, y: 42, r: 40 },
      { x: 140, y: 40, r: 38 },
      // Fine cauliflower bump scallops along silhouette edge
      { x: -94, y: -88, r: 34 },
      { x: 58, y: -76, r: 32 },
      { x: -152, y: -4, r: 34 },
      { x: 146, y: -6, r: 34 },
      { x: -198, y: 38, r: 28 },
      { x: 194, y: 38, r: 28 }
    ];

    // Step 1: Soft outer backlit sun halo around silhouette
    g.save();
    g.translate(ox, oy);
    const halo = g.createRadialGradient(-10, -56, 40, 0, -24, 245);
    halo.addColorStop(0, rgba(rimCol, 0.36));
    halo.addColorStop(0.55, rgba(rimCol, 0.12));
    halo.addColorStop(1, rgba(rimCol, 0));
    g.fillStyle = halo;
    g.beginPath();
    g.arc(0, -24, 245, 0, Math.PI * 2);
    g.fill();

    // Build unified matte cloud silhouette on temp mask canvas for seamless source-atop shading
    const mask = document.createElement('canvas');
    mask.width = cw; mask.height = ch;
    const mg = mask.getContext('2d');
    mg.translate(ox, oy);

    // Base fill in deep cool atmospheric shade
    const baseGrad = mg.createLinearGradient(0, -155, 0, 95);
    baseGrad.addColorStop(0, midCol);
    baseGrad.addColorStop(0.52, midCol);
    baseGrad.addColorStop(0.84, shadeCol);
    baseGrad.addColorStop(1, lerpColor(shadeCol, '#283c66', 0.25));
    mg.fillStyle = baseGrad;
    mg.beginPath();
    silhouetteLobes.forEach((p) => {
      mg.moveTo(p.x + p.r, p.y);
      mg.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    });
    // Flat smooth bottom shelf unifying base seamlessly
    mg.roundRect(-198, 22, 396, 62, 28);
    mg.fill();

    // Step 2: Paint soft painterly internal light volumes CLIPPED cleanly to unified cloud silhouette!
    mg.globalCompositeOperation = 'source-atop';

    // Cool underside depth belly shadow
    const underGrad = mg.createLinearGradient(0, 12, 0, 96);
    underGrad.addColorStop(0, rgba(shadeCol, 0));
    underGrad.addColorStop(0.42, rgba(shadeCol, 0.65));
    underGrad.addColorStop(1, rgba(shadeCol, 0.94));
    mg.fillStyle = underGrad;
    mg.fillRect(-260, 0, 520, 115);

    // Sculpted inner shadow pockets (gives real anime 3D cloud billow depth)
    const shadowPockets = [
      { x: -102, y: 26, r: 64, a: 0.44 },
      { x: -18, y: 28, r: 78, a: 0.42 },
      { x: 76, y: 26, r: 68, a: 0.46 },
      { x: 148, y: 38, r: 52, a: 0.48 },
      { x: -162, y: 40, r: 52, a: 0.46 },
      { x: 42, y: -12, r: 54, a: 0.24 },
      { x: -72, y: -18, r: 50, a: 0.22 }
    ];
    shadowPockets.forEach((s) => {
      const sg = mg.createRadialGradient(s.x, s.y + 8, s.r * 0.1, s.x, s.y, s.r);
      sg.addColorStop(0, rgba(shadeCol, s.a));
      sg.addColorStop(0.65, rgba(shadeCol, s.a * 0.45));
      sg.addColorStop(1, rgba(shadeCol, 0));
      mg.fillStyle = sg;
      mg.beginPath();
      mg.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      mg.fill();
    });

    // Warm sunlit upper-left painterly cauliflower crowns
    const litBillows = [
      { x: -24, y: -112, r: 62, a: 0.96 },
      { x: 26, y: -102, r: 56, a: 0.94 },
      { x: -74, y: -76, r: 68, a: 0.94 },
      { x: -4, y: -74, r: 84, a: 0.96 },
      { x: 70, y: -62, r: 66, a: 0.90 },
      { x: -130, y: -32, r: 66, a: 0.88 },
      { x: -58, y: -24, r: 72, a: 0.86 },
      { x: 18, y: -22, r: 74, a: 0.84 },
      { x: 102, y: -24, r: 64, a: 0.82 },
      { x: -178, y: 10, r: 48, a: 0.72 },
      { x: 158, y: 8, r: 48, a: 0.72 },
      { x: -96, y: -96, r: 38, a: 0.92 }
    ];
    litBillows.forEach((b) => {
      const lg = mg.createRadialGradient(b.x - b.r * 0.2, b.y - b.r * 0.25, b.r * 0.08, b.x, b.y, b.r);
      lg.addColorStop(0, rgba(lightCol, b.a));
      lg.addColorStop(0.58, rgba(lightCol, b.a * 0.72));
      lg.addColorStop(1, rgba(lightCol, 0));
      mg.fillStyle = lg;
      mg.beginPath();
      mg.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      mg.fill();
    });

    // Crisp sun-kissed rim highlight along very top ridges
    const rimGrad = mg.createLinearGradient(0, -162, 0, -28);
    rimGrad.addColorStop(0, rgba(rimCol, 0.92));
    rimGrad.addColorStop(0.45, rgba(lightCol, 0.35));
    rimGrad.addColorStop(1, rgba(lightCol, 0));
    mg.fillStyle = rimGrad;
    mg.fillRect(-250, -165, 500, 145);

    // Subtle soft feather fade along flat cloud bottom so it melts into sea horizon haze
    mg.globalCompositeOperation = 'destination-out';
    const footFade = mg.createLinearGradient(0, 68, 0, 88);
    footFade.addColorStop(0, 'rgba(0,0,0,0)');
    footFade.addColorStop(1, 'rgba(0,0,0,0.42)');
    mg.fillStyle = footFade;
    mg.fillRect(-260, 68, 520, 32);

    g.restore();
    g.drawImage(mask, 0, 0);

    const sprite = { canvas: c, ox, oy };
    cloudCache.set(key, sprite);
    return sprite;
  }

  function drawCumulusCloud(ctx, cx, cy, scale = 1, opts = {}) {
    const {
      lightCol = '#fffdf8',
      midCol = '#d8ebfa',
      shadeCol = '#7ca2d1',
      rimCol = '#fff6dc',
      alpha = 1
    } = opts;
    const sp = getPaintedCloudSprite(lightCol, midCol, shadeCol, rimCol);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.drawImage(sp.canvas, -sp.ox, -sp.oy);
    ctx.restore();
  }

  // Sparkling anime ocean with perspective sun/moon glitter column & rolling swells
  function drawOcean(ctx, horizonY, t, opts = {}) {
    const {
      topCol = '#2a7ec9',
      midCol = '#19549c',
      botCol = '#0d2b5c',
      glitterCol = '#fff3c4',
      sunX = W * 0.5,
      glitterSpread = 240,
      shimmerAlpha = 0.85,
      beatPulse = 0
    } = opts;

    const og = ctx.createLinearGradient(0, horizonY, 0, H);
    og.addColorStop(0, topCol);
    og.addColorStop(0.45, midCol);
    og.addColorStop(1, botCol);
    ctx.fillStyle = og;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // Horizon atmospheric bloom
    const hg = ctx.createLinearGradient(0, horizonY - 8, 0, horizonY + 52);
    hg.addColorStop(0, rgba(glitterCol, 0.44 * shimmerAlpha));
    hg.addColorStop(1, rgba(glitterCol, 0));
    ctx.fillStyle = hg;
    ctx.fillRect(0, horizonY - 4, W, 56);

    // Perspective shimmering wave glints
    ctx.save();
    const rows = 40;
    for (let i = 0; i < rows; i++) {
      const p = i / rows;
      const persp = p * p;
      const y = horizonY + 3 + persp * (H - horizonY - 12);
      const count = 4 + Math.floor((1 - p) * 6);
      const spread = glitterSpread * (0.26 + persp * 1.48);
      for (let j = 0; j < count; j++) {
        const seed = i * 31.7 + j * 13.3;
        const drift = Math.sin(t * (2.0 + hash(seed) * 2.4) + seed) * 24 * (0.28 + persp);
        const gx = sunX + (hash(seed + 1.1) - 0.5) * 2 * spread + drift;
        const distNorm = Math.abs(gx - sunX) / Math.max(40, spread);
        const len = (10 + hash(seed + 2.7) * 44) * (0.32 + persp * 1.22) * (1 + beatPulse * 0.22);
        const hBar = Math.max(1.1, (1.3 + persp * 3.5));
        const a = shimmerAlpha * clamp(1 - distNorm * 0.86, 0.08, 1) * (0.45 + 0.55 * Math.sin(t * 4.8 + seed));
        ctx.fillStyle = rgba(glitterCol, a);
        ctx.beginPath();
        ctx.roundRect(gx - len * 0.5, y, len, hBar, hBar * 0.5);
        ctx.fill();
      }
    }

    // Subtle delicate wave crests across full width
    ctx.strokeStyle = rgba('#ffffff', 0.13 * shimmerAlpha);
    ctx.lineWidth = 1.4;
    for (let k = 0; k < 8; k++) {
      const wy = horizonY + 22 + k * k * 5.2;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 36) {
        const dy = Math.sin(x * 0.011 + t * (1.7 + k * 0.2) + k * 2) * (2.0 + k * 0.55);
        if (x === 0) ctx.moveTo(x, wy + dy);
        else ctx.lineTo(x, wy + dy);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // Sculpted Anime Youth Silhouette: Boy (refined anime head profile, layered hair,
  // folded collar shirt, articulated arm + hand, tailored trousers & sneakers)
  // =========================================================================
  function drawAnimeBoy(ctx, x, y, scale = 1, opts = {}) {
    const {
      fillCol = '#1b2038',
      rimCol = '#ffd49c',
      shirtCol = '#dce6f8',
      t = 0,
      facing = 1, // 1 = right, -1 = left
      armRaise = 0, // 0 = relaxed, 0.72 = pinky promise reach, 0.95 = paper plane launch
      alpha = 1
    } = opts;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.scale(scale * facing, scale);

    const breeze = Math.sin(t * 3.1) * 3.6 + Math.sin(t * 5.4) * 1.1;
    const shirtMid = lerpColor(fillCol, shirtCol, 0.36);
    const shirtLit = lerpColor(shirtMid, rimCol, 0.32);
    const darkShadow = lerpColor(fillCol, '#060814', 0.35);

    // --- 1. Far Leg (planted slightly behind for natural anime stance) ---
    ctx.fillStyle = darkShadow;
    ctx.beginPath();
    ctx.moveTo(-11, -78);
    ctx.quadraticCurveTo(-15, -44, -14, -10);
    ctx.lineTo(-4, -10);
    ctx.quadraticCurveTo(-2, -42, 2, -74);
    ctx.closePath();
    ctx.fill();
    // Far sneaker
    ctx.beginPath();
    ctx.moveTo(-15, -11);
    ctx.lineTo(-16, -2);
    ctx.quadraticCurveTo(-8, 1, 2, -1);
    ctx.quadraticCurveTo(3, -7, -4, -11);
    ctx.closePath();
    ctx.fill();

    // --- 2. Near Leg (tailored summer trouser with slight knee drape + crisp sneaker) ---
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(-2, -78);
    ctx.quadraticCurveTo(2, -45, 4, -11);
    ctx.lineTo(14, -11);
    ctx.quadraticCurveTo(18, -40, 13, -78);
    ctx.closePath();
    ctx.fill();

    // Trouser front backlit edge + subtle trouser cuff crease
    ctx.strokeStyle = rgba(rimCol, 0.55);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(13, -76);
    ctx.quadraticCurveTo(17.5, -42, 13.5, -12);
    ctx.stroke();

    // Near canvas sneaker with bright sole highlight
    ctx.fillStyle = lerpColor(fillCol, '#2b3252', 0.3);
    ctx.beginPath();
    ctx.moveTo(4, -11);
    ctx.lineTo(3, -2);
    ctx.quadraticCurveTo(13, 1, 24, -1);
    ctx.quadraticCurveTo(25, -7, 15, -10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(rimCol, 0.72);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(4, -1.2); ctx.lineTo(23.5, -1.2);
    ctx.stroke();

    // --- 3. Far-Side Subtle Arm (for 3D shoulder depth when reaching) ---
    if (armRaise > 0.2) {
      ctx.save();
      ctx.fillStyle = darkShadow;
      ctx.beginPath();
      ctx.moveTo(9, -133);
      ctx.quadraticCurveTo(22, -125, 31, -118);
      ctx.lineTo(29, -113);
      ctx.quadraticCurveTo(18, -119, 7, -125);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // --- 4. Torso (Summer Button-Up Open-Collar Shirt rippling in sea breeze) ---
    const shirtGrad = ctx.createLinearGradient(-18, -110, 18, -110);
    shirtGrad.addColorStop(0, lerpColor(fillCol, shirtCol, 0.20));
    shirtGrad.addColorStop(0.65, shirtMid);
    shirtGrad.addColorStop(1, shirtLit);
    ctx.fillStyle = shirtGrad;
    ctx.beginPath();
    ctx.moveTo(-13, -142); // back shoulder
    ctx.quadraticCurveTo(-19 - breeze * 0.4, -116, -18 - breeze * 0.9, -76); // wind-fluttering back hem
    ctx.quadraticCurveTo(-12 - breeze * 0.4, -71, -2, -74); // curved untucked hem slit
    ctx.quadraticCurveTo(8, -71, 16, -74); // front hem
    ctx.quadraticCurveTo(19, -102, 14, -138); // slim athletic chest contour
    ctx.quadraticCurveTo(8, -145, -13, -142);
    ctx.closePath();
    ctx.fill();

    // Subtle diagonal shirt fold shading lines
    ctx.strokeStyle = rgba(darkShadow, 0.38);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-14 - breeze * 0.4, -90);
    ctx.quadraticCurveTo(-4, -99, 5, -112);
    ctx.moveTo(-12 - breeze * 0.3, -106);
    ctx.quadraticCurveTo(-2, -113, 6, -122);
    ctx.stroke();

    // Crisp upturned summer shirt collar & front chest rim light
    ctx.fillStyle = lerpColor(shirtMid, rimCol, 0.45);
    ctx.beginPath();
    ctx.moveTo(-8, -143);
    ctx.lineTo(5, -146);
    ctx.lineTo(11, -136);
    ctx.lineTo(-1, -135);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = rgba(rimCol, 0.92);
    ctx.lineWidth = 2.0;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(7, -145);
    ctx.quadraticCurveTo(15, -136, 17.5, -106);
    ctx.quadraticCurveTo(18, -88, 15.5, -74.5);
    ctx.stroke();

    // --- 5. Neck & Sculpted Anime Side/3/4 Head Profile (slender ~1:6.2 teenager proportions!) ---
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(-5.2, -140);
    ctx.lineTo(-4.6, -152);
    ctx.lineTo(4.6, -151);
    ctx.lineTo(5.6, -140);
    ctx.closePath();
    ctx.fill();

    // Backlit throat edge
    ctx.strokeStyle = rgba(rimCol, 0.72);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(4.8, -151); ctx.lineTo(5.6, -141);
    ctx.stroke();

    // Sculpted anime head profile scaled cleanly to 0.83x around neck base (0, -149)
    ctx.save();
    ctx.translate(0, -149);
    ctx.scale(0.83, 0.83);
    ctx.translate(0, 152);

    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(-5.5, -153); // nape
    ctx.bezierCurveTo(-17, -159, -19, -180, -7, -190); // back cranium
    ctx.bezierCurveTo(3.5, -196, 14.5, -190, 16.0, -177); // forehead
    ctx.lineTo(15.6, -172); // brow indent
    ctx.lineTo(18.8, -166.5); // petite anime nose tip
    ctx.lineTo(16.0, -165.0);
    ctx.lineTo(16.8, -162.2); // gentle upper lip
    ctx.lineTo(15.6, -160.2); // lower lip
    ctx.quadraticCurveTo(14.8, -155.2, 10.2, -153.8); // refined anime chin
    ctx.quadraticCurveTo(2, -152.8, -5.5, -153); // jawline
    ctx.closePath();
    ctx.fill();

    // Radiant golden/neon profile rim along forehead, nose, lips & chin
    ctx.strokeStyle = rgba(rimCol, 0.94);
    ctx.lineWidth = 1.8;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(10, -189);
    ctx.quadraticCurveTo(16.0, -183, 16.0, -177);
    ctx.lineTo(15.6, -172);
    ctx.lineTo(18.8, -166.5);
    ctx.lineTo(16.0, -165.0);
    ctx.lineTo(16.8, -162.2);
    ctx.lineTo(15.2, -156.5);
    ctx.quadraticCurveTo(13.0, -154.0, 9.8, -153.8);
    ctx.stroke();

    // Cohesive multi-layered windswept anime boy hair (soft natural flow, zero floating wires!)
    ctx.fillStyle = darkShadow;
    ctx.beginPath();
    ctx.moveTo(-12, -156);
    ctx.quadraticCurveTo(-20 - breeze * 0.45, -156, -21 - breeze * 0.65, -150);
    ctx.quadraticCurveTo(-16 - breeze * 0.25, -154, -15, -159);
    ctx.quadraticCurveTo(-23 - breeze * 0.55, -166, -21 - breeze * 0.55, -176);
    ctx.quadraticCurveTo(-19 - breeze * 0.3, -189, -7, -195);
    ctx.quadraticCurveTo(3, -200 - Math.abs(breeze) * 0.18, 12, -193);
    ctx.quadraticCurveTo(20, -189, 21.5, -178);
    ctx.quadraticCurveTo(17.5, -175, 14.5, -172);
    ctx.quadraticCurveTo(15.5, -180, 10, -184);
    ctx.quadraticCurveTo(10.5, -175, 6.5, -170);
    ctx.quadraticCurveTo(4.5, -178, 0.5, -181);
    ctx.quadraticCurveTo(1.5, -168, -2, -161);
    ctx.quadraticCurveTo(-7, -162, -12, -156);
    ctx.closePath();
    ctx.fill();

    // Delicate backlit crown & bang rim glow following actual hair silhouette
    ctx.strokeStyle = rgba(rimCol, 0.84);
    ctx.lineWidth = 1.45;
    ctx.beginPath();
    ctx.moveTo(-9, -193); ctx.quadraticCurveTo(4, -199, 17, -189);
    ctx.moveTo(14, -188); ctx.quadraticCurveTo(21.5, -182, 20.8, -175);
    ctx.moveTo(-17, -180); ctx.quadraticCurveTo(-22 - breeze * 0.45, -172, -20 - breeze * 0.55, -163);
    ctx.stroke();
    ctx.restore();

    // --- 6. Articulated Near Arm (Rolled Sleeve + Elbow + Forearm + Delicate Anime Hand) ---
    // Shoulder pivot at (2, -134). Compute elbow & hand cleanly by armRaise!
    const shX = 2, shY = -134;
    let elX, elY, wrX, wrY, handAng;
    if (armRaise <= 0.78) {
      const k = clamp(armRaise / 0.72, 0, 1);
      // 0 -> relaxed by side; 0.72 -> graceful pinky-promise reach (hand tip at ~38, -121!)
      elX = lerp(-2, 16, k);
      elY = lerp(-108, -120, k);
      wrX = lerp(4, 33, k);
      wrY = lerp(-82, -121, k);
      handAng = lerp(1.38, -0.05, k);
    } else {
      const k = clamp((armRaise - 0.72) / 0.28, 0, 1);
      // 0.72 -> 1.0: upward paper plane release reach (hand tip at ~46, -155!)
      elX = lerp(16, 22, k);
      elY = lerp(-120, -136, k);
      wrX = lerp(33, 42, k);
      wrY = lerp(-121, -152, k);
      handAng = lerp(-0.05, -0.68, k);
    }

    // Short rolled summer sleeve on upper arm
    const uAng = Math.atan2(elY - shY, elX - shX);
    const uLen = Math.hypot(elX - shX, elY - shY);
    ctx.save();
    ctx.translate(shX, shY);
    ctx.rotate(uAng);
    ctx.fillStyle = shirtMid;
    ctx.beginPath();
    ctx.moveTo(-4, -7.5);
    ctx.lineTo(uLen * 0.76, -6.2);
    ctx.lineTo(uLen * 0.76, 6.8);
    ctx.lineTo(-4, 7.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(rimCol, 0.82);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-2, -7.2); ctx.lineTo(uLen * 0.76, -6.0);
    ctx.stroke();
    ctx.restore();

    // Bare tapered lower upper-arm & forearm
    const fAng = Math.atan2(wrY - elY, wrX - elX);
    const fLen = Math.hypot(wrX - elX, wrY - elY);
    ctx.save();
    ctx.fillStyle = fillCol;
    ctx.strokeStyle = fillCol;
    ctx.lineCap = 'round';
    ctx.lineWidth = 7.4;
    ctx.beginPath();
    ctx.moveTo(lerp(shX, elX, 0.65), lerp(shY, elY, 0.65));
    ctx.lineTo(elX, elY);
    ctx.stroke();

    ctx.translate(elX, elY);
    ctx.rotate(fAng);
    ctx.beginPath();
    ctx.moveTo(0, -4.0);
    ctx.lineTo(fLen, -2.5);
    ctx.lineTo(fLen, 2.5);
    ctx.lineTo(0, 4.0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(rimCol, 0.78);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -3.8); ctx.lineTo(fLen, -2.4);
    ctx.stroke();
    ctx.restore();

    // Delicate articulated hand & extended fingers
    ctx.save();
    ctx.translate(wrX, wrY);
    ctx.rotate(handAng);
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(0, -2.6);
    ctx.lineTo(5.5, -3.2);
    ctx.lineTo(10.5, -1.0); // index/pinky reach tip
    ctx.lineTo(9.5, 1.5);
    ctx.lineTo(5.0, 3.0);
    ctx.lineTo(0, 2.5);
    ctx.closePath();
    ctx.fill();
    // Subtle rim sparkle on reaching fingertips
    ctx.strokeStyle = rgba(rimCol, 0.9);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(2, -2.8); ctx.lineTo(10.5, -1.0);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // Sculpted Anime Girl Silhouette: Graceful profile, cascading multi-ribbon wind hair,
  // cinched waist ribbon, multi-layered backlit pleated sundress & slender sandals
  // =========================================================================
  function drawAnimeGirl(ctx, x, y, scale = 1, opts = {}) {
    const {
      fillCol = '#231f3b',
      rimCol = '#ffc5d9',
      dressCol = '#f8e6ee',
      t = 0,
      facing = -1,
      armRaise = 0,
      alpha = 1
    } = opts;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.scale(scale * facing, scale);

    const breeze = Math.sin(t * 3.4 + 0.6) * 6.2 + Math.sin(t * 5.8) * 1.4;
    const breeze2 = Math.sin(t * 3.9 + 1.5) * 7.4;
    const dressMid = lerpColor(fillCol, dressCol, 0.40);
    const dressLit = lerpColor(dressMid, rimCol, 0.45);
    const darkShadow = lerpColor(fillCol, '#090717', 0.38);

    // --- 1. Cascading Back Long Hair Curtain (behind dress & shoulders) ---
    ctx.fillStyle = darkShadow;
    ctx.beginPath();
    ctx.moveTo(-6, -172);
    ctx.bezierCurveTo(-24 - breeze * 0.5, -152, -32 - breeze * 1.1, -118, -48 - breeze * 1.65, -86);
    ctx.quadraticCurveTo(-30 - breeze * 0.9, -94, -22 - breeze * 0.6, -108);
    ctx.quadraticCurveTo(-30 - breeze * 1.1, -86, -34 - breeze * 1.45, -72);
    ctx.quadraticCurveTo(-14 - breeze * 0.5, -92, -10 - breeze * 0.25, -118);
    ctx.quadraticCurveTo(-4, -142, -2, -162);
    ctx.closePath();
    ctx.fill();

    // --- 2. Slender Tapered Legs & Delicate Summer Strap Sandals ---
    // Far leg
    ctx.fillStyle = darkShadow;
    ctx.beginPath();
    ctx.moveTo(-9, -56);
    ctx.quadraticCurveTo(-11, -32, -8, -8);
    ctx.lineTo(-2.5, -8);
    ctx.quadraticCurveTo(-1, -30, -1, -56);
    ctx.closePath();
    ctx.fill();
    // Far sandal
    ctx.beginPath();
    ctx.moveTo(-9, -8); ctx.lineTo(-9, -1); ctx.quadraticCurveTo(-2, 1, 5, -1); ctx.quadraticCurveTo(4, -5, -2.5, -8);
    ctx.closePath();
    ctx.fill();

    // Near slender leg with calf curve & sunlit front shin edge
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(1, -56);
    ctx.quadraticCurveTo(0, -34, 3.5, -8);
    ctx.lineTo(9.2, -8);
    ctx.quadraticCurveTo(11.5, -28, 9.5, -56);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(rimCol, 0.70);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(9.6, -54); ctx.quadraticCurveTo(11.5, -28, 9.2, -9);
    ctx.stroke();
    // Near strap sandal
    ctx.fillStyle = lerpColor(fillCol, '#3b2442', 0.35);
    ctx.beginPath();
    ctx.moveTo(3, -8); ctx.lineTo(2.5, -1); ctx.quadraticCurveTo(10, 1, 18.5, -1.2); ctx.quadraticCurveTo(17.5, -5.5, 9.5, -7.5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(rimCol, 0.72);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(3, -1); ctx.lineTo(18, -1.2);
    ctx.stroke();

    // --- 3. Multi-Layered Fluttering Summer Sundress ---
    // Back inner shadow petticoat hem peeking out
    ctx.fillStyle = lerpColor(fillCol, dressCol, 0.20);
    ctx.beginPath();
    ctx.moveTo(-9, -104);
    ctx.quadraticCurveTo(-24 - breeze * 0.7, -76, -33 - breeze * 1.15, -49);
    ctx.quadraticCurveTo(-4 - breeze * 0.3, -42, 26 - breeze * 0.25, -49);
    ctx.quadraticCurveTo(18, -76, 10, -104);
    ctx.closePath();
    ctx.fill();

    // Main sculpted sundress bodice + fluttering pleated skirt
    const dressGrad = ctx.createLinearGradient(-22, -134, 24, -48);
    dressGrad.addColorStop(0, lerpColor(fillCol, dressCol, 0.22));
    dressGrad.addColorStop(0.58, dressMid);
    dressGrad.addColorStop(0.86, dressLit);
    dressGrad.addColorStop(1, rgba(rimCol, 0.92));
    ctx.fillStyle = dressGrad;
    ctx.beginPath();
    // Fitted bodice shoulders & bust contour
    ctx.moveTo(-10, -135);
    ctx.quadraticCurveTo(-13, -118, -10, -104); // slender back waist
    // Wind-swept flowing pleated skirt
    ctx.bezierCurveTo(-22 - breeze * 0.55, -84, -30 - breeze * 0.95, -66, -36 - breeze * 1.25, -51);
    // Scalloped waving sunlit hem!
    ctx.quadraticCurveTo(-22 - breeze * 0.85, -46, -12 - breeze * 0.6, -50);
    ctx.quadraticCurveTo(0 - breeze * 0.35, -45, 11 - breeze * 0.2, -49);
    ctx.quadraticCurveTo(21 - breeze * 0.1, -46, 30 - breeze * 0.15, -52);
    // Sunlit front skirt drape up to waist & chest
    ctx.bezierCurveTo(24, -72, 18, -88, 10, -104);
    ctx.quadraticCurveTo(14.5, -118, 11, -134);
    ctx.quadraticCurveTo(2, -138, -10, -135);
    ctx.closePath();
    ctx.fill();

    // Soft translucent backlit chiffon glow along bottom skirt hem (Shinkai signature!)
    const hemGlow = ctx.createLinearGradient(0, -64, 0, -45);
    hemGlow.addColorStop(0, rgba(rimCol, 0));
    hemGlow.addColorStop(1, rgba(rimCol, 0.48));
    ctx.fillStyle = hemGlow;
    ctx.beginPath();
    ctx.moveTo(-30 - breeze * 1.0, -62);
    ctx.lineTo(-36 - breeze * 1.25, -51);
    ctx.quadraticCurveTo(-4 - breeze * 0.4, -44, 30 - breeze * 0.15, -52);
    ctx.lineTo(24, -63);
    ctx.closePath();
    ctx.fill();

    // Graceful vertical skirt pleat fold curves
    ctx.strokeStyle = rgba(darkShadow, 0.36);
    ctx.lineWidth = 1.25;
    [-6, -1, 4, 8].forEach((wx, idx) => {
      const botX = lerp(-24 - breeze * 1.0, 20 - breeze * 0.15, idx / 3);
      ctx.beginPath();
      ctx.moveTo(wx, -102);
      ctx.quadraticCurveTo(lerp(wx, botX, 0.5) - breeze * 0.2, -76, botX, -51);
      ctx.stroke();
    });

    // Fluttering satin waist sash & two trailing ribbon tails!
    ctx.fillStyle = lerpColor(fillCol, rimCol, 0.42);
    ctx.beginPath();
    ctx.roundRect(-11, -106.5, 22, 4.5, 2);
    ctx.fill();
    ctx.strokeStyle = rgba(rimCol, 0.85);
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-10, -104);
    ctx.bezierCurveTo(-24 - breeze * 0.6, -98, -32 - breeze * 1.2, -88, -42 - breeze * 1.55, -78);
    ctx.stroke();
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-9, -103);
    ctx.bezierCurveTo(-20 - breeze2 * 0.5, -94, -26 - breeze2 * 1.0, -82, -32 - breeze2 * 1.3, -70);
    ctx.stroke();

    // Luminous front dress silhouette rim highlight
    ctx.strokeStyle = rgba(rimCol, 0.92);
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(11, -134);
    ctx.quadraticCurveTo(14.5, -118, 10, -104);
    ctx.bezierCurveTo(18, -88, 24, -72, 30 - breeze * 0.15, -52);
    ctx.stroke();

    // --- 4. Slender Neck & Delicate Anime Girl Profile (graceful ~1:6.3 anime proportions!) ---
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(-4.0, -133);
    ctx.lineTo(-3.6, -144);
    ctx.lineTo(3.6, -143);
    ctx.lineTo(4.4, -133);
    ctx.closePath();
    ctx.fill();

    // Sculpted anime girl profile head scaled cleanly to 0.84x around neck base
    ctx.save();
    ctx.translate(0, -143);
    ctx.scale(0.84, 0.84);
    ctx.translate(0, 146);

    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(-5, -147);
    ctx.bezierCurveTo(-16, -153, -18, -173, -7, -182);
    ctx.bezierCurveTo(3, -187, 13.5, -182, 15.0, -169);
    ctx.lineTo(14.6, -165);
    ctx.lineTo(17.4, -160.2); // petite anime nose
    ctx.lineTo(15.0, -158.8);
    ctx.lineTo(15.6, -156.2); // delicate lips
    ctx.lineTo(14.4, -154.5);
    ctx.quadraticCurveTo(13.5, -149.8, 9.2, -148.6); // refined chin
    ctx.quadraticCurveTo(2, -147.2, -5, -147);
    ctx.closePath();
    ctx.fill();

    // Luminous profile rim highlight
    ctx.strokeStyle = rgba(rimCol, 0.95);
    ctx.lineWidth = 1.7;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(10, -181);
    ctx.quadraticCurveTo(15, -175, 15.0, -169);
    ctx.lineTo(14.6, -165);
    ctx.lineTo(17.4, -160.2);
    ctx.lineTo(15.0, -158.8);
    ctx.lineTo(15.6, -156.2);
    ctx.lineTo(14.0, -151.0);
    ctx.quadraticCurveTo(12, -148.8, 9.0, -148.6);
    ctx.stroke();

    // --- 5. Silky Flowing Long Hair Crown, Bangs, Cheek Lock & Delicate Gossamer Highlights ---
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(-12, -152);
    ctx.bezierCurveTo(-20, -164, -18, -182, -5, -187);
    ctx.bezierCurveTo(7, -190, 17, -183, 18.2, -170);
    ctx.quadraticCurveTo(15, -169, 13, -165);
    ctx.quadraticCurveTo(13, -174, 8, -177);
    ctx.quadraticCurveTo(8, -162, 4 - breeze * 0.14, -140);
    ctx.quadraticCurveTo(1, -151, 0, -161);
    ctx.bezierCurveTo(-11 - breeze * 0.35, -142, -26 - breeze * 0.95, -118, -42 - breeze * 1.45, -92);
    ctx.quadraticCurveTo(-24 - breeze * 0.65, -108, -12, -152);
    ctx.closePath();
    ctx.fill();

    // Delicate hair ribbon glint at back crown
    ctx.fillStyle = rgba(rimCol, 0.90);
    ctx.beginPath();
    ctx.ellipse(-11, -167, 4.0, 2.2, -0.45, 0, Math.PI * 2);
    ctx.fill();

    // Soft silky backlit hair crown & gossamer outer-edge rim (subtle, natural, never harsh!)
    ctx.strokeStyle = rgba(rimCol, 0.78);
    ctx.lineWidth = 1.3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-9, -185); ctx.bezierCurveTo(4, -190, 15, -183, 17.8, -170);
    ctx.stroke();

    ctx.strokeStyle = rgba(rimCol, 0.46);
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(-12, -174); ctx.bezierCurveTo(-25 - breeze * 0.55, -152, -36 - breeze * 1.05, -126, -48 - breeze * 1.55, -96);
    ctx.moveTo(-10, -160); ctx.bezierCurveTo(-21 - breeze2 * 0.48, -138, -32 - breeze2 * 0.92, -112, -40 - breeze2 * 1.3, -84);
    ctx.moveTo(7, -174); ctx.quadraticCurveTo(6 - breeze * 0.12, -156, 3.8 - breeze * 0.18, -141);
    ctx.stroke();
    ctx.restore();

    // --- 6. Articulated Slender Arm & Delicate Reaching Hand ---
    // Shoulder at (2, -127). When armRaise=0.72 -> hand tip meets Boy's hand at (~38, -121)!
    const shX = 2, shY = -127;
    const k = clamp(armRaise / 0.72, 0, 1);
    const elX = lerp(-2, 16, k);
    const elY = lerp(-103, -118, k);
    const wrX = lerp(3, 33, k);
    const wrY = lerp(-80, -121, k);
    const handAng = lerp(1.36, -0.06, k);

    // Cap sleeve puff
    ctx.fillStyle = dressMid;
    ctx.beginPath();
    ctx.ellipse(shX, shY + 2, 6.2, 5.2, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Slender upper arm & tapered forearm
    const fAng = Math.atan2(wrY - elY, wrX - elX);
    const fLen = Math.hypot(wrX - elX, wrY - elY);
    ctx.save();
    ctx.strokeStyle = fillCol;
    ctx.lineCap = 'round';
    ctx.lineWidth = 5.6;
    ctx.beginPath();
    ctx.moveTo(shX, shY + 2);
    ctx.lineTo(elX, elY);
    ctx.stroke();

    ctx.translate(elX, elY);
    ctx.rotate(fAng);
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(0, -2.9);
    ctx.lineTo(fLen, -1.9);
    ctx.lineTo(fLen, 1.9);
    ctx.lineTo(0, 2.9);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(rimCol, 0.80);
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(0, -2.8); ctx.lineTo(fLen, -1.8);
    ctx.stroke();
    ctx.restore();

    // Delicate slender hand & pinky fingertip
    ctx.save();
    ctx.translate(wrX, wrY);
    ctx.rotate(handAng);
    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.moveTo(0, -2.1);
    ctx.lineTo(5.0, -2.5);
    ctx.lineTo(9.8, -0.8);
    ctx.lineTo(8.8, 1.3);
    ctx.lineTo(4.5, 2.3);
    ctx.lineTo(0, 2.0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(rimCol, 0.92);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(1.5, -2.2); ctx.lineTo(9.8, -0.8);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // Ultra-Detailed Smoked-Acrylic Retro Summer Cassette Tape (Scene 1 Hero Prop)
  // =========================================================================
  function drawRetroCassette(ctx, cx, cy, scale = 1, t = 0, beat = {}) {
    const pulse = beat.pulse || 0;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale * (1 + pulse * 0.022), scale * (1 + pulse * 0.022));

    // Soft atmospheric neon backlight aura
    const bgGlow = ctx.createRadialGradient(0, 0, 42, 0, 0, 270);
    bgGlow.addColorStop(0, `rgba(255, 118, 178, ${0.26 + pulse * 0.18})`);
    bgGlow.addColorStop(0.55, `rgba(92, 214, 255, ${0.15 + pulse * 0.10})`);
    bgGlow.addColorStop(1, 'rgba(92, 214, 255, 0)');
    ctx.fillStyle = bgGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 270, 0, Math.PI * 2);
    ctx.fill();

    const cw = 376, ch = 236;

    // Outer smoked translucent polycarbonate shell
    const shellGrad = ctx.createLinearGradient(-cw / 2, -ch / 2, cw / 2, ch / 2);
    shellGrad.addColorStop(0, 'rgba(30, 42, 78, 0.84)');
    shellGrad.addColorStop(0.5, 'rgba(18, 25, 52, 0.86)');
    shellGrad.addColorStop(1, 'rgba(12, 18, 38, 0.90)');
    ctx.fillStyle = shellGrad;
    ctx.strokeStyle = 'rgba(155, 232, 255, 0.72)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 15);
    ctx.fill();
    ctx.stroke();

    // Inner molded structural ribs visible through translucent smoked acrylic!
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.13)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-cw / 2 + 10, -ch / 2 + 10, cw - 20, ch - 20, 10);
    ctx.stroke();

    // Internal visible magnetic tape path threading from reels -> bottom guide rollers!
    ctx.save();
    ctx.strokeStyle = 'rgba(84, 52, 74, 0.88)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(-102, 22);
    ctx.lineTo(-154, 92);
    ctx.lineTo(154, 92);
    ctx.lineTo(102, 22);
    ctx.stroke();
    // Subtle metallic guide rollers at lower corners
    [[-154, 92], [154, 92]].forEach(([rx, ry]) => {
      ctx.fillStyle = 'rgba(195, 218, 245, 0.55)';
      ctx.beginPath();
      ctx.arc(rx, ry, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0e1428';
      ctx.beginPath();
      ctx.arc(rx, ry, 2.8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // Sunset gradient retro paper sticker label across top
    const lg = ctx.createLinearGradient(-158, -96, 158, -26);
    lg.addColorStop(0, '#ff9f6e');
    lg.addColorStop(0.48, '#ff6ca8');
    lg.addColorStop(1, '#58c9f5');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.roundRect(-158, -96, 316, 68, 7);
    ctx.fill();

    // Cream top handwriting strip on cassette label
    ctx.fillStyle = 'rgba(255, 251, 244, 0.88)';
    ctx.beginPath();
    ctx.roundRect(-150, -90, 300, 32, 4);
    ctx.fill();
    // Thin ruled notebook lines on cassette sticker
    ctx.strokeStyle = 'rgba(140, 165, 200, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-144, -67); ctx.lineTo(144, -67);
    ctx.stroke();

    // Label typography & TYPE II micro badge
    ctx.fillStyle = '#18142b';
    ctx.font = '800 20px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('去年夏天  LAST SUMMER', -140, -68);
    // Side A pill badge
    ctx.fillStyle = '#18142b';
    ctx.beginPath();
    ctx.roundRect(108, -86, 36, 18, 3);
    ctx.fill();
    ctx.fillStyle = '#fff8ee';
    ctx.font = '700 11px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('A 90', 126, -73);

    ctx.textAlign = 'left';
    ctx.font = '700 11px ui-monospace, Consolas, monospace';
    ctx.fillStyle = 'rgba(24, 18, 42, 0.85)';
    ctx.fillText('TYPE II · CrO₂ · SUMMER MEMORIES · 122 BPM', -142, -39);

    // Center recessed transparent tape window
    ctx.fillStyle = 'rgba(7, 11, 24, 0.90)';
    ctx.strokeStyle = 'rgba(215, 238, 255, 0.28)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-126, -18, 252, 78, 12);
    ctx.fill();
    ctx.stroke();

    // Fine window graduation ticks (0  50  100)
    ctx.strokeStyle = 'rgba(210, 232, 255, 0.32)';
    ctx.lineWidth = 1;
    for (let tx = -36; tx <= 36; tx += 9) {
      const tall = (tx % 18 === 0) ? 7 : 4;
      ctx.beginPath();
      ctx.moveTo(tx, -15); ctx.lineTo(tx, -15 + tall);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(210, 232, 255, 0.42)';
    ctx.font = '600 8px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0     50     100', 0, -1);

    // Rotating tape reels (left & right with wound spiral sheen + 6-tooth hubs)
    const spin = -t * 2.9;
    [-68, 68].forEach((rx, idx) => {
      const tapeR = idx === 0 ? 33 : 26;
      // Dark iron-oxide magnetic tape pack
      const tg = ctx.createRadialGradient(rx, 21, 14, rx, 21, tapeR);
      tg.addColorStop(0, '#2a1c2e');
      tg.addColorStop(0.65, '#3b263c');
      tg.addColorStop(1, '#1e1424');
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.arc(rx, 21, tapeR, 0, Math.PI * 2);
      ctx.fill();
      // Subtle concentric tape-winding sheen rings
      ctx.strokeStyle = 'rgba(255, 195, 224, 0.16)';
      ctx.lineWidth = 0.9;
      for (let rr = 19; rr <= tapeR; rr += 4.5) {
        ctx.beginPath();
        ctx.arc(rx, 21, rr, -0.9, 0.6);
        ctx.stroke();
      }

      // Precision molded white toothed hub
      ctx.save();
      ctx.translate(rx, 21);
      ctx.rotate(spin);
      ctx.fillStyle = '#eff6ff';
      ctx.beginPath();
      ctx.arc(0, 0, 15.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(130, 165, 210, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Inner spindle opening
      ctx.fillStyle = '#111830';
      ctx.beginPath();
      ctx.arc(0, 0, 9.2, 0, Math.PI * 2);
      ctx.fill();
      // 6 precision drive teeth
      ctx.fillStyle = '#ff84ba';
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        ctx.save();
        ctx.rotate(a);
        ctx.fillRect(6.5, -1.6, 3.8, 3.2);
        ctx.restore();
      }
      ctx.restore();
    });

    // Live neon audio waveform dancing smoothly between the two reels
    ctx.save();
    ctx.strokeStyle = '#7ee8ff';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#67d8f5';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let x = -34; x <= 34; x += 2) {
      const amp = (3.5 + pulse * 14 + (beat.mid || 0) * 7) * Math.cos((x / 34) * Math.PI * 0.5);
      const y = 21 + Math.sin(x * 0.35 + t * 16) * amp;
      if (x === -34) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // Frosted diagonal glass glint over tape window
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-126, -18, 252, 78, 12);
    ctx.clip();
    const winGlare = ctx.createLinearGradient(-110, -25, 45, 70);
    winGlare.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
    winGlare.addColorStop(0.45, 'rgba(255, 255, 255, 0.03)');
    winGlare.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = winGlare;
    ctx.beginPath();
    ctx.moveTo(-130, -20); ctx.lineTo(10, -20); ctx.lineTo(-45, 65); ctx.lineTo(-130, 65);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Bottom trapezoidal head bridge with capstan & guide pin holes + pressure pad
    ctx.fillStyle = 'rgba(30, 42, 78, 0.90)';
    ctx.strokeStyle = 'rgba(148, 228, 255, 0.48)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-118, ch / 2);
    ctx.lineTo(-96, 74);
    ctx.lineTo(96, 74);
    ctx.lineTo(118, ch / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Capstan alignment holes & center golden copper pressure spring
    [[-64, 98, 6.5], [64, 98, 6.5], [-34, 102, 4.5], [34, 102, 4.5]].forEach(([hx, hy, hr]) => {
      ctx.fillStyle = '#090d1c';
      ctx.strokeStyle = 'rgba(180, 222, 255, 0.36)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    ctx.fillStyle = 'rgba(255, 206, 132, 0.65)';
    ctx.fillRect(-10, 104, 20, 7);

    // Recessed metallic Phillips screws with crisp cross-slots (4 corners + bottom center)
    [[-170, -100], [170, -100], [-170, 100], [170, 100], [0, 84]].forEach(([sx, sy]) => {
      const sg = ctx.createRadialGradient(sx - 1.2, sy - 1.2, 0.5, sx, sy, 5.2);
      sg.addColorStop(0, '#eef7ff');
      sg.addColorStop(0.65, '#8ca8cc');
      sg.addColorStop(1, '#3b4f74');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sx, sy, 4.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 22, 40, 0.78)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(sx - 2.6, sy); ctx.lineTo(sx + 2.6, sy);
      ctx.moveTo(sx, sy - 2.6); ctx.lineTo(sx, sy + 2.6);
      ctx.stroke();
    });

    // Subtle overall diagonal acrylic sheen across whole cassette face
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 15);
    ctx.clip();
    const sheen = ctx.createLinearGradient(-cw * 0.4, -ch * 0.5, cw * 0.25, ch * 0.4);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.11)');
    sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0.02)');
    sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.moveTo(-cw / 2, -ch / 2);
    ctx.lineTo(40, -ch / 2);
    ctx.lineTo(-90, ch / 2);
    ctx.lineTo(-cw / 2, ch / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // Sculpted 4-Facet Origami Paper Airplane with crisp crease shadows & sunlit edge
  // =========================================================================
  function drawPaperPlane(ctx, x, y, scale = 1, rot = 0, glow = 0.6) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(scale, scale);

    if (glow > 0.01) {
      const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 48);
      g.addColorStop(0, `rgba(255, 246, 220, ${0.52 * glow})`);
      g.addColorStop(1, 'rgba(255, 246, 220, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();
    }

    // Far sunlit upper wing
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(36, 0);
    ctx.lineTo(-28, -16.5);
    ctx.lineTo(-17, -1.5);
    ctx.closePath();
    ctx.fill();

    // Inner valley crease shadow
    ctx.fillStyle = '#c5d7ee';
    ctx.beginPath();
    ctx.moveTo(36, 0);
    ctx.lineTo(-17, -1.5);
    ctx.lineTo(-14, 4.5);
    ctx.closePath();
    ctx.fill();

    // Deep keel fold under fuselage
    ctx.fillStyle = '#97b1d4';
    ctx.beginPath();
    ctx.moveTo(36, 0);
    ctx.lineTo(-14, 4.5);
    ctx.lineTo(-11, 13.5);
    ctx.closePath();
    ctx.fill();

    // Near warm-reflected lower wing
    ctx.fillStyle = '#ebf3fc';
    ctx.beginPath();
    ctx.moveTo(36, 0);
    ctx.lineTo(-14, 4.5);
    ctx.lineTo(-25, 16);
    ctx.closePath();
    ctx.fill();

    // Crisp leading fold highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(-28, -16.5); ctx.lineTo(36, 0); ctx.lineTo(-25, 16);
    ctx.stroke();

    ctx.restore();
  }

  // =========================================================================
  // Authentic Japanese Codd-Neck Ramune Glass Soda Bottle (Scene 3 Hero Prop)
  // Pinched neck with glowing glass marble, frosted Japanese label, condensation droplets!
  // =========================================================================
  function drawSodaBottle(ctx, cx, cy, scale = 1, t = 0, fillLevel = 0.7, beat = {}) {
    const pulse = beat.pulse || 0;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Dreamy outer glass aura
    const ag = ctx.createRadialGradient(0, 8, 22, 0, 8, 220);
    ag.addColorStop(0, `rgba(110, 224, 255, ${0.30 + pulse * 0.18})`);
    ag.addColorStop(0.58, `rgba(255, 146, 206, ${0.14 + pulse * 0.08})`);
    ag.addColorStop(1, 'rgba(110, 224, 255, 0)');
    ctx.fillStyle = ag;
    ctx.beginPath();
    ctx.arc(0, 8, 220, 0, Math.PI * 2);
    ctx.fill();

    // Authentic Ramune silhouette with iconic pinched marble-trap dimples near neck!
    const bottlePath = () => {
      ctx.beginPath();
      ctx.moveTo(-22, -168);
      ctx.lineTo(22, -168);
      // Upper neck descending into Codd pinch waist
      ctx.bezierCurveTo(23, -142, 26, -124, 17, -110); // right pinch dimple
      ctx.bezierCurveTo(27, -96, 58, -74, 60, -30);    // rounded bottle shoulder
      ctx.lineTo(60, 128);
      ctx.quadraticCurveTo(60, 156, 32, 156);
      ctx.lineTo(-32, 156);
      ctx.quadraticCurveTo(-60, 156, -60, 128);
      ctx.lineTo(-60, -30);
      ctx.bezierCurveTo(-58, -74, -27, -96, -17, -110); // left pinch dimple
      ctx.bezierCurveTo(-26, -124, -23, -142, -22, -168);
      ctx.closePath();
    };

    // Translucent cyan-tinted cold glass body
    bottlePath();
    const glassBg = ctx.createLinearGradient(-60, 0, 60, 0);
    glassBg.addColorStop(0, 'rgba(180, 236, 255, 0.24)');
    glassBg.addColorStop(0.35, 'rgba(145, 220, 255, 0.09)');
    glassBg.addColorStop(0.75, 'rgba(170, 230, 255, 0.12)');
    glassBg.addColorStop(1, 'rgba(210, 245, 255, 0.26)');
    ctx.fillStyle = glassBg;
    ctx.fill();

    // Glowing summer soda liquid & carbonation bubbles clipped inside bottle
    ctx.save();
    bottlePath();
    ctx.clip();

    // Thick glass punt base refraction
    const punt = ctx.createLinearGradient(0, 134, 0, 158);
    punt.addColorStop(0, 'rgba(195, 242, 255, 0.08)');
    punt.addColorStop(1, 'rgba(205, 246, 255, 0.42)');
    ctx.fillStyle = punt;
    ctx.fillRect(-62, 132, 124, 28);

    const liqTop = lerp(148, -46, clamp(fillLevel, 0, 1));
    const lg = ctx.createLinearGradient(0, liqTop, 0, 156);
    lg.addColorStop(0, 'rgba(148, 238, 255, 0.80)');
    lg.addColorStop(0.48, 'rgba(84, 174, 252, 0.68)');
    lg.addColorStop(1, 'rgba(178, 118, 245, 0.78)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.moveTo(-66, 162);
    ctx.lineTo(-66, liqTop);
    for (let x = -66; x <= 66; x += 8) {
      const wy = liqTop + Math.sin(x * 0.08 + t * 4.2) * (3.6 + pulse * 4.2);
      ctx.lineTo(x, wy);
    }
    ctx.lineTo(66, 162);
    ctx.closePath();
    ctx.fill();

    // Bright surface meniscus rim on liquid
    ctx.strokeStyle = 'rgba(235, 252, 255, 0.85)';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let x = -62; x <= 62; x += 8) {
      const wy = liqTop + Math.sin(x * 0.08 + t * 4.2) * (3.6 + pulse * 4.2);
      if (x === -62) ctx.moveTo(x, wy);
      else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // Fine carbonation micro-bubble streams rising inside soda!
    for (let i = 0; i < 34; i++) {
      const bx = (hash(i * 11.7) - 0.5) * 96;
      const bp = (t * (0.38 + hash(i * 5.3) * 0.58) + hash(i * 17.9)) % 1;
      const by = lerp(146, liqTop + 3, bp);
      if (by > liqTop + 1) {
        const br = 1.2 + hash(i * 3.1) * 3.4;
        const wx = bx + Math.sin(t * 4.2 + i) * 3.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + 0.52 * (1 - bp)})`;
        ctx.beginPath();
        ctx.arc(wx, by, br, 0, Math.PI * 2);
        ctx.fill();
        if (br > 2.6) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.55 * (1 - bp)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Translucent frosted Japanese Ramune paper label band positioned cleanly at upper-mid body!
    ctx.fillStyle = 'rgba(18, 34, 72, 0.44)';
    ctx.fillRect(-62, -24, 124, 62);
    ctx.fillStyle = 'rgba(235, 250, 255, 0.16)';
    ctx.fillRect(-62, -24, 124, 62);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
    ctx.fillRect(-62, -24, 124, 2.2);
    ctx.fillRect(-62, 35.8, 124, 2.2);
    // Wave motif & crisp typography on bottle label
    ctx.strokeStyle = 'rgba(130, 224, 255, 0.72)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-48, 26); ctx.quadraticCurveTo(-24, 18, 0, 26); ctx.quadraticCurveTo(24, 34, 48, 26);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.font = '700 17px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('夏 · ラムネ', 0, 1);
    ctx.font = '600 8.5px ui-monospace, Consolas, monospace';
    ctx.fillStyle = 'rgba(210, 244, 255, 0.88)';
    ctx.fillText('LAST SUMMER SODA', 0, 15);

    // Glowing translucent Glass Marble (ビー玉) resting in the Codd pinch!
    const marbleY = -123 + Math.sin(t * 2.8) * 1.4;
    const mg = ctx.createRadialGradient(-4, marbleY - 4, 2, 0, marbleY, 13.5);
    mg.addColorStop(0, '#ffffff');
    mg.addColorStop(0.32, '#8ef0ff');
    mg.addColorStop(0.76, '#4cb8f0');
    mg.addColorStop(1, 'rgba(255, 165, 220, 0.85)');
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.arc(0, marbleY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // Crisp marble specular glint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.beginPath();
    ctx.ellipse(-4.5, marbleY - 4.5, 3.6, 2.0, -0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Inner glass wall edge thickness + bright outer rim
    bottlePath();
    ctx.strokeStyle = 'rgba(220, 248, 255, 0.88)';
    ctx.lineWidth = 2.6;
    ctx.stroke();

    // Pinch glass indentation curved glint lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(-14, -110, 7, -0.7, 0.7);
    ctx.moveTo(18, -115);
    ctx.arc(14, -110, 7, Math.PI - 0.7, Math.PI + 0.7);
    ctx.stroke();

    // Molded translucent plastic/glass cap rim lip at top
    ctx.fillStyle = 'rgba(205, 244, 255, 0.42)';
    ctx.strokeStyle = 'rgba(230, 250, 255, 0.88)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-27, -176, 54, 13, 5);
    ctx.fill();
    ctx.stroke();

    // Double curved specular glass shine ribbons (left primary + right subtle rim)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.lineWidth = 4.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-45, -34);
    ctx.quadraticCurveTo(-48, 42, -45, 122);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(220, 248, 255, 0.45)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(47, -26);
    ctx.lineTo(47, 114);
    ctx.moveTo(-16, -158);
    ctx.lineTo(-16, -126);
    ctx.stroke();

    // Crisp cold water condensation droplets beaded on outer glass surface!
    for (let i = 0; i < 16; i++) {
      const dx = (hash(i * 23.7 + 1.2) - 0.5) * 92;
      const dy = -34 + hash(i * 31.3 + 4.1) * 168;
      const dr = 1.6 + hash(i * 7.9) * 2.6;
      // Subtle dark underside shadow
      ctx.fillStyle = 'rgba(18, 45, 86, 0.34)';
      ctx.beginPath();
      ctx.ellipse(dx + 0.6, dy + 1.1, dr * 0.9, dr * 1.15, 0, 0, Math.PI * 2);
      ctx.fill();
      // Translucent bead
      ctx.fillStyle = 'rgba(220, 248, 255, 0.55)';
      ctx.beginPath();
      ctx.ellipse(dx, dy, dr * 0.85, dr * 1.1, 0, 0, Math.PI * 2);
      ctx.fill();
      // Bright specular pinpoint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath();
      ctx.arc(dx - dr * 0.25, dy - dr * 0.35, dr * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // =========================================================================
  // Intricate Steel-Lattice Coastal Ferris Wheel (Scene 5 — Truss Rim & Windowed Gondolas!)
  // =========================================================================
  function drawFerrisWheel(ctx, cx, cy, R, t, beat = {}) {
    const pulse = beat.pulse || 0;
    const rot = t * 0.20;

    ctx.save();
    // Sturdy twin A-frame steel support towers with cross-bracing
    const footY = cy + R * 1.18;
    const footSpan = R * 0.48;
    ctx.strokeStyle = '#152044';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - footSpan, footY); ctx.lineTo(cx - 4, cy);
    ctx.moveTo(cx + footSpan, footY); ctx.lineTo(cx + 4, cy);
    ctx.stroke();

    // Horizontal & diagonal tower truss braces
    ctx.strokeStyle = 'rgba(95, 145, 210, 0.42)';
    ctx.lineWidth = 2;
    for (let k = 1; k <= 3; k++) {
      const f = k / 4;
      const by = lerp(cy, footY, f);
      const bx = footSpan * f;
      ctx.beginPath();
      ctx.moveTo(cx - bx, by); ctx.lineTo(cx + bx, by);
      ctx.stroke();
    }

    // Fine zigzag diagonal steel truss rim between R and R*0.84!
    const rInner = R * 0.84;
    const trussSegs = 32;
    ctx.strokeStyle = 'rgba(155, 224, 255, 0.46)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let i = 0; i < trussSegs; i++) {
      const a0 = rot + (i / trussSegs) * Math.PI * 2;
      const a1 = rot + ((i + 0.5) / trussSegs) * Math.PI * 2;
      const a2 = rot + ((i + 1) / trussSegs) * Math.PI * 2;
      ctx.moveTo(cx + Math.cos(a0) * R, cy + Math.sin(a0) * R);
      ctx.lineTo(cx + Math.cos(a1) * rInner, cy + Math.sin(a1) * rInner);
      ctx.lineTo(cx + Math.cos(a2) * R, cy + Math.sin(a2) * R);
    }
    ctx.stroke();

    // Glowing neon outer & inner rim rings pulsing gracefully with beat
    ctx.shadowColor = '#ff7eb6';
    ctx.shadowBlur = 16 + pulse * 18;
    ctx.strokeStyle = lerpColor('#6de0ff', '#ff92c4', 0.35 + pulse * 0.55);
    ctx.lineWidth = 3.8 + pulse * 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowColor = '#67d8f5';
    ctx.shadowBlur = 10 + pulse * 12;
    ctx.strokeStyle = 'rgba(135, 232, 255, 0.78)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 190, 224, 0.45)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    // 16 fine tension spokes & glass-windowed hanging gondolas
    const cabins = 16;
    for (let i = 0; i < cabins; i++) {
      const a = rot + (i / cabins) * Math.PI * 2;
      const gx = cx + Math.cos(a) * R;
      const gy = cy + Math.sin(a) * R;
      ctx.strokeStyle = 'rgba(185, 224, 255, 0.36)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(gx, gy);
      ctx.stroke();

      // Tiny glowing rim LED node at each spoke joint
      const isLit = ((i + Math.floor(beat.beatIdx || 0)) % 2 === 0);
      ctx.fillStyle = isLit ? '#fff2cc' : '#ff94c8';
      ctx.beginPath();
      ctx.arc(gx, gy, 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Detailed hanging gondola with pivot arm, rounded dome roof & lit glass windows!
      const sway = Math.sin(t * 2.4 + i) * 0.06;
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(sway);

      // Suspension rod
      ctx.strokeStyle = 'rgba(195, 225, 255, 0.72)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(0, 6);
      ctx.stroke();

      // Gondola cabin shell
      ctx.fillStyle = '#141d3c';
      ctx.strokeStyle = isLit ? 'rgba(255, 224, 150, 0.85)' : 'rgba(140, 230, 255, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-8.5, 5, 17, 15, [6, 6, 4, 4]);
      ctx.fill();
      ctx.stroke();

      // Warm illuminated glass panoramic window inside cabin
      ctx.shadowColor = isLit ? '#ffd88a' : '#ff84be';
      ctx.shadowBlur = 9 + pulse * 8;
      ctx.fillStyle = isLit ? '#ffe6a8' : '#ffa8d2';
      ctx.beginPath();
      ctx.roundRect(-6.5, 8.5, 13, 6.5, 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center window mullion bar
      ctx.fillStyle = '#162040';
      ctx.fillRect(-0.6, 8.5, 1.2, 6.5);
      ctx.restore();
    }

    // Illuminated hub star-ring & center jewel
    ctx.strokeStyle = rgba('#ffd896', 0.82);
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffd28a';
    ctx.shadowBlur = 20 + pulse * 14;
    ctx.beginPath();
    ctx.arc(cx, cy, 10.5 + pulse * 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // Detailed Enoden-Style Coastal Sea Train (Scene 2 & Scene 6)
  // Pantographs, roof AC units, bogie wheels, sliding doors, window glare & warm interior!
  // =========================================================================
  function drawSeaTrain(ctx, x, y, scale = 1, lit = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const cars = 4;
    const cw = 224, ch = 66, gap = 9;
    for (let i = 0; i < cars; i++) {
      const cx = i * (cw + gap);
      const isLead = (i === cars - 1);
      const isTail = (i === 0);

      // Undercarriage dark skirt & twin dual-wheel bogies
      ctx.fillStyle = '#101829';
      ctx.fillRect(cx + 12, -5, cw - 24, 6);
      [cx + 38, cx + cw - 38].forEach((bx) => {
        ctx.fillStyle = '#1a2338';
        ctx.beginPath();
        ctx.roundRect(bx - 22, -6, 44, 8, 2);
        ctx.fill();
        [-13, 13].forEach((wx) => {
          ctx.fillStyle = '#0c111f';
          ctx.strokeStyle = '#536888';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(bx + wx, 0, 5.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
      });

      // Roof AC compressor boxes & diamond pantograph on alternate cars!
      ctx.fillStyle = lit ? '#1a2442' : '#7b92a8';
      ctx.beginPath();
      ctx.roundRect(cx + 58, -ch - 8, 44, 7, 2);
      ctx.roundRect(cx + 126, -ch - 8, 44, 7, 2);
      ctx.fill();

      if (i === 1 || i === 3) {
        // Classic Japanese diamond pantograph touching overhead catenary wire!
        const px = cx + 32;
        const py = -ch - 4;
        ctx.strokeStyle = lit ? 'rgba(130, 170, 215, 0.72)' : 'rgba(34, 52, 82, 0.85)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(px - 10, py); ctx.lineTo(px - 18, py - 15); ctx.lineTo(px, py - 30);
        ctx.lineTo(px + 18, py - 15); ctx.lineTo(px + 10, py);
        ctx.moveTo(px - 16, py - 30); ctx.lineTo(px + 16, py - 30); // contact collector shoe
        ctx.stroke();
      }

      // Main classic coastal cream & sea-teal car body with subtle vertical bevel gradient
      const bodyGrad = ctx.createLinearGradient(cx, -ch, cx, -4);
      if (lit) {
        bodyGrad.addColorStop(0, '#263861');
        bodyGrad.addColorStop(0.55, '#1b294a');
        bodyGrad.addColorStop(1, '#121b36');
      } else {
        bodyGrad.addColorStop(0, '#f7fbfd');
        bodyGrad.addColorStop(0.55, '#e6f0f5');
        bodyGrad.addColorStop(1, '#c8dae6');
      }
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(cx, -ch, cw, ch - 3, [isTail ? 11 : 5, isLead ? 12 : 5, 3, 3]);
      ctx.fill();

      // Classic lower coastal-emerald livery band + crisp gold pinstripe
      ctx.fillStyle = lit ? '#285e7a' : '#2e8e82';
      ctx.fillRect(cx + 1, -26, cw - 2, 17);
      ctx.fillStyle = lit ? 'rgba(255, 208, 128, 0.55)' : '#f2c864';
      ctx.fillRect(cx + 1, -28.5, cw - 2, 2.5);

      // Rounded roof cap with subtle top sunlit rim
      ctx.fillStyle = lit ? '#131c36' : '#5b7288';
      ctx.beginPath();
      ctx.roundRect(cx + 3, -ch - 3.5, cw - 6, 6.5, 3);
      ctx.fill();
      ctx.fillStyle = lit ? 'rgba(155, 205, 255, 0.25)' : 'rgba(255, 255, 255, 0.65)';
      ctx.fillRect(cx + 6, -ch - 3, cw - 12, 1.4);

      // Sliding double doors (subtle vertical recessed panel + narrow door panes)
      [cx + 48, cx + cw - 72].forEach((dx) => {
        ctx.strokeStyle = lit ? 'rgba(12, 18, 36, 0.55)' : 'rgba(60, 88, 112, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(dx, -ch + 8, 24, ch - 14);
        ctx.beginPath();
        ctx.moveTo(dx + 12, -ch + 8); ctx.lineTo(dx + 12, -6);
        ctx.stroke();
      });

      // Panoramic passenger windows with frames, warm interior glow, hanging straps & diagonal sky glare!
      const winPositions = [12, 52, 82, 116, 154, 184];
      winPositions.forEach((wxOff, wIdx) => {
        const isDoorWin = (wIdx === 1 || wIdx === 4);
        const ww = isDoorWin ? 17 : 26;
        const wx = cx + wxOff;
        const wy = -ch + 11;
        const wh = 22;

        // Dark aluminum window frame
        ctx.fillStyle = '#18243a';
        ctx.beginPath();
        ctx.roundRect(wx - 1.5, wy - 1.5, ww + 3, wh + 3, 3.5);
        ctx.fill();

        // Glass interior
        if (lit) {
          ctx.shadowColor = '#ffca6b';
          ctx.shadowBlur = 14;
          const wg = ctx.createLinearGradient(wx, wy, wx, wy + wh);
          wg.addColorStop(0, '#fff2c4');
          wg.addColorStop(1, '#ffc972');
          ctx.fillStyle = wg;
        } else {
          const wg = ctx.createLinearGradient(wx, wy, wx, wy + wh);
          wg.addColorStop(0, '#4c8fc4');
          wg.addColorStop(0.55, '#8ad0f5');
          wg.addColorStop(1, '#d8f2ff');
          ctx.fillStyle = wg;
        }
        ctx.beginPath();
        ctx.roundRect(wx, wy, ww, wh, 2.5);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Subtle hanging commuter hand-strap silhouettes inside window
        ctx.fillStyle = lit ? 'rgba(62, 42, 24, 0.38)' : 'rgba(18, 42, 74, 0.25)';
        ctx.fillRect(wx + 5, wy + 1, 1.2, 6);
        ctx.fillRect(wx + ww - 7, wy + 1, 1.2, 6);

        // Crisp diagonal sky reflection streak across window glass
        ctx.fillStyle = lit ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.46)';
        ctx.beginPath();
        ctx.moveTo(wx + 3, wy); ctx.lineTo(wx + 9, wy); ctx.lineTo(wx + 3, wy + wh); ctx.lineTo(wx, wy + wh);
        ctx.closePath();
        ctx.fill();
      });

      // Lead car headlight beam + destination board / Tail car ruby marker light
      if (isLead) {
        ctx.fillStyle = '#fff5cc';
        ctx.shadowColor = '#ffdf88';
        ctx.shadowBlur = lit ? 18 : 8;
        ctx.beginPath();
        ctx.arc(cx + cw - 3, -18, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (lit) {
          const beam = ctx.createLinearGradient(cx + cw, -18, cx + cw + 145, -6);
          beam.addColorStop(0, 'rgba(255, 242, 190, 0.52)');
          beam.addColorStop(1, 'rgba(255, 242, 190, 0)');
          ctx.fillStyle = beam;
          ctx.beginPath();
          ctx.moveTo(cx + cw, -21); ctx.lineTo(cx + cw + 145, -42); ctx.lineTo(cx + cw + 145, 10); ctx.lineTo(cx + cw, -15);
          ctx.closePath();
          ctx.fill();
        }
      }
      if (isTail) {
        ctx.fillStyle = '#ff5470';
        ctx.shadowColor = '#ff385c';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(cx + 3, -18, 3.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Flexible accordion car coupler
      if (i < cars - 1) {
        ctx.fillStyle = '#151d30';
        ctx.fillRect(cx + cw, -ch + 8, gap, ch - 16);
        ctx.strokeStyle = 'rgba(130, 160, 195, 0.22)';
        ctx.lineWidth = 1;
        for (let r = -ch + 12; r < -10; r += 6) {
          ctx.beginPath(); ctx.moveTo(cx + cw + 1, r); ctx.lineTo(cx + cw + gap - 1, r); ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  // =========================================================================
  // Botanically Detailed Luminous Moonlit Orchid (Scene 7 "今年兰花又开")
  // Distinct outer sepals + broad veined inner petals + ruffled spotted labellum lip!
  // =========================================================================
  function drawOrchidFlower(ctx, cx, cy, scale = 1, bloom = 1, t = 0, beat = {}) {
    const pulse = beat.pulse || 0;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale * (1 + pulse * 0.03), scale * (1 + pulse * 0.03));

    // Soft pearlescent moonlight aura behind blossom
    const g = ctx.createRadialGradient(0, 0, 8, 0, 0, 128);
    g.addColorStop(0, `rgba(224, 246, 255, ${0.42 * bloom + pulse * 0.14})`);
    g.addColorStop(0.52, `rgba(255, 178, 224, ${0.22 * bloom})`);
    g.addColorStop(1, 'rgba(180, 220, 255, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 128, 0, Math.PI * 2);
    ctx.fill();

    // Helper for translucent botanically veined orchid petal/sepal
    const drawPetal = (ang, len, wid, idx, isInner) => {
      const open = easeOutBack(clamp((bloom - idx * 0.06) / 0.62, 0, 1));
      if (open <= 0.01) return;
      ctx.save();
      ctx.rotate(ang + Math.sin(t * 1.9 + idx * 1.1) * 0.025);
      ctx.scale(open, open);

      const pg = ctx.createLinearGradient(0, 0, len, 0);
      if (isInner) {
        pg.addColorStop(0, '#ffcae6');
        pg.addColorStop(0.32, '#fff9fc');
        pg.addColorStop(0.82, '#edf8ff');
        pg.addColorStop(1, '#cdeeff');
      } else {
        pg.addColorStop(0, '#f0c4e2');
        pg.addColorStop(0.42, '#f8f2fa');
        pg.addColorStop(1, '#bfe6ff');
      }
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      if (isInner) {
        // Broad sculptural butterfly-wing inner petal
        ctx.bezierCurveTo(len * 0.24, -wid * 1.15, len * 0.74, -wid * 0.98, len, 0);
        ctx.bezierCurveTo(len * 0.74, wid * 0.98, len * 0.24, wid * 1.15, 0, 0);
      } else {
        // Slender pointed outer sepal
        ctx.bezierCurveTo(len * 0.28, -wid, len * 0.72, -wid * 0.68, len, 0);
        ctx.bezierCurveTo(len * 0.72, wid * 0.68, len * 0.28, wid, 0, 0);
      }
      ctx.closePath();
      ctx.fill();

      // Delicate translucent petal midrib & radiating veins
      ctx.strokeStyle = 'rgba(255, 160, 208, 0.34)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(6, 0); ctx.lineTo(len * 0.86, 0);
      ctx.moveTo(12, 0); ctx.quadraticCurveTo(len * 0.45, -wid * 0.42, len * 0.78, -wid * 0.22);
      ctx.moveTo(12, 0); ctx.quadraticCurveTo(len * 0.45, wid * 0.42, len * 0.78, wid * 0.22);
      ctx.stroke();

      // Luminous rim outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.76)';
      ctx.lineWidth = 1.15;
      ctx.stroke();
      ctx.restore();
    };

    // Back layer: 3 slender pointed outer sepals (top, lower-left, lower-right)
    drawPetal(-Math.PI / 2, 74, 20, 0, false);
    drawPetal(0.84, 70, 19, 1, false);
    drawPetal(Math.PI - 0.84, 70, 19, 2, false);

    // Front layer: 2 wide translucent butterfly-wing lateral petals
    drawPetal(-0.18, 76, 30, 3, true);
    drawPetal(Math.PI + 0.18, 76, 30, 4, true);

    // Sculpted 3-lobed ruffled Orchid Labellum (lip) + golden-spotted throat + pollen column!
    if (bloom > 0.25) {
      const cOpen = smoothstep(invLerp(0.25, 0.85, bloom));
      ctx.save();
      ctx.scale(cOpen, cOpen);

      // Lateral upright lip wings
      const lipG = ctx.createRadialGradient(0, 6, 2, 0, 10, 24);
      lipG.addColorStop(0, '#ffe48a');
      lipG.addColorStop(0.55, '#ff88b8');
      lipG.addColorStop(1, '#d95492');
      ctx.fillStyle = lipG;
      ctx.shadowColor = 'rgba(255, 146, 198, 0.65)';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, -4);
      ctx.bezierCurveTo(-18, -10, -22, 8, -10, 16);
      ctx.quadraticCurveTo(0, 28, 10, 16);
      ctx.bezierCurveTo(22, 8, 18, -10, 0, -4);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Delicate crimson-rose throat speckles
      ctx.fillStyle = 'rgba(145, 28, 78, 0.65)';
      [[-5, 6], [5, 6], [-3, 11], [3, 11], [0, 14], [-7, 2], [7, 2]].forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx, sy, 1.35, 0, Math.PI * 2);
        ctx.fill();
      });

      // Glowing golden central column jewel
      ctx.fillStyle = '#fff3b8';
      ctx.shadowColor = '#ffd468';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.ellipse(0, -2, 6.2, 7.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // =========================================================================
  // Cinematic Multi-Tier Japanese Summer Hanabi Firework (Scene 5)
  // Curved gravity-drooping chrysanthemum/willow trails + contrasting inner pistil
  // + golden kamuro twinkling crackle embers!
  // =========================================================================
  function drawCinemaFirework(ctx, cx, cy, progress, colors, maxR = 220, big = false) {
    if (progress <= 0 || progress >= 1) return;
    const p = easeOutCubic(progress);
    const fade = progress < 0.52 ? 1 : 1 - smoothstep(invLerp(0.52, 1, progress));
    const seedBase = cx * 0.13 + cy * 0.29;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. Expansive atmospheric night-sky bloom + crisp ignition flash (no dull grey center disk!)
    const glowEnv = Math.sin(clamp(progress * 1.45, 0, 1) * Math.PI);
    const glowR = maxR * (big ? 1.18 : 0.96) * (0.42 + 0.58 * glowEnv);
    if (glowR > 4) {
      const fg = ctx.createRadialGradient(cx, cy, 1, cx, cy, glowR);
      const hotCore = clamp(1 - progress * 4.2, 0, 1);
      fg.addColorStop(0, `rgba(255, 252, 240, ${0.85 * hotCore + 0.14 * fade})`);
      fg.addColorStop(0.24, rgba(colors[0], 0.30 * fade));
      fg.addColorStop(0.62, rgba(colors[1] || colors[0], 0.11 * fade));
      fg.addColorStop(1, rgba(colors[0], 0));
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Outer Chrysanthemum / Willow Shell (gracefully curved parabolic gravity arcs!)
    const outerRays = big ? 64 : 44;
    ctx.lineCap = 'round';
    for (let i = 0; i < outerRays; i++) {
      const s = seedBase + i * 7.31;
      const ang = (i / outerRays) * Math.PI * 2 + (hash(s) - 0.5) * 0.12;
      // 3D spherical projection depth
      const depthK = 0.50 + Math.pow(hash(s + 3.7), 0.52) * 0.56;
      const rOut = maxR * depthK * p;
      const rIn = rOut * lerp(0.18, 0.64, progress);
      const grav = progress * progress * (big ? 92 : 58) * (0.72 + 0.38 * depthK);

      const x1 = cx + Math.cos(ang) * rIn;
      const y1 = cy + Math.sin(ang) * rIn + grav * 0.22;
      const x2 = cx + Math.cos(ang) * rOut;
      const y2 = cy + Math.sin(ang) * rOut + grav;
      // Pronounced natural willow droop curve
      const mx = lerp(x1, x2, 0.54);
      const my = lerp(y1, y2, 0.54) - grav * 0.30;

      const col = colors[i % colors.length];
      const trailGrad = ctx.createLinearGradient(x1, y1, x2, y2);
      trailGrad.addColorStop(0, rgba(col, 0));
      trailGrad.addColorStop(0.38, rgba(col, fade * 0.44));
      trailGrad.addColorStop(0.84, rgba(col, fade * 0.94));
      trailGrad.addColorStop(1, `rgba(255, 252, 240, ${fade})`);

      ctx.strokeStyle = trailGrad;
      ctx.lineWidth = (big ? 2.2 : 1.75) * (1 - progress * 0.45) * (0.72 + 0.38 * depthK);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(mx, my, x2, y2);
      ctx.stroke();

      // Luminous glowing pearl head at spark tip (soft halo + bright core!)
      const tw = 0.52 + 0.48 * Math.sin(progress * 48 + i * 2.7);
      const tipR = (big ? 2.4 : 1.9) * (1 - progress * 0.35) * (0.78 + 0.36 * tw);
      ctx.fillStyle = rgba(col, fade * 0.42 * tw);
      ctx.beginPath();
      ctx.arc(x2, y2, tipR * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 254, 246, ${fade * tw})`;
      ctx.beginPath();
      ctx.arc(x2, y2, tipR, 0, Math.PI * 2);
      ctx.fill();

      // 3. Kamuro golden glitter & strobing crackle micro-sparks showering gently from willow tips!
      if (progress > 0.28 && (i % 2 === 0)) {
        const kp = invLerp(0.28, 1.0, progress);
        const kFade = Math.sin(kp * Math.PI) * fade;
        for (let m = 0; m < (big ? 4 : 2); m++) {
          const ms = s + m * 19.7;
          const strobe = Math.sin(progress * 66 + ms * 7) > -0.2 ? 1 : 0.15;
          const sx = x2 + (hash(ms) - 0.5) * (20 + kp * 32);
          const sy = y2 + (hash(ms + 2.1) - 0.25) * 16 + kp * (22 + hash(ms + 5.3) * 30);
          ctx.fillStyle = m % 2 === 0
            ? `rgba(255, 234, 170, ${kFade * strobe * 0.95})`
            : rgba(colors[(i + 1) % colors.length], kFade * strobe * 0.85);
          ctx.beginPath();
          ctx.arc(sx, sy, (big ? 1.65 : 1.3) * (1 - kp * 0.38), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 4. Contrasting Inner Pistil Ring (芯 — luminous pearl ring with clean hollow center!)
    const innerRays = big ? 30 : 20;
    const pistilCol = colors[1] || '#ffe294';
    const pIn = easeOutCubic(clamp(progress * 1.15, 0, 1));
    const fadeIn = progress < 0.45 ? 1 : 1 - smoothstep(invLerp(0.45, 0.88, progress));
    if (fadeIn > 0.02) {
      for (let i = 0; i < innerRays; i++) {
        const s = seedBase + 500 + i * 11.1;
        const ang = (i / innerRays) * Math.PI * 2 + 0.14;
        const rOut = maxR * 0.45 * (0.82 + hash(s) * 0.25) * pIn;
        const rIn = rOut * lerp(0.32, 0.78, progress);
        const grav = progress * progress * (big ? 42 : 26);

        const x1 = cx + Math.cos(ang) * rIn;
        const y1 = cy + Math.sin(ang) * rIn + grav * 0.28;
        const x2 = cx + Math.cos(ang) * rOut;
        const y2 = cy + Math.sin(ang) * rOut + grav;

        const ig = ctx.createLinearGradient(x1, y1, x2, y2);
        ig.addColorStop(0, rgba(pistilCol, 0));
        ig.addColorStop(1, rgba(pistilCol, fadeIn * 0.88));
        ctx.strokeStyle = ig;
        ctx.lineWidth = (big ? 1.7 : 1.35) * (1 - progress * 0.4);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = `rgba(255, 253, 240, ${fadeIn})`;
        ctx.beginPath();
        ctx.arc(x2, y2, big ? 1.75 : 1.35, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // Subtle integrated DJ audio spectrum wave along horizon / bottom cinema edge
  function drawAudioWaveAccent(ctx, t, beat, y, color = '#7be6ff', alpha = 0.45) {
    if (alpha <= 0.01) return;
    ctx.save();
    const bars = 48;
    const totalW = 540;
    const x0 = (W - totalW) * 0.5;
    const step = totalW / bars;
    for (let i = 0; i < bars; i++) {
      const centerWeight = Math.sin((i / (bars - 1)) * Math.PI);
      const wave = 0.3 + 0.7 * Math.abs(Math.sin(t * 7.2 + i * 0.55));
      const h = (2.5 + (beat.low * 12 + beat.mid * 9 + beat.pulse * 14) * wave) * centerWeight;
      ctx.fillStyle = rgba(color, alpha * (0.4 + 0.6 * centerWeight));
      ctx.beginPath();
      ctx.roundRect(x0 + i * step, y - h, step * 0.52, h, 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // CinemaScope letterbox bars + 35mm film grain + subtle corner film timestamp
  function drawCinemaFinish(ctx, t, beat, opts = {}) {
    const { vignette = 0.28, recTag = '', flashAlpha = 0 } = opts;

    ctx.save();
    const pat = ctx.createPattern(getGrain(), 'repeat');
    if (pat) {
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, W, H);
    }

    // Soft cinema vignette
    const vg = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.28, W * 0.5, H * 0.5, W * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, `rgba(5,8,20,${vignette})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // Soft scene-cut light flash
    if (flashAlpha > 0.005) {
      ctx.fillStyle = `rgba(255, 244, 230, ${clamp(flashAlpha, 0, 0.55)})`;
      ctx.fillRect(0, 0, W, H);
    }

    // Sleek CinemaScope top & bottom letterbox bars (46px each)
    const barH = 46;
    ctx.fillStyle = '#070912';
    ctx.fillRect(0, 0, W, barH);
    ctx.fillRect(0, H - barH, W, barH);

    // Subtle thin golden hairline along cinema frame borders
    ctx.fillStyle = `rgba(255, 224, 190, ${0.14 + (beat.pulse || 0) * 0.10})`;
    ctx.fillRect(0, barH, W, 1);
    ctx.fillRect(0, H - barH - 1, W, 1);

    // Delicate retro film HUD in top-left & top-right black bar
    ctx.font = '600 13px ui-monospace, Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const dotOn = Math.floor(t * 2) % 2 === 0;
    ctx.fillStyle = dotOn ? '#ff6f9c' : 'rgba(255, 111, 156, 0.35)';
    ctx.beginPath();
    ctx.arc(28, barH * 0.5, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(225, 236, 255, 0.72)';
    ctx.fillText(recTag || 'REC  LAST SUMMER  ·  35MM', 42, barH * 0.5 + 0.5);

    ctx.textAlign = 'right';
    const mm = Math.floor(t / 60).toString().padStart(2, '0');
    const ss = Math.floor(t % 60).toString().padStart(2, '0');
    const ff = Math.floor((t % 1) * 30).toString().padStart(2, '0');
    ctx.fillText(`TC ${mm}:${ss}:${ff}  ·  122 BPM`, W - 26, barH * 0.5 + 0.5);

    ctx.restore();
  }

  // Refined cinema subtitle centered above bottom letterbox with subtle warm glow
  function drawCinemaSubtitle(ctx, text, alpha = 1, beatPulse = 0) {
    if (!text || alpha <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    const cx = W * 0.5;
    const cy = H - 84;

    ctx.font = '600 33px "PingFang SC", "Microsoft YaHei", "Source Han Sans CN", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tw = ctx.measureText(text).width;
    const scrim = ctx.createRadialGradient(cx, cy, 10, cx, cy, tw * 0.65 + 60);
    scrim.addColorStop(0, 'rgba(6, 10, 24, 0.58)');
    scrim.addColorStop(1, 'rgba(6, 10, 24, 0)');
    ctx.fillStyle = scrim;
    ctx.fillRect(cx - tw * 0.7 - 70, cy - 34, tw * 1.4 + 140, 68);

    ctx.shadowColor = `rgba(255, 200, 175, ${0.35 + beatPulse * 0.35})`;
    ctx.shadowBlur = 12 + beatPulse * 6;
    ctx.fillStyle = 'rgba(8, 10, 20, 0.75)';
    ctx.fillText(text, cx, cy + 2);
    ctx.fillStyle = '#fbf8f4';
    ctx.fillText(text, cx, cy);

    const lineW = Math.min(260, tw * 0.36) * (0.95 + beatPulse * 0.12);
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(255, 212, 162, ${0.55 + beatPulse * 0.30})`;
    ctx.fillRect(cx - lineW * 0.5, cy + 22, lineW, 1.5);
    ctx.restore();
  }

  Object.assign(S, {
    W, H,
    clamp, lerp, invLerp, smoothstep, easeOutCubic, easeInCubic, easeInOutQuad, easeOutBack,
    hash, lerpColor, rgba,
    drawSkyGradient, drawStarfield, drawCumulusCloud, drawOcean,
    drawAnimeBoy, drawAnimeGirl, drawRetroCassette, drawPaperPlane,
    drawSodaBottle, drawFerrisWheel, drawSeaTrain, drawOrchidFlower,
    drawCinemaFirework, drawAudioWaveAccent, drawCinemaFinish, drawCinemaSubtitle
  });
})(window.SUMMER);
