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
    <Modal isOpen={isOpen} onClose={resetForm} title="Añadir un nuevo bar" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Nombre del bar *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: La Cervecería del Centro"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Dirección
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle Principal 123"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Latitud *
            </label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              step="0.0001"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Longitud *
            </label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              step="0.0001"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-700 font-medium">
          <MapPin size={16} />
          Haz clic en el mapa para establecer la ubicación
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
            Foto del bar
          </label>
          <ImageUpload onFileSelected={setPhoto} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 text-white py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Save size={20} />
          {isLoading ? 'Guardando...' : 'Guardar bar'}
        </button>
      </form>
    </Modal>
  );
}
