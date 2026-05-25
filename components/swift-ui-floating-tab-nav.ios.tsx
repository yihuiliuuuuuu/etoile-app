import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import type { FloatingTabId } from '@/components/tab-nav-types';
import { Host, Picker, Text } from '@expo/ui/swift-ui';
import { glassEffect, padding, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';

type Props = {
  active: FloatingTabId;
};

export function SwiftUIFloatingTabNav({ active }: Props) {
  const router = useRouter();

  const onSelectionChange = useCallback(
    (selection: string | number | null) => {
      const s = String(selection);
      if (s === active) return;
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (s === 'classes') {
        router.replace('/classes' as never);
      } else if (s === 'practice') {
        router.replace('/practice' as never);
      }
    },
    [active, router],
  );

  return (
    <View style={styles.anchor} pointerEvents="box-none">
      <Host
        matchContents
        colorScheme="light"
        style={styles.host}
        modifiers={[
          glassEffect({
            glass: { variant: 'clear', interactive: true },
            shape: 'capsule',
          }),
          padding({ horizontal: 6, vertical: 4 }),
        ]}
      >
        <Picker
          selection={active}
          onSelectionChange={onSelectionChange}
          modifiers={[pickerStyle('segmented')]}
        >
          <Text modifiers={[tag('classes')]}>Classes</Text>
          <Text modifiers={[tag('practice')]}>Practice</Text>
        </Picker>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: {
    position: 'absolute',
    left: 16,
    bottom: 28,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  host: {
    minWidth: 200,
  },
});
