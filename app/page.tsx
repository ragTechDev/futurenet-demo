import Link from "next/link";
import Overlay from "./ui/Overlay";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#dcefc8] font-sans text-slate-900">
      <Overlay variant="kids" absolute />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col px-4 py-4 sm:px-6 sm:py-6">
        <header className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-[#cededb] backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase tracking-[0.16em] text-slate-900">
              🍀🌐🧸🎗️FutureNet
            </span>
            <span className="text-xs font-semibold text-slate-800">
              Safe digital first steps
            </span>
          </div>
          <nav className="flex flex-wrap justify-end gap-2 text-[11px] font-medium text-slate-900">
            <Link
              href="/pitch-deck"
              className="rounded-full bg-[#cededb] px-3 py-1 hover:bg-[#b8cbc7]"
            >
              Pitch deck
            </Link>
            <Link
              href="/demo"
              className="rounded-full bg-[#f3ccd7] px-3 py-1 hover:bg-[#e7b3c3]"
            >
              Demo
            </Link>
            <Link
              href="/team"
              className="rounded-full bg-white px-3 py-1 ring-1 ring-[#cededb] hover:bg-slate-50"
            >
              Our team
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-white px-3 py-1 ring-1 ring-[#f3ccd7] hover:bg-slate-50"
            >
              Contact
            </Link>
          </nav>
        </header>

        <main className="mt-8 flex flex-1 flex-col gap-10 pb-10">
          <section className="rounded-3xl bg-white/90 p-6 shadow-sm ring-1 ring-[#cededb] backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-900">
              👐 Public benefit project
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-900">
              🤍 A calm, secure digital world for children online.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-900">
              FutureNet is a public benefit initiative to design a safe and secure
              digital experience for children in their early developmental years.
              We explore both the device in their hands and the network around
              them.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-[#dcefc8] p-4 ring-1 ring-[#cededb]">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900">
                  1. 👧 Kid-first smartphone UI 📱
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-900">
                  A web-based demo of a mobile interface inspired by Japan
                  Docomo&apos;s kids&apos; keitai: simple, guided, and age-aware.
                </p>
              </div>
              <div className="rounded-2xl bg-[#cededb] p-4 ring-1 ring-[#f3ccd7]">
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900">
                  2. 🔒 Secured kids&apos; network 🌐
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  A demo of an internet environment isolated from today&apos;s
                  public web, curated for safety, learning, and gentle
                  exploration.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-full bg-[#f3ccd7] px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-[#e7b3c3]"
              >
                See the web UI demo
              </Link>
              <Link
                href="/pitch-deck"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-800 ring-1 ring-[#cededb] hover:bg-slate-50"
              >
                View the pitch deck 
              </Link>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-[#cededb]">
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                Built for small hands, with big safeguards.
              </h2>
              <p className="text-xs leading-relaxed text-slate-900">
                We draw from child development research, humane tech principles,
                and best practices in online safety to imagine what a truly
                child-appropriate digital environment could look like.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-900">
              <div className="rounded-2xl bg-[#dcefc8] px-3 py-3 ring-1 ring-[#cededb]">
                <p className="font-semibold text-slate-900">🤍 Calm by design</p>
                <p className="mt-1 leading-relaxed">
                  Minimal interfaces, gentle motion, and fewer choices to
                  support focus and reduce anxiety.
                </p>
              </div>
              <div className="rounded-2xl bg-[#f3ccd7] px-3 py-3 ring-1 ring-[#cededb]">
                <p className="font-semibold text-slate-900">🛩️ Playful, not addictive</p>
                <p className="mt-1 leading-relaxed">
                  Designed for exploration and creativity rather than endless
                  scrolling or dark patterns.
                </p>
              </div>
              <div className="rounded-2xl bg-[#cededb] px-3 py-3 ring-1 ring-[#f3ccd7]">
                <p className="font-semibold text-slate-900">🎗️Network boundaries</p>
                <p className="mt-1 leading-relaxed">
                  A separate, secured network that treats safety as a default,
                  not an add-on.
                </p>
              </div>
              <div className="rounded-2xl bg-white px-3 py-3 ring-1 ring-[#cededb]">
                <p className="font-semibold text-slate-900">👐 Public benefit</p>
                <p className="mt-1 leading-relaxed">
                  FutureNet is mission-driven, exploring what infrastructure for
                  children-first digital spaces could be.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-[#cededb]">
            <div className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                Meet the project & stay in touch
              </h2>
              <p className="text-xs leading-relaxed text-slate-900">
                Learn more about the people behind FutureNet, share feedback, or
                explore collaborations.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <Link
                href="/team"
                className="inline-flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-xs font-medium text-slate-800 ring-1 ring-[#cededb] hover:bg-slate-50"
              >
                <span>Our team</span>
                <span className="text-[10px] text-slate-500">Research, design & infra</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-between rounded-2xl bg-[#f3ccd7] px-4 py-3 text-xs font-semibold text-slate-800 shadow-sm hover:bg-[#e7b3c3]"
              >
                <span>Contact us</span>
                <span className="text-[10px] opacity-90">
                  Introductions, partnerships, pilots
                </span>
              </Link>
            </div>
          </section>
        </main>

        <footer className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
          <span>© {new Date().getFullYear()} FutureNet · Public benefit project</span>
          <div className="flex gap-2">
            <Link href="/pitch-deck" className="hover:text-slate-700">
              Pitch deck
            </Link>
            <Link href="/contact" className="hover:text-slate-700">
              Contact
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
