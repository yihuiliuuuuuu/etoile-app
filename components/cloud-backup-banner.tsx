import { useAuth } from '@/contexts/auth-context';
import { getCloudSetupMessage } from '@/lib/env';
import { getSchemaSetupMessage } from '@/services/supabase-health';
import { StyleSheet, Text, View } from 'react-native';

import { letterTight, sfPro, weightSemibold } from '@/constants/typography';

/** Warns when cloud backup cannot save or restore data (env, schema, or storage). */
export function CloudBackupBanner() {
  const { loaded, cloudBackupEnabled, supabaseHealth } = useAuth();

  if (!loaded || !supabaseHealth) return null;

  if (!cloudBackupEnabled) {
    if (!__DEV__) return null;
    return (
      <View style={styles.banner} accessibilityRole="alert">
        <Text style={styles.title}>Cloud backup off</Text>
        <Text style={styles.body}>{getCloudSetupMessage()}</Text>
      </View>
    );
  }

  if (!supabaseHealth.schemaReady) {
    return (
      <View style={[styles.banner, styles.bannerCritical]} accessibilityRole="alert">
        <Text style={styles.titleCritical}>Database not set up</Text>
        <Text style={styles.bodyCritical}>
          {getSchemaSetupMessage(supabaseHealth.missingTables)}
          {'\n\n'}
          Until this is done, classes and avatars only stay on this device and disappear after Reset.
        </Text>
      </View>
    );
  }

  if (!supabaseHealth.avatarsBucketReady) {
    return (
      <View style={styles.banner} accessibilityRole="alert">
        <Text style={styles.title}>Avatars bucket missing</Text>
        <Text style={styles.body}>
          In Supabase Dashboard → Storage, create a public bucket named avatars (or re-run the
          storage section at the bottom of supabase/schema.sql).
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF4E5',
    borderWidth: 1,
    borderColor: '#F5C26B',
  },
  bannerCritical: {
    backgroundColor: '#FFEBEE',
    borderColor: '#E57373',
  },
  title: {
    fontFamily: sfPro,
    fontWeight: weightSemibold,
    fontSize: 14,
    letterSpacing: letterTight,
    color: '#8A5A00',
    marginBottom: 4,
  },
  titleCritical: {
    fontFamily: sfPro,
    fontWeight: weightSemibold,
    fontSize: 14,
    letterSpacing: letterTight,
    color: '#B71C1C',
    marginBottom: 4,
  },
  body: {
    fontFamily: sfPro,
    fontSize: 12,
    lineHeight: 17,
    color: '#6B4E12',
  },
  bodyCritical: {
    fontFamily: sfPro,
    fontSize: 12,
    lineHeight: 17,
    color: '#7F1D1D',
  },
});
