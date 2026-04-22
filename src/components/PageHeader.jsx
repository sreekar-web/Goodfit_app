import { useNavigate } from "react-router-dom";

export default function PageHeader({ title, subtitle }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full bg-[#1F1F1F] flex items-center justify-center text-white text-lg"
      >
        ‹
      </button>
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle && <p className="text-[#A3A3A3] text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}