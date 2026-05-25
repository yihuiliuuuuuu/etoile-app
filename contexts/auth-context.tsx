import { AuthBottomSheet, type AuthSheetMode, type AuthSheetVariant } from '@/components/auth-bottom-sheet';
import { getSyncUserId } from '@/lib/get-sync-user-id';
import { getCloudSetupMessage, isSupabaseConfigured } from '@/lib/env';
import type { SyncedUserData } from '@/types/synced-user-data';
import { getSupabaseOrNull } from '@/lib/supabase';
import { fetchClassEntries } from '@/services/class-log-api';
import { fetchUserGoals } from '@/services/goals-api';
import {
  ensureUserProfile,
  fetchProfile,
  updateSignUpPromptShown,
  uploadAvatar,
} from '@/services/profile-api';
import { fetchPracticeEntries } from '@/services/practice-log-api';
import { checkSupabaseHealth, type SupabaseHealth } from '@/services/supabase-health';
import { syncAllUserData } from '@/services/sync-service';
import { isSchemaMissingError } from '@/lib/supabase-errors';
import { loadAuthSnapshot, persistAuthSnapshot } from '@/utils/auth-storage';
import { withAvatarCacheBuster } from '@/utils/avatar-uri';
import { loadPersistedAvatarUri, pickAndPersistAvatar } from '@/utils/profile-avatar';
import { showProfileAvatarMenu } from '@/utils/show-profile-avatar-menu';
import * as Haptics from 'expo-haptics';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/** Delay after first log so the tab UI can update before the auth sheet appears. */
const SIGN_UP_PROMPT_DELAY_MS = 3000;

type AuthContextValue = {
  loaded: boolean;
  hasAccount: boolean;
  isSignedIn: boolean;
  userId: string | null;
  email: string | null;
  avatarUri: string | null;
  avatarRevision: number;
  syncVersion: number;
  syncedData: SyncedUserData | null;
  cloudBackupEnabled: boolean;
  supabaseHealth: SupabaseHealth | null;
  isRefreshing: boolean;
  openSignIn: (variant: AuthSheetVariant) => void;
  openSignUp: (variant: AuthSheetVariant) => void;
  onAvatarPress: (variant: AuthSheetVariant) => void;
  pickAvatar: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshCloudData: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  notifyEntryCreated: (variant: AuthSheetVariant, isCreate: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function friendlyAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) {
    return 'Email or password is incorrect.';
  }
  if (message.includes('User already registered')) {
    return 'An account with this email already exists. Try signing in.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Email confirmation is still required for this project. In Supabase: Authentication → Providers → Email → turn off Confirm email.';
  }
  return message;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [signUpPromptShown, setSignUpPromptShown] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarRevision, setAvatarRevision] = useState(0);

  const setAvatarDisplay = useCallback((uri: string | null) => {
    setAvatarUri(uri);
    setAvatarRevision((n) => n + 1);
  }, []);
  const [syncVersion, setSyncVersion] = useState(0);
  const [syncedData, setSyncedData] = useState<SyncedUserData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const cloudBackupEnabled = isSupabaseConfigured();
  const [supabaseHealth, setSupabaseHealth] = useState<SupabaseHealth | null>(null);

  const refreshSupabaseHealth = useCallback(async () => {
    const health = await checkSupabaseHealth();
    setSupabaseHealth(health);
    if (health.envConfigured && !health.schemaReady) {
      console.warn('[auth] Supabase schema missing tables:', health.missingTables.join(', '));
    }
    return health;
  }, []);

  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetMode, setSheetMode] = useState<AuthSheetMode>('signUp');
  const [sheetVariant, setSheetVariant] = useState<AuthSheetVariant>('classes');
  const signUpPromptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (signUpPromptTimerRef.current) clearTimeout(signUpPromptTimerRef.current);
    };
  }, []);

  const applySession = useCallback(
    async (nextUserId: string, nextEmail: string | null, avatarUrl: string | null) => {
      setUserId(nextUserId);
      setEmail(nextEmail);
      setHasAccount(true);
      setIsSignedIn(true);
      if (avatarUrl) setAvatarDisplay(withAvatarCacheBuster(avatarUrl));

      await persistAuthSnapshot({
        hasAccount: true,
        isSignedIn: true,
        email: nextEmail,
      });

      try {
        await ensureUserProfile(nextUserId, nextEmail);
      } catch (err) {
        console.warn('[auth] profile ensure failed during applySession', err);
      }

      void refreshSupabaseHealth();

      try {
        const data = await syncAllUserData(nextUserId);
        setSyncedData(data);
      } catch (err) {
        if (isSchemaMissingError(err)) {
          console.warn('[auth] sync failed — run supabase/schema.sql in your Supabase project');
        } else {
          console.warn('[auth] sync failed after sign-in', err);
        }
        try {
          const [practice, classes, goals] = await Promise.all([
            fetchPracticeEntries(nextUserId),
            fetchClassEntries(nextUserId),
            fetchUserGoals(nextUserId),
          ]);
          setSyncedData({
            practice,
            classes,
            practiceGoals: goals?.practice ?? null,
            classGoals: goals?.classes ?? null,
          });
        } catch (pullErr) {
          console.warn('[auth] cloud pull fallback failed', pullErr);
          setSyncedData(null);
        }
      }

      const profile = await fetchProfile(nextUserId).catch(() => null);
      if (profile?.avatar_url) setAvatarDisplay(withAvatarCacheBuster(profile.avatar_url));

      setSyncVersion((v) => v + 1);
    },
    [refreshSupabaseHealth, setAvatarDisplay],
  );

  useEffect(() => {
    let cancelled = false;
    let unsubscribeAuth: (() => void) | undefined;

    void (async () => {
      if (isSupabaseConfigured()) {
        const health = await checkSupabaseHealth();
        if (!cancelled) setSupabaseHealth(health);
      }

      const [snapshot, persistedAvatar] = await Promise.all([
        loadAuthSnapshot(),
        loadPersistedAvatarUri(),
      ]);

      if (cancelled) return;

      setSignUpPromptShown(snapshot.signUpPromptShown);
      if (persistedAvatar) setAvatarDisplay(withAvatarCacheBuster(persistedAvatar));

      const supabase = getSupabaseOrNull();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !cancelled) {
          const profile = await fetchProfile(session.user.id).catch(() => null);
          await applySession(
            session.user.id,
            session.user.email ?? snapshot.email,
            profile?.avatar_url ?? persistedAvatar,
          );
          if (profile) setSignUpPromptShown(profile.sign_up_prompt_shown);
        } else if (!cancelled) {
          setHasAccount(snapshot.hasAccount);
          const staleLocalSession = snapshot.isSignedIn && !isSupabaseConfigured();
          setIsSignedIn(staleLocalSession ? false : snapshot.isSignedIn);
          setEmail(snapshot.email);
          if (staleLocalSession) {
            void persistAuthSnapshot({ isSignedIn: false });
          }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (cancelled) return;
          if (event === 'SIGNED_OUT' || !session?.user) {
            setUserId(null);
            setIsSignedIn(false);
            setSyncedData(null);
            void persistAuthSnapshot({ isSignedIn: false });
          }
        });
        unsubscribeAuth = () => subscription.unsubscribe();
      } else {
        setHasAccount(snapshot.hasAccount);
        setIsSignedIn(snapshot.isSignedIn);
        setEmail(snapshot.email);
      }

      if (!cancelled) {
        if (snapshot.hasAccount && !isSupabaseConfigured()) {
          console.warn(
            '[auth] Supabase URL/anon key missing or invalid in .env — cloud backup is off. Add real keys and restart with: npx expo start -c',
          );
        }
        setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribeAuth?.();
    };
  }, [applySession]);

  const openSheet = useCallback((mode: AuthSheetMode, variant: AuthSheetVariant) => {
    setSheetMode(mode);
    setSheetVariant(variant);
    setSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const openSignIn = useCallback(
    (variant: AuthSheetVariant) => {
      openSheet('signIn', variant);
    },
    [openSheet],
  );

  const openSignUp = useCallback(
    (variant: AuthSheetVariant) => {
      openSheet('signUp', variant);
    },
    [openSheet],
  );

  const signOut = useCallback(async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const supabase = getSupabaseOrNull();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUserId(null);
    setIsSignedIn(false);
    setSyncedData(null);
    setHasAccount(true);
    await persistAuthSnapshot({ isSignedIn: false });
  }, []);

  const refreshCloudData = useCallback(async () => {
    if (!userId || !cloudBackupEnabled) return;
    setIsRefreshing(true);
    try {
      const data = await syncAllUserData(userId);
      setSyncedData(data);
      setSyncVersion((v) => v + 1);
    } catch (err) {
      console.warn('[auth] refresh failed', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [userId, cloudBackupEnabled]);

  const requestPasswordReset = useCallback(async (nextEmail: string) => {
    const trimmed = nextEmail.trim();
    if (!trimmed) {
      throw new Error('Enter your email address first.');
    }
    const supabase = getSupabaseOrNull();
    if (!supabase) {
      throw new Error('Password reset requires cloud sign-in. Add Supabase keys to .env.');
    }
    const { error } = await supabase.auth.resetPasswordForEmail(trimmed);
    if (error) throw new Error(friendlyAuthError(error.message));
  }, []);

  const pickAvatar = useCallback(async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const uri = await pickAndPersistAvatar();
    if (!uri) return;

    const localDisplayUri = withAvatarCacheBuster(uri);
    setAvatarDisplay(localDisplayUri);

    const uid = (await getSyncUserId()) ?? userId;
    if (uid) {
      try {
        const publicUrl = await uploadAvatar(uid, uri);
        setAvatarDisplay(publicUrl);
      } catch (err) {
        console.warn('[auth] avatar upload failed — showing local photo only', err);
      }
    }
  }, [setAvatarDisplay, userId]);

  const onAvatarPress = useCallback(
    (variant: AuthSheetVariant) => {
      if (isSignedIn) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        showProfileAvatarMenu({
          onChangePhoto: () => void pickAvatar(),
          onSignOut: () => void signOut(),
        });
        return;
      }
      if (hasAccount) {
        openSignIn(variant);
      } else {
        openSignUp(variant);
      }
    },
    [hasAccount, isSignedIn, openSignIn, openSignUp, pickAvatar, signOut],
  );

  const notifyEntryCreated = useCallback(
    (variant: AuthSheetVariant, isCreate: boolean) => {
      if (!isCreate || isSignedIn || hasAccount || signUpPromptShown) return;
      setSignUpPromptShown(true);
      void persistAuthSnapshot({ signUpPromptShown: true });
      if (userId && isSupabaseConfigured()) {
        void updateSignUpPromptShown(userId, true);
      }
      if (signUpPromptTimerRef.current) clearTimeout(signUpPromptTimerRef.current);
      signUpPromptTimerRef.current = setTimeout(() => {
        signUpPromptTimerRef.current = null;
        openSignUp(variant);
      }, SIGN_UP_PROMPT_DELAY_MS);
    },
    [hasAccount, isSignedIn, openSignUp, signUpPromptShown, userId],
  );

  const signIn = useCallback(
    async (nextEmail: string, password: string) => {
      const trimmed = nextEmail.trim();
      const supabase = getSupabaseOrNull();

      if (!supabase) {
        throw new Error(getCloudSetupMessage());
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmed,
        password,
      });
      if (error) throw new Error(friendlyAuthError(error.message));

      const uid = data.user?.id;
      if (!uid) throw new Error('Sign in failed. Please try again.');

      const profile = await fetchProfile(uid).catch(() => null);
      await applySession(uid, trimmed, profile?.avatar_url ?? null);
      if (profile) setSignUpPromptShown(profile.sign_up_prompt_shown);
      closeSheet();
    },
    [applySession, closeSheet],
  );

  const signUp = useCallback(
    async (nextEmail: string, password: string) => {
      const trimmed = nextEmail.trim();
      const supabase = getSupabaseOrNull();

      if (!supabase) {
        throw new Error(getCloudSetupMessage());
      }

      const { data, error } = await supabase.auth.signUp({
        email: trimmed,
        password,
      });
      if (error) throw new Error(friendlyAuthError(error.message));

      let session = data.session;
      let user = data.user;

      if (!session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmed,
          password,
        });
        if (signInError) {
          throw new Error(friendlyAuthError(signInError.message));
        }
        session = signInData.session;
        user = signInData.user;
      }

      const uid = user?.id;
      if (!uid) throw new Error('Sign up failed. Please try again.');

      const profileEmail = user.email ?? trimmed;
      console.log('[auth] signUp session ready', { userId: uid, email: profileEmail });
      await applySession(uid, profileEmail, null);
      closeSheet();
    },
    [applySession, closeSheet],
  );

  const value = useMemo(
    () => ({
      loaded,
      hasAccount,
      isSignedIn,
      userId,
      email,
      avatarUri,
      avatarRevision,
      syncVersion,
      syncedData,
      cloudBackupEnabled,
      supabaseHealth,
      isRefreshing,
      openSignIn,
      openSignUp,
      onAvatarPress,
      pickAvatar,
      signOut,
      refreshCloudData,
      requestPasswordReset,
      notifyEntryCreated,
      signIn,
      signUp,
    }),
    [
      loaded,
      hasAccount,
      isSignedIn,
      userId,
      email,
      avatarUri,
      avatarRevision,
      syncVersion,
      syncedData,
      cloudBackupEnabled,
      supabaseHealth,
      isRefreshing,
      openSignIn,
      openSignUp,
      onAvatarPress,
      pickAvatar,
      signOut,
      refreshCloudData,
      requestPasswordReset,
      notifyEntryCreated,
      signIn,
      signUp,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthBottomSheet
        visible={sheetVisible}
        mode={sheetMode}
        variant={sheetVariant}
        avatarUri={avatarUri}
        avatarRevision={avatarRevision}
        onPickAvatar={pickAvatar}
        onClose={closeSheet}
        onModeChange={setSheetMode}
        onSignIn={signIn}
        onSignUp={signUp}
        onRequestPasswordReset={requestPasswordReset}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
