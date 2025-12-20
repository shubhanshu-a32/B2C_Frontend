export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          border rounded-lg px-3 py-2 outline-none transition
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? "border-red-500" : "border-gray-300"}
        `}
      />

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}