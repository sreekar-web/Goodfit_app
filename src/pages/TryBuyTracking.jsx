import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";
import api from "../api/index";

const TOTAL_SECONDS = 30 * 60;

export default function TryBuyTracking() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);
  const [decisions, setDecisions] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    // Start session and get details
    api.post(`/tryandbuy/${orderId}/start`)
      .then(() => api.get(`/tryandbuy/${orderId}`))
      .then((res) => {
        setSession(res.data);
        setItems(res.data.order?.items || []);
        if (res.data.secondsLeft) setSecondsLeft(res.data.secondsLeft);
        // Load existing decisions
        const existing = {};
        res.data.order?.items?.forEach((item) => {
          if (item.decision && item.decision !== "UNDECIDED") {
            existing[item.id] = item.decision;
          }
        });
        setDecisions(existing);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (!session?.isActive) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [session]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const progress = (secondsLeft / TOTAL_SECONDS) * 100;

  const keeping   = items.filter((i) => decisions[i.id] === "KEEP").length;
  const returning = items.filter((i) => decisions[i.id] === "RETURN").length;
  const undecided = items.length - keeping - returning;

  const keepTotal = items
    .filter((i) => decisions[i.id] === "KEEP")
    .reduce((sum, i) => sum + i.price, 0);

  const decide = async (itemId, choice) => {
    try {
      await api.post("/tryandbuy/decision", { itemId, decision: choice });
      setDecisions((prev) => ({ ...prev, [itemId]: choice }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      await api.post(`/tryandbuy/${orderId}/confirm`);
      navigate("/myorders");
    } catch (err) {
      console.error(err);
    } finally {
      setConfirming(false);
    }
  };

  const howItWorks = [
    "You've already paid ₹99 Try & Buy fee",
    "Try items at home for 30 minutes",
    "Mark each item to keep or return",
    "Pay only for items you decide to keep",
    "Free return pickup for unwanted items",
  ];

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="text-white">Starting Try & Buy session...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-40">

        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-lg"
          >
            ‹
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[#C9F001] text-lg">✦</span>
            <h1 className="text-lg font-semibold">Try &amp; Buy</h1>
          </div>
        </div>

        <div className="px-4 mt-4 space-y-4">

          {/* TIMER CARD */}
          <div className="bg-gradient-to-br from-[#C9F001]/30 to-[#C9F001]/10 border border-[#C9F001]/30 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#C9F001]/20 flex items-center justify-center flex-shrink-0">
                <img src="/icons/clock.svg" className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[#A3A3A3] text-xs">Time Remaining</p>
                <p className="text-[#C9F001] text-3xl font-bold">{mins}:{secs}</p>
              </div>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[#C9F001] rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[#A3A3A3] text-sm">
              Try the items and decide what to keep before time runs out
            </p>
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Keeping",   value: keeping,   color: "text-[#C9F001]" },
              { label: "Returning", value: returning,  color: "text-red-400" },
              { label: "Undecided", value: undecided,  color: "text-white" },
            ].map((stat, i) => (
              <div key={i} className="bg-[#141414] border border-white/10 rounded-2xl p-3 text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[#A3A3A3] text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* YOUR ITEMS */}
          <p className="font-semibold">Your Items ({items.length})</p>

          {items.map((item) => {
            const decision = decisions[item.id];
            return (
              <div key={item.id} className="bg-[#141414] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.product?.images?.[0]?.url || "/images/p1.png"}
                      className="w-full h-full object-cover"
                    />
                    {decision === "KEEP" && (
                      <div className="absolute inset-0 bg-[#C9F001] flex items-center justify-center">
                        <span className="text-black text-2xl font-bold">✓</span>
                      </div>
                    )}
                    {decision === "RETURN" && (
                      <div className="absolute inset-0 bg-red-500 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">✕</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[#C9F001] text-xs">{item.product?.brand}</p>
                    <p className="text-sm font-semibold">{item.product?.name}</p>
                    <p className="text-[#A3A3A3] text-xs">Size: {item.size}</p>
                    <p className="text-base font-bold mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => decide(item.id, "KEEP")}
                    className={`py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      decision === "KEEP"
                        ? "bg-[#C9F001] text-black"
                        : "bg-[#1F1F1F] text-white border border-white/10"
                    }`}
                  >
                    ✓ Keep It
                  </button>
                  <button
                    onClick={() => decide(item.id, "RETURN")}
                    className={`py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      decision === "RETURN"
                        ? "bg-red-500 text-white"
                        : "bg-[#1F1F1F] text-white border border-white/10"
                    }`}
                  >
                    ✕ Return
                  </button>
                </div>
              </div>
            );
          })}

          {/* PAYMENT SUMMARY */}
          <SectionCard title="Payment Summary">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#A3A3A3]">Try & Buy Fee (Already Paid)</span>
                <span>₹99</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A3A3A3]">Items to Keep ({keeping})</span>
                <span>₹{keepTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                <div>
                  <p className="font-semibold">Additional Amount</p>
                  <p className="text-[#A3A3A3] text-xs">Pay only for items you keep</p>
                </div>
                <span className="text-[#C9F001] text-xl font-bold">
                  ₹{keepTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </SectionCard>

          {/* HOW IT WORKS */}
          <SectionCard title="How Try & Buy Works">
            <div className="space-y-1.5">
              {howItWorks.map((rule, i) => (
                <p key={i} className="text-[#A3A3A3] text-xs">• {rule}</p>
              ))}
            </div>
          </SectionCard>

        </div>

        {/* CONFIRM & PAY */}
        {undecided === 0 && (
          <div className="fixed bottom-0 left-0 w-full flex justify-center">
            <div className="w-full max-w-sm px-4 pb-6 pt-3 bg-gradient-to-t from-[#0A0A0A] to-transparent">
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full bg-[#C9F001] text-black font-bold py-4 rounded-2xl text-sm disabled:opacity-50"
              >
                {confirming ? "Confirming..." : keeping > 0 ? `Confirm & Pay ₹${keepTotal.toLocaleString("en-IN")}` : "Confirm — Return All"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}