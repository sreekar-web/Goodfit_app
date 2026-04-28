import { useState, useEffect } from "react";
import OrderCard from "../components/OrderCard";
import PageHeader from "../components/PageHeader";
import { getMyOrders } from "../api/orders";
import EmptyState from "../components/EmptyState";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter((o) =>
    ["PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"].includes(o.status)
  );

  const pastOrders = orders.filter((o) =>
    ["COMPLETED", "CANCELLED"].includes(o.status)
  );

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">

        <PageHeader title="My Orders" />

        {orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            subtitle="Your orders will appear here once you place one."
            action="Shop Now"
            onAction={() => navigate("/home")}
          />
        ) : (
          <div className="px-4 mt-5 space-y-6">

            {activeOrders.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#F5F5F5]">Active Orders</p>
                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={{
                      id: order.id,
                      status: formatStatus(order.status),
                      time: formatDate(order.createdAt),
                      tryAndBuy: order.tryAndBuy,
                      images: order.items?.map((item) =>
                        item.product?.images?.[0]?.url || "/images/p1.png"
                      ),
                      itemCount: order.items?.length,
                      total: order.total,
                      arriving: order.status === "OUT_FOR_DELIVERY" ? "Arriving in 15 mins" : null,
                    }}
                  />
                ))}
              </div>
            )}

            {activeOrders.length > 0 && pastOrders.length > 0 && (
              <div className="border-t border-white/10" />
            )}

            {pastOrders.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#F5F5F5]">Past Orders</p>
                {pastOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={{
                      id: order.id,
                      status: formatStatus(order.status),
                      time: formatDate(order.createdAt),
                      tryAndBuy: order.tryAndBuy,
                      images: order.items?.map((item) =>
                        item.product?.images?.[0]?.url || "/images/p1.png"
                      ),
                      itemCount: order.items?.length,
                      total: order.total,
                    }}
                  />
                ))}
              </div>
            )}

          </div>
        )}
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

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}