const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const toneClass = toast.type === "error" ? "bg-red-50 text-red-700 ring-red-200" : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return (
    <div className={`fixed right-4 top-4 z-50 rounded-lg px-4 py-3 text-sm shadow-sm ring-1 ${toneClass}`}>
      <div className="flex items-center gap-3">
        <span>{toast.message}</span>
        <button type="button" onClick={onClose} className="font-semibold">
          x
        </button>
      </div>
    </div>
  );
};

export default Toast;
