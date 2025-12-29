import Grocery from '../assets/hero_section/groceries1.jpeg';
import Electronics from '../assets/hero_section/electronics.jpeg';
import Fashion from '../assets/hero_section/fashion.jpeg'
import Electricals from '../assets/hero_section/electricals.jpeg';
import Home_Kitchen from '../assets/hero_section/home_kitchen.jpeg';
import Daily_needs from '../assets/hero_section/daily_needs.jpeg';

export const CATEGORIES = [
  {
    id: "fashion",
    title: "Fashion",
    image: Fashion,
    subs: [
      { id: "clothing", title: "Clothing" },
      { id: "footwear", title: "Footwear" },
    ],
  },
  {
    id: "electronics",
    title: "Electronics",
    image: Electronics,
    subs: [
      { id: "mobiles", title: "Mobile Phones" },
      { id: "laptops", title: "Laptops" },
      { id: "smart-tv", title: "Smart TVs" },
    ],
  },
  {
    id: "electricals",
    title: "Electricals",
    image: Electricals,
    subs: [
      {id: "lights", title: "Lights"},
      {id: "wires", title: "Wires"},
    ],
  },
  {
    id: "home-kitchen",
    title: "Home and Kitchen",
    image: Home_Kitchen,
    subs: [
      {id: "furniture", title: "Furniture"},
      {id: "kitchen-equipments", title: "Kitchen-Equipments"},
    ], 
  },
  {
    id: "food-grocery",
    title: "Food & Grocery",
    image: Grocery,
    subs: [
      {id: "fruits", title: "Fruits"},
      {id: "vegetables", title: "Vegetables"},
    ],
  },
  {
    id: "daily-needs",
    title: "Daily Needs",
    image: Daily_needs,
    subs: [
      {id: "bread", title: "Breads"},
      {id: "milk", title: "Milk"},
      {id: "egg", title: "Egg"},
      {id: "butter", title: "Butter"},
    ],
  },
];