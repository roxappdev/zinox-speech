import { FileText, Play, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    icon: FileText,
    step: "Step 1",
    title: "Type or Paste Your Text",
    description:
      "Up to 1,500 characters per run. Articles, scripts, dialogues, lecture notes — anything written in English. Longer texts are automatically split into sentences and stitched into one seamless audio file.",
  },
  {
    icon: SlidersHorizontal,
    step: "Step 2",
    title: "Pick a Voice and Speed",
    description:
      "Choose from sixteen curated American and British voices, then fine-tune the pace between 0.5x for careful listening and 1.5x for quick proofreading. Switching voices never re-downloads the model.",
  },
  {
    icon: Play,
    step: "Step 3",
    title: "Listen, Download, Done",
    description:
      "Speech is synthesized at 24 kHz in seconds and plays right on the page. Export a lossless WAV with one click and drop it straight into your video editor, podcast rig or IVR system.",
  },
];

const USE_CASES = [
  {
    title: "Video Voice-Overs",
    description: "Narrate YouTube explainers, ads and product demos without booking a studio.",
  },
  {
    title: "E-Learning & Courses",
    description: "Turn lecture notes and slide decks into audio lessons students can replay anywhere.",
  },
  {
    title: "Accessibility",
    description: "Offer an instant read-aloud option for articles, docs and interfaces.",
  },
  {
    title: "Prototype Voice Agents",
    description: "Test dialogue scripts and IVR flows before wiring up a production API.",
  },
  {
    title: "Proofreading",
    description: "Hear your writing at 1.5x speed — your ears catch what your eyes skip.",
  },
  {
    title: "Confidential Documents",
    description: "Listen to private notes and legal drafts knowing nothing ever leaves the device.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-t border-white/5 bg-zinc-950 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge
            variant="outline"
            className="border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/10"
          >
            How It Works
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            From Text to Speech in Three Steps
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            No accounts, no onboarding calls, no configuration. The entire pipeline —
            tokenization, neural synthesis and audio encoding — happens inside this page.
          </p>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative">
              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-[calc(50%+40px)] top-10 hidden h-px w-[calc(100%-80px)] bg-gradient-to-r from-violet-500/40 to-transparent md:block"
                />
              )}
              <div className="h-full rounded-2xl border border-white/5 bg-white/[0.03] p-6">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
                    <step.icon className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-100">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16">
          <h3 className="text-center text-xl font-semibold text-zinc-100">
            What People Build With It
          </h3>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {USE_CASES.map((useCase) => (
              <article
                key={useCase.title}
                className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition-colors hover:border-fuchsia-500/30"
              >
                <h4 className="font-semibold text-zinc-100">{useCase.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                  {useCase.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
