-- Cerves Beer Tracking App - Complete Database Schema
-- Supabase PostgreSQL Migration
-- FULLY IDEMPOTENT - can be run multiple times without errors

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. BARS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS bars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  address TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE bars ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_bars_created_by ON bars(created_by);
CREATE INDEX IF NOT EXISTS idx_bars_location ON bars(latitude, longitude);

-- ============================================================================
-- 3. BEER STYLES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS beer_styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE beer_styles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. BEER LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS beer_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bar_id UUID REFERENCES bars(id) ON DELETE SET NULL,
  beer_style_id UUID NOT NULL REFERENCES beer_styles(id) ON DELETE RESTRICT,
  beer_name TEXT NOT NULL,
  price DECIMAL(10, 2),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_draft BOOLEAN DEFAULT true,
  size TEXT,
  review TEXT,
  photo_url TEXT,
  is_favorite BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE beer_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_beer_logs_user_id ON beer_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_beer_logs_bar_id ON beer_logs(bar_id);
CREATE INDEX IF NOT EXISTS idx_beer_logs_beer_style_id ON beer_logs(beer_style_id);
CREATE INDEX IF NOT EXISTS idx_beer_logs_visibility ON beer_logs(visibility);
CREATE INDEX IF NOT EXISTS idx_beer_logs_created_at ON beer_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beer_logs_user_visibility ON beer_logs(user_id, visibility);

-- ============================================================================
-- 5. TAGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_tags_created_by ON tags(created_by);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- ============================================================================
-- 6. BEER LOG TAGS JUNCTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS beer_log_tags (
  beer_log_id UUID NOT NULL REFERENCES beer_logs(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (beer_log_id, tag_id)
);

ALTER TABLE beer_log_tags ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_beer_log_tags_tag_id ON beer_log_tags(tag_id);

-- ============================================================================
-- 7. FAVORITES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  beer_log_id UUID NOT NULL REFERENCES beer_logs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, beer_log_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_beer_log_id ON favorites(beer_log_id);

-- ============================================================================
-- 8. BADGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  badge_type TEXT NOT NULL,
  threshold INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_badges_badge_type ON badges(badge_type);

-- ============================================================================
-- 9. USER BADGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_at ON user_badges(earned_at DESC);

-- ============================================================================
-- 10. THEMATIC LISTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS thematic_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  cover_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE thematic_lists ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_thematic_lists_user_id ON thematic_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_thematic_lists_visibility ON thematic_lists(visibility);

-- ============================================================================
-- 11. THEMATIC LIST ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS thematic_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES thematic_lists(id) ON DELETE CASCADE,
  beer_log_id UUID NOT NULL REFERENCES beer_logs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE thematic_list_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_thematic_list_items_list_id ON thematic_list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_thematic_list_items_beer_log_id ON thematic_list_items(beer_log_id);

-- ============================================================================
-- 12. FOLLOWS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- ============================================================================
-- 13. FEED ACTIVITIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS feed_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('beer_logged', 'badge_earned', 'list_created')),
  related_beer_log_id UUID REFERENCES beer_logs(id) ON DELETE SET NULL,
  related_badge_id UUID REFERENCES badges(id) ON DELETE SET NULL,
  related_list_id UUID REFERENCES thematic_lists(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE feed_activities ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_feed_activities_user_id ON feed_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_activities_created_at ON feed_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feed_activities_activity_type ON feed_activities(activity_type);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - PROFILES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view public profiles" ON profiles;
CREATE POLICY "Users can view public profiles" ON profiles
  FOR SELECT USING (is_public = true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - BARS
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view bars" ON bars;
CREATE POLICY "Anyone can view bars" ON bars
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create bars" ON bars;
CREATE POLICY "Users can create bars" ON bars
  FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own bars" ON bars;
CREATE POLICY "Users can update own bars" ON bars
  FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own bars" ON bars;
CREATE POLICY "Users can delete own bars" ON bars
  FOR DELETE USING (auth.uid() = created_by);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - BEER STYLES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view beer styles" ON beer_styles;
CREATE POLICY "Anyone can view beer styles" ON beer_styles
  FOR SELECT USING (true);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - BEER LOGS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own beer logs" ON beer_logs;
CREATE POLICY "Users can view own beer logs" ON beer_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view public beer logs" ON beer_logs;
CREATE POLICY "Anyone can view public beer logs" ON beer_logs
  FOR SELECT USING (visibility = 'public');

DROP POLICY IF EXISTS "Users can create beer logs" ON beer_logs;
CREATE POLICY "Users can create beer logs" ON beer_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own beer logs" ON beer_logs;
CREATE POLICY "Users can update own beer logs" ON beer_logs
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own beer logs" ON beer_logs;
CREATE POLICY "Users can delete own beer logs" ON beer_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - TAGS
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view tags" ON tags;
CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create tags" ON tags;
CREATE POLICY "Users can create tags" ON tags
  FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own tags" ON tags;
CREATE POLICY "Users can update own tags" ON tags
  FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can delete own tags" ON tags;
CREATE POLICY "Users can delete own tags" ON tags
  FOR DELETE USING (auth.uid() = created_by);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - BEER LOG TAGS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view beer log tags" ON beer_log_tags;
CREATE POLICY "Users can view beer log tags" ON beer_log_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM beer_logs
      WHERE beer_logs.id = beer_log_tags.beer_log_id
      AND (auth.uid() = beer_logs.user_id OR beer_logs.visibility = 'public')
    )
  );

DROP POLICY IF EXISTS "Users can manage own beer log tags" ON beer_log_tags;
CREATE POLICY "Users can manage own beer log tags" ON beer_log_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM beer_logs
      WHERE beer_logs.id = beer_log_tags.beer_log_id
      AND auth.uid() = beer_logs.user_id
    )
  );

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - FAVORITES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create favorites" ON favorites;
CREATE POLICY "Users can create favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - BADGES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view badges" ON badges;
CREATE POLICY "Anyone can view badges" ON badges
  FOR SELECT USING (true);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - USER BADGES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;
CREATE POLICY "Users can view own badges" ON user_badges
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view badges of public profiles" ON user_badges;
CREATE POLICY "Users can view badges of public profiles" ON user_badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_badges.user_id
      AND profiles.is_public = true
    )
  );

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - THEMATIC LISTS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own lists" ON thematic_lists;
CREATE POLICY "Users can view own lists" ON thematic_lists
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view public lists" ON thematic_lists;
CREATE POLICY "Anyone can view public lists" ON thematic_lists
  FOR SELECT USING (visibility = 'public');

DROP POLICY IF EXISTS "Users can create lists" ON thematic_lists;
CREATE POLICY "Users can create lists" ON thematic_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lists" ON thematic_lists;
CREATE POLICY "Users can update own lists" ON thematic_lists
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own lists" ON thematic_lists;
CREATE POLICY "Users can delete own lists" ON thematic_lists
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - THEMATIC LIST ITEMS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view list items of accessible lists" ON thematic_list_items;
CREATE POLICY "Users can view list items of accessible lists" ON thematic_list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM thematic_lists
      WHERE thematic_lists.id = thematic_list_items.list_id
      AND (auth.uid() = thematic_lists.user_id OR thematic_lists.visibility = 'public')
    )
  );

DROP POLICY IF EXISTS "Users can manage items in own lists" ON thematic_list_items;
CREATE POLICY "Users can manage items in own lists" ON thematic_list_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM thematic_lists
      WHERE thematic_lists.id = thematic_list_items.list_id
      AND auth.uid() = thematic_lists.user_id
    )
  );

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - FOLLOWS
-- ============================================================================

DROP POLICY IF EXISTS "Users can view follow relationships" ON follows;
CREATE POLICY "Users can view follow relationships" ON follows
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE (profiles.id = follows.follower_id OR profiles.id = follows.following_id)
      AND profiles.is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can manage own follows" ON follows;
CREATE POLICY "Users can manage own follows" ON follows
  FOR ALL USING (auth.uid() = follower_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - FEED ACTIVITIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own activities" ON feed_activities;
CREATE POLICY "Users can view own activities" ON feed_activities
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view public activities" ON feed_activities;
CREATE POLICY "Anyone can view public activities" ON feed_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = feed_activities.user_id
      AND profiles.is_public = true
    )
  );

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('beer-photos', 'beer-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('bar-photos', 'bar-photos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('list-covers', 'list-covers', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES - BEER PHOTOS
-- ============================================================================

DROP POLICY IF EXISTS "Beer photos are public" ON storage.objects;
CREATE POLICY "Beer photos are public" ON storage.objects
  FOR SELECT USING (bucket_id = 'beer-photos');

DROP POLICY IF EXISTS "Users can upload beer photos" ON storage.objects;
CREATE POLICY "Users can upload beer photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'beer-photos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete own beer photos" ON storage.objects;
CREATE POLICY "Users can delete own beer photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'beer-photos' AND auth.uid() = owner);

-- ============================================================================
-- STORAGE POLICIES - AVATARS
-- ============================================================================

DROP POLICY IF EXISTS "Avatars are public" ON storage.objects;
CREATE POLICY "Avatars are public" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
CREATE POLICY "Users can delete own avatars" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- ============================================================================
-- STORAGE POLICIES - BAR PHOTOS
-- ============================================================================

DROP POLICY IF EXISTS "Bar photos are public" ON storage.objects;
CREATE POLICY "Bar photos are public" ON storage.objects
  FOR SELECT USING (bucket_id = 'bar-photos');

DROP POLICY IF EXISTS "Users can upload bar photos" ON storage.objects;
CREATE POLICY "Users can upload bar photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'bar-photos' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete own bar photos" ON storage.objects;
CREATE POLICY "Users can delete own bar photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'bar-photos' AND auth.uid() = owner);

-- ============================================================================
-- STORAGE POLICIES - LIST COVERS
-- ============================================================================

DROP POLICY IF EXISTS "List covers are public" ON storage.objects;
CREATE POLICY "List covers are public" ON storage.objects
  FOR SELECT USING (bucket_id = 'list-covers');

DROP POLICY IF EXISTS "Users can upload list covers" ON storage.objects;
CREATE POLICY "Users can upload list covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'list-covers' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete own list covers" ON storage.objects;
CREATE POLICY "Users can delete own list covers" ON storage.objects
  FOR DELETE USING (bucket_id = 'list-covers' AND auth.uid() = owner);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Auto-create profile when new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, is_public)
  VALUES (new.id, new.email, true);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp on profiles
CREATE OR REPLACE FUNCTION public.update_profiles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_timestamp ON profiles;
CREATE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profiles_timestamp();

-- Update updated_at timestamp on bars
CREATE OR REPLACE FUNCTION public.update_bars_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_bars_timestamp ON bars;
CREATE TRIGGER update_bars_timestamp
  BEFORE UPDATE ON bars
  FOR EACH ROW EXECUTE FUNCTION public.update_bars_timestamp();

-- Update updated_at timestamp on beer_logs
CREATE OR REPLACE FUNCTION public.update_beer_logs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_beer_logs_timestamp ON beer_logs;
CREATE TRIGGER update_beer_logs_timestamp
  BEFORE UPDATE ON beer_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_beer_logs_timestamp();

-- Update updated_at timestamp on thematic_lists
CREATE OR REPLACE FUNCTION public.update_thematic_lists_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_thematic_lists_timestamp ON thematic_lists;
CREATE TRIGGER update_thematic_lists_timestamp
  BEFORE UPDATE ON thematic_lists
  FOR EACH ROW EXECUTE FUNCTION public.update_thematic_lists_timestamp();

-- Auto-create feed activity when beer log is created (if public)
CREATE OR REPLACE FUNCTION public.create_beer_log_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF new.visibility = 'public' THEN
    INSERT INTO feed_activities (user_id, activity_type, related_beer_log_id)
    VALUES (new.user_id, 'beer_logged', new.id);
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_beer_log_activity ON beer_logs;
CREATE TRIGGER create_beer_log_activity
  AFTER INSERT ON beer_logs
  FOR EACH ROW EXECUTE FUNCTION public.create_beer_log_activity();

-- Auto-create feed activity when list is created (if public)
CREATE OR REPLACE FUNCTION public.create_list_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF new.visibility = 'public' THEN
    INSERT INTO feed_activities (user_id, activity_type, related_list_id)
    VALUES (new.user_id, 'list_created', new.id);
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_list_activity ON thematic_lists;
CREATE TRIGGER create_list_activity
  AFTER INSERT ON thematic_lists
  FOR EACH ROW EXECUTE FUNCTION public.create_list_activity();

-- ============================================================================
-- SEED DATA - BEER STYLES (16 styles)
-- ============================================================================

INSERT INTO beer_styles (name, description) VALUES
  ('IPA', 'India Pale Ale - hoppy and bitter'),
  ('Lager', 'Clean, crisp, and smooth beer'),
  ('Stout', 'Dark, full-bodied with coffee/chocolate notes'),
  ('Pilsner', 'Light lager with floral hop character'),
  ('Wheat', 'Wheaty flavor with light, refreshing character'),
  ('Pale Ale', 'Balanced malt and hop flavors'),
  ('Porter', 'Dark beer with roasted malt flavors'),
  ('Sour', 'Tart and acidic fermented beer'),
  ('Amber', 'Medium-bodied with caramel maltiness'),
  ('Blonde', 'Light, smooth, approachable golden ale'),
  ('Red Ale', 'Reddish color with balanced malt sweetness'),
  ('Belgian', 'Complex flavors with fruity esters'),
  ('Trigo', 'Wheat beer with light citrus notes'),
  ('Tostada', 'Toasted malt flavors'),
  ('Negra', 'Dark Mexican lager style'),
  ('Artesanal', 'Craft beer made in small batches')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SEED DATA - BADGES (6 badges)
-- ============================================================================

INSERT INTO badges (name, description, icon, badge_type, threshold) VALUES
  ('Explorador', 'Has visited 5 different bars', '🌍', 'explorer', 5),
  ('Cervecero', 'Has logged 10 beers', '🍺', 'collector', 10),
  ('IPA Lover', 'Has logged 10 IPAs', '🔥', 'specialist', 10),
  ('Crítico', 'Has written 20 reviews', '✍️', 'reviewer', 20),
  ('Fotógrafo', 'Has uploaded 10 beer photos', '📸', 'photographer', 10),
  ('Social', 'Has gained 5 followers', '👥', 'social', 5)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- END OF SCHEMA MIGRATION
-- ============================================================================
