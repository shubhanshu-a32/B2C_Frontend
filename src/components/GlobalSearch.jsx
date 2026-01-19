import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useCategoryStore from "../store/categoryStore";

export default function GlobalSearch() {
    const navigate = useNavigate();
    const location = useLocation();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const [mobileActive, setMobileActive] = useState(false);

    // Close mobile search on navigation
    useEffect(() => {
        setMobileActive(false);
    }, [location.pathname, location.search]);

    const handleSearch = (term) => {
        if (!term.trim()) return;
        navigate(`/shop?q=${encodeURIComponent(term)}`);
        setQuery("");
        setSuggestions([]);
        setMobileActive(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        const term = value.toLowerCase();
        const matches = [];

        categories.forEach((c) => {
            if (c.name.toLowerCase().includes(term)) {
                matches.push({ type: 'category', title: c.name, id: c.slug });
            }
            if (c.subCategories) {
                c.subCategories.forEach(s => {
                    if (s.name.toLowerCase().includes(term)) {
                        matches.push({ type: 'subcategory', title: s.name, id: s.slug, catId: c.slug });
                    }
                });
            }
        });

        setSuggestions(matches.slice(0, 8));
    };

    const handleSuggestionClick = (s) => {
        if (s.type === 'category') {
            navigate("/shop", { state: { category: s.id } });
        } else if (s.type === 'subcategory') {
            navigate("/shop", { state: { category: s.catId, subcategory: s.id } });
        } else {
            navigate(`/shop?q=${encodeURIComponent(s.title)}`);
        }
        setQuery("");
        setSuggestions([]);
        setMobileActive(false);
    };

    return (
        <div className="relative w-auto md:flex-1 md:w-auto max-w-xl sm:px-6 mx-auto group mx-4 md:mx-auto">

            {/* Mobile Search Trigger Icon */}
            {!mobileActive && (
                <button
                    onClick={() => setMobileActive(true)}
                    className="md:hidden p-2 text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            )}

            {/* Search Input Container - Desktop & Mobile Expanded */}
            <div className={`
                items-center bg-gray-100 dark:bg-gray-700 rounded-lg transition-all
                ${mobileActive
                    ? 'flex fixed top-0 left-0 right-0 z-[60] h-[60px] px-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-lg'
                    : 'hidden md:flex border border-transparent focus-within:border-blue-500'
                }
            `}>
                {/* Back Button for Mobile */}
                {mobileActive && (
                    <button onClick={() => setMobileActive(false)} className="mr-3 text-gray-500 dark:text-gray-300">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {!mobileActive && (
                    <svg className="w-5 h-5 ml-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}

                <input
                    type="text"
                    name="q"
                    id="search-input"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                    placeholder="Search for products, categories..."
                    className="w-full bg-transparent outline-none border-none focus:ring-0 px-3 py-2 text-gray-800 dark:text-gray-200 placeholder-gray-500"
                    autoFocus={mobileActive}
                />

                {query && (
                    <button onClick={() => { setQuery(""); setSuggestions([]); }} className="p-2 text-gray-500 hover:text-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && query && (
                <div className={`
                    bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 overflow-hidden z-[60]
                    ${mobileActive
                        ? 'fixed top-[60px] left-0 right-0 h-[calc(100vh-60px)] rounded-none overflow-y-auto'
                        : 'absolute top-full left-0 right-0 mt-1'
                    }
                `}>
                    {suggestions.map((s, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSuggestionClick(s)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between group/item border-b dark:border-gray-700 last:border-none"
                        >
                            <span className="text-gray-700 dark:text-gray-200">{s.title}</span>
                            <span className="text-xs text-gray-400 uppercase">{s.type}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay for Mobile Search */}
            {mobileActive && (
                <div className="fixed inset-0 bg-black/50 z-[50] md:hidden" onClick={() => setMobileActive(false)} />
            )}
        </div>
    );
}
