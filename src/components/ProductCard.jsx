import { useNavigate } from "react-router-dom";

export default function ProductCard({ image, brand, name, price, oldPrice, discount, trending }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate("/product")} className="cursor-pointer">

      {/* IMAGE */}
      <div className="relative bg-[#1F1F1F] rounded-2xl overflow-hidden">
        <img src={image} className="w-full h-52 object-cover" />

        {/* TRENDING BADGE */}
        {trending && (
          <div className="absolute top-2 left-2 bg-[#C9F001] text-black text-[9px] font-semibold px-2 py-0.5 rounded-full">
            Trending
          </div>
        )}

        {/* DISCOUNT BADGE */}
        {discount && (
          <div className={`absolute left-2 bg-red-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full ${trending ? "top-7" : "top-2"}`}>
            {discount}
          </div>
        )}

        {/* WISHLIST */}
        <button className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center">
          <img src="/icons/heart.svg" className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* TEXT */}
      <div className="mt-2 px-1">
        <p className="text-[#C9F001] text-[10px] font-medium">{brand}</p>
        <p className="text-sm font-medium mt-0.5 leading-snug">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold">₹{price.toLocaleString("en-IN")}</span>
          {oldPrice && (
            <span className="text-[#A3A3A3] text-xs line-through">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

    </div>
  );
}