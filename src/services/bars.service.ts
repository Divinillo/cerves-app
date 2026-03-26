import { supabase } from './supabase';
import type { Bar } from '../types/database';

export interface ServiceResponse<T> {
  data?: T;
  error?: Error;
}

export interface BarInput {
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export const barsService = {
  /**
   * Create a new bar
   */
  async createBar(input: BarInput): Promise<ServiceResponse<Bar>> {
    try {
      const { data, error } = await supabase
        .from('bars')
        .insert([
          {
            name: input.name,
            description: input.description,
            latitude: input.latitude,
            longitude: input.longitude,
            address: input.address,
            city: input.city,
            country: input.country,
          },
        ])
        .select()
        .single();

      return error ? { error } : { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to create bar') };
    }
  },

  /**
   * Get bars within geographic bounds
   */
  async getBarsInBounds(
    north: number,
    south: number,
    east: number,
    west: number
  ): Promise<ServiceResponse<Bar[]>> {
    try {
      const { data, error } = await supabase
        .from('bars')
        .select('*')
        .gte('latitude', south)
        .lte('latitude', north)
        .gte('longitude', west)
        .lte('longitude', east);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error('Failed to fetch bars in bounds'),
      };
    }
  },

  /**
   * Get a specific bar by ID
   */
  async getBarById(id: string): Promise<ServiceResponse<Bar>> {
    try {
      const { data, error } = await supabase
        .from('bars')
        .select('*')
        .eq('id', id)
        .single();

      return error ? { error } : { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch bar') };
    }
  },

  /**
   * Search bars by name or city
   */
  async searchBars(query: string): Promise<ServiceResponse<Bar[]>> {
    try {
      const { data, error } = await supabase
        .from('bars')
        .select('*')
        .or(`name.ilike.%${query}%,city.ilike.%${query}%,address.ilike.%${query}%`)
        .limit(20);

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to search bars') };
    }
  },

  /**
   * Get all bars
   */
  async getAllBars(): Promise<ServiceResponse<Bar[]>> {
    try {
      const { data, error } = await supabase
        .from('bars')
        .select('*')
        .order('name', { ascending: true });

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch bars') };
    }
  },
};
