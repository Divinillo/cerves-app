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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center gap-3">
          <Trophy size={32} />
          <h1 className="text-3xl font-bold">Rankings</h1>
        </div>
        <p className="text-amber-100 mt-2">
          Descubre las mejores cervezas y bares de la comunidad
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setTab('beers')}
          className={`px-6 py-2 font-semibold transition rounded-lg ${
            tab === 'beers'
              ? 'bg-amber-500 text-white'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Cervezas
        </button>
        <button
          onClick={() => setTab('bars')}
          className={`px-6 py-2 font-semibold transition rounded-lg ${
            tab === 'bars'
              ? 'bg-amber-500 text-white'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Bares
        </button>

        {/* Style Filter - Only for beers */}
        {tab === 'beers' && (
          <select
            value={styleFilter}
            onChange={(e) => setStyleFilter(e.target.value)}
            className="ml-auto px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {BEER_STYLES.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {displayItems.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition"
          >
            {/* Position */}
            <div className="flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                    : index === 1
                      ? 'bg-gradient-to-r from-slate-300 to-slate-400'
                      : index === 2
                        ? 'bg-gradient-to-r from-orange-300 to-orange-400'
                        : 'bg-slate-400'
                }`}
              >
                {item.position}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{item.name}</h3>
              {('brewery' in item) && (
                <p className="text-sm text-slate-600">{(item as any).brewery}</p>
              )}
              <p className="text-xs text-slate-500">
                {item.reviewCount} reseñas
              </p>
            </div>

            {/* Rating */}
            <div className="flex-shrink-0 text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <Rating
                  value={Math.round(item.rating)}
                  readonly
                  size="sm"
                />
              </div>
              <p className="text-xl font-bold text-amber-600">
                {item.rating.toFixed(1)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {displayItems.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No hay rankings disponibles</p>
        </div>
      )}
    </div>
  );
}
