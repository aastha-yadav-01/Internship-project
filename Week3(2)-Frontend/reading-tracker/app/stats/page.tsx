import { items } from "@/lib/data";

export default function StatsPage() {
  const total = items.length;
  const done = items.filter((item) => item.status === "done").length;
  const inProgress = items.filter((item) => item.status === "in-progress").length;
  const want = items.filter((item) => item.status === "want").length;

  const stats = [
    { label: "Total tracked", value: total },
    { label: "Finished", value: done },
    { label: "In progress", value: inProgress },
    { label: "On the list", value: want },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Stats</h1>
      <p className="mt-2 max-w-md text-sm text-ink-soft">
        A quick read on what&apos;s on your shelf right now.
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-sm border border-border bg-card px-4 py-5"
          >
            <dt className="text-sm text-stone">{stat.label}</dt>
            <dd className="mt-2 font-serif text-3xl text-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
