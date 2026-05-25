import { StoryOnboarding } from '@/components/onboarding/story-onboarding';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
  return (
    <>
      <StatusBar style="light" />
      <StoryOnboarding />
    </>
  );
}
