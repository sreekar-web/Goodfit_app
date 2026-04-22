import { useState } from "react";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";

const allProducts = [
  { id: 1, brand: "Ethereal Threads", name: "Ethereal Silk Dress",     price: 4999, oldPrice: 7999,  image: "/images/p1.png", tags: ["Dresses", "Ethnic"],   trending: true,  discount: "38% OFF" },
  { id: 2, brand: "Urban Edge",       name: "Premium Leather Jacket",  price: 8999, oldPrice: null,  image: "/images/p2.png", tags: ["Outerwear"],           trending: false, discount: null },
  { id: 3, brand: "Desi Couture",     name: "Handcrafted Saree",       price: 6499, oldPrice: null,  image: "/images/p3.png", tags: ["Ethnic"],              trending: true,  discount: null },
  { id: 4, brand: "Modern Muse",      name: "Contemporary Jumpsuit",   price: 3999, oldPrice: 5999,  image: "/images/p4.png", tags: ["Dresses"],             trending: false, discount: "33% OFF" },
  { id: 5, brand: "Luxe Leather",     name: "Designer Handbag",        price: 5499, oldPrice: null,  image: "/images/p2.png", tags: ["Accessories"],         trending: true,  discount: null },
  { id: 6, brand: "Minimalist Co.",   name: "Minimalist Shirt",        price: 2499, oldPrice: null,  image: "/images/p1.png", tags: ["Outerwear"],           trending: false, discount: null },
  { id: 7, brand: "Royal Attire",     name: "Elegant Evening Gown",    price: 9999, oldPrice: 14999, image: "/images/p3.png", tags: ["Dresses", "Ethnic"],   trending: true,  discount: "33% OFF" },
  { id: 8, brand: "Urban Beats",      name: "Streetwear Collection",   price: 3499, oldPrice: null,  image: "/images/p4.png", tags: ["Outerwear"],           trending: false, discount: null },
];

const filterTabs = ["All", "Dresses", "Ethnic", "Outerwear", "Accessories"];

export default function SearchBrowse() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filtered = allProducts.filter((p) => {
    const matchesTab = activeTab === "All" || p.tags.includes(activeTab);
    const matchesQuery =
      query === "" ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">

        <PageHeader title="My Categories" />

        <div className="px-4 mt-4 space-y-4">

          {/* SEARCH BAR */}
          <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-4 py-3">
            <img src="/icons/search.svg" className="w-4 h-4 opacity-50" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anything.."
              className="flex-1 bg-transparent outline-none text-sm placeholder-[#A3A3A3]"
            />
            {/* FILTER ICON */}
            <button className="flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeTab === tab
                    ? "bg-[#C9F001] text-black"
                    : "bg-[#1F1F1F] text-[#F5F5F5]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* RESULTS COUNT */}
          <p className="text-[#A3A3A3] text-xs">{filtered.length} items found</p>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 gap-3">
                {filtered.map((p) => (
                    <ProductCard
                    key={p.id}
                    image={p.image}
                    brand={p.brand}
                    name={p.name}
                    price={p.price}
                    oldPrice={p.oldPrice}
                    discount={p.discount}
                    trending={p.trending}
                    />
                ))}
            </div>

        </div>
      </div>
    </div>
  );
}