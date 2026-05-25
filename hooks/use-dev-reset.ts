import { resetAppToFreshExperience } from '@/utils/reset-app-state';
import { Alert, DevSettings } from 'react-native';

/** Long-press tab title in development builds to replay onboarding → empty → sign-in. */
export function useDevReset() {
  if (!__DEV__) {
    return { onLongPressTitle: undefined as undefined };
  }

  const onLongPressTitle = () => {
    Alert.alert(
      'Reset app?',
      'Clears onboarding, sign-in, and all logs. The app will reload from the beginning.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            void resetAppToFreshExperience().then(() => DevSettings.reload());
          },
        },
      ],
    );
  };

  return { onLongPressTitle };
}
