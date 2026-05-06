import Banner from "../components/Banner";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function Categories() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'All'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const query = {}
    if (activeTab === 'Men') query.category = "Men's Topwear"
    if (activeTab === 'Women') query.category = "Tops & Dresses"
    if (activeTab === 'Kids') query.category = 'Kids'
    query.limit = 20

    getProducts(query)
      .then(res => {
        if (!cancelled) {
          setProducts(res.data.products || res.data)
          setLoading(false)
        }
      })
      .catch(err => {
        console.error(err)
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [activeTab])

  const tabs = ['All', 'Men', 'Women', 'Kids']

  const chips = {
    All: [
      { name: 'Tops & Dresses', category: 'Tops & Dresses' },
      { name: "Men's Topwear", category: "Men's Topwear" },
      { name: "Women's Ethnic", category: "Women's Ethnic" },
      { name: 'Handbags', category: 'Handbags' },
      { name: 'Winter Wear', category: 'Winter Wear' },
      { name: 'Accessories', category: 'Accessories' },
      { name: 'Beauty Needs', category: 'Beauty Needs' },
      { name: 'Footwear', category: 'Footwear' },
    ],
    Men: [
      { name: "Topwear", category: "Men's Topwear" },
      { name: 'Winter Wear', category: 'Winter Wear' },
      { name: 'Accessories', category: 'Accessories' },
      { name: 'Footwear', category: 'Footwear' },
    ],
    Women: [
      { name: 'Tops & Dresses', category: 'Tops & Dresses' },
      { name: 'Ethnic', category: "Women's Ethnic" },
      { name: 'Handbags', category: 'Handbags' },
      { name: 'Beauty Needs', category: 'Beauty Needs' },
    ],
    Kids: [
      { name: 'All Kids', category: 'Kids' },
    ],
  }

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

        <div className="mt-4 space-y-4">

          {/* TABS */}
          <div className="flex justify-between text-sm border-b border-gray-700 px-2 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setLoading(true); setActiveTab(tab) }}
                className={`pb-2 transition-all duration-200 
                  ${activeTab === tab
                    ? "text-[#D5FF00] border-b-2 border-[#D5FF00]"
                    : "text-gray-400 hover:text-[#D5FF00]"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {chips[activeTab]?.map((chip, i) => (
              <button
                key={i}
                onClick={() => {
                  setLoading(true)
                  getProducts({ category: chip.category, limit: 20 })
                    .then(res => setProducts(res.data.products || res.data))
                    .catch(err => console.error(err))
                    .finally(() => setLoading(false))
                }}
                className="flex flex-col items-center min-w-[70px] cursor-pointer active:opacity-70"
              >
                <div className="w-14 h-14 rounded-full bg-gray-600" />
                <span className="text-xs mt-2 text-gray-300 text-center">{chip.name}</span>
              </button>
            ))}
          </div>

        </div>

        {/* BANNER */}
        <Banner image="/images/catbanner.png" link="/exclusive" />

        {/* PRODUCTS */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {activeTab === 'All' ? 'All Products' : `${activeTab}'s Collection`}
          </h2>
          <span className="text-sm text-gray-400">{products.length} items</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 mt-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-[#1F1F1F] rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-4">🛍️</div>
            <p>No products found</p>
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

        {/* OCCASION */}
        <h2 className="mt-6 text-lg font-semibold">Shop by Occasion</h2>
        <div className="grid grid-cols-2 gap-4 mt-3">
          {["Everyday Outfits", "Reception Night", "Wedding Day", "Date Night"].map((o, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden cursor-pointer">
              <img src={`/images/o${i + 1}.png`} className="h-44 w-full object-cover" />
              <div className="absolute bottom-0 w-full bg-[#D5FF00] text-black text-sm font-semibold text-center py-2">
                {o}
              </div>
            </div>
          ))}
        </div>

        <Banner image="/images/catbanner2.png" link="/exclusive" />

      </div>
    </div>
  )
}