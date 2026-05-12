import { useRef, useState } from "react";

const UploadBox = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        if (!disabled && event.dataTransfer.files?.[0]) onFileSelect(event.dataTransfer.files[0]);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white"
      } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-blue-400"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => onFileSelect(event.target.files?.[0])}
        className="hidden"
        disabled={disabled}
      />
      <p className="text-sm text-slate-500">Drag and drop JPG/PNG/WEBP (max 5MB)</p>
      <button type="button" className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white" disabled={disabled}>
        Upload Image
      </button>
    </div>
  );
};

export default UploadBox;
