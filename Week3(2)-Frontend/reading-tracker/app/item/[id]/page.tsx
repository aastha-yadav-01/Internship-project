import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem, kindLabel, statusLabel, items } from "@/lib/data";

export function generateStaticParams() {
  return items.map((item) => ({ id: item.id }));
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <Link href="/" className="text-sm text-stone hover:text-stamp">
        ← Back to shelf
      </Link>

      <div className="mt-6 rounded-sm border border-border bg-card p-6">
        <p className="text-sm text-stone">{kindLabel(item.kind)}</p>
        <h1 className="mt-1 font-serif text-3xl text-ink">{item.title}</h1>
        <p className="mt-1 text-ink-soft">{item.creator}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-stone">Status</dt>
            <dd className="mt-1 text-ink">{statusLabel(item.status)}</dd>
          </div>
          <div>
            <dt className="text-stone">Progress</dt>
            <dd className="mt-1 text-ink">{item.progress}</dd>
          </div>
          <div>
            <dt className="text-stone">Added</dt>
            <dd className="mt-1 text-ink">{item.addedOn}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <p className="text-stone text-sm">Notes</p>
          <p className="mt-1 text-ink-soft">{item.notes}</p>
        </div>
      </div>
    </div>
  );
}
