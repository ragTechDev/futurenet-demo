"use client";

import { useEffect, useState } from "react";

export default function Typewriter({
  text,
  startDelayMs = 450,
  charDelayMs = 22,
  className,
  showCaret,
}: {
  text: string;
  startDelayMs?: number;
  charDelayMs?: number;
  className?: string;
  showCaret?: boolean;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    let interval: number | undefined;
    const startTimer = window.setTimeout(() => {
      let i = 0;
      interval = window.setInterval(() => {
        i += 1;
        setValue(text.slice(0, i));
        if (i >= text.length && interval) window.clearInterval(interval);
      }, charDelayMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startTimer);
      if (interval) window.clearInterval(interval);
    };
  }, [text, startDelayMs, charDelayMs]);

  return (
    <span className={className}>
      {value}
      {showCaret ? <span className="caret" aria-hidden="true" /> : null}
    </span>
  );
}
