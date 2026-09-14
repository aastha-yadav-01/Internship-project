import Link from "next/link";
import { items, kindLabel, statusLabel, type ItemStatus } from "@/lib/data";

const statusAccent: Record<ItemStatus, string> = {
  want: "bg-stone",
  "in-progress": "bg-stamp",
  done: "bg-shelf",
};

export default function ShelfPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Your shelf</h1>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          Everything you&apos;re reading, watching, or meaning to get to.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/item/${item.id}`}
              className="group relative flex flex-col gap-2 rounded-sm border border-border bg-card px-5 py-4 transition-colors hover:border-stamp/40 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span
                className={`absolute left-0 top-0 h-full w-1 rounded-l-sm ${statusAccent[item.status]}`}
                aria-hidden
              />
              <div className="pl-2">
                <p className="font-serif text-lg text-ink group-hover:text-stamp">
                  {item.title}
                </p>
                <p className="text-sm text-ink-soft">
                  {item.creator} · {kindLabel(item.kind)}
                </p>
              </div>
              <div className="pl-2 text-sm text-stone sm:shrink-0 sm:text-right">
                <p>{statusLabel(item.status)}</p>
                <p>{item.progress}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
