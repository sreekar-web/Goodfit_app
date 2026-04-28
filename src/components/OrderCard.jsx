import { useNavigate } from "react-router-dom";

export default function OrderCard({ order }) {
  const navigate = useNavigate();
  const statusStyles = {
    "Order Placed":     { color: "text-[#A3A3A3]",  icon: "/icons/box.svg" },
    "Preparing":        { color: "text-[#A3A3A3]",  icon: "/icons/box.svg" },
    "Out for Delivery": { color: "text-[#2b7fff]",  icon: "/icons/delivery.svg" },
    "Delivered":        { color: "text-[#C9F001]",  icon: "/icons/checkicon.svg" },
    "Completed":        { color: "text-[#A3A3A3]",  icon: "/icons/box.svg" },
    "Cancelled":        { color: "text-red-400",     icon: "/icons/box.svg" },
  };
  const { color, icon } = statusStyles[order.status] || { color: "text-white", icon: "📦" };

  return (
    <div
      onClick={() => navigate(`/order/${order.id}`, { state: { order } })}
      className="bg-[#141414] border border-white/10 rounded-3xl p-4 space-y-3 cursor-pointer"
    >

      {/* TOP ROW — order ID + badge + arrow */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">

          {/* ORDER ID + BADGE */}
          <div className="flex items-center gap-2">
            <span className="text-[#A3A3A3] text-xs">{order.id}</span>
            {order.tryAndBuy && (
              <span className="text-[9px] text-[#C9F001] bg-[#C9F001]/20 border border-[#C9F001]/30 px-2 py-0.5 rounded-full">
                Try &amp; Buy
              </span>
            )}
          </div>

          {/* STATUS */}
          <div className={`flex items-center gap-1.5 ${color}`}>
            <img src={icon} className="w-4 h-4" /> 
            <span className="text-sm font-semibold">{order.status}</span>
          </div>

          {/* TIME */}
          <p className="text-[#A3A3A3] text-[10px]">{order.time}</p>

          {/* ARRIVING SOON BADGE */}
          {order.arriving && (
            <div className="flex items-center gap-1">
                <img src="/icons/clock.svg" className="w-3 h-3" />
                <p className="text-[#C9F001] text-[10px]">{order.arriving}</p>
            </div>
          )}
        </div>

        <span className="text-[#A3A3A3] text-lg">›</span>
      </div>

      {/* PRODUCT IMAGES */}
      <div className="flex gap-2">
        {order.images.map((img, i) => (
            <div key={i} className="w-16 h-16 rounded-2xl bg-[#1F1F1F] overflow-hidden">
                <img src={img} className="w-full h-full object-cover" />
            </div>
        ))}
      </div>

      {/* ITEMS + PRICE */}
      <div className="flex justify-between items-center border-t border-white/10 pt-3">
        <span className="text-[#A3A3A3] text-xs">{order.itemCount} {order.itemCount === 1 ? "item" : "items"}</span>
        <span className="text-[#F5F5F5] text-sm font-semibold">₹{order.total.toLocaleString("en-IN")}</span>
      </div>

      {/* START TRY & BUY BUTTON — only for delivered try&buy orders */}
      {order.tryAndBuy && order.status === "Delivered" && (
        <div className="border-t border-white/10 pt-3">
          <button className="w-full bg-[#C9F001]/10 border border-[#C9F001]/30 text-[#C9F001] text-sm font-semibold py-2.5 rounded-xl">
            Start Try &amp; Buy →
          </button>
        </div>
      )}

    </div>
  );
}