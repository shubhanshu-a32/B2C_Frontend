export default function Pagination({ page, pages, onPageChange }) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Prev
      </button>

      <span className="px-3 py-1">{page} / {pages}</span>

      <button
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}