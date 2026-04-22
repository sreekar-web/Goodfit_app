export default function SectionHeader({ title }) {
  return (
    <div className="flex justify-between items-center mb-4 mt-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <span className="text-sm text-purple-400">See All</span>
    </div>
  );
}