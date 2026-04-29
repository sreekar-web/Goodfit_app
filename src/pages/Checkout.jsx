import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/orders";
import { createPaymentOrder, verifyPayment } from "../api/payments";
import PageHeader from "../components/PageHeader";
import api from "../api/index";

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  const { tryAndBuy, promoCode, total } = state || {};

  useEffect(() => {
    api.get("/addresses")
      .then((res) => {
        setAddresses(res.data);
        const def = res.data.find((a) => a.isDefault) || res.data[0];
        if (def) setSelectedAddress(def.id);
      })
      .catch((err) => console.error(err))
      .finally(() => setFetchingAddresses(false));
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    try {
      setLoading(true);

      // 1. Place order
      const orderRes = await placeOrder({
        addressId: selectedAddress,
        tryAndBuy: tryAndBuy || false,
        promoCode: promoCode || null,
      });

      const order = orderRes.data;

      // 2. Create Razorpay payment order
      const paymentRes = await createPaymentOrder(order.id);
      const { razorpayOrderId, amount, currency, keyId } = paymentRes.data;

      // 3. Open Razorpay checkout
      const options = {
        key: keyId,
        amount,
        currency,
        name: "Goodfit",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // 4. Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id,
            });
            navigate("/myorders");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed");
          }
        },
        modal: {
            ondismiss: () => {
                setLoading(false);
            },
        },
        retry: { enabled: false },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || "9999999999",
        },
        theme: { color: "#D5FF00" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">

        <PageHeader title="Checkout" />

        <div className="px-4 mt-4 space-y-4">

          {/* DELIVERY ADDRESS */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
            <p className="font-semibold mb-3">Delivery Address</p>

            {fetchingAddresses ? (
              <div className="text-[#A3A3A3] text-sm">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div>
                <p className="text-[#A3A3A3] text-sm mb-3">No addresses saved yet.</p>
                <button className="text-[#D5FF00] text-sm font-semibold">
                  + Add New Address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedAddress === addr.id
                        ? "border-[#D5FF00] bg-[#D5FF00]/5"
                        : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#D5FF00]">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[9px] bg-[#D5FF00]/20 text-[#D5FF00] px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-[#F5F5F5]">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                    <p className="text-xs text-[#A3A3A3]">{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-[#141414] border border-white/10 rounded-2xl p-4">
            <p className="font-semibold mb-3">Order Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A3A3A3]">Total</span>
                <span>₹{total?.toLocaleString("en-IN")}</span>
              </div>
              {tryAndBuy && (
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Try & Buy Fee</span>
                  <span className="text-[#D5FF00]">₹99</span>
                </div>
              )}
              {promoCode && (
                <div className="flex justify-between">
                  <span className="text-[#A3A3A3]">Promo</span>
                  <span className="text-green-400">{promoCode} applied</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#A3A3A3]">Delivery</span>
                <span className="text-green-400">FREE</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="fixed bottom-0 left-0 w-full flex justify-center">
          <div className="w-full max-w-sm px-4 pb-6 pt-4 bg-gradient-to-t from-[#0A0A0A] to-transparent">
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full bg-[#D5FF00] text-black font-bold py-4 rounded-2xl text-sm disabled:opacity-50"
            >
              {loading ? "Processing..." : `Pay ₹${total?.toLocaleString("en-IN")}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}