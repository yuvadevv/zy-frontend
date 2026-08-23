// src/lib/supabase/storage.ts
import { createClient } from './client';
import { SUPABASE_BUCKETS } from '../constants';

// Helper for client-side uploads (architecture only)
export const uploadFile = async (
  bucketName: typeof SUPABASE_BUCKETS[keyof typeof SUPABASE_BUCKETS],
  filePath: string,
  file: File
) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false
  });
  return { data, error };
};

// Helper for downloading files
export const downloadFile = async (
  bucketName: typeof SUPABASE_BUCKETS[keyof typeof SUPABASE_BUCKETS],
  filePath: string
) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from(bucketName).download(filePath);
  return { data, error };
};

// Helper to get public URL
export const getPublicUrl = (
  bucketName: typeof SUPABASE_BUCKETS[keyof typeof SUPABASE_BUCKETS],
  filePath: string
) => {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};
