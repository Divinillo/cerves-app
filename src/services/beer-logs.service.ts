import { supabase } from './supabase';
import type { BeerLog, ActivityType, Visibility } from '../types/database';
import { storageService } from './storage.service';

export interface BeerLogInput {
  bar_id: string;
  beer_name: string;
  brewery?: string;
  beer_style_id?: string;
  size: string;
  rating?: number;
  notes?: string;
  visibility?: Visibility;
  photo?: File;
}

const DEFAULT_VISIBILITY: Visibility = 'private';
const BEER_LOGGED: ActivityType = 'beer_logged';

export interface ServiceResponse<T> {
  data?: T;
  error?: Error;
}

export const beerLogsService = {
  /**
   * Create a new beer log
   */
  async createBeerLog(
    userId: string,
    input: BeerLogInput
  ): Promise<ServiceResponse<BeerLog>> {
    try {
      let photoUrl: string | undefined;

      // Upload photo if provided
      if (input.photo) {
        const uploadResult = await storageService.uploadBeerPhoto(
          input.photo,
          userId,
          'temp'
        );

        if (uploadResult.error) {
          return { error: uploadResult.error };
        }

        photoUrl = uploadResult.data;
      }

      // Insert beer log
      const { data, error } = await supabase
        .from('beer_logs')
        .insert([
          {
            user_id: userId,
            bar_id: input.bar_id,
            beer_name: input.beer_name,
            brewery: input.brewery,
            beer_style_id: input.beer_style_id,
            size: input.size,
            rating: input.rating,
            notes: input.notes,
            visibility: input.visibility || DEFAULT_VISIBILITY,
            photo_url: photoUrl,
          },
        ])
        .select()
        .single();

      if (error || !data) {
        return { error: error || new Error('Failed to create beer log') };
      }

      // Create feed activity
      await supabase.from('feed_activities').insert([
        {
          user_id: userId,
          type: BEER_LOGGED,
          beer_log_id: data.id,
        },
      ]);

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to create beer log') };
    }
  },

  /**
   * Get beer logs for a specific user
   */
  async getBeerLogsByUser(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ServiceResponse<BeerLog[]>> {
    try {
      const { data, error } = await supabase
        .from('beer_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch beer logs') };
    }
  },

  /**
   * Get all public beer logs by a user
   */
  async getPublicBeerLogsByUser(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ServiceResponse<BeerLog[]>> {
    try {
      const { data, error } = await supabase
        .from('beer_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Failed to fetch public beer logs'),
      };
    }
  },

  /**
   * Get beer logs for a specific bar
   */
  async getBeerLogsByBar(barId: string): Promise<ServiceResponse<BeerLog[]>> {
    try {
      const { data, error } = await supabase
        .from('beer_logs')
        .select('*')
        .eq('bar_id', barId)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch bar beer logs') };
    }
  },

  /**
   * Get all public beer logs
   */
  async getPublicBeerLogs(
    limit: number = 20,
    offset: number = 0
  ): Promise<ServiceResponse<BeerLog[]>> {
    try {
      const { data, error } = await supabase
        .from('beer_logs')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Failed to fetch public beer logs'),
      };
    }
  },

  /**
   * Update a beer log
   */
  async updateBeerLog(id: string, input: Partial<BeerLogInput>): Promise<ServiceResponse<BeerLog>> {
    try {
      let photoUrl: string | undefined;

      if (input.photo) {
        const uploadResult = await storageService.uploadBeerPhoto(input.photo, 'temp', id);

        if (uploadResult.error) {
          return { error: uploadResult.error };
        }

        photoUrl = uploadResult.data;
      }

      const updateData: any = {
        beer_name: input.beer_name,
        brewery: input.brewery,
        beer_style_id: input.beer_style_id,
        size: input.size,
        rating: input.rating,
        notes: input.notes,
        visibility: input.visibility,
      };

      if (photoUrl) {
        updateData.photo_url = photoUrl;
      }

      // Remove undefined values
      Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

      const { data, error } = await supabase
        .from('beer_logs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      return error ? { error } : { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to update beer log') };
    }
  },

  /**
   * Delete a beer log
   */
  async deleteBeerLog(id: string): Promise<ServiceResponse<void>> {
    try {
      // Get the beer log to find the photo
      const { data: beerLog, error: fetchError } = await supabase
        .from('beer_logs')
        .select('photo_url')
        .eq('id', id)
        .single();

      if (fetchError) {
        return { error: fetchError };
      }

      // Delete photo if exists
      if (beerLog?.photo_url) {
        await storageService.deletePhoto('beer-photos', beerLog.photo_url);
      }

      // Delete the beer log
      const { error } = await supabase.from('beer_logs').delete().eq('id', id);

      return error ? { error } : { data: undefined };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to delete beer log') };
    }
  },

  /**
   * Toggle favorite status for a beer log
   */
  async toggleFavorite(beerLogId: string, userId: string): Promise<ServiceResponse<boolean>> {
    try {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('beer_log_id', beerLogId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Remove favorite
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);

        if (error) {
          return { error };
        }

        return { data: false };
      } else {
        // Add favorite
        const { error } = await supabase.from('favorites').insert([
          {
            beer_log_id: beerLogId,
            user_id: userId,
          },
        ]);

        if (error) {
          return { error };
        }

        // Create feed activity
        const { data: beerLog } = await supabase
          .from('beer_logs')
          .select('user_id')
          .eq('id', beerLogId)
          .single();

        if (beerLog) {
          // TODO: Update activity type enum when available
          // await supabase.from('feed_activities').insert([
          //   {
          //     user_id: beerLog.user_id,
          //     type: FAVORITE_ACTIVITY,
          //     related_user_id: userId,
          //     beer_log_id: beerLogId,
          //   },
          // ]);
        }

        return { data: true };
      }
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to toggle favorite') };
    }
  },

  /**
   * Get favorites for a user
   */
  async getFavorites(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ServiceResponse<BeerLog[]>> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('beer_logs(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return { error };
      }

      const beerLogs = data?.map((fav: any) => fav.beer_logs).filter(Boolean) || [];
      return { data: beerLogs };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch favorites') };
    }
  },
};
