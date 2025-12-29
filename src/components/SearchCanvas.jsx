// src/components/SearchCanvas.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "just-debounce-it"; 
import api from "../services/api"; 

export default function SearchCanvas({ open, setOpen }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("b2c_recent_searches") || "[]");
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ("");
      setSuggestions([]);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    function onClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, setOpen]);

  // Debounced suggestions fetch
  const fetchSuggestions = useRef(
    debounce(async (term) => {
      if (!term) {
        setSuggestions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // If you have a backend suggestions endpoint, replace below with real call
        // const res = await api.get("/products/search-suggestions", { params: { q: term } });
        // setSuggestions(res.data || []);
        // Fallback: client-side mock suggestions using term
        const mocked = [
          `${term} - Best Seller`,
          `${term} - New Arrival`,
          `${term} - Discount`,
          `${term} - Top Rated`,
        ];
        await new Promise((r) => setTimeout(r, 250));
        setSuggestions(mocked);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250)
  ).current;

  useEffect(() => {
    setLoading(false);
    fetchSuggestions(q.trim());
  }, [q, fetchSuggestions]);

  const submit = (e) => {
    e?.preventDefault();
    const term = q.trim();
    if (!term) return;
    const newRecent = [term, ...recent.filter((r) => r !== term)].slice(0, 8);
    setRecent(newRecent);
    localStorage.setItem("b2c_recent_searches", JSON.stringify(newRecent));
    setOpen(false);
    navigate(`/buyer/shop?q=${encodeURIComponent(term)}`);
  };

  const clickSuggestion = (s) => {
    setQ(s);
    setTimeout(() => {
      submit();
    }, 0);
  };

  const clearRecent = () => {
    setRecent([]);
    localStorage.removeItem("b2c_recent_searches");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <div
        ref={wrapperRef}
        className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-800 p-4 rounded shadow"
      >
        <form onSubmit={submit} className="flex gap-2 items-center">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for products, brands or categories..."
            className="flex-1 p-3 border rounded dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
            aria-label="Search products"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setQ("")}
            className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Clear"
          >
            Clear
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            aria-label="Search"
          >
            Search
          </button>
        </form>

        <div className="mt-3">
          {loading && <div className="text-sm text-gray-500 dark:text-gray-300">Loading suggestions...</div>}

          {!loading && suggestions.length > 0 && (
            <div className="grid gap-2 mt-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => clickSuggestion(s)}
                  className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {!loading && suggestions.length === 0 && q.trim().length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-300 mt-2">No suggestions. Press Enter to search.</div>
          )}
        </div>

        {recent.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">Recent searches</h4>
              <button onClick={clearRecent} className="text-sm text-red-500">Clear</button>
            </div>

            <div className="flex gap-2 mt-2 flex-wrap">
              {recent.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => clickSuggestion(r)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}