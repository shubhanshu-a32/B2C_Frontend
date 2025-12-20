import { useEffect, useState } from "react";
import fashion from "../assets/hero_section/fashion.jpeg"
import electronics from "../assets/hero_section/electronics.jpeg";
import electricals from "../assets/hero_section/electricals.jpeg";
import home_kitchen from "../assets/hero_section/home_kitchen.jpeg";
import groceries from "../assets/hero_section/groceries.jpeg";
import daily_needs from "../assets/hero_section/daily_needs.jpeg";

const SLIDES = [
  fashion,
  electronics,
  electricals,
  home_kitchen,
  groceries,
  daily_needs,
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[380px] overflow-hidden">
      {SLIDES.map((img, i) => (
        <img
          key={i}
          src={img}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}
    </div>
  );
}
//           className={`absolute inset-0 w-full h-full object-contain bg-gray-100 dark:bg-gray-800 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"
