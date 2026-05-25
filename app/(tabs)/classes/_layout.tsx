import { Stack } from 'expo-router';

export default function ClassesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="monthly" />
      <Stack.Screen name="studios" />
    </Stack>
  );
}
