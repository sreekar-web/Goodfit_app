import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import SectionCard from "../components/SectionCard";
import { getOrder } from "../api/orders";

const timeline = [
  { status: "PLACED",           label: "Order Placed" },
  { status: "PREPARING",        label: "Preparing" },
  { status: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { status: "DELIVERED",        label: "Delivered" },
];

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="text-white">Order not found</div>
      </div>
    );
  }

  const completedStatuses = order.timeline?.map((t) => t.status) || [];

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">

        <PageHeader title="Order Details" subtitle={order.id} />

        <div className="px-4 mt-4 space-y-4">

          {/* STATUS CARD */}
          <div className="bg-gradient-to-br from-[#C9F001]/30 to-[#C9F001]/10 border border-[#C9F001]/30 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#C9F001]/30 flex items-center justify-center flex-shrink-0">
                <img src="/icons/checkicon.svg" className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{formatStatus(order.status)}</h2>
                <p className="text-[#A3A3A3] text-xs mt-0.5">
                  {new Date(order.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                  })}
                </p>
                {order.tryAndBuy && (
                  <span className="inline-block mt-2 bg-[#C9F001] text-black text-xs font-medium px-3 py-0.5 rounded-full">
                    Try &amp; Buy Enabled
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* START TRY & BUY */}
          {order.tryAndBuy && order.status === "DELIVERED" && (
            <button
              onClick={() => navigate(`/trybuytracking/${order.id}`)}
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
              {timeline.map((step, i) => {
                const done = completedStatuses.includes(step.status);
                const timeEntry = order.timeline?.find((t) => t.status === step.status);
                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                        done
                          ? "bg-[#C9F001]/20 border-[#C9F001]/40"
                          : "bg-white/5 border-white/10"
                      }`}>
                        <img src="/icons/checkicon.svg" className={`w-4 h-4 ${!done ? "opacity-20" : ""}`} />
                      </div>
                      {i < timeline.length - 1 && (
                        <div className={`w-px flex-1 my-1 min-h-[24px] ${done ? "bg-[#C9F001]/20" : "bg-white/10"}`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${done ? "text-white" : "text-white/30"}`}>
                        {step.label}
                      </p>
                      {timeEntry && (
                        <p className="text-[#A3A3A3] text-xs">
                          {new Date(timeEntry.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* DELIVERY ADDRESS */}
          {order.address && (
            <SectionCard title="Delivery Address">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-[#C9F001]/10 flex items-center justify-center flex-shrink-0 text-sm">
                  <img src="/icons/location.svg" className="w-5 h-5" />
                </div>
                <p className="text-[#A3A3A3] text-sm leading-relaxed">
                  {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
              </div>
            </SectionCard>
          )}

          {/* ITEMS */}
          <SectionCard title={`Items (${order.items?.length})`}>
            <div className="space-y-4">
              {order.items?.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.product?.images?.[0]?.url || `/images/p${(i % 4) + 1}.png`}
                    className="w-16 h-16 rounded-xl object-cover bg-[#1F1F1F]"
                  />
                  <div className="flex-1">
                    <p className="text-[#C9F001] text-xs">{item.product?.brand}</p>
                    <p className="text-sm font-medium">{item.product?.name}</p>
                    <p className="text-[#A3A3A3] text-xs">Size: {item.size} • Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">₹{item.price.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* PAYMENT SUMMARY */}
          <SectionCard title="Payment Summary">
            <div className="space-y-2">
              {[
                { label: "Subtotal", value: `₹${(order.total - order.tryAndBuyFee + order.discount).toLocaleString("en-IN")}`, color: "text-white" },
                ...(order.tryAndBuy ? [{ label: "Try & Buy Fee", value: "₹99", color: "text-[#C9F001]" }] : []),
                ...(order.discount > 0 ? [{ label: "Discount", value: `- ₹${order.discount.toLocaleString("en-IN")}`, color: "text-red-400" }] : []),
                { label: "Delivery", value: "FREE", color: "text-green-400", pill: true },
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
                <span className="text-[#C9F001] font-bold">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
}

function formatStatus(status) {
  const map = {
    PLACED: "Order Placed",
    PREPARING: "Preparing",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return map[status] || status;
}