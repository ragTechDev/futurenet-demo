import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#dcefc8] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="mb-4 flex w-full max-w-sm items-center justify-between text-[10px] font-medium text-slate-700">
          <Link href="/" className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900">
            <span aria-hidden>←</span>
            <span>Back to FutureNet home</span>
          </Link>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Demo lock screen
          </span>
        </div>

        <div className="mb-4 text-center text-xs font-medium uppercase tracking-[0.22em] text-slate-600">
          FutureNet · Kid phone demo
        </div>

        <Link
          href="/demo/home"
          className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#dcefc8]"
        >
          <div className="relative flex items-center justify-center">
            <svg
              aria-hidden
              className="h-[520px] w-full max-w-xs drop-shadow-xl"
              viewBox="0 0 260 420"
              xmlns="http://www.w3.org/2000/svg"
           >
              <defs>
                <linearGradient id="phoneBody" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f3ccd7" />
                  <stop offset="100%" stopColor="#cededb" />
                </linearGradient>
              </defs>

              <rect
                x="8"
                y="8"
                width="250"
                height="410"
                rx="42"
                fill="url(#phoneBody)"
              />

              <rect x="34" y="60" width="200" height="340" rx="28" fill="#f9fafb" />

              <rect x="120" y="26" width="40" height="6" rx="3" fill="#e5e7eb" />
              <circle cx="110" cy="29" r="4" fill="#e5e7eb" />

              <rect x="120" y="430" width="28" height="6" rx="3" fill="#e5e7eb" />

              <g>
                <text
                  x="135"
                  y="110"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                  style={{ letterSpacing: "0.22em", textTransform: "uppercase" }}
                >
                  LOCKED
                </text>
                <text
                  x="135"
                  y="138"
                  textAnchor="middle"
                  fontSize="32"
                  fill="#0f172a"
                  fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                >
                  09:24
                </text>
                <text
                  x="135"
                  y="160"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                >
                  Friday · FutureNet Kids
                </text>

                {Array.from({ length: 4 }).map((_, row) => (
                  <g key={row}>
                    {Array.from({ length: 3 }).map((__, col) => (
                      <circle
                        key={`${row}-${col}`}
                        cx={100 + col * 35}
                        cy={200 + row * 26}
                        r={5}
                        fill="#e5e7eb"
                      />
                    ))}
                  </g>
                ))}

                <text
                  x="135"
                  y="320"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#64748b"
                >
                  Tap to unlock and open home
                </text>
              </g>

              <g>
                <rect x="70" y="350" width="50" height="18" rx="9" fill="#d1fae5" />
                <rect x="150" y="350" width="50" height="18" rx="9" fill="#fee2e2" />
              </g>
            </svg>

            <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-6">
              <div className="flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-medium text-white opacity-0 shadow-sm transition group-hover:opacity-100">
                <span>Tap to see demo home screen</span>
              </div>
            </div>
          </div>
        </Link>

        <p className="mt-4 max-w-xs text-center text-xs text-slate-700">
          This lock screen mock is a starting point for a kid-first keitai UI.
          Tap the phone to jump into the prototype home launcher.
        </p>
      </div>
    </main>
  );
}
