import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, addToCart, updateCartItem, removeFromCart, validatePromo } from "../api/cart";
import { createPaymentOrder } from "../api/payments";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tryAndBuy, setTryAndBuy] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (itemId, delta, currentQty) => {
    const newQty = currentQty + delta;
    try {
      const res = await updateCartItem(itemId, newQty);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      const res = await removeFromCart(itemId);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyPromo = async () => {
    try {
      setPromoError("");
      const res = await validatePromo(promoCode);
      setAppliedPromo(res.data.code);
      setPromoDiscount(res.data.discount);
    } catch (err) {
      setPromoError(err.response?.data?.error || "Invalid promo code");
      setAppliedPromo(null);
      setPromoDiscount(0);
    }
  };

  const handleQuickApplyPromo = async (code) => {
    try {
      setPromoError("");
      setPromoCode(code);
      const res = await validatePromo(code);
      setAppliedPromo(res.data.code);
      setPromoDiscount(res.data.discount);
    } catch (err) {
      setPromoError(err.response?.data?.error || "Invalid promo code");
    }
  };

  const items = cart?.items || [];
  const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tryAndBuyFee = tryAndBuy ? 99 : 0;
  const total = cartTotal - promoDiscount + tryAndBuyFee;
  const savings = items.reduce((sum, item) => {
    const fake = Math.round(item.product.price * 1.6);
    return sum + (fake - item.product.price) * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="bg-[#080904] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#080904] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">

        {/* HEADER */}
        <div className="flex items-center gap-4 px-4 pt-6 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <span className="text-white text-lg">‹</span>
          </button>
          <div>
            <h1 className="text-xl font-bold">My Cart</h1>
            <p className="text-sm text-[#999]">{items.length} items</p>
          </div>
        </div>

        <div className="border-t border-white/10" />

        {/* CART ITEMS */}
        <div className="px-4 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate("/home")}
                className="bg-[#D5FF00] text-black px-6 py-3 rounded-xl font-semibold text-sm"
              >
                Shop Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-[#1F1F1F] rounded-2xl p-4 border border-white/10">
                <div className="flex gap-3">
                  <img
                    src={item.product.images?.[0]?.url || "/images/p1.png"}
                    className="w-20 h-24 rounded-xl object-cover bg-[#333]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#D5FF00] text-xs font-semibold">{item.product.brand}</p>
                        <p className="text-sm font-medium mt-0.5 leading-snug">{item.product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Size: {item.size}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0"
                      >
                        <img src="/icons/deleteicon.svg" className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-[#2A2A2A] rounded-full">
                        <button
                          onClick={() => handleUpdateQty(item.id, -1, item.quantity)}
                          className="w-8 h-8 flex items-center justify-center text-white rounded-full"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.id, 1, item.quantity)}
                          className="w-8 h-8 flex items-center justify-center text-white rounded-full"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold text-sm">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* TRY & BUY */}
          {items.length > 0 && (
            <div className="bg-[#1F1F1F] rounded-2xl p-4 border border-white/10">
              <div className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#262626] flex items-center justify-center flex-shrink-0">
                  <img src="/icons/tabstar.svg" className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Enable Try &amp; Buy</p>
                  <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                    Try items at home for 30 minutes before deciding
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-[#D5FF00]">₹99 fee</span>
                    <span className="text-[10px] text-[#A3A3A3]">• Free returns</span>
                  </div>
                </div>
                <button
                  onClick={() => setTryAndBuy(!tryAndBuy)}
                  className={`w-6 h-6 rounded-full border flex-shrink-0 mt-1 transition-all ${
                    tryAndBuy ? "bg-[#D5FF00] border-[#D5FF00]" : "border-white/20 bg-transparent"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <div className="border-t border-white/10" />

            {/* PROMO CODE */}
            <div className="px-4 py-5">
              <p className="font-semibold mb-3">Promo Code</p>
              <div className="flex gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none placeholder-[#EDE8FF]/60"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-[#D5FF00] text-black font-semibold px-4 rounded-xl text-sm"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-red-400 text-xs mt-2">{promoError}</p>}
              {appliedPromo && (
                <p className="text-green-400 text-xs mt-2">✓ {appliedPromo} applied — ₹{promoDiscount} off!</p>
              )}
              <div className="flex gap-2 mt-3">
                {["GOODFIT25", "TRYBUY10"].map((code) => (
                  <button
                    key={code}
                    onClick={() => handleQuickApplyPromo(code)}
                    className={`border border-dashed border-[#D5FF00] rounded-full px-3 py-1 text-xs font-bold text-[#D5FF00] transition-all ${
                      appliedPromo === code ? "bg-[#D5FF00]/10" : "bg-[#080904]"
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* BILL DETAILS */}
            <div className="px-4 py-5 space-y-3">
              <p className="font-semibold">Bill Details</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Cart Total</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Delivery Fee</span>
                <span className="text-green-400">FREE</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Discount (Promo)</span>
                  <span className="text-red-400">- ₹{promoDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {tryAndBuy && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Try & Buy Fee</span>
                  <span className="text-[#D5FF00]">₹99</span>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 mx-4" />

            {/* TOTAL */}
            <div className="px-4 py-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-base">Total Amount</span>
                <span className="font-bold text-base">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-[#D5FF00] text-xs mt-1">
                🎉 You save ₹{savings.toLocaleString("en-IN")} on this order!
              </p>
            </div>

            {/* BOTTOM CTA */}
            <div className="fixed bottom-0 left-0 w-full flex justify-center pointer-events-none">
              <div className="w-full max-w-sm px-4 pb-6 flex items-center justify-between pointer-events-auto bg-gradient-to-t from-[#080904] via-[#080904]/90 to-transparent pt-4">
                <div>
                  <p className="text-xs text-gray-400">{tryAndBuy ? "Try and Buy Fee" : "Total Amount"}</p>
                  <p className="text-lg font-bold">₹{tryAndBuy ? tryAndBuyFee : total.toLocaleString("en-IN")}</p>
                </div>
                <button
                  onClick={() => navigate("/checkout", { state: { cartId: cart.id, tryAndBuy, promoCode: appliedPromo, total } })}
                  className="bg-[#D5FF00] text-black font-bold px-6 py-4 rounded-2xl text-sm"
                >
                  Proceed to Pay →
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}