import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/AppText';
import { Avatar } from '@/src/components/Avatar';
import { colors, spacing } from '@/src/theme';

interface GreetingProps {
  salutation: string;
  name: string;
  avatarUri?: string;
  initials?: string;
}

/**
 * Editorial header at the top of the Home screen.
 *
 * "Good morning," in italic serif followed by the user's first name in
 * the bold serif cut, with a circular avatar on the right.
 */
export function Greeting({ salutation, name, avatarUri, initials }: GreetingProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText variant="subtitleSerifItalic" color={colors.textSecondary}>
          {salutation},
        </AppText>
        <AppText variant="displaySerif" color={colors.textPrimary} style={styles.name}>
          {name}
        </AppText>
      </View>
      <Avatar uri={avatarUri} initials={initials ?? name} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    paddingRight: spacing.md,
  },
  name: {
    marginTop: spacing.xxs,
  },
});
