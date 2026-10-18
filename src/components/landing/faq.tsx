import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FAQ_ITEMS } from "@/lib/site";

export function Faq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-white/5 bg-gradient-to-b from-zinc-950 to-zinc-900/50 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <Badge
            variant="outline"
            className="border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/10"
          >
            FAQ
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Everything you might want to know before converting your first line of text.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 last:border-b"
            >
              <AccordionTrigger className="py-5 text-left text-base font-medium text-zinc-100 hover:text-violet-300 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-zinc-400">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
