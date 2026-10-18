import { ArrowRight, BarChart3, Cpu, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_STATS = [
  {
    icon: Cpu,
    value: "In-browser",
    label: "neural inference on your own device",
  },
  {
    icon: BarChart3,
    value: "24 kHz",
    label: "studio-grade audio output",
  },
  {
    icon: Lock,
    value: "0 bytes",
    label: "of your text ever uploaded",
  },
  {
    icon: ArrowRight,
    value: "16",
    label: "curated American & British voices",
  },
];

const EQ_HEIGHTS = [38, 62, 90, 55, 78, 100, 48, 70, 85, 58, 92, 66, 42, 74, 95, 52, 80, 60, 36, 68, 88, 50, 72, 44];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-320px] h-[640px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute right-[-180px] top-[220px] h-[420px] w-[420px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <a
            href="#demo"
            className="group inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 transition-colors hover:bg-violet-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-400" />
            </span>
            Runs 100% in your browser — nothing leaves your device
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          <h1 className="mt-8 max-w-4xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            Free AI Text to Speech.{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
              Natural Voices, Zero Trade-offs.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-zinc-400 sm:text-xl">
            Turn any text into studio-quality speech with a{" "}
            <strong className="font-semibold text-zinc-200">neural voice engine</strong>{" "}
            that runs right inside this page. No API keys, no uploads, no sign-up.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <a href="#demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="h-13 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 text-base font-semibold text-white shadow-xl shadow-violet-500/30 border-0 hover:opacity-90 sm:w-auto"
              >
                Generate Speech — It&apos;s Free
              </Button>
            </a>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="h-13 w-full border-white/10 bg-white/5 px-8 text-base text-zinc-200 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                See How It Works
              </Button>
            </a>
          </div>

          {/* Animated equalizer */}
          <div
            aria-hidden="true"
            className="mt-16 flex h-24 w-full max-w-2xl items-center justify-center gap-[6px] sm:gap-2"
          >
            {EQ_HEIGHTS.map((h, i) => (
              <span
                key={i}
                className="eq-bar w-1.5 rounded-full bg-gradient-to-t from-violet-600/70 to-fuchsia-400/70 sm:w-2"
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i % 8) * 0.13}s`,
                  animationDuration: `${1 + (i % 5) * 0.09}s`,
                }}
              />
            ))}
          </div>

          {/* Stats */}
          <dl className="mt-14 grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.value}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-left backdrop-blur-sm"
              >
                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  <stat.icon className="h-4 w-4 text-violet-400" aria-hidden="true" />
                </dt>
                <dd className="mt-2 text-2xl font-bold text-zinc-50 sm:text-3xl">
                  {stat.value}
                </dd>
                <dd className="mt-1 text-sm text-zinc-500">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
