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
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-slate-800">Registrar una cerveza</h1>

        {/* Bar Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bar *
          </label>
          <div className="flex gap-2">
            <select
              value={formData.barId || ''}
              onChange={(e) => setFormData({ ...formData, barId: e.target.value })}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            >
              <option value="">Selecciona un bar</option>
              <option value="1">La Cervecería del Barrio</option>
              <option value="2">El Sótano Cervecero</option>
            </select>
            <button
              type="button"
              onClick={() => setShowAddBar(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <Plus size={20} />
              Nuevo
            </button>
          </div>
        </div>

        {/* Beer Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre de la cerveza *
          </label>
          <input
            type="text"
            value={formData.beerName || ''}
            onChange={(e) => setFormData({ ...formData, beerName: e.target.value })}
            placeholder="Ej: Doble Lúpulo IPA"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        {/* Beer Style */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estilo *
          </label>
          <select
            value={formData.style || ''}
            onChange={(e) => setFormData({ ...formData, style: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Puntuación *
          </label>
          <Rating
            value={formData.rating || 0}
            onChange={(value) => setFormData({ ...formData, rating: value })}
            size="lg"
          />
        </div>

        {/* Price and Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <span className="absolute right-3 top-2 text-slate-500">€</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tamaño *
            </label>
            <select
              value={formData.size || ''}
              onChange={(e) => setFormData({ ...formData, size: e.target.value as BeerLogData['size'] })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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

        {/* Draft/Bottle */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={formData.draft === true}
              onChange={() => setFormData({ ...formData, draft: true })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-slate-700">Grifo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={formData.draft === false}
              onChange={() => setFormData({ ...formData, draft: false })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-slate-700">Botella</span>
          </label>
        </div>

        {/* Photo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Foto de la cerveza
          </label>
          <ImageUpload onFileSelected={setPhoto} />
        </div>

        {/* Review */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Comentario
          </label>
          <textarea
            value={formData.review || ''}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            placeholder="¿Qué te pareció esta cerveza?"
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Etiquetas
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Añade una etiqueta"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition"
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

        {/* Visibility */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="visibility"
            checked={formData.isPublic ?? true}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="visibility" className="text-sm font-medium text-slate-700">
            Público (visible para otros usuarios)
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          <Save size={20} />
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
