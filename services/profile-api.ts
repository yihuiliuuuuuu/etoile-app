import * as FileSystem from 'expo-file-system/legacy';

import { getSupabase } from '@/lib/supabase';
import { stripUriQuery, withAvatarCacheBuster } from '@/utils/avatar-uri';

export async function fetchProfile(userId: string) {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('email, avatar_url, sign_up_prompt_shown')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Insert or update the row for the signed-in user (id must equal auth.uid()). */
export async function upsertProfile(userId: string, email: string | null): Promise<void> {
  const payload = {
    id: userId,
    email,
    updated_at: new Date().toISOString(),
  };

  const { error } = await getSupabase().from('profiles').upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error('[profile] upsert failed', {
      userId,
      email: email ?? null,
      code: error.code,
      message: error.message,
    });
    throw error;
  }

  console.log('[profile] upsert ok', { userId, email: email ?? null });
}

/** Guarantees a profiles row exists after sign-up / sign-in. */
export async function ensureUserProfile(userId: string, email: string | null): Promise<void> {
  try {
    await upsertProfile(userId, email);
    const row = await fetchProfile(userId);
    if (!row) {
      console.warn('[profile] upsert reported success but select returned no row', { userId });
      return;
    }
    console.log('[profile] verified', {
      userId,
      email: row.email ?? null,
      hasAvatar: Boolean(row.avatar_url),
    });
  } catch (err) {
    console.error('[profile] ensureUserProfile failed', { userId, email: email ?? null, err });
    throw err;
  }
}

export async function updateSignUpPromptShown(userId: string, shown: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from('profiles')
    .update({ sign_up_prompt_shown: shown, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

async function readLocalImageBytes(localUri: string): Promise<ArrayBuffer> {
  const path = stripUriQuery(localUri);
  const base64 = await FileSystem.readAsStringAsync(path, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function uploadAvatar(userId: string, localUri: string): Promise<string> {
  const path = `${userId}/avatar.jpg`;
  const bytes = await readLocalImageBytes(localUri);

  const { error: uploadError } = await getSupabase().storage.from('avatars').upload(path, bytes, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (uploadError) {
    console.error('[profile] avatar storage upload failed', {
      userId,
      code: uploadError.name,
      message: uploadError.message,
    });
    throw uploadError;
  }

  const { data } = getSupabase().storage.from('avatars').getPublicUrl(path);
  const avatarUrl = withAvatarCacheBuster(data.publicUrl);

  const { error: profileError } = await getSupabase()
    .from('profiles')
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (profileError) {
    console.error('[profile] avatar_url update failed', {
      userId,
      code: profileError.code,
      message: profileError.message,
    });
    throw profileError;
  }

  console.log('[profile] avatar upload ok', { userId });
  return avatarUrl;
}
