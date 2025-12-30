"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import InlineSvg from "./InlineSvg";

export default function Doodle({
  className,
  delayMs,
  src,
}: {
  className: string;
  delayMs: number;
  src: string;
}) {
  const style = useMemo(() => {
    return { "--delay": `${delayMs}ms` } as CSSProperties & { "--delay": string };
  }, [delayMs]);

  return (
    <div className={className} style={style}>
      <InlineSvg src={src} />
    </div>
  );
}
