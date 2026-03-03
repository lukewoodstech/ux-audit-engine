import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-10 bg-white px-8 py-16 text-center dark:bg-black sm:items-start sm:text-left">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
            AI UX Audit Engine
          </p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-zinc-50">
            Turn product screenshots into actionable UX audit reports.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            Upload a single page screenshot and get a structured UX review grounded in
            Nielsen&apos;s heuristics and accessibility best practices. No setup or
            instrumentation required.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm font-medium sm:flex-row">
          <Link
            href="/audits/new"
            className="flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Run a UX audit
          </Link>
          <div className="flex items-center justify-center text-xs text-zinc-600 dark:text-zinc-400">
            Screenshot-only MVP · No login required
          </div>
        </div>
      </main>
    </div>
  );
}
