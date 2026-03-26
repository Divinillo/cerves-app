import React, { useState } from 'react';
import { Save, Plus } from 'lucide-react';
import Rating from '../shared/Rating';
import ImageUpload from '../shared/ImageUpload';
import TagBadge from '../shared/TagBadge';
import Modal from '../shared/Modal';

interface BeerLogFormProps {
  onSubmit: (data: BeerLogData) => void;
  isLoading?: boolean;
}

interface BeerLogData {
  barId: string;
  beerName: string;
  style: string;
  rating: number;
  price: number;
  size: 'caña' | 'doble' | 'pinta' | 'tercio' | 'quinto';
  draft: boolean;
  photo?: File;
  review: string;
  tags: string[];
  isPublic: boolean;
}

const BEER_STYLES = [
  'IPA',
  'Lager',
  'Stout',
  'Porter',
  'Pilsner',
  'Wheat',
  'APA',
  'DIPA',
  'Sour',
  'Otro',
];

const SIZE_OPTIONS: Array<BeerLogData['size']> = ['caña', 'doble', 'pinta', 'tercio', 'quinto'];

export default function BeerLogForm({ onSubmit, isLoading = false }: BeerLogFormProps) {
  const [formData, setFormData] = useState<Partial<BeerLogData>>({
    rating: 0,
    draft: true,
    isPublic: true,
    tags: [],
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [showAddBar, setShowAddBar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.barId ||
      !formData.beerName ||
      !formData.style ||
      !formData.rating ||
      !formData.size ||
      formData.price === undefined
    ) {
      alert('Por favor rellena todos los campos requeridos');
      return;
    }

    onSubmit({
      barId: formData.barId!,
      beerName: formData.beerName!,
      style: formData.style!,
      rating: formData.rating!,
      price: formData.price!,
      size: formData.size!,
      draft: formData.draft ?? true,
      photo: photo || undefined,
      review: formData.review || '',
      tags: formData.tags || [],
      isPublic: formData.isPublic ?? true,
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag),
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Registra una cerveza</h1>
          <p className="text-slate-600">Comparte tu experiencia cervecera con la comunidad</p>
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
            Foto
          </label>
          <ImageUpload onFileSelected={setPhoto} />
        </div>

        {/* Beer Name */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Nombre de la cerveza *
          </label>
          <input
            type="text"
            value={formData.beerName || ''}
            onChange={(e) => setFormData({ ...formData, beerName: e.target.value })}
            placeholder="Ej: Doble Lúpulo IPA"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
            required
          />
        </div>

        {/* Bar Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Bar *
          </label>
          <div className="flex gap-2">
            <select
              value={formData.barId || ''}
              onChange={(e) => setFormData({ ...formData, barId: e.target.value })}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
              required
            >
              <option value="">Selecciona un bar</option>
              <option value="1">La Cervecería del Barrio</option>
              <option value="2">El Sótano Cervecero</option>
            </select>
            <button
              type="button"
              onClick={() => setShowAddBar(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl transition-all font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo
            </button>
          </div>
        </div>

        {/* Beer Style and Rating Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Estilo *
            </label>
            <select
              value={formData.style || ''}
              onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
              required
            >
              <option value="">Selecciona un estilo</option>
              {BEER_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
              Puntuación *
            </label>
            <Rating
              value={formData.rating || 0}
              onChange={(value) => setFormData({ ...formData, rating: value })}
              size="lg"
            />
          </div>
        </div>

        {/* Price and Size Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Precio *
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-3 pr-8 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
              Tamaño *
            </label>
            <select
              value={formData.size || ''}
              onChange={(e) => setFormData({ ...formData, size: e.target.value as BeerLogData['size'] })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
              required
            >
              <option value="">Selecciona tamaño</option>
              {SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Draft/Bottle Pills */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
            Presentación
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, draft: true })}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                formData.draft === true
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🍻 Grifo
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, draft: false })}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                formData.draft === false
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🍾 Botella
            </button>
          </div>
        </div>

        {/* Review */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
            Comentario
          </label>
          <textarea
            value={formData.review || ''}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            placeholder="¿Qué te pareció esta cerveza? Aroma, sabor, cuerpo..."
            rows={4}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
            Etiquetas
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Añade una etiqueta y presiona Enter"
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-xl font-semibold transition-all"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map((tag) => (
              <TagBadge
                key={tag}
                label={tag}
                onRemove={() => removeTag(tag)}
              />
            ))}
          </div>
        </div>

        {/* Visibility Toggle */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isPublic ?? true}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-5 h-5 accent-amber-500"
            />
            <div>
              <p className="font-semibold text-slate-800">Compartir públicamente</p>
              <p className="text-xs text-slate-600">Otros usuarios verán esta cerveza en el feed</p>
            </div>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 text-white py-4 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-lg"
        >
          <Save size={24} />
          {isLoading ? 'Guardando...' : 'Guardar cerveza'}
        </button>
      </form>

      {/* Add Bar Modal */}
      <Modal
        isOpen={showAddBar}
        onClose={() => setShowAddBar(false)}
        title="Nuevo bar"
      >
        <p className="text-slate-600">Funcionalidad para añadir bar próximamente</p>
      </Modal>
    </div>
  );
}
