import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import LocationPopup from './LocationPopup';
// Assuming the logo is available or we can use an SVG
// import Logo from '../assets/logo/Ketalog_Logo.jpeg'; 

export default function LocationFilter() {
    const { location, updateLocation, clearLocation } = useLocation();
    const [isPopupOpen, setPopupOpen] = useState(false);

    return (
        <div className="w-full bg-white dark:bg-gray-900 border-b dark:border-gray-700 py-3 px-4 flex items-center justify-center sm:justify-start gap-3 shadow-sm">
            <div
                onClick={() => setPopupOpen(true)}
                className="flex items-center gap-2 cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-600 rounded px-3 py-2 hover:shadow-md transition-shadow group"
                style={{ minWidth: '180px' }}
            >
                {/* Orange Location Icon */}
                <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                <div className="flex flex-col leading-tight">
                    <span className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                        {location ? (location.area === "Katni" ? "Katni" : `${location.area}, ${location.pincode}`) : "Select Location"}
                    </span>
                </div>

                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Optional: Search Bar Placeholder to match the image's layout if desired, 
                but since GlobalSearch is in Navbar, we just keep the location filter clean or add a secondary search trigger if needed. 
                The user asked to "apply the photo... where Select Location is implemented". 
                For now I will keep it focused on the location pill design. 
            */}

            {/* Contextual Text or Clear Button */}
            {location && location.area !== "Katni" && (
                <button
                    onClick={(e) => { e.stopPropagation(); updateLocation({ area: 'Katni', pincode: '483501', district: 'Katni', state: 'Madhya Pradesh' }); }} // Reset to default
                    className="text-xs text-blue-500 hover:text-blue-700 underline"
                >
                    Reset to Default
                </button>
            )}

            <LocationPopup
                isOpen={isPopupOpen}
                onClose={() => setPopupOpen(false)}
                onSave={updateLocation}
            />
        </div>
    );
}
