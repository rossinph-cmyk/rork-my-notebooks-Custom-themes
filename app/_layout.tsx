import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotebookProvider } from "@/contexts/NotebookContext";
import { useOnboardingStore } from "@/contexts/OnboardingStore";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import OnboardingSlideshow from "@/components/OnboardingSlideshow";


SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "My Notebooks",
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="notebook/[id]" 
        options={{ 
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="+not-found" 
        options={{ 
          title: "Not Found",
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  const { hasAcceptedPrivacyPolicy, hasCompletedOnboarding, acceptPrivacyPolicy, completeOnboarding } = useOnboardingStore();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NotebookProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
          <PrivacyPolicyModal
            visible={!hasAcceptedPrivacyPolicy}
            onAccept={acceptPrivacyPolicy}
          />
          <OnboardingSlideshow
            visible={hasAcceptedPrivacyPolicy && !hasCompletedOnboarding}
            onComplete={completeOnboarding}
          />
        </GestureHandlerRootView>
      </NotebookProvider>
    </QueryClientProvider>
  );
}
