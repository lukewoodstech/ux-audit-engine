"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewAuditPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Please upload a screenshot to run an audit.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/audit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error || "Failed to run audit");
      }

      const data = (await response.json()) as { auditId: string };

      router.push(`/audits/${data.auditId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong running the audit.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            New AI UX Audit
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Upload a single page screenshot. We&apos;ll run a heuristic and accessibility
            review and generate a structured UX audit report.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="screenshot"
              className="block text-sm font-medium text-zinc-800 dark:text-zinc-200"
            >
              Screenshot
            </label>
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              <input
                id="screenshot"
                name="screenshot"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const selected = event.target.files?.[0] ?? null;
                  setFile(selected);
                  setError(null);
                }}
                className="block w-full text-sm text-zinc-900 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-50 hover:file:bg-zinc-800 dark:text-zinc-100 dark:file:bg-zinc-100 dark:file:text-zinc-950 dark:hover:file:bg-zinc-200"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-500">
                PNG or JPEG, ideally 1440px wide desktop or mobile viewport screenshots.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? "Running audit..." : "Run audit"}
          </button>
        </form>
      </div>
    </div>
  );
}

