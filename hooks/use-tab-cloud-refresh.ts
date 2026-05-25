import { useAuth } from '@/contexts/auth-context';
import { isSupabaseConfigured } from '@/lib/env';
import { useCallback } from 'react';

/** Pull-to-refresh props for tab ScrollViews when signed in with Supabase. */
export function useTabCloudRefresh() {
  const { isSignedIn, isRefreshing, refreshCloudData } = useAuth();

  const onRefresh = useCallback(() => {
    void refreshCloudData();
  }, [refreshCloudData]);

  const enabled = isSignedIn && isSupabaseConfigured();

  return {
    refreshing: enabled && isRefreshing,
    onRefresh: enabled ? onRefresh : undefined,
  };
}
