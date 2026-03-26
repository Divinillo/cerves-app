import React, { useState } from 'react';
import { MapPin, Save } from 'lucide-react';
import Modal from '../shared/Modal';
import ImageUpload from '../shared/ImageUpload';

interface AddBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (barData: BarData) => void;
  initialLat?: number;
  initialLng?: number;
}

interface BarData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photo?: File;
}

export default function AddBarModal({
  isOpen,
  onClose,
  onSave,
  initialLat = 0,
  initialLng = 0,
}: AddBarModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(initialLat);
  const [longitude, setLongitude] = useState(initialLng);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || latitude === 0 || longitude === 0) {
      alert('Por favor rellena todos los campos requeridos');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        name,
        address,
        latitude,
        longitude,
        photo: photo || undefined,
      });
      resetForm();
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setAddress('');
    setLatitude(initialLat);
    setLongitude(initialLng);
    setPhoto(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={resetForm} title="Añadir un nuevo bar">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre del bar *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: La Cervecería del Centro"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Dirección
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle Principal 123"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Latitud *
            </label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              step="0.0001"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Longitud *
            </label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              step="0.0001"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 flex items-center gap-1">
          <MapPin size={14} />
          Haz clic en el mapa para establecer la ubicación
        </p>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Foto del bar
          </label>
          <ImageUpload
            onFileSelected={setPhoto}
            className="w-full"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {isLoading ? 'Guardando...' : 'Guardar bar'}
        </button>
      </form>
    </Modal>
  );
}
