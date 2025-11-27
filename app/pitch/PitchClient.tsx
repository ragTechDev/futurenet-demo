"use client";

import { useEffect, useState } from "react";

type PitchClientProps = {
  slides: string[];
};

type SlideProps = {
  content: string;
};

function Slide({ content }: SlideProps) {
  const lines = content.split(/\r?\n/).map((line) => line.trim());

  const titleLines: string[] = [];
  const subtitleLines: string[] = [];
  const bodyLines: string[] = [];

  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("#")) {
      const text = line.replace(/^#+\s*/, "");
      if (titleLines.length === 0) {
        titleLines.push(text);
      } else if (subtitleLines.length === 0) {
        subtitleLines.push(text);
      } else {
        bodyLines.push(text);
      }
    } else {
      bodyLines.push(line);
    }
  }

  return (
    <section className="flex h-full w-full items-center justify-center px-4 py-10 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {titleLines.length > 0 && (
          <h1
            className="font-semibold tracking-tight"
            style={{ fontSize: "clamp(0.8rem, 2.2vw, 2.3rem)" }}
          >
            {titleLines.join(" ")}
          </h1>
        )}
        {subtitleLines.length > 0 && (
          <h2
            className="font-medium text-zinc-200"
            style={{ fontSize: "clamp(0.6rem, 1.8vw, 1.5rem)" }}
          >
            {subtitleLines.join(" ")}
          </h2>
        )}
        {bodyLines.length > 0 && (
          <div
            className="mt-2 space-y-2 leading-relaxed text-zinc-100"
            style={{ fontSize: "clamp(0.5rem, 1.3vw, 1.0rem)" }}
          >
            {bodyLines.map((line, index) => {
              if (line.startsWith("- ")) {
                return (
                  <ul key={index} className="list-disc pl-5">
                    <li>{line.replace(/^-\s+/, "")}</li>
                  </ul>
                );
              }
              return <p key={index}>{line}</p>;
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export function PitchClient({ slides }: PitchClientProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        setIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        setIndex((prev) => Math.max(prev - 1, 0));
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slides.length]);

  const goPrev = () => setIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () => setIndex((prev) => Math.min(prev + 1, slides.length - 1));

  return (
    <div className="flex h-full w-full flex-col bg-black text-white">
      <main className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0">
          <Slide content={slides[index]} />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-end justify-end pb-2 pr-2 sm:pb-3 sm:pr-3">
          <div className="flex gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={goPrev}
              disabled={index === 0}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-[10px] text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 sm:h-8 sm:w-8"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={index === slides.length - 1}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-black/70 text-[10px] text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 sm:h-8 sm:w-8"
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
