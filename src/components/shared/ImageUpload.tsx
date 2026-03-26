import { useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';

interface ImageUploadProps {
  onFileSelected: (file: File) => void;
  currentUrl?: string;
  className?: string;
}

export default function ImageUpload({ onFileSelected, currentUrl, className = '' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-amber-50', 'border-amber-500');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-amber-50', 'border-amber-500');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-amber-50', 'border-amber-500');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onFileSelected(file);
    };
    reader.readAsDataURL(file);
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {preview ? (
        <div className="relative w-full group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-56 object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-2xl transition-all flex items-center justify-center">
            <button
              type="button"
              onClick={clearPreview}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-12 text-center cursor-pointer transition-all bg-gradient-to-br from-slate-50 to-amber-50 hover:from-amber-50 hover:to-orange-50"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
            <Camera className="text-amber-600" size={32} />
          </div>
          <p className="text-slate-800 font-bold mb-1">Selecciona una foto</p>
          <p className="text-slate-600 mb-4">Arrastra y suelta o haz clic para seleccionar</p>
          <p className="text-slate-400 text-sm">PNG, JPG, WebP - máx. 5MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
