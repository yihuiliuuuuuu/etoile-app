import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileAvatar, profileAvatarBaseStyle } from '@/components/profile-avatar';
import { SheetBackdrop } from '@/components/sheet-backdrop';
import { useBottomSheetAnimation } from '@/hooks/use-bottom-sheet-animation';
import { CLASSES_ACCENT, PRACTICE_ACCENT } from '@/constants/tab-colors';
import { letterTight, screenBackground, sfPro, weightSemibold } from '@/constants/typography';

export type AuthSheetMode = 'signIn' | 'signUp';
export type AuthSheetVariant = 'classes' | 'practice';

type Props = {
  visible: boolean;
  mode: AuthSheetMode;
  variant: AuthSheetVariant;
  avatarUri: string | null;
  avatarRevision?: number;
  onPickAvatar: () => void;
  onClose: () => void;
  onModeChange: (mode: AuthSheetMode) => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onRequestPasswordReset: (email: string) => Promise<void>;
};

type PasswordFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  visible: boolean;
  onToggleVisible: () => void;
  onFocus?: () => void;
  textContentType: 'password' | 'newPassword';
  autoComplete: 'password' | 'password-new';
};

function PasswordField({
  value,
  onChangeText,
  placeholder,
  visible,
  onToggleVisible,
  onFocus,
  textContentType,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <View style={styles.passwordRow}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor="#b7b7b7"
        secureTextEntry={!visible}
        textContentType={textContentType}
        autoComplete={autoComplete}
        style={[styles.fieldInput, styles.passwordInput]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggleVisible();
        }}
        style={({ pressed }) => [styles.eyeBtn, pressed && styles.pressed]}
        hitSlop={8}
      >
        <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
      </Pressable>
    </View>
  );
}

const COPY = {
  signIn: {
    title: 'Sign In',
    subtitle: 'Return to your practice',
    confirmLabel: 'Sign in',
    footerPrefix: "Don't have an account? ",
    footerLink: 'Sign up',
  },
  signUp: {
    title: 'Sign Up',
    subtitle: 'Begin your dance journey',
    confirmLabel: 'Sign up',
    footerPrefix: 'Already have an account? ',
    footerLink: 'Sign in',
  },
} as const;

export function AuthBottomSheet({
  visible,
  mode,
  variant,
  avatarUri,
  avatarRevision = 0,
  onPickAvatar,
  onClose,
  onModeChange,
  onSignIn,
  onSignUp,
  onRequestPasswordReset,
}: Props) {
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();
  const { translateY, closeAnimated, openAnimated, resetInstant, backdropAnimStyle, screenHeight } =
    useBottomSheetAnimation(onClose);
  const topInset = insets.top;

  const accent = variant === 'practice' ? PRACTICE_ACCENT : CLASSES_ACCENT;
  const copy = COPY[mode];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const dismiss = useCallback(() => {
    Keyboard.dismiss();
    closeAnimated();
  }, [closeAnimated]);

  useEffect(() => {
    if (!visible) {
      resetInstant();
      return;
    }
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setSubmitting(false);
    setAuthError(null);
    setResetMessage(null);
    openAnimated();
  }, [visible, mode, openAnimated, resetInstant]);

  const sheetAnim = useAnimatedStyle(() => {
    const kb = keyboard.height.value;
    const maxCollapsed = screenHeight * 0.94;
    const keyboardOpen = kb > 12;
    const fittedHeight = keyboardOpen
      ? Math.min(maxCollapsed, screenHeight - kb - topInset - 8)
      : maxCollapsed;
    return {
      transform: [{ translateY: translateY.value - kb }],
      maxHeight: fittedHeight,
      height: keyboardOpen ? fittedHeight : undefined,
    };
  }, [topInset]);

  const scrollContentAnim = useAnimatedStyle(() => {
    const kb = keyboard.height.value;
    return {
      paddingBottom: kb > 0 ? 20 : 8,
    };
  });

  const scrollFocusedFieldIntoView = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const passwordsMatch = confirmPassword === password;
  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    (mode === 'signIn' || (passwordsMatch && confirmPassword.length >= 6));

  const onSubmit = useCallback(async () => {
    if (!canSubmit || submitting) return;
    if (mode === 'signUp' && !passwordsMatch) {
      setAuthError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    setAuthError(null);
    try {
      if (mode === 'signUp') {
        await onSignUp(email, password);
      } else {
        await onSignIn(email, password);
      }
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, submitting, mode, email, password, passwordsMatch, onSignIn, onSignUp]);

  const switchMode = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setAuthError(null);
    setResetMessage(null);
    onModeChange(mode === 'signIn' ? 'signUp' : 'signIn');
  }, [mode, onModeChange]);

  const onForgotPassword = useCallback(async () => {
    setAuthError(null);
    setResetMessage(null);
    setSubmitting(true);
    try {
      await onRequestPasswordReset(email);
      setResetMessage('Check your email for a password reset link.');
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setResetMessage(null);
      setAuthError(err instanceof Error ? err.message : 'Could not send reset email.');
    } finally {
      setSubmitting(false);
    }
  }, [email, onRequestPasswordReset]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismiss}
    >
      <View style={styles.modalRoot}>
        <SheetBackdrop animatedStyle={backdropAnimStyle} onPress={dismiss} />

        <Animated.View
          style={[
            styles.sheet,
            sheetAnim,
            { paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 16) },
          ]}
        >
          <View style={styles.handle} accessibilityLabel="Sheet handle" />

          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={dismiss}
              style={({ pressed }) => [styles.headerCircle, pressed && styles.pressed]}
            >
              <Text style={styles.closeGlyph}>×</Text>
            </Pressable>
            <View style={styles.headerSpacer} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={copy.confirmLabel}
              disabled={!canSubmit || submitting}
              onPress={() => void onSubmit()}
              style={({ pressed }) => [
                styles.headerCircle,
                { backgroundColor: accent },
                (!canSubmit || submitting) && styles.confirmDisabled,
                pressed && canSubmit && !submitting && styles.pressed,
              ]}
            >
              <Text style={styles.checkGlyph}>✓</Text>
            </Pressable>
          </View>

          <Animated.ScrollView
            ref={scrollRef}
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, scrollContentAnim]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
              onPress={onPickAvatar}
              style={({ pressed }) => [styles.avatarWrap, pressed && styles.pressed]}
            >
              <ProfileAvatar
                uri={avatarUri}
                revision={avatarRevision}
                size={112}
                style={profileAvatarBaseStyle.base}
              />
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={16} color="#111" />
              </View>
            </Pressable>

            <Text style={styles.title}>{copy.title}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
            {authError ? <Text style={styles.authError}>{authError}</Text> : null}
            {resetMessage ? <Text style={styles.resetMessage}>{resetMessage}</Text> : null}

            <View style={styles.fieldCard}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                onFocus={scrollFocusedFieldIntoView}
                placeholder="Email"
                placeholderTextColor="#b7b7b7"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                style={styles.fieldInput}
              />
              <View style={styles.fieldDivider} />
              <PasswordField
                value={password}
                onChangeText={setPassword}
                onFocus={scrollFocusedFieldIntoView}
                placeholder="Password"
                visible={showPassword}
                onToggleVisible={() => setShowPassword((v) => !v)}
                textContentType={mode === 'signUp' ? 'newPassword' : 'password'}
                autoComplete={mode === 'signUp' ? 'password-new' : 'password'}
              />
              {mode === 'signUp' ? (
                <>
                  <View style={styles.fieldDivider} />
                  <PasswordField
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={scrollFocusedFieldIntoView}
                    placeholder="Confirm password"
                    visible={showConfirmPassword}
                    onToggleVisible={() => setShowConfirmPassword((v) => !v)}
                    textContentType="newPassword"
                    autoComplete="password-new"
                  />
                </>
              ) : null}
            </View>

            {mode === 'signIn' ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
                disabled={submitting}
                onPress={() => void onForgotPassword()}
                style={styles.forgotPress}
              >
                <Text style={[styles.forgotText, { color: accent }]}>Forgot password?</Text>
              </Pressable>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={switchMode}
              style={styles.footerPress}
            >
              <Text style={styles.footerText}>
                {copy.footerPrefix}
                <Text style={[styles.footerLink, { color: accent }]}>{copy.footerLink}</Text>
              </Text>
            </Pressable>
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: screenBackground,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 20,
    paddingTop: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 24,
  },
  scroll: {
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerSpacer: {
    width: 44,
  },
  headerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8e8ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeGlyph: {
    fontFamily: sfPro,
    fontSize: 26,
    color: '#333',
    fontWeight: weightSemibold,
    marginTop: -2,
    includeFontPadding: false,
  },
  checkGlyph: {
    fontFamily: sfPro,
    fontSize: 20,
    color: '#fff',
    fontWeight: weightSemibold,
    includeFontPadding: false,
  },
  confirmDisabled: {
    opacity: 0.45,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 4,
  },
  avatarWrap: {
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  cameraBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: screenBackground,
  },
  title: {
    fontFamily: sfPro,
    fontSize: 28,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: sfPro,
    fontSize: 16,
    fontWeight: weightSemibold,
    color: '#9a9a9a',
    letterSpacing: letterTight,
    textAlign: 'center',
    marginBottom: 12,
  },
  authError: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#c44',
    letterSpacing: letterTight,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resetMessage: {
    fontFamily: sfPro,
    fontSize: 14,
    fontWeight: weightSemibold,
    color: '#4a4a4a',
    letterSpacing: letterTight,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  forgotPress: {
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  forgotText: {
    fontFamily: sfPro,
    fontSize: 15,
    fontWeight: weightSemibold,
    letterSpacing: letterTight,
  },
  fieldCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 18,
    marginBottom: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
    overflow: 'hidden',
  },
  fieldInput: {
    fontFamily: sfPro,
    fontSize: 17,
    fontWeight: weightSemibold,
    color: '#111',
    letterSpacing: letterTight,
    paddingVertical: 16,
  },
  fieldDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ebebeb',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  footerPress: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  footerText: {
    fontFamily: sfPro,
    fontSize: 15,
    fontWeight: weightSemibold,
    color: '#9a9a9a',
    letterSpacing: letterTight,
    textAlign: 'center',
  },
  footerLink: {
    fontWeight: weightSemibold,
  },
  pressed: {
    opacity: 0.88,
  },
});
