/**
 * Web Audio API Ambient Soundscape Hook
 * Generates warm vintage shellac vinyl crackle & gentle meditative West African pentatonic tones
 */

import { useState, useRef, useEffect, useCallback } from 'react';

export function useSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const vinylNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const melodyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceIndexRef = useRef<number>(0);

  // Pentatonic scale frequencies in G (G3, A3, C4, D4, E4, G4)
  const scale = [196.00, 220.00, 261.63, 293.66, 329.63, 392.00];
  const noteSequence = [0, 2, 4, 3, 1, 3, 2, 5, 4, 2, 1, 0];

  const initContext = useCallback(() => {
    if (audioCtxRef.current) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.connect(ctx.destination);

    audioCtxRef.current = ctx;
    masterGainRef.current = master;
  }, []);

  const createVinylTexture = useCallback(() => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      let white = Math.random() * 2 - 1;
      let sample = white * 0.015;
      if (Math.random() < 0.0003) {
        sample += (Math.random() > 0.5 ? 1 : -1) * (0.08 + Math.random() * 0.12);
      }
      output[i] = sample;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const vinylGain = ctx.createGain();
    vinylGain.gain.setValueAtTime(0.35, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(vinylGain);
    vinylGain.connect(master);

    whiteNoise.start();
    vinylNodeRef.current = whiteNoise;
  }, []);

  const playGentleTone = useCallback((freq: number) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(master);

    osc.start(now);
    osc.stop(now + 3.0);
  }, []);

  const startSoundscape = useCallback(() => {
    initContext();
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    createVinylTexture();

    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.85, now + 1.2);

    setIsPlaying(true);

    const scheduleNext = () => {
      const noteFreq = scale[noteSequence[sequenceIndexRef.current % noteSequence.length]];
      sequenceIndexRef.current++;
      playGentleTone(noteFreq);

      const delay = 2400 + Math.random() * 800;
      melodyTimerRef.current = setTimeout(scheduleNext, delay);
    };

    scheduleNext();
  }, [initContext, createVinylTexture, playGentleTone, noteSequence, scale]);

  const stopSoundscape = useCallback(() => {
    setIsPlaying(false);
    if (melodyTimerRef.current) {
      clearTimeout(melodyTimerRef.current);
      melodyTimerRef.current = null;
    }

    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (ctx && master) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0.0001, now + 0.8);

      setTimeout(() => {
        if (vinylNodeRef.current) {
          try { vinylNodeRef.current.stop(); } catch (e) { /* ignore */ }
          vinylNodeRef.current.disconnect();
          vinylNodeRef.current = null;
        }
      }, 900);
    }
  }, []);

  const toggleSoundscape = useCallback(() => {
    if (isPlaying) {
      stopSoundscape();
    } else {
      startSoundscape();
    }
  }, [isPlaying, startSoundscape, stopSoundscape]);

  useEffect(() => {
    return () => {
      if (melodyTimerRef.current) clearTimeout(melodyTimerRef.current);
      if (vinylNodeRef.current) {
        try { vinylNodeRef.current.stop(); } catch (e) { /* ignore */ }
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return { isPlaying, toggleSoundscape };
}
