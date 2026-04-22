import Banner from "../components/Banner";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Categories() {
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();

  const products = [
    { image: "/images/p1.png" },
    { image: "/images/p2.png" },
    { image: "/images/p3.png" },
    { image: "/images/p4.png" },
  ];

  return (
    <div className="bg-[#080904] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm px-4 pb-24">

        {/* HEADER */}
        <div className="flex justify-between items-center mt-4">
          <img src="/icons/profileicon.svg" className="w-12 h-12 rounded-full" />
          <img src="/icons/headerlogo.svg" className="w-10 h-10" />
          <Link to="/cart" className="flex flex-col items-center">
            <img src="/icons/carticon.svg" className="w-5 h-5 mb-1" />
            <span className="text-gray-400">Cart</span>
          </Link>
        </div>

        {/* SEARCH */}
        <div
          onClick={() => navigate("/search")}
          className="mt-4 bg-[#1A1A1A] rounded-full px-4 py-3 flex items-center cursor-pointer"
        >
          <img src="/icons/search.svg" className="w-5 mr-2" />
          <span className="text-[#A3A3A3] text-sm">Search for anything..</span>
        </div>

        {/* 🔽 PUT EVERYTHING BELOW THIS */}
        <div className="mt-4 space-y-4">
          {/* TABS */}
          <div className="flex justify-between text-sm border-b border-gray-700 px-2 mt-4">

            {["All", "Men", "Women", "Kids"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 transition-all duration-200 
                  ${
                    activeTab === tab
                      ? "text-[#D5FF00] border-b-2 border-[#D5FF00]"
                      : "text-gray-400 hover:text-[#D5FF00]"
                  }
                `}
              >
                {tab}
              </button>
            ))}

          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-4">

            {["Soft Girl", "Bold", "Earthy", "Indie Core", "Lehengas"].map((item, i) => (
              <div key={i} className="flex flex-col items-center min-w-[70px]">

                <div className="w-14 h-14 rounded-full bg-gray-600"></div>

                <span className="text-xs mt-2 text-gray-300">
                  {item}
                </span>

              </div>
            ))}

          </div>
        </div>

        {/* BANNER */}
        <Banner
          image="/images/catbanner.png"
          link="/exclusive" />

        {/* MADE IN INDIA */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Made in India Picks
          </h2>

          <span className="text-sm text-purple-400">
            See All
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          {products.map((p, i) => (
            <div key={i} className="bg-[#1F1F1F] rounded-xl p-2">
              <img src={p.image} className="rounded-lg h-40 w-full object-cover" />
              <p className="text-[#D5FF00] text-xs mt-2">@threadstories</p>
              <p className="text-sm">Thread Stories</p>
              <p className="text-xs text-gray-400">Handloom sarees</p>
            </div>
          ))}
        </div>

        {/* OCCASION */}
        <h2 className="mt-6 text-lg font-semibold">Shop by Occasion</h2>

        <div className="grid grid-cols-2 gap-4 mt-3">
          {["Everyday Outfits", "Reception Night", "Wedding Day", "Date Night"].map((o, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden">
              <img src={`/images/o${i + 1}.png`} className="h-44 w-full object-cover" />

              <div className="absolute bottom-0 w-full bg-[#D5FF00] text-black text-sm font-semibold text-center py-2">
                {o}
              </div>
            </div>
          ))}
        </div>

        <Banner
          image="/images/catbanner2.png"
          link="/exclusive" 
        />

      </div>
    </div>
  );
}