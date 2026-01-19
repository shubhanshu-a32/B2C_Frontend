import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(() => {
        try {
            const saved = localStorage.getItem('userLocation');
            return saved ? JSON.parse(saved) : { area: "Katni", pincode: "483501", district: "Katni", state: "Madhya Pradesh" };
        } catch (e) {
            // console.error("Failed to parse userLocation", e);
            localStorage.removeItem('userLocation');
            return { area: "Katni", pincode: "483501", district: "Katni", state: "Madhya Pradesh" };
        }
    });

    useEffect(() => {
        if (location) {
            localStorage.setItem('userLocation', JSON.stringify(location));
        } else {
            localStorage.removeItem('userLocation');
        }
    }, [location]);

    const updateLocation = (newLocation) => {
        setLocation(newLocation);
    };

    const clearLocation = () => {
        setLocation(null);
    };

    return (
        <LocationContext.Provider value={{ location, updateLocation, clearLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
