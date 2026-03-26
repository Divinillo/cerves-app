import { useState } from 'react';
import { Trophy } from 'lucide-react';
import Rating from '../shared/Rating';

interface RankingsViewProps {
  items?: Array<{
    position: number;
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    image?: string;
  }>;
}

const BEER_STYLES = [
  'Todas',
  'IPA',
  'Lager',
  'Stout',
  'Porter',
  'Pilsner',
  'Wheat',
  'APA',
];

export default function RankingsView({ items }: RankingsViewProps) {
  const [tab, setTab] = useState<'beers' | 'bars'>('beers');
  const [styleFilter, setStyleFilter] = useState('Todas');

  const mockBeers = [
    {
      position: 1,
      id: 'beer1',
      name: 'Doble Lúpulo IPA',
      rating: 4.8,
      reviewCount: 142,
      brewery: 'Cervecería Local',
    },
    {
      position: 2,
      id: 'beer2',
      name: 'Porter Negra',
      rating: 4.7,
      reviewCount: 98,
      brewery: 'Cervecería Local',
    },
    {
      position: 3,
      id: 'beer3',
      name: 'IPA de Trigo',
      rating: 4.6,
      reviewCount: 87,
      brewery: 'Cervecería Local',
    },
  ];

  const mockBars = [
    {
      position: 1,
      id: 'bar1',
      name: 'La Cervecería del Barrio',
      rating: 4.7,
      reviewCount: 324,
    },
    {
      position: 2,
      id: 'bar2',
      name: 'El Sótano Cervecero',
      rating: 4.6,
      reviewCount: 287,
    },
    {
      position: 3,
      id: 'bar3',
      name: 'Taverna de Hopas',
      rating: 4.5,
      reviewCount: 256,
    },
  ];

  const displayItems = items || (tab === 'beers' ? mockBeers : mockBars);

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
                  {style}
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
          const medal = medalEmojis[index] || '🔹';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex items-center gap-6 group hover:translate-x-1"
            >
              {/* Position Medal */}
              <div className="flex-shrink-0 text-4xl">
                {medal}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-lg truncate">{item.name}</h3>
                {('brewery' in item) && (
                  <p className="text-sm text-slate-600">{(item as any).brewery}</p>
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
          <p className="text-slate-700 text-xl font-semibold">No hay rankings disponibles</p>
        </div>
      )}
    </div>
  );
}
