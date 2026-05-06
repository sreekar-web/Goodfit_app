import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api/products";
import { addToCart } from "../api/cart";
import { addToWishlist, removeFromWishlist, checkWishlist } from "../api/wishlist";

export default function Product() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then((res) => {
        setProduct(res.data);
        if (res.data.sizes?.length > 0) {
          setSelectedSize(res.data.sizes[0].size);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    checkWishlist(id)
      .then(res => setWishlisted(res.data.wishlisted))
      .catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) return;
    try {
      setAdding(true);
      await addToCart({ productId: product.id, size: selectedSize, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        await removeFromWishlist(product.id);
        setWishlisted(false);
      } else {
        await addToWishlist(product.id);
        setWishlisted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} by ${product.brand} on GoodFits!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white">Product not found</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pb-32 flex justify-center">
      <div className="w-full max-w-sm">

        {/* IMAGE SECTION */}
        <div className="relative">
          <div className="w-full h-[420px] bg-[#111] overflow-hidden">
            {product.images?.[0]?.url && (
              <img src={product.images[0].url} className="w-full h-full object-cover" />
            )}
          </div>

          <div
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-10 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
              <img src="/icons/ppagearrow.svg" className="w-4 h-4" />
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-3 z-10">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center cursor-pointer"
            >
              <img src="/icons/shareicon.svg" className="w-4 h-4" />
            </button>
            <button
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center cursor-pointer"
            >
              {wishlisted
                ? <span style={{ fontSize: 16, color: '#D5FF00' }}>♥</span>
                : <img src="/icons/heart.svg" className="w-4 h-4" />
              }
            </button>
          </div>

          <div className="absolute bottom-[-35px] left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {product.images?.slice(0, 3).map((img, i) => (
              <div key={i} className="w-16 h-20 bg-[#1F1F1F] rounded-lg border border-white/20 overflow-hidden">
                <img src={img.url} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="px-4 mt-16 space-y-3">
          <p className="text-[#D5FF00] text-sm font-semibold">{product.brand}</p>
          <h1 className="text-xl font-semibold leading-snug">{product.name}</h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#D5FF00] text-black px-2 py-[2px] rounded-full text-xs font-semibold">
              <span>★</span>
              <span>4.95</span>
            </div>
            <span className="text-gray-400 text-sm">(2.4k reviews)</span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span className="text-2xl font-bold">₹{product.price.toLocaleString("en-IN")}</span>
            {product.oldPrice && (
              <span className="line-through text-gray-400 text-sm">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
            {product.discount && (
              <div className="relative ml-1">
                <img src="/icons/discount.svg" className="h-6" />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black">
                  {product.discount}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SIZE SECTION */}
        <div className="px-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Select Size</h2>
            <span className="text-[#D5FF00] text-sm">Size Guide →</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {product.sizes?.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSize(s.size)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border cursor-pointer
                  ${selectedSize === s.size
                    ? "border-[#D5FF00] text-[#D5FF00]"
                    : "border-gray-500 text-white"
                  }`}
              >
                {s.size}
              </div>
            ))}
          </div>
        </div>

        {/* TRY & BUY */}
        <div className="px-4 mt-6">
          <div className="bg-[#1F1F1F] rounded-xl p-4">
            <p className="font-semibold">Try & Buy Available</p>
            <p className="text-gray-400 text-sm mt-1">
              Try at home before you pay. 15-min trial window. No questions asked returns.
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-6 space-y-6 px-4">
          {product.description && (
            <div>
              <h2 className="text-[#D5FF00] text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}
          <div>
            <h2 className="text-[#D5FF00] text-lg font-semibold mb-2">Unique Features</h2>
            <ul className="text-gray-300 text-sm space-y-2 pl-2">
              {["100% Cotton Fabric", "Handcrafted Embroidery", "Made in India", "Try & Buy Available"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-[#D5FF00]">•</span>{f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 mb-24 flex gap-4 px-4">
          <button className="flex-1 border border-[#D5FF00] text-[#D5FF00] py-3 rounded-xl">
            Buy Now
          </button>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 bg-[#D5FF00] text-black py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {adding ? "Adding..." : added ? "Added! ✓" : "Add to Cart"}
          </button>
        </div>

      </div>
    </div>
  );
}