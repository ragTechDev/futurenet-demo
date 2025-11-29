import Link from "next/link";

export default function DemoTasksPage() {
  return (
    <main className="min-h-screen bg-[#dcefc8] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center px-4 py-10 sm:max-w-xl">
        <div className="mb-4 flex w-full max-w-sm items-center justify-between text-[10px] font-medium text-slate-700">
          <Link href="/demo" className="inline-flex items-center gap-1 text-slate-700 hover:text-slate-900">
            <span aria-hidden>←</span>
            <span>Back to demo lock screen</span>
          </Link>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Tasks
          </span>
        </div>

        <div className="flex h-[520px] w-full flex-col rounded-3xl bg-white/90 p-4 shadow-lg ring-1 ring-[#cededb] sm:max-w-xs">
          <header className="mb-4 flex items-center justify-between text-xs font-medium text-slate-700">
            <span>09:24</span>
            <div className="flex items-center gap-2">
              <span>Tasks</span>
              <Link
                href="/demo/home"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dcfce7] text-[10px] font-semibold text-slate-800 hover:bg-[#bbf7d0]"
                aria-label="Close and go back to home"
              >
                ×
              </Link>
            </div>
          </header>
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-sm">
            <div className="text-center text-xs uppercase tracking-[0.18em] text-slate-500">
              Launcher
            </div>
            <h1 className="text-base font-semibold text-slate-900">Tasks</h1>
            <p className="px-4 text-center text-xs text-slate-600">
              A simple launcher-style task list where FutureNet can gently
              scaffold routines, chores, or learning goals.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
