const PreviewCard = ({ title, imageUrl, emptyLabel }) => (
  <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
    <h3 className="mb-3 text-sm font-semibold text-slate-700">{title}</h3>
    <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
      {imageUrl ? <img src={imageUrl} alt={title} className="max-h-full max-w-full object-contain" /> : <p className="text-sm text-slate-400">{emptyLabel}</p>}
    </div>
  </div>
);

export default PreviewCard;
