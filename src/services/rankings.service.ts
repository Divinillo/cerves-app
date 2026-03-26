import { supabase } from './supabase';
import type { BeerLog, Bar } from '../types/database';

export interface ServiceResponse<T> {
  data?: T;
  error?: Error;
}

export interface RankedBeer extends BeerLog {
  rating_count?: number;
  average_rating?: number;
}

export interface RankedBar extends Bar {
  log_count?: number;
  average_rating: number;
}

const PUBLIC_VISIBILITY = 'public';

export const rankingsService = {
  /**
   * Get top-rated beers
   */
  async getTopBeers(limit: number = 20, styleId?: string): Promise<ServiceResponse<RankedBeer[]>> {
    try {
      let query = supabase
        .from('beer_logs')
        .select('*')
        .eq('visibility', PUBLIC_VISIBILITY)
        .not('rating', 'is', null);

      if (styleId) {
        query = query.eq('beer_style_id', styleId);
      }

      const { data, error } = await query
        .order('rating', { ascending: false })
        .limit(limit);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch top beers') };
    }
  },

  /**
   * Get top-rated bars
   */
  async getTopBars(limit: number = 20): Promise<ServiceResponse<RankedBar[]>> {
    try {
      const { data, error } = await supabase
        .from('bars')
        .select('*')
        .order('rating', { ascending: false })
        .not('rating', 'is', null)
        .limit(limit);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch top bars') };
    }
  },

  /**
   * Get top-rated beers in a geographic area
   */
  async getTopBeersByArea(
    lat: number,
    lng: number,
    radiusKm: number = 5,
    limit: number = 20
  ): Promise<ServiceResponse<RankedBeer[]>> {
    try {
      // Fetch all beers within radius using geographic bounds
      // A more precise approach would use PostGIS, but this works with standard SQL
      const latOffset = radiusKm / 111; // ~111 km per degree latitude
      const lngOffset = radiusKm / (111 * Math.cos((lat * Math.PI) / 180)); // Adjust for latitude

      const { data: bars, error: barsError } = await supabase
        .from('bars')
        .select('id')
        .gte('latitude', lat - latOffset)
        .lte('latitude', lat + latOffset)
        .gte('longitude', lng - lngOffset)
        .lte('longitude', lng + lngOffset);

      if (barsError) {
        return { error: barsError };
      }

      const barIds = bars?.map((b: any) => b.id) || [];

      if (barIds.length === 0) {
        return { data: [] };
      }

      const { data, error } = await supabase
        .from('beer_logs')
        .select('*')
        .in('bar_id', barIds)
        .eq('visibility', PUBLIC_VISIBILITY)
        .not('rating', 'is', null)
        .order('rating', { ascending: false })
        .limit(limit);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Failed to fetch top beers by area'),
      };
    }
  },
};
