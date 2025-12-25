"use client";

import { useEffect, useState } from "react";

export default function InlineSvg({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch(src);
        const text = await res.text();
        if (!cancelled) setSvg(text);
      } catch {
        if (!cancelled) setSvg("");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [src]);

  return <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}
