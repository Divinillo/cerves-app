import { supabase } from './supabase';
import { compressImage } from '../utils/imageCompressor';
import { moderateImage } from './moderation.service';

export interface ServiceResponse<T> {
  data?: T;
  error?: Error;
  moderation?: boolean; // true if rejected by moderation
}

export const storageService = {
  /**
   * Upload a beer log photo — compresses, moderates, then uploads.
   * Compression: ~3-5MB → ~80-150KB (maximize free tier)
   * Moderation: Google Vision SafeSearch (1,000 free/month)
   */
  async uploadBeerPhoto(
    file: File,
    userId: string,
    beerLogId: string
  ): Promise<ServiceResponse<string>> {
    try {
      // 1. Compress: ~3-5MB original → ~80-150KB JPEG
      const compressed = await compressImage(file);

      // 2. Moderate: check for inappropriate content
      const modResult = await moderateImage(compressed);
      if (!modResult.safe) {
        return {
          error: new Error(modResult.reason || 'Imagen rechazada por contenido inapropiado'),
          moderation: true,
        };
      }

      // 3. Upload to Supabase Storage
      const fileName = `${userId}/${beerLogId}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('beer-photos')
        .upload(fileName, compressed, {
          contentType: 'image/jpeg',
          cacheControl: '31536000',
          upsert: false,
        });

      if (uploadError) {
        return { error: uploadError };
      }

      // Get public URL
      const { data } = supabase.storage.from('beer-photos').getPublicUrl(fileName);

      if (!data?.publicUrl) {
        return { error: new Error('Failed to get public URL') };
      }

      return { data: data.publicUrl };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to upload beer photo') };
    }
  },

  /**
   * Upload a user avatar
   */
  async uploadAvatar(file: File, userId: string): Promise<ServiceResponse<string>> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        return { error: uploadError };
      }

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);

      if (!data?.publicUrl) {
        return { error: new Error('Failed to get public URL') };
      }

      return { data: data.publicUrl };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to upload avatar') };
    }
  },

  /**
   * Upload a bar photo
   */
  async uploadBarPhoto(
    file: File,
    userId: string,
    barId: string
  ): Promise<ServiceResponse<string>> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${barId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('bar-photos')
        .upload(fileName, file, { upsert: false });

      if (uploadError) {
        return { error: uploadError };
      }

      // Get public URL
      const { data } = supabase.storage.from('bar-photos').getPublicUrl(fileName);

      if (!data?.publicUrl) {
        return { error: new Error('Failed to get public URL') };
      }

      return { data: data.publicUrl };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to upload bar photo') };
    }
  },

  /**
   * Delete a photo from storage
   */
  async deletePhoto(bucket: string, path: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      return error ? { error } : { data: undefined };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Failed to delete photo') };
    }
  },
};
