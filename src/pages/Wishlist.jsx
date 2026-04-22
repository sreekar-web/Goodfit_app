import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

const initialWishlist = [
  {
    id: 1,
    brand: "Ethereal Threads",
    name: "Ethereal Silk Dress",
    price: 4999,
    oldPrice: 7935,
    image: "/images/p1.png",
    discount: "37% OFF",
    trending: true,
  },
  {
    id: 2,
    brand: "Urban Edge",
    name: "Premium Leather Jacket",
    price: 8999,
    oldPrice: null,
    image: "/images/p2.png",
    trending: false,
  },
  {
    id: 3,
    brand: "Modern Muse",
    name: "Contemporary Jumpsuit",
    price: 3999,
    oldPrice: 5969,
    image: "/images/p3.png",
    discount: "33% OFF",
    trending: true,
  },
  {
    id: 4,
    brand: "Luxe Leather",
    name: "Designer Handbag",
    price: 5499,
    oldPrice: null,
    image: "/images/p4.png",
    trending: false,
  },
];

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialWishlist);

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">

        <PageHeader
          title="My Wishlist"
          subtitle={items.length > 0 ? `${items.length} items saved` : null}
        />

        {items.length === 0 ? (
          <EmptyState
            icon="🤍"
            title="Your wishlist is empty"
            subtitle="Save items you love and come back to them anytime."
            action="Browse Products"
            onAction={() => navigate("/search")}
          />
        ) : (
          <div className="px-4 mt-4 space-y-4">

            {/* SORT ROW */}
            <div className="flex justify-between items-center">
              <p className="text-[#A3A3A3] text-xs">{items.length} items</p>
              <button
                onClick={() => setItems([])}
                className="text-red-400 text-xs border border-red-400/30 px-3 py-1 rounded-full"
              >
                Clear All
              </button>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 gap-3">
              {items.map((item) => (
                <div key={item.id} className="relative">
                  <ProductCard
                    image={item.image}
                    brand={item.brand}
                    name={item.name}
                    price={item.price}
                    oldPrice={item.oldPrice}
                    discount={item.discount}
                    trending={item.trending}
                  />
                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center z-10"
                  >
                    <img src="/icons/heart.svg" className="w-3.5 h-3.5" style={{ filter: "invert(27%) sepia(90%) saturate(700%) hue-rotate(330deg)" }} />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}