import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function LocationPopup({ isOpen, onClose, onSave }) {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            api.get("/location")
                .then(res => {
                    setLocations(res.data);
                    setFilteredLocations(res.data);
                })
                .catch(err => {
                    console.error(err);
                    toast.error("Failed to load locations");
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    useEffect(() => {
        if (!searchText) {
            setFilteredLocations(locations);
            return;
        }
        const lower = searchText.toLowerCase();
        const filtered = locations.filter(l =>
            l.area.toLowerCase().includes(lower) ||
            l.pincode.toString().includes(lower)
        );
        setFilteredLocations(filtered);
    }, [searchText, locations]);

    if (!isOpen) return null;

    const handleSelect = (loc) => {
        onClose();
        onSave({ pincode: loc.pincode, area: loc.area });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 transform transition-all scale-100 flex flex-col max-h-[80vh]">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Select Location
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Search or select your area.</p>

                <input
                    type="text"
                    placeholder="Search area or pincode..."
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 mb-2"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <div className="flex-1 overflow-y-auto space-y-1 mb-4 border rounded p-2 bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 max-h-60">
                    {loading ? (
                        <div className="text-center py-4 text-gray-500">Loading locations...</div>
                    ) : filteredLocations.length > 0 ? (
                        filteredLocations.map(loc => (
                            <button
                                key={loc._id}
                                onClick={() => handleSelect(loc)}
                                className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 rounded transition flex justify-between items-center group border-b border-gray-50 dark:border-gray-800 last:border-0"
                            >
                                <span className="font-medium text-gray-700 dark:text-gray-200">{loc.area}</span>
                                <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded group-hover:bg-white">{loc.pincode}</span>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">No locations found.</div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>

            </div>
        </div>
    );
}
