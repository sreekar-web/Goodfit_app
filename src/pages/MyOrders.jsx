import OrderCard from "../components/OrderCard";
import PageHeader from "../components/PageHeader";

export default function MyOrders() {
  

  const activeOrders = [
    {
      id: "GF202610001",
      status: "Delivered",
      time: "Today, 2:45 PM",
      tryAndBuy: true,
      images: ["/images/p1.png", "/images/p2.png"],
      itemCount: 2,
      total: 10498,
    },
    {
      id: "GF202609998",
      status: "Out for Delivery",
      time: "Today, 1:30 PM",
      arriving: "Arriving in 15 mins",
      tryAndBuy: false,
      images: ["/images/p3.png"],
      itemCount: 1,
      total: 8999,
    },
  ];

  const pastOrders = [
    {
      id: "GF202609985",
      status: "Completed",
      time: "Yesterday",
      tryAndBuy: false,
      images: ["/images/p4.png"],
      itemCount: 1,
      total: 3999,
    },
  ];

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">

        {/* HEADER */}
        <PageHeader title="My Orders" />

        <div className="px-4 mt-5 space-y-6">

          {/* ACTIVE ORDERS */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#F5F5F5]">Active Orders</p>
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* DIVIDER */}
          <div className="border-t border-white/10" />

          {/* PAST ORDERS */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-[#F5F5F5]">Past Orders</p>
            {pastOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}