export default function CategoryFilter({ selected, onChange }) {
  const categories = ["Fashion", "Grocery", "Furniture"];

  return (
    <div className="flex gap-3 mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-lg border ${
            selected === cat
              ? "bg-blue-600 text-white border-blue-700"
              : "bg-white text-gray-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}