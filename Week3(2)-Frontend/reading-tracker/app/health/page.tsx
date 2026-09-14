// Rendered at request time so this reflects the live status of the
// upstream API rather than being baked in at build time.
export const dynamic = "force-dynamic";

type HealthResult = {
  ok: boolean;
  detail: string;
  checkedAt: string;
};

async function checkOpenLibrary(): Promise<HealthResult> {
  const checkedAt = new Date().toISOString();
  try {
    const res = await fetch(
      "https://openlibrary.org/subjects/fiction.json?limit=1",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return {
        ok: false,
        detail: `Open Library responded with status ${res.status}.`,
        checkedAt,
      };
    }

    const data = await res.json();
    const workCount = typeof data.work_count === "number" ? data.work_count : null;

    return {
      ok: true,
      detail:
        workCount !== null
          ? `Open Library reachable — ${workCount.toLocaleString()} fiction works indexed.`
          : "Open Library reachable.",
      checkedAt,
    };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "Unknown fetch error.",
      checkedAt,
    };
  }
}

export default async function HealthPage() {
  const result = await checkOpenLibrary();

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">System status</h1>
      <p className="mt-2 max-w-md text-sm text-ink-soft">
        Confirms the app can reach an external data source at request time.
      </p>

      <div className="mt-8 flex items-start gap-3 rounded-sm border border-border bg-card px-5 py-4">
        <span
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
            result.ok ? "bg-shelf" : "bg-stamp"
          }`}
          aria-hidden
        />
        <div>
          <p className="text-ink">{result.ok ? "Healthy" : "Unreachable"}</p>
          <p className="mt-1 text-sm text-ink-soft">{result.detail}</p>
          <p className="mt-2 text-xs text-stone">Checked {result.checkedAt}</p>
        </div>
      </div>
    </div>
  );
}
