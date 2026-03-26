import { supabase } from './supabase';
import type { ThematicList, ThematicListItem, Visibility } from '../types/database';

export interface ServiceResponse<T> {
  data?: T;
  error?: Error;
}

export interface ListInput {
  name: string;
  description?: string;
  visibility?: Visibility;
}

const DEFAULT_VISIBILITY: Visibility = 'private';

export const listsService = {
  /**
   * Create a new thematic list
   */
  async createList(userId: string, input: ListInput): Promise<ServiceResponse<ThematicList>> {
    try {
      const { data, error } = await supabase
        .from('thematic_lists')
        .insert([
          {
            user_id: userId,
            name: input.name,
            description: input.description,
            visibility: input.visibility || DEFAULT_VISIBILITY,
          },
        ])
        .select()
        .single();

      return error ? { error } : { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to create list') };
    }
  },

  /**
   * Get all lists for a user
   */
  async getUserLists(userId: string): Promise<ServiceResponse<ThematicList[]>> {
    try {
      const { data, error } = await supabase
        .from('thematic_lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return error ? { error } : { data: data || [] };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch user lists') };
    }
  },

  /**
   * Get a specific list by ID
   */
  async getListById(id: string): Promise<ServiceResponse<ThematicList & { items: ThematicListItem[] }>> {
    try {
      const { data, error } = await supabase
        .from('thematic_lists')
        .select('*, thematic_list_items(*)')
        .eq('id', id)
        .single();

      if (error || !data) {
        return { error: error || new Error('List not found') };
      }

      return {
        data: {
          ...data,
          items: data.thematic_list_items || [],
        },
      };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to fetch list') };
    }
  },

  /**
   * Add a beer log to a list
   */
  async addBeerToList(listId: string, beerLogId: string): Promise<ServiceResponse<ThematicListItem>> {
    try {
      // Get the current max position
      const { data: items, error: fetchError } = await supabase
        .from('thematic_list_items')
        .select('position')
        .eq('list_id', listId)
        .order('position', { ascending: false })
        .limit(1);

      if (fetchError) {
        return { error: fetchError };
      }

      const nextPosition = (items?.[0]?.position || 0) + 1;

      const { data, error } = await supabase
        .from('thematic_list_items')
        .insert([
          {
            list_id: listId,
            beer_log_id: beerLogId,
            position: nextPosition,
          },
        ])
        .select()
        .single();

      return error ? { error } : { data };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to add beer to list') };
    }
  },

  /**
   * Remove a beer log from a list
   */
  async removeBeerFromList(listId: string, beerLogId: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('thematic_list_items')
        .delete()
        .eq('list_id', listId)
        .eq('beer_log_id', beerLogId);

      return error ? { error } : { data: undefined };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to remove beer from list') };
    }
  },

  /**
   * Delete a list
   */
  async deleteList(id: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('thematic_lists')
        .delete()
        .eq('id', id);

      return error ? { error } : { data: undefined };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to delete list') };
    }
  },
};
