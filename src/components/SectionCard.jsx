export default function SectionCard({ title, children, className = "" }) {
  return (
    <div className={`bg-[#141414] border border-white/10 rounded-2xl p-4 ${className}`}>
      {title && <p className="text-white font-semibold mb-3">{title}</p>}
      {children}
    </div>
  );
}