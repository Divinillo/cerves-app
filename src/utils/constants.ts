// Beer sizes
export const BEER_SIZES = [
  { label: 'Caña', value: 'caña' as const, ml: 200 },
  { label: 'Doble', value: 'doble' as const, ml: 400 },
  { label: 'Pinta', value: 'pinta' as const, ml: 568 },
  { label: 'Tercio', value: 'tercio' as const, ml: 333 },
  { label: 'Quinto', value: 'quinto' as const, ml: 200 },
];

// Map configuration
export const DEFAULT_MAP_CENTER: [number, number] = [40.4168, -3.7038]; // Madrid
export const DEFAULT_ZOOM = 12;
export const MIN_ZOOM = 8;
export const MAX_ZOOM = 18;

// Geolocation defaults
export const DEFAULT_SEARCH_RADIUS_KM = 5;
export const MAX_SEARCH_RADIUS_KM = 25;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Rating
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// Badge conditions
export const BADGE_CONDITIONS = {
  BEER_COLLECTOR: 10, // 10 beers logged
  BAR_EXPLORER: 5, // 5 different bars
  STYLE_COLLECTOR: 5, // 5 different beer styles
  SOCIAL_BUTTERFLY: 10, // 10 followers
  AREA_EXPERT: 20, // 20 beers in same area
};

// Feed activity types
export const ACTIVITY_LABELS = {
  beer_log: 'logged a beer',
  follow: 'started following',
  badge_earned: 'earned a badge',
  favorite: 'liked',
};

// URLs for images (if using a CDN or similar)
export const DEFAULT_AVATAR_URL =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=';
