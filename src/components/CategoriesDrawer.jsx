// src/components/CategoriesDrawer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  {
    id: "fashion",
    title: "FASHION",
    subs: [
      { id: "clothing", title: "Clothing" },
      { id: "footwear", title: "Footwear" },
    ],
  },
  {
    id: "electronics",
    title: "ELECTRONICS",
    subs: [
      { id: "mobile-phones", title: "Mobile Phones" },
      { id: "laptops", title: "Laptops" },
      { id: "smart-televisions", title: "Smart Televisions" },
    ],
  },
  {
    id: "electricals",
    title: "ELECTRICALS",
    subs: [
      { id: "lights", title: "Lights" },
      { id: "wires", title: "Wires" },
    ],
  },
  {
    id: "home-kitchen",
    title: "HOME & KITCHEN",
    subs: [
      { id: "furniture", title: "Furniture" },
      { id: "kitchen-equipments", title: "Kitchen Equipments" },
    ],
  },
  {
    id: "food-grocery",
    title: "FOOD & GROCERY",
    subs: [
      { id: "fruits", title: "Fruits" },
      { id: "vegetables", title: "Vegetables" },
    ],
  },
  {
    id: "daily-needs",
    title: "DAILY NEEDS",
    subs: [
      { id: "bread", title: "Bread" },
      { id: "milk", title: "Milk" },
      { id: "egg", title: "Egg" },
      { id: "butter", title: "Butter" },
    ],
  },
];

export default function CategoriesDrawer({ open, setOpen }) {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  if (!open) return null;

  const goToShop = (category, subcategory) => {
    navigate("/shop", {
      state: { category: category, subcategory: subcategory },
    });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-xl p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            All Categories
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="border-b border-gray-200 dark:border-gray-700 pb-3"
            >
              <button
                onClick={() =>
                  setExpanded(expanded === cat.id ? null : cat.id)
                }
                className="w-full flex items-center justify-between py-2"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {cat.title}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {expanded === cat.id ? "−" : "+"}
                </span>
              </button>

              {/* Subcategories */}
              {expanded === cat.id && (
                <div className="mt-2 pl-3 space-y-1">
                  {cat.subs.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => goToShop(cat.id, sub.id)}
                      className="block w-full text-left py-1 text-gray-700 dark:text-gray-300 hover:text-blue-600"
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
