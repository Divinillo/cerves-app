import { useState, useRef, useEffect } from 'react';
import { X, Star, ChevronDown, Camera, Send } from 'lucide-react';

interface QuickBeerLogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuickBeerData) => void;
  barName?: string;
  barId?: string;
  /** When no bar is selected, user tapped empty map spot */
  mapCoords?: { lat: number; lng: number };
  isLoading?: boolean;
}

export interface QuickBeerData {
  barId?: string;
  barName: string;
  beerName: string;
  style: string;
  rating: number;
  price: number;
  size: 'caña' | 'doble' | 'pinta' | 'tercio' | 'quinto';
  isDraft: boolean;
  isPublic: boolean;
  photo?: File;
  /** If creating a new bar at these coords */
  newBarCoords?: { lat: number; lng: number };
}

const BEER_STYLES = [
  'IPA', 'Lager', 'Stout', 'Porter', 'Pilsner',
  'Wheat', 'APA', 'DIPA', 'Sour', 'Pale Ale',
  'Amber Ale', 'Belgian', 'Saison', 'Otro',
];

const SIZE_OPTIONS = [
  { value: 'caña' as const, label: 'Caña', emoji: '🍺' },
  { value: 'doble' as const, label: 'Doble', emoji: '🍻' },
  { value: 'pinta' as const, label: 'Pinta', emoji: '🍺' },
  { value: 'tercio' as const, label: 'Tercio', emoji: '🍶' },
  { value: 'quinto' as const, label: 'Quinto', emoji: '🥃' },
];

export default function QuickBeerLog({
  isOpen,
  onClose,
  onSubmit,
  barName: initialBarName = '',
  barId,
  mapCoords,
  isLoading = false,
}: QuickBeerLogProps) {
  const [beerName, setBeerName] = useState('');
  const [barName, setBarName] = useState(initialBarName);
  const [style, setStyle] = useState('');
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState('');
  const [size, setSize] = useState<QuickBeerData['size']>('caña');
  const [isDraft, setIsDraft] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const beerNameRef = useRef<HTMLInputElement>(null);

  // Animate in/out
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
      // Focus beer name after animation
      setTimeout(() => beerNameRef.current?.focus(), 350);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Reset form when opening with new bar
  useEffect(() => {
    if (isOpen) {
      setBeerName('');
      setBarName(initialBarName);
      setStyle('');
      setRating(0);
      setPrice('');
      setSize('caña');
      setIsDraft(true);
      setIsPublic(true);
      setPhoto(null);
      setPhotoPreview(null);
      setShowStylePicker(false);
    }
  }, [isOpen, initialBarName]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!beerName.trim() || !rating) return;

    onSubmit({
      barId,
      barName: barName || initialBarName,
      beerName: beerName.trim(),
      style: style || 'Otro',
      rating,
      price: parseFloat(price) || 0,
      size,
      isDraft,
      isPublic,
      photo: photo || undefined,
      newBarCoords: !barId ? mapCoords : undefined,
    });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const canSubmit = beerName.trim() && rating > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 pointer-events-auto transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`absolute bottom-0 left-0 right-0 pointer-events-auto bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-800 truncate">
              {barId ? `Cerveza en ${initialBarName}` : 'Registrar cerveza'}
            </h2>
            {!barId && mapCoords && (
              <p className="text-xs text-slate-400 mt-0.5">Nuevo punto en el mapa</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="ml-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>
          {/* Bar name (if new location) */}
          {!barId && (
            <div className="mb-4">
              <input
                type="text"
                value={barName}
                onChange={(e) => setBarName(e.target.value)}
                placeholder="Nombre del bar..."
                className="w-full px-4 py-3 bg-amber-50 border-2 border-amber-200 rounded-2xl text-slate-800 font-semibold placeholder-amber-300 focus:border-amber-400 focus:bg-amber-50/80 transition-all"
              />
            </div>
          )}

          {/* Beer name - always visible */}
          <div className="mb-4">
            <input
              ref={beerNameRef}
              type="text"
              value={beerName}
              onChange={(e) => setBeerName(e.target.value)}
              placeholder="Nombre de la cerveza..."
              className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-lg font-semibold text-slate-800 placeholder-slate-400 focus:border-amber-400 focus:bg-white transition-all"
            />
          </div>

          {/* Rating - big, tappable stars */}
          <div className="flex items-center justify-center gap-3 mb-5 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star === rating ? 0 : star)}
                className="transition-all duration-150 active:scale-90"
              >
                <Star
                  size={40}
                  className={`transition-all duration-200 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Style picker - compact */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowStylePicker(!showStylePicker)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-600 hover:border-slate-300 transition-all"
            >
              <span className={style ? 'text-slate-800 font-semibold' : 'text-slate-400'}>
                {style || 'Estilo de cerveza'}
              </span>
              <ChevronDown
                size={20}
                className={`text-slate-400 transition-transform ${showStylePicker ? 'rotate-180' : ''}`}
              />
            </button>
            {showStylePicker && (
              <div className="mt-2 flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                {BEER_STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setStyle(s);
                      setShowStylePicker(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                      style === s
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick options row: Price + Size + Draft */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Price */}
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Precio"
                step="0.1"
                min="0"
                className="w-full px-3 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center font-semibold text-slate-800 placeholder-slate-400 focus:border-amber-400 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                €
              </span>
            </div>

            {/* Size */}
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as QuickBeerData['size'])}
              className="px-2 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center font-semibold text-slate-800 focus:border-amber-400 transition-all appearance-none"
            >
              {SIZE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.emoji} {opt.label}
                </option>
              ))}
            </select>

            {/* Draft / Bottle toggle */}
            <div className="flex rounded-2xl overflow-hidden border-2 border-slate-200">
              <button
                type="button"
                onClick={() => setIsDraft(true)}
                className={`flex-1 py-3 text-xs font-bold transition-all ${
                  isDraft
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-50 text-slate-500'
                }`}
              >
                Grifo
              </button>
              <button
                type="button"
                onClick={() => setIsDraft(false)}
                className={`flex-1 py-3 text-xs font-bold transition-all ${
                  !isDraft
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-50 text-slate-500'
                }`}
              >
                Botella
              </button>
            </div>
          </div>

          {/* Photo + Visibility row */}
          <div className="flex items-center gap-3 mb-5">
            {/* Photo button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                photoPreview
                  ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                  : 'bg-slate-100 text-slate-500 border-2 border-slate-200 hover:border-slate-300'
              }`}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="" className="w-6 h-6 rounded-lg object-cover" />
              ) : (
                <Camera size={18} />
              )}
              {photoPreview ? 'Foto lista' : 'Foto'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />

            {/* Public/Private toggle */}
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
                isPublic
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-slate-100 text-slate-500 border-2 border-slate-200'
              }`}
            >
              {isPublic ? '🌍 Público' : '🔒 Privado'}
            </button>

            {/* Spacer */}
            <div className="flex-1" />
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
              canSubmit
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send size={22} />
            {isLoading ? 'Guardando...' : 'Registrar cerveza'}
          </button>
        </div>
      </div>
    </div>
  );
}
