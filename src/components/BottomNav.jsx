import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const [opacity, setOpacity] = useState(0.5);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setOpacity(1);
        return;
      }
      // Goes from 0.5 opacity at top to 1.0 at bottom
      const ratio = scrollY / maxScroll;
      setOpacity(0.5 + ratio * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 w-full flex justify-center transition-opacity duration-200"
      style={{ opacity }}
    >
      <div className="relative w-full max-w-sm">
        <img src="/images/bottom-nav.svg" className="w-full" />

        <div className="absolute inset-0 flex justify-between items-end px-8 pb-3 text-xs">

          <Link to="/home" className="flex flex-col items-center group">
            <img src="/icons/homeicon.svg" className="w-5 h-5 mb-1 opacity-60 group-hover:opacity-100 group-hover:drop-shadow-[0_0_6px_#D5FF00]" />
            <span className="text-gray-400 group-hover:text-[#D5FF00]">Home</span>
          </Link>

          <Link to="/categories" className="flex flex-col items-center group">
            <img src="/icons/categoryicon.svg" className="w-5 h-5 mb-1 opacity-60 group-hover:opacity-100 group-hover:drop-shadow-[0_0_6px_#D5FF00]" />
            <span className="text-gray-400 group-hover:text-[#D5FF00]">Categories</span>
          </Link>

          <div className="w-10" />

          <Link to="/wishlist" className="flex flex-col items-center text-gray-400">
            <img src="/icons/wishlisticon.svg" className="w-5 h-5 mb-1" />
            <span>Wishlist</span>
          </Link>

          <Link to="/profile" className="flex flex-col items-center text-gray-400">
            <img src="/icons/profileicon.svg" className="w-5 h-5 mb-1" />
            <span>Profile</span>
          </Link>

        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -top-[-7px]">
          <img src="/icons/framelogo.svg" className="w-[55px] h-[55px]" />
        </div>

      </div>
    </div>
  );
}