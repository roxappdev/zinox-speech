"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Download,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  SAMPLE_TEXTS,
  TTS_MODEL_ID,
  VOICES,
  VOICE_GROUPS,
  type VoiceGroup,
} from "@/lib/site";

const MODEL_ID = TTS_MODEL_ID;
const MAX_CHARS = 1500;
const CHUNK_LIMIT = 280;
const PEAK_BUCKETS = 110;

type Status = "idle" | "loading" | "generating" | "done" | "error";

interface ProgressEventLike {
  status: string;
  file?: string;
  loaded?: number;
  total?: number;
}

interface RawAudioLike {
  audio: Float32Array;
  sampling_rate: number;
}

interface KokoroTtsInstance {
  generate(
    text: string,
    options: { voice: string; speed: number }
  ): Promise<RawAudioLike>;
}

interface KokoroTtsConstructor {
  from_pretrained(
    modelId: string,
    options: {
      dtype?: string;
      device?: string;
      progress_callback?: ((event: ProgressEventLike) => void) | null;
    }
  ): Promise<KokoroTtsInstance>;
}

/* ------------------------------ Audio helpers ------------------------------ */

function toFloat32(audio: Float32Array): Float32Array {
  return audio;
}

function float32ToWav(samples: Float32Array, sampleRate: number): Blob {
  const dataSize = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  return new Blob([view], { type: "audio/wav" });
}

function splitIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?\n]+[.!?]+["')\]]*\s*|[^.!?\n]+["')\]]*$/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  const pushCurrent = () => {
    const trimmed = current.trim();
    if (trimmed) chunks.push(trimmed);
    current = "";
  };

  for (const sentence of sentences) {
    if (sentence.length > CHUNK_LIMIT) {
      pushCurrent();
      // Hard-split very long sentences at word boundaries.
      const words = sentence.split(/\s+/);
      let part = "";
      for (const word of words) {
        if ((part + " " + word).trim().length > CHUNK_LIMIT) {
          if (part.trim()) chunks.push(part.trim());
          part = word;
        } else {
          part = `${part} ${word}`.trim();
        }
      }
      if (part.trim()) chunks.push(part.trim());
      continue;
    }
    if ((current + " " + sentence).trim().length > CHUNK_LIMIT) {
      pushCurrent();
    }
    current = `${current} ${sentence}`.trim();
  }
  pushCurrent();

  return chunks.length > 0 ? chunks : [text.trim()];
}

function computePeaks(samples: Float32Array, buckets: number): number[] {
  const size = Math.max(1, Math.floor(samples.length / buckets));
  const peaks: number[] = [];
  for (let b = 0; b < buckets; b += 1) {
    let peak = 0;
    const start = b * size;
    const end = Math.min(start + size, samples.length);
    for (let i = start; i < end; i += 1) {
      const abs = Math.abs(samples[i]);
      if (abs > peak) peak = abs;
    }
    peaks.push(peak);
  }
  const max = Math.max(...peaks, 0.01);
  return peaks.map((p) => Math.max(0.06, p / max));
}

/* -------------------------------- Component -------------------------------- */

export function TtsDemo() {
  const [text, setText] = useState(SAMPLE_TEXTS[0].text);
  const [voiceId, setVoiceId] = useState("af_heart");
  const [speed, setSpeed] = useState(1);
  const [device, setDevice] = useState<"wasm" | "webgpu">("wasm");
  const [hasWebGpu, setHasWebGpu] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [statusText, setStatusText] = useState("");
  const [loadProgress, setLoadProgress] = useState(0);
  const [chunkInfo, setChunkInfo] = useState<{ current: number; total: number } | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [peaks, setPeaks] = useState<number[] | null>(null);
  const [performance_, setPerformance] = useState<{ audioSec: number; genSec: number; rtf: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const synthCache = useRef(new Map<string, unknown>());
  const fileProgress = useRef(new Map<string, { loaded: number; total: number }>());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const peaksRef = useRef<number[] | null>(null);
  const playedRef = useRef(0);

  useEffect(() => {
    const gpuAvailable = typeof navigator !== "undefined" && "gpu" in navigator;
    setHasWebGpu(Boolean(gpuAvailable));
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      cancelAnimationFrame(rafRef.current);
    };
  }, [audioUrl]);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    const currentPeaks = peaksRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (!currentPeaks) return;

    const barCount = currentPeaks.length;
    const gap = 3;
    const barWidth = Math.max(2, (width - gap * (barCount - 1)) / barCount);
    const played = playedRef.current;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#8b5cf6");
    gradient.addColorStop(1, "#d946ef");

    for (let i = 0; i < barCount; i += 1) {
      const x = i * (barWidth + gap);
      const barHeight = currentPeaks[i] * (height - 8);
      const y = (height - barHeight) / 2;
      const fraction = barCount > 1 ? i / (barCount - 1) : 0;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      if (fraction <= played) {
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = "rgba(113, 113, 122, 0.42)";
      }
      ctx.fill();
    }
  }, []);

  const startProgressLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      const audio = audioRef.current;
      if (audio && audio.duration && Number.isFinite(audio.duration)) {
        playedRef.current = Math.min(1, audio.currentTime / audio.duration);
      }
      drawWaveform();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [drawWaveform]);

  const stopProgressLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    peaksRef.current = peaks;
    drawWaveform();
  }, [peaks, drawWaveform]);

  const getSynthesizer = useCallback(
    async (targetDevice: "wasm" | "webgpu") => {
      const cacheKey = targetDevice;

      if (synthCache.current.has(cacheKey)) {
        return synthCache.current.get(cacheKey);
      }

      setStatus("loading");
      setLoadProgress(0);
      setStatusText("Preparing the neural engine…");
      fileProgress.current.clear();

      // The engine is loaded lazily so the initial page bundle stays small.
      const { KokoroTTS } = (await import("kokoro-js")) as {
        KokoroTTS: KokoroTtsConstructor;
      };

      const onProgress = (event: ProgressEventLike) => {
        if (!event.file || !event.total) return;
        fileProgress.current.set(event.file, {
          loaded: event.loaded ?? 0,
          total: event.total,
        });
        let loaded = 0;
        let total = 0;
        fileProgress.current.forEach((v) => {
          loaded += v.loaded;
          total += v.total;
        });
        if (total > 0) {
          const pct = Math.min(100, Math.round((loaded / total) * 100));
          setLoadProgress(pct);
          setStatusText(
            pct < 100
              ? `Downloading the neural engine — ${pct}% (${targetDevice === "webgpu" ? "~330 MB" : "~90 MB"})`
              : "Loading the engine into memory…"
          );
        }
      };

      const synthesizer = await KokoroTTS.from_pretrained(MODEL_ID, {
        device: targetDevice,
        dtype: targetDevice === "webgpu" ? "fp32" : "q8",
        progress_callback: onProgress,
      });

      synthCache.current.set(cacheKey, synthesizer);
      return synthesizer;
    },
    []
  );

  const handleGenerate = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setStatus("generating");
    setErrorMsg("");
    setStatusText("");
    setChunkInfo(null);
    playedRef.current = 0;

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setPeaks(null);
    setPerformance(null);

    const startedAt = performance.now();

    try {
      const synthesizer = await getSynthesizer(device);

      const chunks = splitIntoChunks(trimmed);
      const parts: Float32Array[] = [];
      let sampleRate = 24000;

      for (let i = 0; i < chunks.length; i += 1) {
        setChunkInfo({ current: i + 1, total: chunks.length });
        setStatusText(
          chunks.length > 1
            ? `Synthesizing speech — segment ${i + 1} of ${chunks.length}`
            : "Synthesizing speech…"
        );
        const output = await (
          synthesizer as KokoroTtsInstance
        ).generate(chunks[i], { voice: voiceId, speed });
        sampleRate = output.sampling_rate ?? 24000;
        parts.push(toFloat32(output.audio));
      }

      const totalLength = parts.reduce((acc, part) => acc + part.length, 0);
      const merged = new Float32Array(totalLength);
      let offset = 0;
      for (const part of parts) {
        merged.set(part, offset);
        offset += part.length;
      }

      const blob = float32ToWav(merged, sampleRate);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setPeaks(computePeaks(merged, PEAK_BUCKETS));

      const audioSec = totalLength / sampleRate;
      const genSec = (performance.now() - startedAt) / 1000;
      setPerformance({ audioSec, genSec, rtf: genSec > 0 ? audioSec / genSec : 0 });

      setStatus("done");
      setStatusText("");
      setChunkInfo(null);

      requestAnimationFrame(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().then(startProgressLoop).catch(() => {});
        }
      });
    } catch (err) {
      console.error("TTS generation failed:", err);
      setStatus("error");
      setChunkInfo(null);
      setStatusText("");
      const message = err instanceof Error ? err.message : "Unknown error";
      setErrorMsg(
        `Speech generation failed: ${message}. Check your internet connection (the engine is downloaded on first run) and try again.`
      );
    }
  }, [text, device, voiceId, speed, audioUrl, getSynthesizer, startProgressLoop]);

  const handleDownload = useCallback(() => {
    if (!audioUrl) return;
    const anchor = document.createElement("a");
    anchor.href = audioUrl;
    anchor.download = `zinox-speech-${voiceId}-${Date.now()}.wav`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }, [audioUrl, voiceId]);

  const handleReset = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setPeaks(null);
    setPerformance(null);
    playedRef.current = 0;
    setStatus("idle");
    setStatusText("");
    setChunkInfo(null);
    setErrorMsg("");
    setLoadProgress(0);
  }, [audioUrl]);

  const busy = status === "loading" || status === "generating";
  const selectedVoice = VOICES.find((v) => v.id === voiceId);

  return (
    <section id="demo" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="outline"
            className="border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/10"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Live Demo
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Hear It Before You Believe It
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            This demo loads a real neural network into this page and synthesizes speech
            on your CPU or GPU. No recordings, no server round-trips — just inference,
            live in your browser.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 shadow-2xl shadow-violet-950/40 backdrop-blur">
          <div className="grid gap-6 p-6 sm:p-8">
            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Try a sample:
              </span>
              {SAMPLE_TEXTS.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => setText(sample.text)}
                  disabled={busy}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-violet-500/40 hover:bg-violet-500/15 hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Text input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tts-text" className="text-sm text-zinc-300">
                  Your text
                </Label>
                <span
                  className={`text-xs tabular-nums ${
                    text.length > MAX_CHARS ? "text-red-400" : "text-zinc-500"
                  }`}
                >
                  {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                </span>
              </div>
              <Textarea
                id="tts-text"
                value={text}
                onChange={(event) =>
                  setText(event.target.value.slice(0, MAX_CHARS))
                }
                placeholder="Type or paste the text you want to hear…"
                rows={5}
                disabled={busy}
                className="resize-none border-white/10 bg-zinc-950/60 text-base leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-violet-500/50"
                aria-describedby="tts-text-hint"
              />
              <p id="tts-text-hint" className="text-xs text-zinc-600">
                Long texts are split into sentence-level segments and stitched together
                seamlessly.
              </p>
            </div>

            {/* Controls */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="tts-voice" className="text-sm text-zinc-300">
                  Voice
                </Label>
                <Select
                  value={voiceId}
                  onValueChange={setVoiceId}
                  disabled={busy}
                >
                  <SelectTrigger
                    id="tts-voice"
                    className="w-full border-white/10 bg-zinc-950/60 text-zinc-100"
                    aria-label="Select a voice"
                  >
                    <SelectValue placeholder="Pick a voice" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 border-white/10 bg-zinc-900 text-zinc-100 nice-scroll">
                    {VOICE_GROUPS.map((group: VoiceGroup) => (
                      <SelectGroup key={group}>
                        <SelectLabel className="text-xs uppercase tracking-wide text-zinc-500">
                          {group}
                        </SelectLabel>
                        {VOICES.filter((v) => v.group === group).map((voice) => (
                          <SelectItem key={voice.id} value={voice.id} className="focus:bg-violet-500/20">
                            <span className="flex w-full items-center justify-between gap-3">
                              <span>
                                {voice.name}
                                <span className="ml-2 text-xs text-zinc-500">
                                  {voice.note ?? voice.id}
                                </span>
                              </span>
                              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-300">
                                {voice.grade}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tts-speed" className="text-sm text-zinc-300">
                  Speed <span className="tabular-nums text-violet-400">{speed.toFixed(2)}x</span>
                </Label>
                <div className="flex h-10 items-center px-1">
                  <Slider
                    id="tts-speed"
                    value={[speed]}
                    onValueChange={(values) => setSpeed(values[0] ?? 1)}
                    min={0.5}
                    max={1.5}
                    step={0.05}
                    disabled={busy}
                    aria-label="Speaking speed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tts-device" className="text-sm text-zinc-300">
                  Compute device
                </Label>
                <Select
                  value={device}
                  onValueChange={(value) => setDevice(value as "wasm" | "webgpu")}
                  disabled={busy}
                >
                  <SelectTrigger
                    id="tts-device"
                    className="w-full border-white/10 bg-zinc-950/60 text-zinc-100"
                    aria-label="Select compute device"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-zinc-900 text-zinc-100">
                    <SelectItem value="wasm" className="focus:bg-violet-500/20">
                      CPU (WASM, INT8) — most compatible
                    </SelectItem>
                    <SelectItem
                      value="webgpu"
                      disabled={!hasWebGpu}
                      className="focus:bg-violet-500/20"
                    >
                      {hasWebGpu
                        ? "WebGPU — fastest (FP32, ~330 MB)"
                        : hasWebGpu === false
                          ? "WebGPU — not available in this browser"
                          : "WebGPU"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={busy || !text.trim()}
                className="h-12 flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-base font-semibold text-white shadow-lg shadow-violet-500/30 border-0 hover:opacity-90 disabled:opacity-40 sm:flex-none sm:px-10"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Loading model…
                  </>
                ) : status === "generating" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" aria-hidden="true" />
                    Generate Speech
                  </>
                )}
              </Button>

              {status === "done" && (
                <>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDownload}
                    className="h-12 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10 hover:text-white"
                  >
                    <Download className="h-5 w-5" aria-hidden="true" />
                    Download WAV
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    onClick={handleReset}
                    className="h-12 text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Clear
                  </Button>
                </>
              )}
            </div>

            {/* Progress / status */}
            {(busy || status === "loading") && (
              <div className="space-y-2 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4" role="status" aria-live="polite">
                <p className="flex items-center gap-2 text-sm text-violet-200">
                  <Zap className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {statusText || "Working…"}
                </p>
                {status === "loading" && (
                  <Progress
                    value={loadProgress}
                    className="h-2 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-fuchsia-500"
                    aria-label={`Model download progress ${loadProgress}%`}
                  />
                )}
                {chunkInfo && chunkInfo.total > 1 && (
                  <Progress
                    value={(chunkInfo.current / chunkInfo.total) * 100}
                    className="h-2 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-violet-500 [&>div]:to-fuchsia-500"
                    aria-label={`Generation progress, segment ${chunkInfo.current} of ${chunkInfo.total}`}
                  />
                )}
                <p className="text-xs text-zinc-500">
                  First run downloads the neural engine. It is cached afterwards —
                  reloads are near-instant and work offline.
                </p>
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div
                className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
                role="alert"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Result */}
            {status === "done" && audioUrl && (
              <div className="space-y-4 rounded-2xl border border-white/10 bg-zinc-950/50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                    <Play className="h-4 w-4 text-violet-400" aria-hidden="true" />
                    {selectedVoice ? `${selectedVoice.name} · ${selectedVoice.group}` : voiceId}
                    {performance_ && (
                      <span className="text-xs font-normal text-zinc-500">
                        · 24 kHz · {performance_.audioSec.toFixed(1)}s of audio
                      </span>
                    )}
                  </p>
                  {performance_ && (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 whitespace-nowrap"
                    >
                      <Zap className="h-3 w-3" aria-hidden="true" />
                      {performance_.rtf >= 1
                        ? `${performance_.rtf.toFixed(1)}x faster than real time`
                        : `${(performance_.rtf * 100).toFixed(0)}% of real-time speed`}
                    </Badge>
                  )}
                </div>
                <canvas
                  ref={canvasRef}
                  className="h-20 w-full"
                  aria-label="Waveform of the generated audio"
                  role="img"
                />
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  className="w-full"
                  onPlay={startProgressLoop}
                  onPause={() => {
                    stopProgressLoop();
                    drawWaveform();
                  }}
                  onEnded={() => {
                    stopProgressLoop();
                    playedRef.current = 1;
                    drawWaveform();
                    playedRef.current = 0;
                  }}
                  onSeeked={() => {
                    drawWaveform();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
