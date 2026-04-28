import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../api/products";

const filterTabs = ["All", "Dresses", "Ethnic", "Outerwear", "Accessories"];

export default function SearchBrowse() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {};
    if (query) params.search = query;
    if (activeTab !== "All") params.category = activeTab;

    setLoading(true);
    getProducts(params)
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [query, activeTab]);

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
          <p className="text-[#A3A3A3] text-xs">{products.length} items found</p>

          {/* PRODUCT GRID */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-[#1F1F1F] rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  productId={p.id}
                  image={p.images?.[0]?.url || `/images/p${(i % 4) + 1}.png`}
                  brand={p.brand}
                  name={p.name}
                  price={p.price}
                  oldPrice={p.oldPrice}
                  discount={p.discount}
                  trending={p.trending}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}