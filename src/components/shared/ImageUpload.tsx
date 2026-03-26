import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

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
        <div className="relative w-full">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={clearPreview}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 transition"
        >
          <Upload className="mx-auto mb-2 text-slate-400" size={32} />
          <p className="text-slate-600 font-medium">Arrastra una imagen o haz clic para seleccionar</p>
          <p className="text-slate-400 text-sm">PNG, JPG hasta 5MB</p>
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
