import { useEffect, useState } from "react";
import fashion from "../assets/hero_section/fashion.jpeg"
import electronics from "../assets/hero_section/electronics.jpeg";
import electricals from "../assets/hero_section/electricals.jpeg";
import home_kitchen from "../assets/hero_section/home_kitchen.jpeg";
import groceries from "../assets/hero_section/groceries1.jpeg";
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
    <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl shadow-md group">
      {SLIDES.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}

      {/* Optional: Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
