import Link from "next/link";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AuditsIndexPage() {
  const supabase = createServiceSupabaseClient();

  const { data: audits } = await supabase
    .from("audits")
    .select("id, input_type, status, summary, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
              AI UX Audit Engine
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Past audits
            </h1>
          </div>
          <Link
            href="/audits/new"
            className="flex h-9 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            + New audit
          </Link>
        </div>

        {!audits || audits.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No audits yet.{" "}
              <Link
                href="/audits/new"
                className="font-medium text-zinc-950 underline-offset-2 hover:underline dark:text-zinc-50"
              >
                Run your first audit.
              </Link>
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {audits.map((audit) => (
              <li key={audit.id}>
                <Link
                  href={`/audits/${audit.id}`}
                  className="group flex flex-col gap-2 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-zinc-200 transition hover:ring-zinc-400 dark:bg-zinc-950 dark:ring-zinc-800 dark:hover:ring-zinc-600 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-medium text-zinc-950 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                      {audit.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 font-medium uppercase dark:bg-zinc-800">
                        {audit.input_type}
                      </span>
                      <span>
                        {new Date(audit.created_at as string).toLocaleString(
                          undefined,
                          { dateStyle: "medium", timeStyle: "short" },
                        )}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 self-start rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    {audit.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
