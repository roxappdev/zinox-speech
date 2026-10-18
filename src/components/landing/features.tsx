import {
  Accessibility,
  Coins,
  Gauge,
  Mic2,
  ShieldCheck,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Private by Architecture",
    description:
      "Your text is synthesized on your own silicon. There is no server to send it to, no logging, no training on your data — privacy is not a policy here, it is physics.",
  },
  {
    icon: Coins,
    title: "Zero Cost, Zero Limits",
    description:
      "No API keys, no subscription, no character quotas and no rate limits. Synthesize a sentence or an entire chapter — the price is always the same: free.",
  },
  {
    icon: Gauge,
    title: "Faster Than Real Time",
    description:
      "WebGPU acceleration pushes synthesis to several times faster than playback on modern GPUs, while the WASM fallback keeps older machines comfortably in real time.",
  },
  {
    icon: Mic2,
    title: "16 Curated Voices",
    description:
      "Hand-picked American and British voices across female and male ranges, each rated by quality grade — from the flagship Heart (A) to the storyteller Fable.",
  },
  {
    icon: WifiOff,
    title: "Works Offline",
    description:
      "After the first run the model is cached in your browser. Generate speech on a plane, in a bunker or on a train through the middle of nowhere.",
  },
  {
    icon: Accessibility,
    title: "Accessible by Design",
    description:
      "Full keyboard navigation, ARIA live regions for progress and errors, and adjustable speech rate from 0.5x to 1.5x — built to be listened to by everyone.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-white/5 bg-zinc-950 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="outline"
            className="border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/10"
          >
            Why Zinox Speech
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Cloud TTS Services, Without the Cloud
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Traditional text-to-speech APIs charge per character, require accounts and
            ship your text to data centers. Zinox Speech deletes all three downsides by
            running the neural network where your text already is.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.06]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 ring-1 ring-violet-500/30 transition-transform group-hover:scale-110">
                <feature.icon className="h-5.5 w-5.5 text-violet-300" aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-zinc-100">{feature.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
