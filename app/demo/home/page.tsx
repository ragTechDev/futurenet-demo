import Link from "next/link";

export default function DemoHomePage() {
  return (
    <main className="min-h-screen bg-[#dcefc8] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center px-4 py-10 sm:max-w-xl">
        <div className="mb-4 flex w-full max-w-sm items-center justify-between text-[10px] font-medium text-slate-700">
          <Link href="/demo" className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900">
            <span aria-hidden>←</span>
            <span>Back to demo lock screen</span>
          </Link>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Demo home
          </span>
        </div>

        <div className="flex h-full min-h-[520px] w-full flex-col rounded-3xl bg-white/90 p-4 shadow-lg ring-1 ring-[#cededb] sm:h-[520px] sm:max-w-xs">
          <header className="mb-4 flex items-center justify-between text-xs font-medium text-slate-700">
            <span>09:24</span>
            <span>FutureNet</span>
          </header>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm">
            <div className="text-center text-xs uppercase tracking-[0.18em] text-slate-500">
              Launcher
            </div>
            <h1 className="text-base font-semibold text-slate-900">Home</h1>
            <p className="px-4 text-center text-xs text-slate-600">
              This screen represents the main home view of a kid-first smartphone
              launcher inside FutureNet.
            </p>
          </div>

          <nav className="mt-4 grid grid-cols-4 gap-2 text-[10px]">
            <Link
              href="/demo/emergency"
              className="flex flex-col items-center gap-1 text-xs font-medium text-slate-800 hover:text-slate-900"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fee2e2] text-base" aria-hidden>
                🆘
              </span>
              <span>Emergency</span>
            </Link>
            <Link
              href="/demo/messaging"
              className="flex flex-col items-center gap-1 text-xs font-medium text-slate-800 hover:text-slate-900"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0f2fe] text-base" aria-hidden>
                💬
              </span>
              <span>Messages</span>
            </Link>
            <Link
              href="/demo/tasks"
              className="flex flex-col items-center gap-1 text-xs font-medium text-slate-800 hover:text-slate-900"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dcfce7] text-base" aria-hidden>
                ⭐
              </span>
              <span>Tasks</span>
            </Link>
            <Link
              href="/demo/parent"
              className="flex flex-col items-center gap-1 text-xs font-medium text-slate-800 hover:text-slate-900"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ff] text-base" aria-hidden>
                👨‍👩‍👧
              </span>
              <span>Parent</span>
            </Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
