import { ActionSheetIOS, Alert, Platform } from 'react-native';

type Options = {
  onChangePhoto: () => void;
  onSignOut: () => void;
};

function confirmSignOut(onSignOut: () => void) {
  Alert.alert('Sign out?', 'You can sign in again anytime. Your data stays on this device.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: onSignOut },
  ]);
}

export function showProfileAvatarMenu({ onChangePhoto, onSignOut }: Options) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Change photo', 'Sign out', 'Cancel'],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      (index) => {
        if (index === 0) onChangePhoto();
        if (index === 1) confirmSignOut(onSignOut);
      },
    );
    return;
  }

  Alert.alert('Profile', undefined, [
    { text: 'Change photo', onPress: onChangePhoto },
    { text: 'Sign out', style: 'destructive', onPress: () => confirmSignOut(onSignOut) },
    { text: 'Cancel', style: 'cancel' },
  ]);
}
