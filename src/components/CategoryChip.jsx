export default function CategoryChip({ label }) {
  return (
    <div className="flex flex-col items-center min-w-[70px]">
      <div className="w-14 h-14 rounded-full bg-gray-600"></div>
      <span className="text-xs mt-2 text-gray-300">{label}</span>
    </div>
  );
}