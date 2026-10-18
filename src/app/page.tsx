import { SiteHeader } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { TtsDemo } from "@/components/landing/tts-demo";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Faq } from "@/components/landing/faq";
import { SiteFooter } from "@/components/landing/footer";
import { FAQ_ITEMS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

function StructuredData() {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any modern web browser",
    browserRequirements: "Requires JavaScript and WebAssembly support",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Free AI text to speech with no sign-up",
      "Runs 100% in the browser",
      "16 natural English voices",
      "WebGPU acceleration with WASM fallback",
      "Lossless WAV download",
      "Adjustable speaking speed from 0.5x to 1.5x",
      "Offline synthesis after the first run is cached",
    ],
    keywords:
      "text to speech, free tts, ai voice generator, browser tts, offline speech synthesis",
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <StructuredData />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <TtsDemo />
        <Features />
        <HowItWorks />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
