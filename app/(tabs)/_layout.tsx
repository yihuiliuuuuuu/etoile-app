import { FloatingTabNav } from '@/components/floating-tab-nav';
import { ClassEntryBottomSheet } from '@/components/class-entry-bottom-sheet';
import { PracticeEntryBottomSheet } from '@/components/practice-entry-bottom-sheet';
import { AuthProvider } from '@/contexts/auth-context';
import { ClassLogProvider, useClassLog } from '@/contexts/class-log-context';
import { GoalsProvider } from '@/contexts/goals-context';
import { PracticeLogProvider, usePracticeLog } from '@/contexts/practice-log-context';
import { CLASSES_ACCENT, PRACTICE_ACCENT } from '@/constants/tab-colors';
import { letterTight, sfPro, weightSemibold } from '@/constants/typography';
import { Tabs, usePathname } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { FloatingTabId } from '@/components/tab-nav-types';

function TabLayoutInner() {
  const pathname = usePathname();
  const {
    isEditorVisible: practiceEditorVisible,
    editingEntry: practiceEditingEntry,
    openCreate: openPracticeCreate,
    closeEditor: closePracticeEditor,
  } = usePracticeLog();
  const {
    isEditorVisible: classEditorVisible,
    editingEntry: classEditingEntry,
    openCreate: openClassCreate,
    closeEditor: closeClassEditor,
  } = useClassLog();

  const activeTab = useMemo((): FloatingTabId => {
    const p = pathname ?? '';
    return p.includes('practice') ? 'practice' : 'classes';
  }, [pathname]);

  const openFabSheet = useCallback(() => {
    if (activeTab === 'practice') {
      openPracticeCreate();
    } else {
      openClassCreate();
    }
  }, [activeTab, openClassCreate, openPracticeCreate]);

  return (
      <View style={styles.root}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen name="classes" options={{ title: 'Classes' }} />
          <Tabs.Screen name="practice" options={{ title: 'Practice' }} />
        </Tabs>

      <FloatingTabNav active={activeTab} />

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: activeTab === 'practice' ? PRACTICE_ACCENT : CLASSES_ACCENT },
        ]}
        onPress={openFabSheet}
        accessibilityRole="button"
        accessibilityLabel={activeTab === 'practice' ? 'Add practice' : 'Add class'}
      >
        <Text style={styles.plus}>＋</Text>
      </TouchableOpacity>

      <PracticeEntryBottomSheet
        visible={practiceEditorVisible}
        editingEntry={practiceEditingEntry}
        onClose={closePracticeEditor}
      />
      <ClassEntryBottomSheet
        visible={classEditorVisible}
        editingEntry={classEditingEntry}
        onClose={closeClassEditor}
      />
      </View>
  );
}

export default function TabLayout() {
  return (
    <AuthProvider>
      <GoalsProvider>
        <PracticeLogProvider>
          <ClassLogProvider>
            <TabLayoutInner />
          </ClassLogProvider>
        </PracticeLogProvider>
      </GoalsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fab: {
    position: 'absolute',
    right: 26,
    bottom: 28,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontFamily: sfPro,
    color: 'white',
    fontSize: 38,
    fontWeight: weightSemibold,
    letterSpacing: letterTight,
  },
});
