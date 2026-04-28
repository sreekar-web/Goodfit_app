import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";
import { getWishlist, removeFromWishlist } from "../api/wishlist";

export default function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist()
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const removeItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    try {
      await Promise.all(items.map((item) => removeFromWishlist(item.productId)));
      setItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading wishlist...</div>
      </div>
    );
  }

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

            <div className="flex justify-between items-center">
              <p className="text-[#A3A3A3] text-xs">{items.length} items</p>
              <button
                onClick={clearAll}
                className="text-red-400 text-xs border border-red-400/30 px-3 py-1 rounded-full"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {items.map((item) => (
                <div key={item.id} className="relative">
                  <ProductCard
                    productId={item.productId}
                    image={item.product?.images?.[0]?.url || "/images/p1.png"}
                    brand={item.product?.brand}
                    name={item.product?.name}
                    price={item.product?.price}
                    oldPrice={item.product?.oldPrice}
                    discount={item.product?.discount}
                    trending={item.product?.trending}
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center z-10"
                  >
                    <img
                      src="/icons/heart.svg"
                      className="w-3.5 h-3.5"
                      style={{ filter: "invert(27%) sepia(90%) saturate(700%) hue-rotate(330deg)" }}
                    />
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