import React, { useState, useRef } from "react";
import { View, Text, Modal, Pressable, ScrollView, Dimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingSlideshowProps {
  visible: boolean;
  onComplete: () => void;
}

const SLIDES = [
  {
    id: 1,
    color: "#7C3AED",
    title: "Welcome to Voice Notepad!",
    // image: require("../../assets/WhatsApp Image 2025-12-11 at 23.06.15_99233046-1765465638984.jpeg"),
    features: [
      {
        icon: "mic",
        title: "Voice-to-Text",
        description: "Tap the microphone button to record your voice and instantly convert it to text"
      },
      {
        icon: "create-outline",
        title: "Edit Text Anytime",
        description: "Click on any note text to manually edit it with your keyboard"
      },
      {
        icon: "color-palette",
        title: "Customize Colors",
        description: "Change notebook cover colors using the rainbow gradient color picker"
      },
      {
        icon: "image-outline",
        title: "Add Background Images",
        description: "Personalize each notebook with custom photos and adjust transparency"
      }
    ]
  },
  {
    id: 2,
    color: "#EC4899",
    title: "Organize Your Notes",
    // image: require("../../assets/WhatsApp Image 2025-12-11 at 23.06.16_f6d1bd59-1765465654331.jpeg"),
    features: [
      {
        icon: "book",
        title: "Multiple Notebooks",
        description: "Create unlimited notebooks to organize different topics or projects"
      },
      {
        icon: "color-fill",
        title: "Individual Note Colors",
        description: "Customize background and text colors for each individual note"
      },
      {
        icon: "layers-outline",
        title: "Transparency Control",
        description: "Adjust image transparency with a slider for perfect visibility (0-100%)"
      },
      {
        icon: "share-social",
        title: "Share Your Notes",
        description: "Easily share notes via WhatsApp, messaging apps, or email"
      }
    ]
  },
  {
    id: 3,
    color: "#D4A574",
    title: "Personalize Everything",
    // image: require("../../assets/WhatsApp Image 2025-12-11 at 23.06.16_c178f76d-1765465681684.jpeg"),
    features: [
      {
        icon: "image",
        title: "Notebook Background Images",
        description: "Add custom photos to individual notebook covers with ghosted transparency"
      },
      {
        icon: "images-outline",
        title: "Home Screen Background",
        description: "Set a background image for your entire home screen"
      },
      {
        icon: "contrast",
        title: "Dark Mode",
        description: "Toggle between light and dark themes for comfortable viewing"
      },
      {
        icon: "pencil",
        title: "Rename Notebooks",
        description: "Tap on notebook names to quickly rename and organize your collection"
      }
    ]
  },
  {
    id: 4,
    color: "#0891B2",
    title: "Advanced Features",
    // image: require("../../assets/WhatsApp Image 2025-12-11 at 23.06.16_6e23342c-1765465698275.jpeg"),
    features: [
      {
        icon: "trash-outline",
        title: "Delete Notes & Notebooks",
        description: "Long-press notebooks or swipe notes to delete unwanted items"
      },
      {
        icon: "eye-outline",
        title: "Lined Paper View",
        description: "Notes display on realistic lined paper for a familiar writing experience"
      },
      {
        icon: "save-outline",
        title: "Auto-Save",
        description: "All your notes are automatically saved locally on your device"
      },
      {
        icon: "finger-print",
        title: "No Account Required",
        description: "Privacy-focused: no login needed, all data stays on your device"
      }
    ]
  }
];

export const OnboardingSlideshow: React.FC<OnboardingSlideshowProps> = ({
  visible,
  onComplete,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * SCREEN_WIDTH,
        animated: true,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
    setCurrentSlide(0);
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={handleComplete}
    >
      <View className="flex-1 bg-gray-900">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {SLIDES.map((slide, index) => (
            <View
              key={slide.id}
              style={{ width: SCREEN_WIDTH }}
              className="flex-1"
            >
              <View className="flex-1">
                {/* Background Image Layer */}
                {slide.image && (
                  <Image
                    source={slide.image}
                    className="absolute inset-0 w-full h-full"
                    style={{ opacity: 0.25 }}
                    resizeMode="cover"
                  />
                )}

                {/* Gradient Overlay */}
                <LinearGradient
                  colors={[slide.color + "CC", slide.color + "66", "#000000"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ flex: 1 }}
                >
                  {/* Title Section */}
                  <View className="h-64 items-center justify-center px-6">
                    <View className="bg-white/20 backdrop-blur-lg rounded-3xl p-6">
                      <Text className="text-4xl font-bold text-white text-center">
                        {slide.title}
                      </Text>
                    </View>
                  </View>

                {/* Features List */}
                <ScrollView
                  className="flex-1 px-6 pt-8"
                  showsVerticalScrollIndicator={false}
                >
                  {slide.features.map((feature, idx) => (
                    <View
                      key={idx}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-4 flex-row"
                    >
                      <View className="mr-4">
                        <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                          <Ionicons name={feature.icon as any} size={24} color="#FFFFFF" />
                        </View>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xl font-bold text-white mb-2">
                          {feature.title}
                        </Text>
                        <Text className="text-base text-white/80 leading-6">
                          {feature.description}
                        </Text>
                      </View>
                    </View>
                  ))}

                  <View className="h-32" />
                </ScrollView>
              </LinearGradient>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Navigation */}
        <View className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-lg p-6">
          {/* Pagination Dots */}
          <View className="flex-row justify-center mb-6">
            {SLIDES.map((_, index) => (
              <View
                key={index}
                className="mx-2 rounded-full"
                style={{
                  width: currentSlide === index ? 32 : 8,
                  height: 8,
                  backgroundColor: currentSlide === index ? "#FFFFFF" : "#FFFFFF40",
                }}
              />
            ))}
          </View>

          {/* Buttons */}
          <View className="flex-row gap-3">
            {currentSlide < SLIDES.length - 1 ? (
              <>
                <Pressable
                  onPress={handleSkip}
                  className="flex-1 bg-white/20 rounded-xl py-4 items-center active:opacity-70"
                >
                  <Text className="text-white text-base font-semibold">Skip</Text>
                </Pressable>
                <Pressable
                  onPress={handleNext}
                  className="flex-1 bg-white rounded-xl py-4 items-center active:opacity-70"
                >
                  <Text className="text-gray-900 text-base font-bold">Next</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                onPress={handleComplete}
                className="flex-1 bg-white rounded-xl py-4 items-center active:opacity-70"
              >
                <Text className="text-gray-900 text-base font-bold">Get Started</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
