import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { PitchClient } from "./PitchClient";

function getSlides() {
  const filePath = path.join(
    process.cwd(),
    "presentations",
    "futurenet-pitch",
    "slides.md",
  );

  let raw = "";
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return ["# FutureNet Pitch Deck\nSlides file not found."];
  }

  return raw
    .split(/^---$/m)
    .map((slide) => slide.trim())
    .filter((slide) => slide.length > 0);
}

export default function PitchPage() {
  const slides = getSlides();

  return (
    <main className="min-h-screen bg-[#dcefc8] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full flex-col px-4 py-6 sm:max-w-3xl sm:px-6 sm:py-8">
        <section className="mx-auto w-full overflow-hidden bg-transparent p-0 sm:rounded-3xl sm:bg-white/90 sm:p-5 sm:shadow-sm sm:ring-1 sm:ring-[#cededb]">
          <div className="mb-3 flex w-full items-center justify-between text-[10px] font-medium text-slate-700">
            <Link href="/" className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900">
              <span aria-hidden>←</span>
              <span>Back to FutureNet home</span>
            </Link>
          </div>

          <header className="mb-4 flex flex-col gap-1 text-sm">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
              FutureNet
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Pitch deck</h1>
            <p className="text-xs leading-relaxed text-slate-600">
              Slide-by-slide view of the FutureNet public benefit project. Use
              arrow keys or on-screen controls to navigate.
            </p>
          </header>

          <div className="mt-3 rounded-2xl bg-[#cededb]/10 p-2 overflow-hidden">
            <div
              className="w-full"
              style={{ aspectRatio: "16 / 9" }}
            >
              <PitchClient slides={slides} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
