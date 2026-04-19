import { useEffect, useMemo, useState } from "react";
import UploadBox from "../components/UploadBox";
import PreviewCard from "../components/PreviewCard";
import ResultStats from "../components/ResultStats";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import { compressImageApi, getDownloadUrl, uploadImageApi } from "../services/api";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formatBytes = (bytes) => (bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`);

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [uploadMeta, setUploadMeta] = useState(null);
  const [quality, setQuality] = useState(70);
  const [format, setFormat] = useState("jpg");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const originalPreviewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => originalPreviewUrl && URL.revokeObjectURL(originalPreviewUrl), [originalPreviewUrl]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;
    if (!allowedTypes.includes(selectedFile.type)) return setToast({ type: "error", message: "Only JPG, PNG, and WEBP files are supported." });
    if (selectedFile.size > MAX_SIZE_BYTES) return setToast({ type: "error", message: "File size must be 5MB or less." });

    try {
      setLoading(true);
      setFile(selectedFile);
      setResult(null);
      const uploaded = await uploadImageApi(selectedFile);
      setUploadMeta(uploaded);
      setToast({ type: "success", message: "Image uploaded successfully." });
    } catch (error) {
      setToast({ type: "error", message: error.message });
      setUploadMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompress = async () => {
    if (!uploadMeta?.id) return setToast({ type: "error", message: "Please upload an image first." });
    try {
      setLoading(true);
      const compressed = await compressImageApi({ imageId: uploadMeta.id, quality, format });
      setResult(compressed);
      setToast({ type: "success", message: "Image compressed successfully." });
    } catch (error) {
      setToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Image Compressor</h1>
          <p className="mt-2 text-sm text-slate-500">Upload, compress, and download optimized images quickly.</p>
        </header>

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <UploadBox onFileSelect={handleFileSelect} disabled={loading} />
          {file && <p className="mt-4 text-sm text-slate-500">{file.name} - {formatBytes(file.size)}</p>}
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PreviewCard title="Original Image" imageUrl={originalPreviewUrl} emptyLabel="Upload image to preview." />
          <PreviewCard title="Compressed Image" imageUrl={result?.fileUrl ? getDownloadUrl(result.fileUrl) : null} emptyLabel="Compressed output appears here." />
        </section>

        <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Quality: {quality}</label>
              <input type="range" min="10" max="100" step="10" value={quality} onChange={(event) => setQuality(Number(event.target.value))} className="w-full" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Format</label>
              <select value={format} onChange={(event) => setFormat(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
          </div>
          <button type="button" onClick={handleCompress} disabled={loading || !uploadMeta} className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
            {loading ? "Compressing image..." : "Compress Image"}
          </button>
        </section>

        <section className="space-y-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Result</h2>
          <ResultStats result={result} />
          {result?.fileUrl && (
            <div className="flex justify-center">
              <a href={getDownloadUrl(result.fileUrl)} download className="inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
                Download Compressed Image
              </a>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
