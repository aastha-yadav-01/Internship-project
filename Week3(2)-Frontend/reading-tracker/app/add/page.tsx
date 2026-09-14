import AddItemForm from "./add-item-form";

export default function AddPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Add to your shelf</h1>
      <p className="mt-2 max-w-md text-sm text-ink-soft">
        This form is a placeholder for now — saving will connect to real
        storage in a later phase.
      </p>

      <AddItemForm />
    </div>
  );
}
