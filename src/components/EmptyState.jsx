export default function EmptyState({ icon, title, subtitle, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1F1F1F] flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="text-[#A3A3A3] text-sm mt-2 leading-relaxed">{subtitle}</p>
      {action && (
        <button
          onClick={onAction}
          className="mt-6 bg-[#D5FF00] text-black font-semibold px-8 py-3 rounded-xl text-sm"
        >
          {action}
        </button>
      )}
    </div>
  );
}