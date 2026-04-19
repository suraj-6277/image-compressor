const StatItem = ({ label, value }) => (
  <div className="rounded-lg bg-slate-50 p-3 text-center ring-1 ring-slate-200">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
  </div>
);

const ResultStats = ({ result }) => {
  if (!result) return null;
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatItem label="Original Size" value={result.originalSize} />
      <StatItem label="Compressed Size" value={result.compressedSize} />
      <StatItem label="Saved" value={result.percentageSaved} />
    </div>
  );
};

export default ResultStats;
