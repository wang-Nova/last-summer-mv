// Master Timeline Director, Dual-Mode Player, 122 BPM Beat LED & Recorder for 《去年夏天》
(function (S) {
  const DURATION = 79.00;

  const SCENES = [
    { id: 1,  start: 0.00,  end: 9.10,  name: '01 午夜雨窗磁带', lyric: '疼不疼痛不痛 / 幻想中我的梦' },
    { id: 2,  start: 9.10,  end: 18.25, name: '02 盛夏跨海电车', lyric: '在过去每个时候 / 别怕你就算我是你的' },
    { id: 3,  start: 18.25, end: 24.30, name: '03 星尘汽水瓶',   lyric: '意念中想不通 / 却总是被一次掏空' },
    { id: 4,  start: 24.30, end: 31.15, name: '04 黄金海堤约定', lyric: '在去年夏天跟你 / 答应了不放手' },
    { id: 5,  start: 31.15, end: 38.45, name: '05 海岸摩天轮烟花', lyric: '还有什么等待 / 这故事中的人不太精彩' },
    { id: 6,  start: 38.45, end: 46.20, name: '06 四季空站台',   lyric: '夏去了又回来 / 而人却已不在' },
    { id: 7,  start: 46.20, end: 56.25, name: '07 兰花雨与夜骑', lyric: '今年兰花又开 / 我想要一个人活得精彩' },
    { id: 8,  start: 56.25, end: 64.15, name: '08 双时空纸页风暴', lyric: '我拿了总会还 / 是不同步的未来' },
    { id: 9,  start: 64.15, end: 71.25, name: '09 破晓镜面细雨', lyric: '把虚伪的尘埃 / 把每次心痛都当成活该' },
    { id: 10, start: 71.25, end: 79.00, name: '10 朝阳放飞释怀', lyric: '把心慢慢的释怀 / 我给你的爱' }
  ];

  // Exact vocal-verified lyrics aligned to 0.1s against 《去年夏天》DJ
  const LYRICS = [
    { start: 0.30,  end: 2.35,  text: '疼不疼 痛不痛' },
    { start: 2.35,  end: 4.80,  text: '这样一直被动' },
    { start: 5.10,  end: 7.15,  text: '幻想中 我的梦' },
    { start: 7.15,  end: 9.10,  text: '总会过分要命的囧' },
    { start: 9.10,  end: 11.15, text: '在过去 每个时候' },
    { start: 11.15, end: 14.10, text: '我都会想象的念头' },
    { start: 14.10, end: 16.10, text: '别怕 你就算我是你的' },
    { start: 16.10, end: 18.25, text: '小小狗 也总会被打痛' },
    { start: 18.25, end: 21.15, text: '意念中 想不通' },
    { start: 21.15, end: 24.30, text: '却总是被一次掏空' },
    { start: 24.30, end: 26.20, text: '在去年夏天 跟你' },
    { start: 26.20, end: 28.05, text: '一个小小要求' },
    { start: 28.05, end: 29.25, text: '答应了不放手' },
    { start: 29.25, end: 31.15, text: '而如今也再不回头' },
    { start: 31.15, end: 33.15, text: '还有什么等待' },
    { start: 33.15, end: 35.10, text: '还有什么悲哀' },
    { start: 35.10, end: 38.45, text: '这故事中的人 不太精彩' },
    { start: 38.45, end: 40.30, text: '夏去了又回来' },
    { start: 40.30, end: 42.30, text: '而人却已不在' },
    { start: 42.30, end: 46.20, text: '它重复着我汹涌的忍耐' },
    { start: 46.20, end: 48.20, text: '今年兰花又开' },
    { start: 48.20, end: 50.10, text: '开了它也会败' },
    { start: 50.10, end: 52.20, text: '我想要一个人 活得精彩' },
    { start: 52.20, end: 54.15, text: '有些人总会来' },
    { start: 54.15, end: 56.25, text: '有些人在我心中在徘徊' },
    { start: 56.25, end: 58.25, text: '我拿了总会还' },
    { start: 58.25, end: 60.20, text: '你拿了就逃开' },
    { start: 60.20, end: 62.25, text: '在失去中我 慢慢的变呆' },
    { start: 62.25, end: 64.15, text: '是不同步的未来' },
    { start: 64.15, end: 66.20, text: '却把书包中的日记更改' },
    { start: 66.20, end: 67.40, text: '把虚伪的尘埃' },
    { start: 67.40, end: 69.20, text: '也全部都掩盖' },
    { start: 69.20, end: 71.25, text: '把每次心痛 都当成活该' },
    { start: 71.25, end: 74.20, text: '把心慢慢的释怀' },
    { start: 74.20, end: 77.15, text: '我相信总有一天 你会明白' },
    { start: 77.15, end: 78.75, text: '我给你的爱' }
  ];

  const outCanvas = document.getElementById('mvCanvas');
  const outCtx = outCanvas.getContext('2d');
  const sound = new S.SoundEngine();

  const state = {
    mode: 'canvas',
    beatMode: 'soft',   // 'soft' (default) | 'strong' | 'off'
    t: 27.60,           // Hero preview frame: Golden Hour Seawall Pinky Promise!
    playing: false,
    speed: 1.0,
    loop: true,
    interactive: false,
    bursts: [],
    recording: false
  };

  // UI refs
  const mvVideo = document.getElementById('mvVideo');
  const modeVideoBtn = document.getElementById('modeVideoBtn');
  const beatSyncBtn = document.getElementById('beatSyncBtn');
  const beatLed = document.getElementById('beatLed');
  const videoStatusBanner = document.getElementById('videoStatusBanner');
  const videoStatusText = document.getElementById('videoStatusText');
  const videoFallbackCanvasBtn = document.getElementById('videoFallbackCanvasBtn');
  const videoRetryBlobBtn = document.getElementById('videoRetryBlobBtn');
  const startOverlay = document.getElementById('startOverlay');
  const bigPlayBtn = document.getElementById('bigPlayBtn');
  const bigVideoBtn = document.getElementById('bigVideoBtn');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const timeDisplay = document.getElementById('timeDisplay');
  const timelineSlider = document.getElementById('timelineSlider');
  const sceneTicks = document.getElementById('sceneTicks');
  const scenePills = document.getElementById('scenePills');
  const muteBtn = document.getElementById('muteBtn');
  const speedSelect = document.getElementById('speedSelect');
  const loopCheck = document.getElementById('loopCheck');
  const interactiveBtn = document.getElementById('interactiveBtn');
  const interactiveHint = document.getElementById('interactiveHint');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const recordBtn = document.getElementById('recordBtn');
  const canvasFrame = document.getElementById('canvasFrame');
  const audioFileInput = document.getElementById('audioFileInput');
  const customAudioBar = document.getElementById('customAudioBar');
  const audioFileName = document.getElementById('audioFileName');
  const audioOffset = document.getElementById('audioOffset');
  const clearAudioBtn = document.getElementById('clearAudioBtn');

  let videoBlobUrl = null;
  let videoBlobTried = false;
  let videoWatchdog = null;

  function showVideoBanner(msg) {
    if (!videoStatusBanner || !videoStatusText) return;
    videoStatusText.textContent = msg;
    videoStatusBanner.classList.remove('hidden');
  }

  function hideVideoBanner() {
    if (videoStatusBanner) videoStatusBanner.classList.add('hidden');
  }

  async function tryBlobVideoFallback(autoplay = true, targetSec = 0) {
    if (videoBlobTried) return false;
    videoBlobTried = true;
    showVideoBanner('正在加载兼容视频流（WebM VP9+Opus / MP4）...');
    const candidates = [];
    if (mvVideo.canPlayType('video/webm')) candidates.push({ url: 'last-summer-mv.webm', mime: 'video/webm' });
    if (mvVideo.canPlayType('video/mp4')) candidates.push({ url: 'last-summer-mv.mp4', mime: 'video/mp4' });
    if (!candidates.length) {
      candidates.push({ url: 'last-summer-mv.webm', mime: 'video/webm' });
      candidates.push({ url: 'last-summer-mv.mp4', mime: 'video/mp4' });
    }
    for (const cand of candidates) {
      try {
        const resp = await fetch(cand.url);
        if (!resp.ok) continue;
        const buf = await resp.arrayBuffer();
        if (!buf || buf.byteLength < 10000) continue;
        const blob = new Blob([buf], { type: cand.mime });
        if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
        videoBlobUrl = URL.createObjectURL(blob);
        mvVideo.removeAttribute('src');
        Array.from(mvVideo.querySelectorAll('source')).forEach((s) => s.remove());
        mvVideo.src = videoBlobUrl;
        mvVideo.load();
        const ok = await new Promise((resolve) => {
          let done = false;
          const fin = (v) => { if (!done) { done = true; resolve(v); } };
          mvVideo.addEventListener('canplay', () => fin(true), { once: true });
          mvVideo.addEventListener('error', () => fin(false), { once: true });
          setTimeout(() => fin(mvVideo.readyState >= 1), 3500);
        });
        if (ok) {
          hideVideoBanner();
          try { mvVideo.currentTime = targetSec; } catch (_) {}
          if (autoplay && state.mode === 'video') mvVideo.play().catch(() => {});
          return true;
        }
      } catch (_) {}
    }
    if (state.mode === 'video') {
      showVideoBanner('当前内嵌预览容器无法解码本地视频流。请直接点击下方按钮用「实时代码播放」（内置零限制配乐与 122 BPM 真实卡点），或在浏览器打开 http://127.0.0.1:8767/ 观看。');
    }
    return false;
  }

  function setMode(nextMode, opts = {}) {
    const { autoplay = false, startFromZero = false } = opts;
    if (videoWatchdog) { clearTimeout(videoWatchdog); videoWatchdog = null; }
    if (nextMode === 'video') {
      const wasOverlay = !startOverlay.classList.contains('hidden');
      pausePlayback();
      state.mode = 'video';
      startOverlay.classList.add('hidden');
      interactiveHint.classList.add('hidden');
      hideVideoBanner();
      outCanvas.classList.add('hidden');
      mvVideo.classList.remove('hidden');
      mvVideo.loop = state.loop;
      mvVideo.playbackRate = state.speed;
      mvVideo.muted = sound.muted;
      const targetSec = (startFromZero || wasOverlay) ? 0 : S.clamp(state.t, 0, DURATION);
      const applyTime = () => {
        hideVideoBanner();
        try { mvVideo.currentTime = targetSec; } catch (_) {}
      };
      if (mvVideo.readyState >= 1) applyTime();
      else {
        mvVideo.addEventListener('loadedmetadata', applyTime, { once: true });
        try { mvVideo.load(); } catch (_) {}
        videoWatchdog = setTimeout(() => {
          if (state.mode === 'video' && mvVideo.readyState === 0) tryBlobVideoFallback(autoplay, targetSec);
        }, 1600);
      }
      modeVideoBtn.classList.add('active');
      modeVideoBtn.textContent = '🎨 切回实时代码';
      if (autoplay) mvVideo.play().catch(() => {});
      playPauseBtn.textContent = mvVideo.paused ? '▶ 播放' : '⏸ 暂停';
      updateUi(targetSec);
    } else {
      const vidSec = Number.isFinite(mvVideo.currentTime) ? mvVideo.currentTime : state.t;
      mvVideo.pause();
      hideVideoBanner();
      state.mode = 'canvas';
      mvVideo.classList.add('hidden');
      outCanvas.classList.remove('hidden');
      modeVideoBtn.classList.remove('active');
      modeVideoBtn.textContent = '🎬 成品视频（带配乐）';
      seekTo(startFromZero ? 0 : vidSec);
      if (autoplay) startPlayback();
      else playPauseBtn.textContent = '▶ 播放';
    }
  }

  // Build 10 Act Quick-Jump Pills & Scrubber Ticks
  const pillEls = [];
  SCENES.forEach((sc) => {
    const tick = document.createElement('span');
    tick.className = 'scene-tick';
    tick.style.left = `${(sc.start / DURATION) * 100}%`;
    sceneTicks.appendChild(tick);

    const btn = document.createElement('button');
    btn.className = 'scene-pill';
    btn.innerHTML = `<div class="pill-top"><span>${sc.name}</span><span class="pill-time">${sc.start.toFixed(1)}s</span></div><div class="pill-lyric">${sc.lyric}</div>`;
    btn.addEventListener('click', () => {
      startOverlay.classList.add('hidden');
      if (state.mode === 'video') {
        mvVideo.currentTime = sc.start + 0.02;
        mvVideo.play().catch(() => {});
      } else {
        seekTo(sc.start + 0.05);
        if (!state.playing) startPlayback();
      }
    });
    scenePills.appendChild(btn);
    pillEls.push(btn);
  });

  function getLyricAt(t) {
    for (const l of LYRICS) {
      if (t >= l.start && t <= l.end) {
        const fadeIn = S.clamp((t - l.start) / 0.14, 0, 1);
        const fadeOut = S.clamp((l.end - t) / 0.14, 0, 1);
        return { text: l.text, alpha: Math.min(fadeIn, fadeOut) };
      }
    }
    return null;
  }

  function getSceneIdxAt(t) {
    for (let i = 0; i < SCENES.length; i++) {
      if (t >= SCENES[i].start && t < SCENES[i].end) return i;
    }
    return SCENES.length - 1;
  }

  function renderFrame(t) {
    outCtx.clearRect(0, 0, S.W, S.H);
    S.renderMasterFrame(outCtx, t, state);
    const lyr = getLyricAt(t);
    if (lyr) {
      const beat = S.BEAT.getBeatInfo(t);
      const k = state.beatMode === 'off' ? 0 : state.beatMode === 'soft' ? 0.45 : 1.0;
      S.drawCinemaSubtitle(outCtx, lyr.text, lyr.alpha, beat.pulse * k);
    }
  }

  function updateUi(t) {
    const m = Math.floor(t / 60).toString().padStart(2, '0');
    const s = (t % 60).toFixed(1).padStart(4, '0');
    timeDisplay.textContent = `${m}:${s} / 01:19.0`;
    timelineSlider.value = t.toFixed(2);
    const activeIdx = getSceneIdxAt(t);
    pillEls.forEach((el, idx) => el.classList.toggle('active', idx === activeIdx));

    // Live 122 BPM Beat Indicator LED
    const beat = S.BEAT.getBeatInfo(t);
    const hit = beat.pulse > 0.36 && (state.playing || (state.mode === 'video' && !mvVideo.paused));
    beatLed.classList.toggle('hit', hit);
    beatLed.textContent = (hit && beat.beatInBar === 0) ? '✦ 122 BPM' : '● 122 BPM';

    if (!state.interactive || state.mode === 'video') {
      interactiveHint.classList.add('hidden');
    } else {
      interactiveHint.textContent = (t >= 31.0 && t < 64.0)
        ? '✨ 点击夜空绽放盛夏烟花！'
        : '✈️ 点击天空放飞回忆纸飞机！';
      interactiveHint.classList.remove('hidden');
    }
  }

  function startPlayback() {
    startOverlay.classList.add('hidden');
    state.playing = true;
    playPauseBtn.textContent = '⏸ 暂停';
    sound.playFrom(state.t, state.speed);
  }

  function pausePlayback() {
    state.playing = false;
    playPauseBtn.textContent = '▶ 播放';
    sound.pause();
  }

  function seekTo(sec) {
    state.t = S.clamp(sec, 0, DURATION);
    sound.onSeek(state.t, state.playing, state.speed);
    renderFrame(state.t);
    updateUi(state.t);
  }

  // ---- Event Wiring ----
  modeVideoBtn.addEventListener('click', () => {
    if (state.mode === 'video') setMode('canvas', { autoplay: false });
    else setMode('video', { autoplay: true });
  });

  function applyBeatMode(mode) {
    const labels = { soft: '🥁 节奏卡点：柔和', strong: '🥁 节奏卡点：强', off: '🥁 节奏卡点：关' };
    state.beatMode = labels[mode] ? mode : 'soft';
    beatSyncBtn.textContent = labels[state.beatMode];
    beatSyncBtn.classList.toggle('active', state.beatMode !== 'off');
  }

  beatSyncBtn.addEventListener('click', () => {
    const order = ['soft', 'strong', 'off'];
    const next = order[(order.indexOf(state.beatMode) + 1) % order.length];
    applyBeatMode(next);
    renderFrame(state.t);
  });

  bigPlayBtn.addEventListener('click', () => {
    state.bursts = [];
    setMode('canvas', { autoplay: true, startFromZero: true });
  });

  bigVideoBtn.addEventListener('click', () => {
    setMode('video', { autoplay: true, startFromZero: true });
  });

  mvVideo.addEventListener('play', () => {
    hideVideoBanner();
    if (state.mode === 'video') playPauseBtn.textContent = '⏸ 暂停';
  });
  mvVideo.addEventListener('canplay', () => hideVideoBanner());
  mvVideo.addEventListener('error', () => {
    if (state.mode === 'video') tryBlobVideoFallback(true, state.t);
  });
  mvVideo.addEventListener('pause', () => {
    if (state.mode === 'video') playPauseBtn.textContent = '▶ 播放';
  });
  mvVideo.addEventListener('volumechange', () => {
    if (state.mode === 'video') {
      sound.setMuted(mvVideo.muted);
      muteBtn.textContent = mvVideo.muted ? '🔇' : '🔊';
    }
  });

  videoFallbackCanvasBtn?.addEventListener('click', () => setMode('canvas', { autoplay: true, startFromZero: true }));
  videoRetryBlobBtn?.addEventListener('click', () => { videoBlobTried = false; tryBlobVideoFallback(true, state.t); });

  playPauseBtn.addEventListener('click', () => {
    if (state.mode === 'video') {
      if (mvVideo.paused) mvVideo.play().catch(() => {});
      else mvVideo.pause();
      return;
    }
    if (state.playing) pausePlayback();
    else {
      if (state.t >= DURATION - 0.05) seekTo(0);
      startPlayback();
    }
  });

  restartBtn.addEventListener('click', () => {
    if (state.mode === 'video') {
      mvVideo.currentTime = 0;
      mvVideo.play().catch(() => {});
      return;
    }
    state.bursts = [];
    seekTo(0);
    startPlayback();
  });

  timelineSlider.addEventListener('input', (e) => {
    startOverlay.classList.add('hidden');
    const sec = parseFloat(e.target.value);
    if (state.mode === 'video') {
      mvVideo.currentTime = sec;
      updateUi(sec);
    } else {
      seekTo(sec);
    }
  });

  muteBtn.addEventListener('click', () => {
    sound.ensureContext();
    const next = !sound.muted;
    sound.setMuted(next);
    mvVideo.muted = next;
    muteBtn.textContent = next ? '🔇' : '🔊';
  });

  speedSelect.addEventListener('change', (e) => {
    state.speed = parseFloat(e.target.value) || 1;
    mvVideo.playbackRate = state.speed;
    if (state.playing) sound.onSeek(state.t, true, state.speed);
  });

  loopCheck.addEventListener('change', (e) => {
    state.loop = e.target.checked;
    mvVideo.loop = state.loop;
  });

  interactiveBtn.addEventListener('click', () => {
    state.interactive = !state.interactive;
    interactiveBtn.textContent = `✨ 互动彩蛋：${state.interactive ? '开' : '关'}`;
    interactiveBtn.classList.toggle('active', state.interactive);
    if (!state.interactive) state.bursts = [];
    updateUi(state.t);
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) canvasFrame.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  });

  outCanvas.addEventListener('click', (e) => {
    if (state.interactive) {
      const r = outCanvas.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * S.W;
      const y = ((e.clientY - r.top) / r.height) * S.H;
      const kind = (state.t >= 31.0 && state.t < 64.0) ? 'firework' : 'plane';
      state.bursts.push({ x, y, t0: state.t, kind });
      if (state.bursts.length > 16) state.bursts.shift();
      sound.ensureContext();
      sound.playChime();
      return;
    }
    if (state.playing) pausePlayback();
    else startPlayback();
  });

  audioFileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    sound.loadCustomAudio(file);
    audioFileName.textContent = `🎵 已加载：${file.name}`;
    customAudioBar.classList.remove('hidden');
    if (state.playing) sound.playFrom(state.t, state.speed);
  });

  audioOffset.addEventListener('input', (e) => {
    sound.setCustomOffset(e.target.value);
    if (state.playing) sound.onSeek(state.t, true, state.speed);
  });

  clearAudioBtn.addEventListener('click', () => {
    sound.useBuiltInSong();
    customAudioBar.classList.add('hidden');
    audioFileInput.value = '';
    if (state.playing) sound.playFrom(state.t, state.speed);
  });

  // WebM Recorder
  let recorder = null;
  let recordedChunks = [];
  recordBtn.addEventListener('click', () => {
    if (state.mode === 'video') setMode('canvas', { autoplay: false, startFromZero: true });
    if (state.recording && recorder) {
      recorder.stop();
      return;
    }
    if (typeof MediaRecorder === 'undefined') {
      alert('当前浏览器不支持 MediaRecorder 录制');
      return;
    }
    sound.ensureContext();
    const videoStream = outCanvas.captureStream(30);
    const tracks = [...videoStream.getVideoTracks()];
    if (sound.recordDest) tracks.push(...sound.recordDest.stream.getAudioTracks());
    const mixed = new MediaStream(tracks);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm';
    recorder = new MediaRecorder(mixed, { mimeType: mime, videoBitsPerSecond: 6000000 });
    recordedChunks = [];
    recorder.ondataavailable = (ev) => { if (ev.data.size > 0) recordedChunks.push(ev.data); };
    recorder.onstop = () => {
      state.recording = false;
      recordBtn.textContent = '⏺ 录制导出';
      recordBtn.classList.remove('recording');
      const blob = new Blob(recordedChunks, { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'last-summer-mv.webm';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    };
    state.recording = true;
    recordBtn.textContent = '⏹ 停止录制';
    recordBtn.classList.add('recording');
    state.bursts = [];
    seekTo(0);
    startPlayback();
    recorder.start();
  });

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.code === 'Space') { e.preventDefault(); playPauseBtn.click(); }
    else if (e.code === 'ArrowLeft') {
      if (state.mode === 'video') mvVideo.currentTime = Math.max(0, mvVideo.currentTime - 2.0);
      else seekTo(state.t - 2.0);
    } else if (e.code === 'ArrowRight') {
      if (state.mode === 'video') mvVideo.currentTime = Math.min(DURATION, mvVideo.currentTime + 2.0);
      else seekTo(state.t + 2.0);
    } else if (e.key === 'f' || e.key === 'F') {
      fullscreenBtn.click();
    }
  });

  // Main Animation Loop
  let lastWall = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - lastWall) / 1000);
    lastWall = now;

    if (state.mode === 'video') {
      const vt = Number.isFinite(mvVideo.currentTime) ? mvVideo.currentTime : 0;
      state.t = S.clamp(vt, 0, DURATION);
      updateUi(state.t);
      requestAnimationFrame(tick);
      return;
    }

    if (state.playing) {
      const audT = sound.getActiveAudioTime();
      if (audT !== null && Math.abs(audT - state.t) < 0.45) {
        state.t = S.clamp(audT, 0, DURATION);
      } else {
        state.t += dt * state.speed;
      }
      if (state.t >= DURATION) {
        if (state.recording && recorder) {
          state.t = DURATION;
          recorder.stop();
          pausePlayback();
        } else if (state.loop) {
          state.bursts = [];
          state.t = 0;
          sound.onSeek(0, true, state.speed);
        } else {
          state.t = DURATION;
          pausePlayback();
        }
      }
      sound.sync(state.t, state.playing, state.speed);
    }

    renderFrame(state.t);
    updateUi(state.t);
    requestAnimationFrame(tick);
  }

  window.MV_PLAYER = {
    seekTo: (sec) => {
      startOverlay.classList.add('hidden');
      pausePlayback();
      seekTo(sec);
    },
    setMode,
    setBeatMode: (mode) => { applyBeatMode(mode); renderFrame(state.t); },
    play: startPlayback,
    pause: pausePlayback,
    getState: () => state,
    DURATION,
    SCENES
  };

  applyBeatMode(state.beatMode);
  renderFrame(state.t);
  updateUi(state.t);
  requestAnimationFrame(tick);
})(window.SUMMER);
