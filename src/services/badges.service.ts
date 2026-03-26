import { supabase } from './supabase';
import type { Badge, UserBadge, ActivityType } from '../types/database';

export interface ServiceResponse<T> {
  data?: T;
  error?: Error;
}

const BADGE_EARNED: ActivityType = 'badge_earned';

export const badgesService = {
  /**
   * Check and award badges for a user based on conditions
   */
  async checkAndAwardBadges(userId: string): Promise<ServiceResponse<UserBadge[]>> {
    try {
      const awardedBadges: UserBadge[] = [];

      // Get all badges
      const { data: allBadges, error: badgesError } = await supabase
        .from('badges')
        .select('*');

      if (badgesError || !allBadges) {
        return { error: badgesError || new Error('Failed to fetch badges') };
      }

      // Get user's beer logs count
      const { data: beerLogs, error: beerLogsError } = await supabase
        .from('beer_logs')
        .select('id')
        .eq('user_id', userId);

      if (beerLogsError) {
        return { error: beerLogsError };
      }

      const beerCount = beerLogs?.length || 0;

      // Get user's unique bars count
      const { data: bars, error: barsError } = await supabase
        .from('beer_logs')
        .select('bar_id')
        .eq('user_id', userId);

      if (barsError) {
        return { error: barsError };
      }

      const uniqueBarIds = new Set(bars?.map((b: any) => b.bar_id) || []);
      const barCount = uniqueBarIds.size;

      // Get user's followers count
      const { data: followers, error: followersError } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', userId);

      if (followersError) {
        return { error: followersError };
      }

      const followerCount = followers?.length || 0;

      // Check each badge condition
      for (const badge of allBadges) {
        let shouldAward = false;

        if (badge.condition === 'beer_count' && badge.condition_value) {
          shouldAward = beerCount >= badge.condition_value;
        } else if (badge.condition === 'bar_count' && badge.condition_value) {
          shouldAward = barCount >= badge.condition_value;
        } else if (badge.condition === 'style_collector') {
          // Get unique beer styles
          const { data: styles } = await supabase
            .from('beer_logs')
            .select('beer_style_id')
            .eq('user_id', userId);

          const uniqueStyles = new Set(styles?.map((s: any) => s.beer_style_id).filter(Boolean) || []);
          shouldAward = uniqueStyles.size >= (badge.condition_value || 5);
        } else if (badge.condition === 'social' && badge.condition_value) {
          shouldAward = followerCount >= badge.condition_value;
        } else if (badge.condition === 'explorer' && badge.condition_value) {
          shouldAward = barCount >= badge.condition_value;
        }

        // Award badge if conditions met and user doesn't already have it
        if (shouldAward) {
          const { data: existing } = await supabase
            .from('user_badges')
            .select('id')
            .eq('user_id', userId)
            .eq('badge_id', badge.id)
            .single();

          if (!existing) {
            const { data, error } = await supabase
              .from('user_badges')
              .insert([
                {
                  user_id: userId,
                  badge_id: badge.id,
                },
              ])
              .select()
              .single();

            if (!error && data) {
              awardedBadges.push(data);

              // Create feed activity
              await supabase.from('feed_activities').insert([
                {
                  user_id: userId,
                  type: BADGE_EARNED,
                  related_badge_id: badge.id,
                },
              ]);
            }
          }
        }
      }

      return { data: awardedBadges };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to check badges') };
    }
  },

  /**
   * Get badges earned by a user
   */
  async getUserBadges(userId: string): Promise<ServiceResponse<(UserBadge & { badge: Badge })[]>> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badge:badge_id(*)')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch user badges') };
    }
  },

  /**
   * Get all available badges
   */
  async getAllBadges(): Promise<ServiceResponse<Badge[]>> {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('name', { ascending: true });

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch badges') };
    }
  },
};
