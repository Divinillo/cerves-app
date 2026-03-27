import { useState, useRef } from 'react';
import { X, Star, Camera, Trash2 } from 'lucide-react';
import type { SavedBeer } from '../../context/BeerContext';

const STYLES = ['Lager', 'IPA', 'DIPA', 'Stout', 'Porter', 'Wheat', 'Pale Ale', 'Amber', 'Pilsner', 'Sour', 'Belgian', 'Red Ale', 'Otra'];
const SIZES = ['Caña', 'Doble', 'Tercio', 'Pinta', 'Quinto', 'Jarra'];

interface EditBeerModalProps {
  beer: SavedBeer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (beerId: string, updates: Partial<SavedBeer>, newPhoto?: File) => void;
}

export default function EditBeerModal({ beer, isOpen, onClose, onSave }: EditBeerModalProps) {
  const [beerName, setBeerName] = useState(beer.beerName);
  const [style, setStyle] = useState(beer.style);
  const [rating, setRating] = useState(beer.rating);
  const [price, setPrice] = useState(beer.price.toString());
  const [size, setSize] = useState(beer.size);
  const [isDraft, setIsDraft] = useState(beer.isDraft);
  const [isPublic, setIsPublic] = useState(beer.isPublic);
  const [notes, setNotes] = useState(beer.notes || '');
  const [barName, setBarName] = useState(beer.barName);
  const [photoPreview, setPhotoPreview] = useState<string | null>(beer.photoUrl || null);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPhoto(file);
      setRemovePhoto(false);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setNewPhoto(null);
    setRemovePhoto(true);
    setPhotoPreview(null);
  };

  const handleSave = () => {
    const updates: Partial<SavedBeer> = {
      beerName: beerName.trim(),
      style,
      rating,
      price: parseFloat(price) || 0,
      size,
      isDraft,
      isPublic,
      notes: notes.trim(),
      barName: barName.trim(),
    };
    if (removePhoto) {
      updates.photoUrl = undefined;
    }
    onSave(beer.id, updates, newPhoto || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl md:rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Editar cerveza</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Photo */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Foto</label>
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-amber-300 rounded-xl flex flex-col items-center justify-center gap-2 text-amber-500 hover:bg-amber-50 transition"
              >
                <Camera size={28} />
                <span className="text-sm font-medium">Añadir foto</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {photoPreview && (
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-2 text-sm text-amber-600 font-medium hover:underline"
              >
                Cambiar foto
              </button>
            )}
          </div>

          {/* Beer name */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Nombre de la cerveza</label>
            <input
              type="text"
              value={beerName}
              onChange={(e) => setBeerName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 text-slate-800 font-medium"
            />
          </div>

          {/* Bar name */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Bar</label>
            <input
              type="text"
              value={barName}
              onChange={(e) => setBarName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 text-slate-800"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-2 block">Valoración</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className="p-1">
                  <Star
                    size={32}
                    className={`transition-colors ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 hover:text-amber-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Estilo</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    style === s
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price + Size + Draft row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Precio (€)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 text-center font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Tamaño</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-2 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 text-slate-800 bg-white"
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Tipo</label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden h-[42px]">
                <button
                  onClick={() => setIsDraft(true)}
                  className={`flex-1 text-sm font-medium transition ${isDraft ? 'bg-amber-500 text-white' : 'bg-white text-slate-600'}`}
                >
                  🍻
                </button>
                <button
                  onClick={() => setIsDraft(false)}
                  className={`flex-1 text-sm font-medium transition ${!isDraft ? 'bg-amber-500 text-white' : 'bg-white text-slate-600'}`}
                >
                  🍾
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Notas</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Sabor, aroma, sensaciones..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 text-slate-800 resize-none"
            />
          </div>

          {/* Public toggle */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Publicación pública</p>
              <p className="text-xs text-slate-500">Visible en La Taberna para todos</p>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-12 h-7 rounded-full transition-colors relative ${isPublic ? 'bg-amber-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${isPublic ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!beerName.trim()}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
