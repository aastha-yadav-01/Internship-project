"use client";

import { useState } from "react";

export default function AddItemForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="mt-8 flex max-w-md flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label className="flex flex-col gap-1 text-sm text-ink-soft">
        Title
        <input
          type="text"
          name="title"
          placeholder="e.g. The Employees"
          className="rounded-sm border border-border bg-card px-3 py-2 text-ink outline-none focus:border-stamp"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-soft">
        Creator
        <input
          type="text"
          name="creator"
          placeholder="Author, director, or studio"
          className="rounded-sm border border-border bg-card px-3 py-2 text-ink outline-none focus:border-stamp"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ink-soft">
        Kind
        <select
          name="kind"
          className="rounded-sm border border-border bg-card px-3 py-2 text-ink outline-none focus:border-stamp"
        >
          <option value="book">Book</option>
          <option value="show">Show</option>
          <option value="movie">Movie</option>
        </select>
      </label>

      <button
        type="submit"
        className="mt-2 self-start rounded-sm bg-stamp px-4 py-2 text-sm text-[var(--color-page)] transition-opacity hover:opacity-90"
      >
        Save to shelf
      </button>

      {submitted && (
        <p className="text-sm text-shelf">
          Noted — this placeholder doesn&apos;t persist yet.
        </p>
      )}
    </form>
  );
}
