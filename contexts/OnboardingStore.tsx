import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  hasAcceptedPrivacyPolicy: boolean;
  hasCompletedOnboarding: boolean;
  acceptPrivacyPolicy: () => void;
  completeOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasAcceptedPrivacyPolicy: false,
      hasCompletedOnboarding: false,
      acceptPrivacyPolicy: () => set({ hasAcceptedPrivacyPolicy: true }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: 'my-notebooks-custom-themes-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
