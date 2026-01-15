import {
    FcCellPhone,
    FcChargeBattery,
    FcFlashOn,
    FcMultipleDevices,
    FcCloth,
    FcConferenceCall,
    FcBusinesswoman,
    FcDepartment,
    FcHome,
    FcShop,
    FcPaid,
    FcSportsMode,
    FcReading,
    FcEditImage,
    FcBearish,
    FcSelfie,
    FcAutomotive,
    FcBriefcase,
    FcHeadset,
    FcCamera,
    FcGlobe,
    FcMusic,
    FcSupport,
    FcLandscape,
    FcPackage,
    FcRating,
    FcLike,
    FcIdea,
    FcElectricalSensor,
    FcElectricity,
    FcPhoneAndroid,
    FcClock,
    FcPrint,
    FcImageFile,
    FcGoogle,
    FcAndroidOs,
    FcAlarmClock,
    FcKindle
} from "react-icons/fc";

export const categoryIcons = {
    "electronics": FcCellPhone,
    "electricals": FcElectricalSensor,
    "electric": FcElectricity,
    "mobiles": FcPhoneAndroid,
    "mobile": FcPhoneAndroid,
    "laptops": FcMultipleDevices, // Valid alternative
    "laptop": FcMultipleDevices,
    "computers": FcMultipleDevices,
    "accessories": FcHeadset,
    "watches": FcAlarmClock, // Valid alternative
    "fashion": FcCloth,
    "clothing": FcCloth,
    "men": FcConferenceCall,
    "women": FcBusinesswoman,
    "footwear": FcPrint,
    "shoes": FcPrint,
    "home": FcHome,
    "furniture": FcHome, // Valid alternative
    "decor": FcLandscape, // Valid alternative
    "kitchen": FcShop, // Fallback
    "appliances": FcChargeBattery,
    "grocery": FcShop,
    "daily-needs": FcPaid,
    "daily needs": FcPaid,
    "food-grocery": FcShop,
    "food": FcShop, // Fallback
    "sports": FcSportsMode,
    "fitness": FcSportsMode,
    "books": FcReading,
    "stationery": FcEditImage,
    "toys": FcBearish,
    "kids": FcBearish,
    "baby": FcKindle, // Abstract
    "beauty": FcSelfie,
    "makeup": FcSelfie,
    "personal care": FcLike,
    "health": FcLike,
    "automotive": FcAutomotive,
    "cars": FcAutomotive,
    "gifts": FcPackage,
    "gadgets": FcHeadset,
    "audio": FcHeadset,
    "cameras": FcCamera,
    "photography": FcCamera,
    "travel": FcGlobe,
    "bags": FcBriefcase,
    "luggage": FcBriefcase,
    "music": FcMusic,
    "instruments": FcMusic,
    "hardware": FcSupport,
    "hardware-diy": FcSupport,
    "diy": FcSupport,
    "tools": FcSupport,
    "garden": FcLandscape,
    "plants": FcLandscape
};

// No colors needed as Fc icons are colorful
export const categoryColors = {};
export const categoryImages = {};

export const DefaultCategoryIcon = FcPackage;

const fallbackIcons = [
    FcPackage, FcRating, FcLike, FcIdea, FcGoogle, FcAndroidOs
];

export const getSubCategoryIcon = (subName) => {
    if (!subName) return DefaultCategoryIcon;
    const lower = subName.toLowerCase();

    // 1. Try specific match
    if (categoryIcons[lower]) return categoryIcons[lower];

    // 2. Try partial match
    const keys = Object.keys(categoryIcons);
    for (const key of keys) {
        if (lower.includes(key)) return categoryIcons[key];
    }

    // 3. Fallback
    let hash = 0;
    for (let i = 0; i < subName.length; i++) {
        hash = subName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % fallbackIcons.length;
    return fallbackIcons[index];
};
