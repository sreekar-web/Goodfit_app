
import { useNavigate } from "react-router-dom";


export default function Product() {
  const navigate = useNavigate();
  return (
    <div className="bg-black text-white min-h-screen pb-32 flex justify-center">
      <div className="w-full max-w-sm">

        {/* IMAGE SECTION */}
        <div className="relative">

          {/* MAIN IMAGE */}
          <div className="w-full h-[420px] bg-[#111]" />

          {/* BACK BUTTON */}
          <div className="absolute top-4 left-4 z-10">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
              <img src="/icons/ppagearrow.svg" className="w-4 h-4" />
            </div>
          </div>

          {/* TOP RIGHT ICONS */}
          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
              <img src="/icons/shareicon.svg" className="w-4 h-4" />
            </div>
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
              <img src="/icons/heart.svg" className="w-4 h-4" />
            </div>
          </div>

          {/* THUMBNAILS */}
          <div className="absolute bottom-[-35px] left-1/2 -translate-x-1/2 flex gap-3 z-10">
            <div className="w-16 h-20 bg-[#1F1F1F] rounded-lg border border-white/20" />
            <div className="w-16 h-20 bg-[#1F1F1F] rounded-lg border border-white/20" />
            <div className="w-16 h-20 bg-[#1F1F1F] rounded-lg border border-white/20" />
          </div>

        </div>

        {/* DETAILS (IMPORTANT: spacing increased) */}
        <div className="px-4 mt-16 space-y-3">

          <p className="text-[#D5FF00] text-sm font-semibold">
            AURORA COLLECTION
          </p>

          <h1 className="text-xl font-semibold leading-snug">
            New White Block Printed Maxi Dress
          </h1>

          {/* RATING */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#D5FF00] text-black px-2 py-[2px] rounded-full text-xs font-semibold">
              <span>★</span>
              <span>4.95</span>
            </div>
            <span className="text-gray-400 text-sm">(2.4k reviews)</span>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl font-bold">₹1499</span>
            <span className="line-through text-gray-400 text-sm">
              ₹4999
            </span>

            <div className="relative ml-1">
              <img src="/icons/discount.svg" className="h-6" />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black">
                25% Off
              </span>
            </div>
          </div>

        </div>

        {/* SIZE SECTION */}
        <div className="px-4 mt-6">

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Select Size</h2>
            <span className="text-[#D5FF00] text-sm">
              Size Guide →
            </span>
          </div>

          <div className="flex gap-3 flex-wrap">
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border 
                ${size === "M"
                    ? "border-[#D5FF00] text-[#D5FF00]"
                    : "border-gray-500 text-white"
                  }`}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        {/* TRY & BUY */}
        <div className="px-4 mt-6">
          <div className="bg-[#1F1F1F] rounded-xl p-4">
            <p className="font-semibold">Try & Buy Available</p>
            <p className="text-gray-400 text-sm mt-1">
              Try at home before you pay. 30-min trial window.
              No questions asked returns.
            </p>
          </div>
        </div>

        {/* DESCRIPTION + FEATURES */}
        <div className="mt-6 space-y-6 px-4">

          <div>
            <h2 className="text-[#D5FF00] text-lg font-semibold mb-2">
              Description
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              Beautiful handcrafted kurta set made from premium cotton. Perfect for festive occasions and casual wear. Features intricate embroidery work by local artisans.
            </p>
          </div>

          <div>
            <h2 className="text-[#D5FF00] text-lg font-semibold mb-2">
              Unique Features
            </h2>

            <ul className="text-gray-300 text-sm space-y-2 pl-2">
              <li className="flex items-start gap-2">
                <span className="text-[#D5FF00]">•</span>
                100% Cotton Fabric
              </li>

              <li className="flex items-start gap-2">
                <span className="text-[#D5FF00]">•</span>
                Handcrafted Embroidery
              </li>

              <li className="flex items-start gap-2">
                <span className="text-[#D5FF00]">•</span>
                Made in India
              </li>

              <li className="flex items-start gap-2">
                <span className="text-[#D5FF00]">•</span>
                Try & Buy Available
              </li>
            </ul>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-6 mb-24 flex gap-4 px-4">

          <button className="flex-1 border border-[#D5FF00] text-[#D5FF00] py-3 rounded-xl">
            Buy Now
          </button>

          <button onClick={() => navigate("/cart")} className="flex-1 bg-[#D5FF00] text-black py-3 rounded-xl">
            Add to Cart
          </button>

        </div>

      </div>

      
    </div>
  );
}