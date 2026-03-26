import { supabase } from './supabase';
import type { Profile, FeedActivity, ActivityType } from '../types/database';

export interface ServiceResponse<T> {
  data?: T;
  error?: Error;
}

const BEER_LOGGED: ActivityType = 'beer_logged';
const PUBLIC_VISIBILITY = 'public';

export const socialService = {
  /**
   * Follow a user
   */
  async followUser(followerId: string, followingId: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase.from('follows').insert([
        {
          follower_id: followerId,
          following_id: followingId,
        },
      ]);

      if (error) {
        return { error };
      }

      // Create feed activity
      // TODO: Add FOLLOW activity type
      // await supabase.from('feed_activities').insert([
      //   {
      //     user_id: followingId,
      //     type: FOLLOW_ACTIVITY,
      //     related_user_id: followerId,
      //   },
      // ]);

      return { data: undefined };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to follow user') };
    }
  },

  /**
   * Unfollow a user
   */
  async unfollowUser(followerId: string, followingId: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      return error ? { error } : { data: undefined };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to unfollow user') };
    }
  },

  /**
   * Get followers of a user
   */
  async getFollowers(userId: string): Promise<ServiceResponse<Profile[]>> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('profiles:follower_id(*)')
        .eq('following_id', userId);

      if (error) {
        return { error };
      }

      const profiles = data?.map((follow: any) => follow.profiles).filter(Boolean) || [];
      return { data: profiles };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch followers') };
    }
  },

  /**
   * Get users that a user is following
   */
  async getFollowing(userId: string): Promise<ServiceResponse<Profile[]>> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('profiles:following_id(*)')
        .eq('follower_id', userId);

      if (error) {
        return { error };
      }

      const profiles = data?.map((follow: any) => follow.profiles).filter(Boolean) || [];
      return { data: profiles };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch following') };
    }
  },

  /**
   * Check if user is following another user
   */
  async isFollowing(followerId: string, followingId: string): Promise<ServiceResponse<boolean>> {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows found
        return { error };
      }

      return { data: !!data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to check follow status') };
    }
  },

  /**
   * Get personalized feed for a user (logs from followed users)
   */
  async getFeed(userId: string, limit: number = 20, offset: number = 0): Promise<ServiceResponse<FeedActivity[]>> {
    try {
      // Get users that this user follows
      const { data: follows, error: followsError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', userId);

      if (followsError) {
        return { error: followsError };
      }

      const followingIds = follows?.map((f: any) => f.following_id) || [];

      // Get feed activities from followed users
      const { data, error } = await supabase
        .from('feed_activities')
        .select('*')
        .in('user_id', followingIds)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch feed') };
    }
  },

  /**
   * Get public feed (public beer logs)
   */
  async getPublicFeed(limit: number = 20, offset: number = 0): Promise<ServiceResponse<FeedActivity[]>> {
    try {
      const { data, error } = await supabase
        .from('feed_activities')
        .select(
          `
          *,
          beer_logs(visibility)
        `
        )
        .eq('beer_logs.visibility', PUBLIC_VISIBILITY)
        .eq('type', BEER_LOGGED)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch public feed') };
    }
  },
};
