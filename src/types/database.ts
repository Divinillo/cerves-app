// Database type definitions

export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Bar {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photo_url?: string;
  average_rating: number;
  total_beers: number;
  created_at: string;
  updated_at: string;
}

export interface BeerLog {
  id: string;
  user_id: string;
  bar_id: string;
  beer_name: string;
  beer_style: string;
  rating: number;
  price: number;
  size: 'caña' | 'doble' | 'pinta' | 'tercio' | 'quinto';
  is_draft: boolean;
  photo_url?: string;
  review?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface BeerTag {
  id: string;
  beer_log_id: string;
  tag_name: string;
  created_at: string;
}

export interface BeerList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListItem {
  id: string;
  list_id: string;
  beer_log_id: string;
  added_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon: string;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  beer_log_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type Visibility = 'private' | 'public';

export type BeerSize = 'caña' | 'doble' | 'pinta' | 'tercio' | 'quinto';

export type ActivityType = 'beer_logged' | 'badge_earned' | 'list_created';

export interface ThematicList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  visibility: Visibility;
  cover_photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ThematicListItem {
  id: string;
  thematic_list_id: string;
  beer_log_id: string;
  position: number;
  created_at: string;
}

export interface FeedActivity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  related_beer_log_id?: string;
  related_badge_id?: string;
  related_list_id?: string;
  created_at: string;
}
