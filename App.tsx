import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { NotebookScreen } from './src/screens/NotebookScreen';
import { RootStackParamList } from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import OnboardingSlideshow from './components/OnboardingSlideshow';
import { useOnboardingStore } from './contexts/OnboardingStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const hasAcceptedPrivacyPolicy = useOnboardingStore((s) => s.hasAcceptedPrivacyPolicy);
  const hasCompletedOnboarding = useOnboardingStore((s) => s.hasCompletedOnboarding);
  const acceptPrivacyPolicy = useOnboardingStore((s) => s.acceptPrivacyPolicy);
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Notebook" component={NotebookScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
      
      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        visible={!hasAcceptedPrivacyPolicy}
        onAccept={acceptPrivacyPolicy}
      />
      
      {/* Onboarding Slideshow */}
      <OnboardingSlideshow
        visible={hasAcceptedPrivacyPolicy && !hasCompletedOnboarding}
        onComplete={completeOnboarding}
      />
    </SafeAreaProvider>
  );
}
