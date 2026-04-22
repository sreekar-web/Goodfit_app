import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  const [tryAndBuy, setTryAndBuy] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const [items, setItems] = useState([
    {
      id: 1,
      brand: "Ethereal Threads",
      name: "Ethereal Silk Dress",
      size: "M",
      price: 4999,
      image: "/images/p1.png",
    },
    {
      id: 2,
      brand: "Luxe Leather",
      name: "Designer Handbag",
      size: "One Size",
      price: 5499,
      image: "/images/p2.png",
    },
  ]);

  const [quantities, setQuantities] = useState({ 1: 1, 2: 1 });

  const promoCodes = { GOODFIT25: 1000, TRYBUY10: 500 };

  const updateQty = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setQuantities((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const applyPromo = () => {
    if (promoCodes[promoCode]) {
      setAppliedPromo(promoCode);
    }
  };

  const cartTotal = items.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 1),
    0
  );
  const discount = appliedPromo ? promoCodes[appliedPromo] : 0;
  const tryAndBuyFee = tryAndBuy ? 99 : 0;
  const total = cartTotal - discount + tryAndBuyFee;
  const savings = items.reduce((sum, item) => {
    const fake = Math.round(item.price * 1.6);
    return sum + (fake - item.price) * (quantities[item.id] || 1);
  }, 0);

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
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#1F1F1F] rounded-2xl p-4 border border-white/10"
            >
              <div className="flex gap-3">
                {/* IMAGE */}
                <img
                  src={item.image}
                  className="w-20 h-24 rounded-xl object-cover bg-[#333]"
                />

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[#D5FF00] text-xs font-semibold">{item.brand}</p>
                      <p className="text-sm font-medium mt-0.5 leading-snug">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Size: {item.size}</p>
                    </div>
                    {/* DELETE */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0"
                    >
                      <img src="/icons/deleteicon.svg" className="w-4 h-4" />
                    </button>
                  </div>

                  {/* QTY + PRICE */}
                  <div className="flex items-center justify-between mt-3">
                    {/* QUANTITY */}
                    <div className="flex items-center bg-[#2A2A2A] rounded-full">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-white rounded-full"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">
                        {quantities[item.id]}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-white rounded-full"
                      >
                        +
                      </button>
                    </div>

                    {/* PRICE */}
                    <span className="font-semibold text-sm">
                      ₹{(item.price * (quantities[item.id] || 1)).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* TRY & BUY */}
          <div className="bg-[#1F1F1F] rounded-2xl p-4 border border-white/10">
            <div className="flex gap-3 items-start">
              {/* ICON */}
              <div className="w-12 h-12 rounded-2xl bg-[#262626] flex items-center justify-center flex-shrink-0 text-xl">
                <img src="/icons/tabstar.svg" className="w-4 h-4" />
              </div>

              {/* TEXT */}
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

              {/* TOGGLE */}
              <button
                onClick={() => setTryAndBuy(!tryAndBuy)}
                className={`w-6 h-6 rounded-full border flex-shrink-0 mt-1 transition-all ${
                  tryAndBuy
                    ? "bg-[#D5FF00] border-[#D5FF00]"
                    : "border-white/20 bg-transparent"
                }`}
              />
            </div>
          </div>
        </div>

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
              onClick={applyPromo}
              className="bg-[#D5FF00] text-black font-semibold px-4 rounded-xl text-sm"
            >
              Apply
            </button>
          </div>

          {/* CHIPS */}
          <div className="flex gap-2 mt-3">
            {["GOODFIT25", "TRYBUY10"].map((code) => (
              <button
                key={code}
                onClick={() => { setPromoCode(code); setAppliedPromo(code); }}
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

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Discount (Promo)</span>
              <span className="text-red-400">- ₹{discount.toLocaleString("en-IN")}</span>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 mx-4" />

        {/* TOTAL */}
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-base">Total Amount</span>
            <span className="font-bold text-base">
              ₹{total.toLocaleString("en-IN")}
            </span>
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
            <button className="bg-[#D5FF00] text-black font-bold px-6 py-4 rounded-2xl text-sm">
              Proceed to Pay →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}