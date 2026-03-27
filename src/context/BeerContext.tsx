import { createContext, useContext, useState, useCallback } from 'react';

export interface SavedBeer {
  id: string;
  userId: string;
  userName: string;
  beerName: string;
  style: string;
  rating: number;
  price: number;
  size: string;
  isDraft: boolean;
  isPublic: boolean;
  notes: string;
  barId?: string;
  barName: string;
  barAddress?: string;
  barLat?: number;
  barLng?: number;
  photoUrl?: string;
  tags?: string[];
  createdAt: string;
}

interface BeerContextType {
  beers: SavedBeer[];
  addBeer: (beer: Omit<SavedBeer, 'id' | 'createdAt'>) => SavedBeer;
  getPublicBeers: () => SavedBeer[];
  getUserBeers: (userId: string) => SavedBeer[];
  getFavorites: (userId: string) => SavedBeer[];
  toggleFavorite: (userId: string, beerId: string) => void;
  isFavorite: (userId: string, beerId: string) => boolean;
}

const BeerContext = createContext<BeerContextType | undefined>(undefined);

// Seed data so the app doesn't feel empty
const SEED_BEERS: SavedBeer[] = [
  {
    id: 'seed-1',
    userId: 'user-demo-1',
    userName: 'Juan López',
    beerName: 'Doble Lúpulo IPA',
    style: 'IPA',
    rating: 5,
    price: 5.5,
    size: 'Pinta',
    isDraft: true,
    isPublic: true,
    notes: 'Increíble aroma a cítricos y pino. Amargor equilibrado, cuerpo medio. De las mejores IPAs que he probado en Madrid.',
    barName: 'La Cervecería del Barrio',
    barAddress: 'Calle Huertas 12, Madrid',
    barLat: 40.42,
    barLng: -3.70,
    tags: ['lupulada', 'cítrica', 'top'],
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'seed-2',
    userId: 'user-demo-2',
    userName: 'María García',
    beerName: 'Guinness Draught',
    style: 'Stout',
    rating: 4,
    price: 5.5,
    size: 'Pinta',
    isDraft: true,
    isPublic: true,
    notes: 'Clásica. Cremosa, tostada, perfecta para el frío.',
    barName: 'The Irish Rover',
    barAddress: 'Av. de Brasil 7, Madrid',
    barLat: 40.415,
    barLng: -3.695,
    tags: ['clásica', 'cremosa'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
  },
  {
    id: 'seed-3',
    userId: 'user-demo-3',
    userName: 'Carlos Ruiz',
    beerName: 'Alhambra Reserva',
    style: 'Lager',
    rating: 4,
    price: 3.5,
    size: 'Tercio',
    isDraft: false,
    isPublic: true,
    notes: 'Buena relación calidad precio. Suave, refrescante.',
    barName: 'La Tape',
    barAddress: 'Calle San Bernardo 88',
    barLat: 40.425,
    barLng: -3.705,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'seed-4',
    userId: 'user-demo-4',
    userName: 'Ana Martínez',
    beerName: 'West Coast IPA',
    style: 'IPA',
    rating: 5,
    price: 7.0,
    size: 'Pinta',
    isDraft: true,
    isPublic: true,
    notes: 'Brutal. Seca, amarga, resinosa. Para amantes del lúpulo americano.',
    barName: 'Craft & Co.',
    barLat: 40.418,
    barLng: -3.692,
    tags: ['amarga', 'resinosa', 'craft'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'seed-5',
    userId: 'user-demo-1',
    userName: 'Juan López',
    beerName: 'Hazy DIPA',
    style: 'DIPA',
    rating: 5,
    price: 6.5,
    size: 'Doble',
    isDraft: true,
    isPublic: true,
    notes: 'Turbidísima, tropical, jugosa. 8% que no se notan. Peligrosa.',
    barName: 'Fábrica Maravillas',
    barAddress: 'Calle Valverde 29',
    barLat: 40.422,
    barLng: -3.701,
    tags: ['hazy', 'tropical', 'peligrosa'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function BeerProvider({ children }: { children: React.ReactNode }) {
  const [beers, setBeers] = useState<SavedBeer[]>(SEED_BEERS);
  const [favorites, setFavorites] = useState<Map<string, Set<string>>>(new Map());

  const addBeer = useCallback((beer: Omit<SavedBeer, 'id' | 'createdAt'>) => {
    const newBeer: SavedBeer = {
      ...beer,
      id: `beer-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setBeers((prev) => [newBeer, ...prev]);
    return newBeer;
  }, []);

  const getPublicBeers = useCallback(() => {
    return beers.filter((b) => b.isPublic).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [beers]);

  const getUserBeers = useCallback((userId: string) => {
    return beers.filter((b) => b.userId === userId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [beers]);

  const getFavorites = useCallback((userId: string) => {
    const userFavs = favorites.get(userId);
    if (!userFavs || userFavs.size === 0) return [];
    return beers.filter((b) => userFavs.has(b.id));
  }, [beers, favorites]);

  const toggleFavorite = useCallback((userId: string, beerId: string) => {
    setFavorites((prev) => {
      const next = new Map(prev);
      const userFavs = new Set(next.get(userId) || []);
      if (userFavs.has(beerId)) {
        userFavs.delete(beerId);
      } else {
        userFavs.add(beerId);
      }
      next.set(userId, userFavs);
      return next;
    });
  }, []);

  const isFavorite = useCallback((userId: string, beerId: string) => {
    return favorites.get(userId)?.has(beerId) || false;
  }, [favorites]);

  return (
    <BeerContext.Provider value={{ beers, addBeer, getPublicBeers, getUserBeers, getFavorites, toggleFavorite, isFavorite }}>
      {children}
    </BeerContext.Provider>
  );
}

export function useBeers() {
  const context = useContext(BeerContext);
  if (!context) {
    throw new Error('useBeers must be used within a BeerProvider');
  }
  return context;
}
