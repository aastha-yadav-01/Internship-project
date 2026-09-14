export type ItemStatus = "want" | "in-progress" | "done";
export type ItemKind = "book" | "show" | "movie";

export type TrackedItem = {
  id: string;
  title: string;
  creator: string; // author or director/studio
  kind: ItemKind;
  status: ItemStatus;
  progress: string; // e.g. "Chapter 12", "S2E4", "—"
  notes: string;
  addedOn: string; // ISO date
};

// Static placeholder data for the Foundations phase.
// Swap for a real database in a later phase.
export const items: TrackedItem[] = [
  {
    id: "piranesi",
    title: "Piranesi",
    creator: "Susanna Clarke",
    kind: "book",
    status: "in-progress",
    progress: "Chapter 9",
    notes: "Started for the atmosphere, staying for the mystery.",
    addedOn: "2026-08-02",
  },
  {
    id: "severance",
    title: "Severance",
    creator: "Apple TV+",
    kind: "show",
    status: "in-progress",
    progress: "S2E7",
    notes: "Watching an episode a night, no spoilers please.",
    addedOn: "2026-07-20",
  },
  {
    id: "the-fall",
    title: "The Fall",
    creator: "dir. Tarsem Singh",
    kind: "movie",
    status: "want",
    progress: "—",
    notes: "Recommended twice this month, taking it as a sign.",
    addedOn: "2026-09-01",
  },
  {
    id: "the-employees",
    title: "The Employees",
    creator: "Olga Ravn",
    kind: "book",
    status: "done",
    progress: "Finished",
    notes: "Short, strange, stuck with me for weeks.",
    addedOn: "2026-06-14",
  },
  {
    id: "past-lives",
    title: "Past Lives",
    creator: "dir. Celine Song",
    kind: "movie",
    status: "done",
    progress: "Finished",
    notes: "Rewatch candidate.",
    addedOn: "2026-05-30",
  },
];

export function getItem(id: string): TrackedItem | undefined {
  return items.find((item) => item.id === id);
}

export function statusLabel(status: ItemStatus): string {
  switch (status) {
    case "want":
      return "Want to start";
    case "in-progress":
      return "In progress";
    case "done":
      return "Finished";
  }
}

export function kindLabel(kind: ItemKind): string {
  switch (kind) {
    case "book":
      return "Book";
    case "show":
      return "Show";
    case "movie":
      return "Movie";
  }
}
