import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";

const timeline = [
  { label: "Order Placed",    time: "1:15 PM" },
  { label: "Preparing",       time: "1:30 PM" },
  { label: "Out for Delivery", time: "2:10 PM" },
  { label: "Delivered",       time: "2:45 PM" },
];

export default function OrderDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">

        <PageHeader title="Order Details" subtitle={order?.id || "GF202610001"} />

        <div className="px-4 mt-4 space-y-4">

          {/* STATUS CARD */}
          <div className="bg-gradient-to-br from-[#C9F001]/30 to-[#C9F001]/10 border border-[#C9F001]/30 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C9F001]/30 flex items-center justify-center flex-shrink-0">
                <img src="/icons/checkicon.svg" className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Delivered</h2>
                <p className="text-[#A3A3A3] text-xs mt-0.5">April 1, 2026 at 2:45 PM</p>
                {order?.tryAndBuy && (
                  <span className="inline-block mt-2 bg-[#C9F001] text-black text-xs font-medium px-3 py-0.5 rounded-full">
                    Try &amp; Buy Enabled
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* START TRY & BUY BUTTON */}
          {order?.tryAndBuy && (
            <button
              onClick={() => navigate("/trybuytracking", { state: { order } })}
              className="w-full bg-[#C9F001] text-black font-semibold py-4 rounded-2xl flex items-center justify-between px-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
                  <img src="/icons/blackclock.svg" className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Start Try &amp; Buy</p>
                  <p className="text-xs font-normal opacity-80">30 minutes to decide</p>
                </div>
              </div>
              <span className="text-xl">›</span>
            </button>
          )}

          {/* ORDER TIMELINE */}
          <SectionCard title="Order Timeline">
            <div className="space-y-0">
              {timeline.map((step, i) => (
                <div key={i} className="flex gap-3">
                  {/* ICON + LINE */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#C9F001]/20 border border-[#C9F001]/40 flex items-center justify-center flex-shrink-0">
                      <img src="/icons/checkicon.svg" className="w-4 h-4" />
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-[#C9F001]/20 my-1 min-h-[24px]" />
                    )}
                  </div>
                  {/* TEXT */}
                  <div className="pb-4">
                    <p className="text-sm font-medium text-white">{step.label}</p>
                    <p className="text-[#A3A3A3] text-xs">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* DELIVERY PARTNER */}
          <SectionCard title="Delivery Partner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-xl">👤</div>
                </div>
                <div>
                  <p className="text-sm font-semibold">Rahul Sharma</p>
                  <p className="text-[#A3A3A3] text-xs">+91 98765 43210</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-[#C9F001]/10 border border-[#C9F001]/30 flex items-center justify-center text-[#C9F001]">
                <img src="/icons/call.svg" className="w-4 h-4" />
              </button>
            </div>
          </SectionCard>

          {/* DELIVERY ADDRESS */}
          <SectionCard title="Delivery Address">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-[#C9F001]/10 flex items-center justify-center flex-shrink-0 text-sm">
                <img src="/icons/location.svg" className="w-4 h-4" />
              </div>
              <p className="text-[#A3A3A3] text-sm leading-relaxed">
                Flat 301, Sunshine Apartments<br />Madhapur, Hyderabad - 500081
              </p>
            </div>
          </SectionCard>

          {/* ITEMS */}
          <SectionCard title={`Items (${order?.itemCount || 2})`}>
            <div className="space-y-4">
              {(order?.images || ["/images/p1.png", "/images/p2.png"]).map((img, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={img} className="w-16 h-16 rounded-xl object-cover bg-[#1F1F1F]" />
                  <div className="flex-1">
                    <p className="text-[#C9F001] text-xs">{i === 0 ? "Ethereal Threads" : "Luxe Leather"}</p>
                    <p className="text-sm font-medium">{i === 0 ? "Ethereal Silk Dress" : "Designer Handbag"}</p>
                    <p className="text-[#A3A3A3] text-xs">{i === 0 ? "Size: M • Qty: 1" : "Size: One Size • Qty: 1"}</p>
                  </div>
                  <p className="text-sm font-semibold">{i === 0 ? "₹4,999" : "₹5,499"}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* PAYMENT SUMMARY */}
          <SectionCard title="Payment Summary">
            <div className="space-y-2">
              {[
                { label: "Subtotal",      value: "₹10,498",  color: "text-white" },
                { label: "Try & Buy Fee", value: "₹99",      color: "text-[#C9F001]" },
                { label: "Delivery",      value: "FREE",      color: "text-green-400", pill: true },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-[#A3A3A3]">{row.label}</span>
                  {row.pill
                    ? <span className="bg-[#1F1F1F] border border-white/10 text-green-400 text-xs px-2 py-0.5 rounded-full">FREE</span>
                    : <span className={row.color}>{row.value}</span>
                  }
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 flex justify-between items-center">
                <span className="font-semibold">Total Paid</span>
                <span className="text-[#C9F001] font-bold">₹99</span>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}