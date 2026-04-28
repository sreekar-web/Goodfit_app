import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProducts } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    "Tops & Dresses",
    "Men's Topwear",
    "Women's Ethnic",
    "Winter Wear",
    "Handbags",
    "Beauty Needs",
  ];

  useEffect(() => {
    getProducts({ limit: 4 })
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#080904] min-h-screen flex justify-center">
      <div className="w-full max-w-sm text-white p-5 pb-24">

        {/* HEADER */}
        <div className="flex justify-between items-center mt-4">
          <div className="w-10 h-10 bg-gray-600 rounded-full" />
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

        {/* BANNER */}
        <img src="/images/60mindelivery.png" className="rounded-xl mt-4" />

        {/* CATEGORIES */}
        <h2 className="mt-6 text-lg font-semibold">Top Categories</h2>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="border border-[#D5FF00] rounded-2xl p-3 flex flex-col items-center justify-center bg-[#0c0c0c]"
            >
              <div className="w-14 h-14 bg-gray-600 rounded-full mb-2" />
              <p className="text-xs text-center">{cat}</p>
            </div>
          ))}
        </div>

        {/* TRY & BUY */}
        <Link to="/tryandbuy">
          <img src="/images/tryandbuy.png" className="rounded-xl mt-4" />
        </Link>

        {/* PRODUCTS */}
        <h2 className="mt-6 text-lg font-semibold">Top Selling Products</h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 mt-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-[#1F1F1F] rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-3">
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

        {/* BRAND */}
        <img src="/images/brandspotlight.png" className="rounded-xl mt-4" />

      </div>
    </div>
  );
}