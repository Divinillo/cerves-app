import { useState } from 'react';
import { Trophy } from 'lucide-react';
import Rating from '../shared/Rating';

const BEER_STYLES = [
  'Todas',
  'IPA',
  'Lager',
  'Stout',
  'Porter',
  'Pilsner',
  'Wheat',
  'APA',
  'DIPA',
  'Sour',
];

const mockBeers = [
  { id: 'beer1', name: 'Doble Lúpulo IPA', style: 'IPA', rating: 4.8, reviewCount: 142, brewery: 'La Virgen' },
  { id: 'beer2', name: 'Porter Negra', style: 'Porter', rating: 4.7, reviewCount: 98, brewery: 'Cibeles' },
  { id: 'beer3', name: 'IPA de Trigo', style: 'IPA', rating: 4.6, reviewCount: 87, brewery: 'La Cibeles' },
  { id: 'beer4', name: 'Mahou Clásica', style: 'Lager', rating: 4.3, reviewCount: 312, brewery: 'Mahou' },
  { id: 'beer5', name: 'Alhambra Reserva', style: 'Lager', rating: 4.5, reviewCount: 267, brewery: 'Alhambra' },
  { id: 'beer6', name: 'Guinness Draught', style: 'Stout', rating: 4.4, reviewCount: 189, brewery: 'Guinness' },
  { id: 'beer7', name: 'Pilsner Urquell', style: 'Pilsner', rating: 4.2, reviewCount: 156, brewery: 'Urquell' },
  { id: 'beer8', name: 'Blue Moon', style: 'Wheat', rating: 4.1, reviewCount: 134, brewery: 'Blue Moon' },
  { id: 'beer9', name: 'West Coast IPA', style: 'IPA', rating: 4.9, reviewCount: 76, brewery: 'Basqueland' },
  { id: 'beer10', name: 'Founders APA', style: 'APA', rating: 4.3, reviewCount: 92, brewery: 'Founders' },
  { id: 'beer11', name: 'Imperial Stout', style: 'Stout', rating: 4.6, reviewCount: 64, brewery: 'Naparbier' },
  { id: 'beer12', name: 'Berliner Weisse Sour', style: 'Sour', rating: 4.0, reviewCount: 48, brewery: 'Garage Beer' },
  { id: 'beer13', name: 'Hazy DIPA', style: 'DIPA', rating: 4.7, reviewCount: 55, brewery: 'Basqueland' },
  { id: 'beer14', name: 'Cruzcampo Gran Reserva', style: 'Lager', rating: 3.9, reviewCount: 201, brewery: 'Cruzcampo' },
  { id: 'beer15', name: 'Ambar Export', style: 'Pilsner', rating: 4.0, reviewCount: 178, brewery: 'Ambar' },
];

const mockBars = [
  { id: 'bar1', name: 'La Cervecería del Barrio', rating: 4.7, reviewCount: 324 },
  { id: 'bar2', name: 'El Sótano Cervecero', rating: 4.6, reviewCount: 287 },
  { id: 'bar3', name: 'Taverna de Hopas', rating: 4.5, reviewCount: 256 },
  { id: 'bar4', name: 'Craft & Co.', rating: 4.8, reviewCount: 198 },
  { id: 'bar5', name: 'La Tape', rating: 4.4, reviewCount: 345 },
  { id: 'bar6', name: 'Cervecería 100 Montaditos', rating: 3.8, reviewCount: 512 },
  { id: 'bar7', name: 'The Irish Rover', rating: 4.3, reviewCount: 267 },
  { id: 'bar8', name: 'Fábrica Maravillas', rating: 4.6, reviewCount: 189 },
];

export default function RankingsView() {
  const [tab, setTab] = useState<'beers' | 'bars'>('beers');
  const [styleFilter, setStyleFilter] = useState('Todas');

  // Apply filter
  const filteredBeers = styleFilter === 'Todas'
    ? mockBeers
    : mockBeers.filter((b) => b.style === styleFilter);

  // Sort by rating descending
  const sortedBeers = [...filteredBeers].sort((a, b) => b.rating - a.rating);
  const sortedBars = [...mockBars].sort((a, b) => b.rating - a.rating);

  const displayItems = tab === 'beers' ? sortedBeers : sortedBars;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-2xl p-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'}}></div>
        <div className="relative">
          <div className="flex items-center gap-4 mb-3">
            <Trophy size={40} />
            <h1 className="text-4xl font-bold">Rankings</h1>
          </div>
          <p className="text-white/80 text-lg">
            Descubre las mejores cervezas y bares de la comunidad
          </p>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex gap-3">
            <button
              onClick={() => setTab('beers')}
              className={`px-6 py-3 font-bold rounded-xl transition-all ${
                tab === 'beers'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cervezas
            </button>
            <button
              onClick={() => setTab('bars')}
              className={`px-6 py-3 font-bold rounded-xl transition-all ${
                tab === 'bars'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Bares
            </button>
          </div>

          {/* Style Filter - Only for beers */}
          {tab === 'beers' && (
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="md:ml-auto px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-500 transition-all"
            >
              {BEER_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style === 'Todas' ? `Todas (${mockBeers.length})` : `${style} (${mockBeers.filter(b => b.style === style).length})`}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Rankings List */}
      <div className="space-y-4">
        {displayItems.map((item, index) => {
          const medalEmojis = ['🥇', '🥈', '🥉'];
          const medal = medalEmojis[index] || `#${index + 1}`;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex items-center gap-6 group hover:translate-x-1"
            >
              {/* Position Medal */}
              <div className="flex-shrink-0 text-4xl min-w-[48px] text-center">
                {typeof medal === 'string' && medal.startsWith('#') ? (
                  <span className="text-xl font-bold text-slate-400">{medal}</span>
                ) : (
                  medal
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-lg truncate">{item.name}</h3>
                {'brewery' in item && (
                  <p className="text-sm text-slate-600">{(item as typeof mockBeers[0]).brewery}</p>
                )}
                {'style' in item && (
                  <span className="inline-block mt-1 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                    {(item as typeof mockBeers[0]).style}
                  </span>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  <strong>{item.reviewCount}</strong> reseñas
                </p>
              </div>

              {/* Rating */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 justify-end mb-2">
                  <Rating
                    value={Math.round(item.rating)}
                    readonly
                    size="sm"
                  />
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {item.rating.toFixed(1)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {displayItems.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-slate-700 text-xl font-semibold">No hay cervezas de este estilo</p>
          <p className="text-slate-500 mt-2">Prueba con otro filtro</p>
        </div>
      )}
    </div>
  );
}
