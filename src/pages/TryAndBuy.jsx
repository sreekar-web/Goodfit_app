import { useNavigate } from "react-router-dom";

export default function TryAndBuy() {
  const navigate = useNavigate();

  const details = [
    { emoji: "📦", label: "Booking ID",          value: "#TRY-GF-82283",              divider: true  },
    { emoji: "📍", label: "Delivery Address",    value: "Flat 4B, Banjara Hills, Hyd", divider: true  },
    { emoji: "👔", label: "Items for Trial",     value: "2 items · ₹7,998 total value", divider: true },
    { emoji: "⏱️", label: "Trial Duration",      value: "30 minutes at your door",    divider: false },
  ];

  const rules = [
    "Rider waits max 30 minutes outside",
    "Try items in your home privately",
    "Return items in original condition",
    "Pay only for what you decide to keep",
  ];

  return (
    <div className="bg-[#080904] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">  {/* pb-32 clears the bottom nav */}

        {/* TOP HERO */}
        <div className="bg-[#D5FF00] w-full flex flex-col items-center pt-12 pb-10 px-6">
          <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12L10 17L19 7" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-[#0A0A0A] text-2xl font-extrabold text-center leading-tight">
            Try &amp; Buy Scheduled!
          </h1>
          <p className="text-[#0A0A0A]/80 text-sm text-center mt-3 leading-relaxed px-4">
            Get ready to try before you buy. Our rider will arrive at your door with your items.
          </p>
          <div className="mt-5 border border-black/30 rounded-full px-5 py-2">
            <span className="text-[#0A0A0A] text-xs font-semibold">
              Sat, Apr 4 · 10:00 PM – 11:00 PM
            </span>
          </div>
        </div>

        {/* BOOKING DETAILS CARD */}
        <div className="mx-4 mt-6 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden"
             style={{ boxShadow: "0px 4px 22px rgba(201, 240, 1, 0.12)" }}>
          {details.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-6 py-4 ${item.divider ? "border-b border-white/10" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-[#C9F001]/10 flex items-center justify-center flex-shrink-0 text-base">
                {item.emoji}
              </div>
              <div>
                <p className="text-[#A3A3A3] text-xs">{item.label}</p>
                <p className="text-[#F5F5F5] text-sm font-semibold mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TRIAL RULES CARD */}
        <div className="mx-4 mt-4 bg-[#1F1F1F] border border-white/10 rounded-2xl p-4">
          <p className="text-[#C9F001] text-xs font-bold mb-3">📋 Trial Rules</p>
          <div className="space-y-1.5">
            {rules.map((rule, i) => (
              <p key={i} className="text-[#A3A3A3] text-xs leading-relaxed">· {rule}</p>
            ))}
          </div>
        </div>

        {/* VIEW BOOKINGS BUTTON */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/myorders")}
            className="border border-[#D5FF00] text-[#D5FF00] font-semibold text-sm px-16 py-3 rounded-lg"
          >
            View my Bookings
          </button>
        </div>

      </div>
    </div>
  );
}