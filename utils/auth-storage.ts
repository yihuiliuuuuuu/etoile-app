import AsyncStorage from '@react-native-async-storage/async-storage';

import { clearPersistedAvatar } from '@/utils/profile-avatar';

const KEYS = {
  hasAccount: 'etoile_auth_has_account_v1',
  isSignedIn: 'etoile_auth_signed_in_v1',
  signUpPromptShown: 'etoile_auth_sign_up_prompt_shown_v1',
  email: 'etoile_auth_email_v1',
} as const;

export type AuthSnapshot = {
  hasAccount: boolean;
  isSignedIn: boolean;
  signUpPromptShown: boolean;
  email: string | null;
};

export async function loadAuthSnapshot(): Promise<AuthSnapshot> {
  try {
    const [hasAccount, isSignedIn, signUpPromptShown, email] = await Promise.all([
      AsyncStorage.getItem(KEYS.hasAccount),
      AsyncStorage.getItem(KEYS.isSignedIn),
      AsyncStorage.getItem(KEYS.signUpPromptShown),
      AsyncStorage.getItem(KEYS.email),
    ]);
    return {
      hasAccount: hasAccount === 'true',
      isSignedIn: isSignedIn === 'true',
      signUpPromptShown: signUpPromptShown === 'true',
      email: email || null,
    };
  } catch {
    return {
      hasAccount: false,
      isSignedIn: false,
      signUpPromptShown: false,
      email: null,
    };
  }
}

export async function persistAuthSnapshot(patch: Partial<AuthSnapshot>): Promise<void> {
  const ops: Promise<void>[] = [];
  if (patch.hasAccount !== undefined) {
    ops.push(AsyncStorage.setItem(KEYS.hasAccount, patch.hasAccount ? 'true' : 'false'));
  }
  if (patch.isSignedIn !== undefined) {
    ops.push(AsyncStorage.setItem(KEYS.isSignedIn, patch.isSignedIn ? 'true' : 'false'));
  }
  if (patch.signUpPromptShown !== undefined) {
    ops.push(
      AsyncStorage.setItem(KEYS.signUpPromptShown, patch.signUpPromptShown ? 'true' : 'false'),
    );
  }
  if (patch.email !== undefined) {
    if (patch.email) {
      ops.push(AsyncStorage.setItem(KEYS.email, patch.email));
    } else {
      ops.push(AsyncStorage.removeItem(KEYS.email));
    }
  }
  await Promise.all(ops);
}

/** Dev helper — reset local auth state. */
export async function clearAuthSnapshot(): Promise<void> {
  await Promise.all([
    ...Object.values(KEYS).map((key) => AsyncStorage.removeItem(key)),
    clearPersistedAvatar(),
  ]);
}
