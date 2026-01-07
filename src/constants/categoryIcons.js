import {
    Smartphone,
    Shirt,
    ShoppingBag,
    Home,
    Dumbbell,
    BookOpen,
    Baby,
    Palette,
    Package,
    Laptop,
    Watch,
    Footprints,
    Armchair,
    Refrigerator,
    Car,
    HeartPulse,
    Pencil,
    Gift,
    Utensils,
    Monitor,
    Headphones,
    Camera,
    Briefcase,
    Music,
    Wrench,
    Leaf,
    Zap,
    Plug,
    Apple,
    UtensilsCrossed,
    Hammer,
    ShoppingBasket
} from "lucide-react";

export const categoryIcons = {
    "electronics": Smartphone,
    "electricals": Plug,
    "electric": Zap,
    "mobiles": Smartphone,
    "mobile": Smartphone,
    "laptops": Laptop,
    "laptop": Laptop,
    "computers": Monitor,
    "accessories": Watch,
    "watches": Watch,
    "fashion": Shirt,
    "clothing": Shirt,
    "men": Shirt,
    "women": Shirt,
    "footwear": Footprints,
    "shoes": Footprints,
    "home": Home,
    "furniture": Armchair,
    "decor": Home,
    "kitchen": Utensils,
    "appliances": Refrigerator,
    "grocery": ShoppingBag,
    "daily-needs": ShoppingBasket,
    "daily needs": ShoppingBasket,
    "food-grocery": Apple,
    "food": UtensilsCrossed,
    "sports": Dumbbell,
    "fitness": Dumbbell,
    "books": BookOpen,
    "stationery": Pencil,
    "toys": Baby,
    "kids": Baby,
    "baby": Baby,
    "beauty": Palette,
    "makeup": Palette,
    "personal care": HeartPulse,
    "health": HeartPulse,
    "automotive": Car,
    "cars": Car,
    "gifts": Gift,
    "gadgets": Headphones,
    "audio": Headphones,
    "cameras": Camera,
    "photography": Camera,
    "travel": Briefcase,
    "bags": Briefcase,
    "luggage": Briefcase,
    "music": Music,
    "instruments": Music,
    "hardware": Wrench,
    "hardware-diy": Wrench,
    "diy": Wrench,
    "tools": Wrench,
    "garden": Leaf,
    "plants": Leaf
};


// Fallback icons for sub-categories without specific match
const fallbackIcons = [
    Package, Tag, Star, Disc, Layers, Box, Circle, Square,
    Triangle, Hexagon, Heart, Cloud, Sun, Moon, Flag,
    Bookmark, Award, Anchor, Aperture, Archive
];

import {
    Tag, Star, Disc, Layers, Box, Circle, Square,
    Triangle, Hexagon, Heart, Cloud, Sun, Moon, Flag,
    Bookmark, Award, Anchor, Aperture, Archive
} from "lucide-react";

export const DefaultCategoryIcon = Package;

export const getSubCategoryIcon = (subName) => {
    if (!subName) return DefaultCategoryIcon;
    const lower = subName.toLowerCase();

    // 1. Try specific match
    if (categoryIcons[lower]) return categoryIcons[lower];

    // 2. Try partial match
    // e.g. "Gaming Laptops" -> contains "laptop"
    const keys = Object.keys(categoryIcons);
    for (const key of keys) {
        if (lower.includes(key)) return categoryIcons[key];
    }

    // 3. Deterministic Fallback based on string hash
    let hash = 0;
    for (let i = 0; i < subName.length; i++) {
        hash = subName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % fallbackIcons.length;
    return fallbackIcons[index];
};
