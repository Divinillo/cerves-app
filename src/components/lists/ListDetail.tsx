import { useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import BeerLogCard from '../beer-log/BeerLogCard';

interface ListDetailProps {
  data?: {
    id: string;
    name: string;
    description: string;
    beers: any[];
    isOwn: boolean;
  };
}

export default function ListDetail({ data }: ListDetailProps) {
  const { listId } = useParams();

  // Mock data
  const list = data || {
    id: listId || '1',
    name: 'Mis IPAs Favoritas',
    description: 'Las mejores IPAs que he probado en mi vida cervecera',
    beers: [
      {
        id: 'beer1',
        beerName: 'Doble Lúpulo IPA',
        style: 'IPA',
        barName: 'La Cervecería del Barrio',
        rating: 4.8,
        price: 5.5,
        size: 'caña',
        isDraft: true,
      },
      {
        id: 'beer2',
        beerName: 'IPA de Trigo',
        style: 'IPA',
        barName: 'El Sótano Cervecero',
        rating: 4.6,
        price: 6.0,
        size: 'caña',
        isDraft: true,
      },
    ],
    isOwn: true,
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{list.name}</h1>
            <p className="text-slate-600 mt-2">{list.description}</p>
          </div>
          {list.isOwn && (
            <button className="text-slate-500 hover:text-red-600 transition">
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="bg-amber-50 rounded-lg p-4">
          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-800">{list.beers.length}</span> cervezas en esta lista
          </p>
        </div>

        {/* Add Button */}
        {list.isOwn && (
          <button className="w-full mt-4 border-2 border-dashed border-amber-500 hover:bg-amber-50 text-amber-600 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2">
            <Plus size={20} />
            Añadir cerveza
          </button>
        )}
      </div>

      {/* Beers Grid */}
      {list.beers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.beers.map((beer) => (
            <div key={beer.id} className="relative">
              <BeerLogCard
                id={beer.id}
                beerName={beer.beerName}
                style={beer.style}
                barName={beer.barName}
                rating={beer.rating}
                price={beer.price}
                size={beer.size}
                isDraft={beer.isDraft}
              />
              {list.isOwn && (
                <button className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-slate-500 text-lg">Esta lista está vacía</p>
          {list.isOwn && (
            <>
              <p className="text-slate-400 text-sm mt-2">
                Empieza a añadir cervezas a esta lista
              </p>
              <button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 mx-auto">
                <Plus size={20} />
                Añadir primera cerveza
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
