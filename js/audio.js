// Bulletproof Zero-CORS Audio Engine (Inline Base64 OGG Opus -> Web Audio AudioBuffer + HTMLAudio fallback)
window.SUMMER = window.SUMMER || {};

(function (S) {
  function b64ToArrayBuffer(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.recordDest = null;
      this.muted = false;
      this.customOffset = 0;

      // Primary decoded Web Audio engine (works 100% in file://, Electron DSH preview, and http!)
      this.decodedBuffer = null;
      this.decodedSource = null;
      this.decodedStartCtxTime = 0;
      this.decodedStartOffset = 0;
      this.decodedRate = 1;
      this.decodingPromise = null;

      // Optional user-uploaded local audio element
      this.customFileAudio = null;
      this.customFileUrl = null;
    }

    ensureContext() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.muted ? 0 : 0.92;
        this.master.connect(this.ctx.destination);
        this.recordDest = this.ctx.createMediaStreamDestination();
        this.master.connect(this.recordDest);
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (!this.customFileAudio) {
        this._ensureBuiltInDecoded();
      }
    }

    _ensureBuiltInDecoded() {
      if (this.decodedBuffer || this.decodingPromise || !this.ctx) return this.decodingPromise;
      this.decodingPromise = (async () => {
        // 1. Decode directly from inline js/bgm-data.js (0 network / 0 CORS failure!)
        if (S.BGM_OGG_B64) {
          try {
            const ab = b64ToArrayBuffer(S.BGM_OGG_B64);
            this.decodedBuffer = await this.ctx.decodeAudioData(ab);
            return this.decodedBuffer;
          } catch (_) {}
        }
        // 2. Fallback fetch if on HTTP
        for (const url of ['audio/last-summer-bgm.ogg', 'audio/last-summer-bgm.mp3']) {
          try {
            const resp = await fetch(url);
            if (!resp.ok) continue;
            const ab = await resp.arrayBuffer();
            this.decodedBuffer = await this.ctx.decodeAudioData(ab);
            return this.decodedBuffer;
          } catch (_) {}
        }
        return null;
      })();
      return this.decodingPromise;
    }

    _stopBufferSource() {
      if (this.decodedSource) {
        try { this.decodedSource.stop(); } catch (_) {}
        try { this.decodedSource.disconnect(); } catch (_) {}
        this.decodedSource = null;
      }
    }

    _startBufferAt(offsetSec, speed = 1) {
      if (!this.ctx || !this.decodedBuffer) return;
      this._stopBufferSource();
      const dur = this.decodedBuffer.duration;
      const clamped = Math.max(0, Math.min(offsetSec, Math.max(0, dur - 0.05)));
      const src = this.ctx.createBufferSource();
      src.buffer = this.decodedBuffer;
      src.playbackRate.value = speed;
      src.connect(this.master);
      src.start(0, clamped);
      this.decodedSource = src;
      this.decodedStartCtxTime = this.ctx.currentTime;
      this.decodedStartOffset = clamped;
      this.decodedRate = speed;
    }

    setMuted(flag) {
      this.muted = flag;
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(flag ? 0 : 0.92, this.ctx.currentTime, 0.03);
      }
      if (this.customFileAudio) {
        this.customFileAudio.muted = flag;
      }
    }

    // Called synchronously inside user click gesture!
    playFrom(t, speed = 1) {
      this.ensureContext();
      const target = Math.max(0, t + this.customOffset);
      if (this.customFileAudio) {
        this.customFileAudio.playbackRate = speed;
        try { this.customFileAudio.currentTime = target; } catch (_) {}
        this.customFileAudio.play().catch(() => {});
        return;
      }
      if (this.decodedBuffer) {
        this._startBufferAt(target, speed);
      } else {
        this._ensureBuiltInDecoded()?.then((buf) => {
          if (buf && this._wantPlaying) {
            this._startBufferAt(Math.max(0, this._wantTime + this.customOffset), this._wantSpeed);
          }
        });
      }
      this._wantPlaying = true;
      this._wantTime = t;
      this._wantSpeed = speed;
    }

    pause() {
      this._wantPlaying = false;
      this._stopBufferSource();
      if (this.customFileAudio && !this.customFileAudio.paused) {
        this.customFileAudio.pause();
      }
    }

    getActiveAudioTime() {
      if (this.customFileAudio && !this.customFileAudio.paused && this.customFileAudio.readyState >= 2) {
        return this.customFileAudio.currentTime - this.customOffset;
      }
      if (this.decodedSource && this.ctx && this.decodedBuffer) {
        return this.decodedStartOffset + (this.ctx.currentTime - this.decodedStartCtxTime) * this.decodedRate - this.customOffset;
      }
      return null;
    }

    sync(t, playing, speed = 1) {
      this._wantPlaying = playing;
      this._wantTime = t;
      this._wantSpeed = speed;
      if (!playing) {
        this.pause();
        return;
      }
      const target = Math.max(0, t + this.customOffset);
      if (this.customFileAudio) {
        this.customFileAudio.playbackRate = speed;
        if (this.customFileAudio.paused) {
          try { this.customFileAudio.currentTime = target; } catch (_) {}
          this.customFileAudio.play().catch(() => {});
        } else if (Math.abs(this.customFileAudio.currentTime - target) > 0.22) {
          try { this.customFileAudio.currentTime = target; } catch (_) {}
        }
        return;
      }
      if (this.decodedBuffer) {
        const cur = this.decodedSource
          ? this.decodedStartOffset + (this.ctx.currentTime - this.decodedStartCtxTime) * this.decodedRate
          : null;
        if (!this.decodedSource || Math.abs(this.decodedRate - speed) > 0.01 || (cur !== null && Math.abs(cur - target) > 0.28)) {
          this._startBufferAt(target, speed);
        }
      }
    }

    onSeek(t, playing = false, speed = 1) {
      this._wantTime = t;
      const target = Math.max(0, t + this.customOffset);
      if (this.customFileAudio) {
        try { this.customFileAudio.currentTime = target; } catch (_) {}
        return;
      }
      if (playing && this.decodedBuffer) {
        this._startBufferAt(target, speed);
      } else {
        this._stopBufferSource();
      }
    }

    loadCustomAudio(file) {
      this.pause();
      if (this.customFileUrl) URL.revokeObjectURL(this.customFileUrl);
      this.customFileUrl = URL.createObjectURL(file);
      const a = new Audio(this.customFileUrl);
      a.preload = 'auto';
      a.muted = this.muted;
      this.customFileAudio = a;
    }

    useBuiltInSong() {
      this.pause();
      if (this.customFileUrl) URL.revokeObjectURL(this.customFileUrl);
      this.customFileAudio = null;
      this.customFileUrl = null;
      this.customOffset = 0;
    }

    setCustomOffset(sec) {
      this.customOffset = Number(sec) || 0;
    }

    playChime() {
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(784, now);
      osc.frequency.exponentialRampToValueAtTime(1175, now + 0.09);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  }

  S.SoundEngine = SoundEngine;
})(window.SUMMER);
