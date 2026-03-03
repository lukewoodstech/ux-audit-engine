import { notFound } from "next/navigation";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

type AuditPageProps = {
  params: { id: string };
};

function severityLabel(severity: number) {
  switch (severity) {
    case 3:
      return "P0 – Critical";
    case 2:
      return "P1 – Major";
    case 1:
      return "P2 – Moderate";
    default:
      return "P3 – Minor";
  }
}

function severityBadgeClass(severity: number) {
  switch (severity) {
    case 3:
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200";
    case 2:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200";
    case 1:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
  }
}

export default async function AuditDetailPage({ params }: AuditPageProps) {
  const supabase = createServiceSupabaseClient();

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("*")
    .eq("id", params.id)
    .single();

  if (auditError || !audit) {
    notFound();
  }

  const { data: items } = await supabase
    .from("audit_items")
    .select("*")
    .eq("audit_id", params.id)
    .order("severity", { ascending: false });

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-500">
            AI UX Audit
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Screenshot review
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Input type: <span className="font-medium">{audit.input_type}</span>{" "}
            ·{" "}
            <span>
              Created{" "}
              {new Date(audit.created_at as string).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </p>
        </header>

        <section className="grid gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800 md:grid-cols-[2fr,1fr]">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400">
              Executive summary
            </h2>
            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {audit.summary}
            </p>
          </div>

          <div className="space-y-4 border-t border-zinc-200 pt-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                Status
              </h3>
              <p className="mt-1 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                {audit.status}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                Storage path
              </h3>
              <p className="mt-1 break-all text-xs text-zinc-500 dark:text-zinc-500">
                {audit.input_image_path}
              </p>
            </div>
          </div>
        </section>

        {items && items.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600 dark:text-zinc-400">
                Top issues
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                Sorted by severity (P0–P3)
              </p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${severityBadgeClass(
                            item.severity as number,
                          )}`}
                        >
                          {severityLabel(item.severity as number)}
                        </span>
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium dark:bg-zinc-800">
                        Effort: <span className="uppercase">{item.effort}</span>
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 font-medium dark:bg-zinc-800">
                        Impact: <span className="uppercase">{item.impact}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 text-sm text-zinc-700 dark:text-zinc-300 md:grid-cols-2">
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
                        Evidence
                      </h4>
                      <p className="leading-relaxed">{item.evidence}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
                        Recommendation
                      </h4>
                      <p className="leading-relaxed">{item.recommendation}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

