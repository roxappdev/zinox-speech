import { AudioWaveform } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "#demo", label: "Live Demo" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#faq", label: "FAQ" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <a
              href="#top"
              className="flex items-center gap-2.5 font-semibold tracking-tight text-zinc-50"
              aria-label={`${SITE_NAME} home`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
                <AudioWaveform className="h-4.5 w-4.5 text-white" aria-hidden="true" />
              </span>
              <span>
                Zinox{" "}<span className="text-violet-400">Speech</span>
              </span>
            </a>
            <p className="max-w-xs text-center text-sm leading-relaxed text-zinc-500 md:text-left">
              Free AI text to speech that respects your privacy. Natural voices, zero
              uploads, zero cost — running entirely in your browser.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-violet-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {SITE_NAME}. Speech synthesis runs locally — we
            never see your text.
          </p>
          <p className="text-xs text-zinc-600">
            Built for privacy, speed and accessibility.
          </p>
        </div>
      </div>
    </footer>
  );
}
