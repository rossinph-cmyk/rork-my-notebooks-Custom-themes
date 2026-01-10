import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import {
  Mic,
  Edit3,
  Palette,
  ImageIcon,
  BookOpen,
  PaintBucket,
  Layers,
  Share2,
  Moon,
  Pencil,
  Trash2,
  Eye,
  Save,
  Fingerprint,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface OnboardingSlideshowProps {
  visible: boolean;
  onComplete: () => void;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Slide {
  title: string;
  color: string;
  gradientColors: readonly [string, string, string];
  features: Feature[];
  backgroundImage: any;
}

const SLIDES: Slide[] = [
  {
    title: 'Welcome to My-Notebooks-Custom-Themes!',
    color: '#7C3AED',
    gradientColors: ['#7C3AEDCC', '#7C3AED66', '#000000'],
    backgroundImage: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/ca4vga2jmdte4l84w6jf7',
    features: [
      {
        icon: <Mic size={28} color="#FFFFFF" />,
        title: 'Voice-to-Text',
        description: 'Tap the microphone button to record your voice and instantly convert it to text',
      },
      {
        icon: <Edit3 size={28} color="#FFFFFF" />,
        title: 'Edit Text Anytime',
        description: 'Click on any note text to manually edit it with your keyboard',
      },
      {
        icon: <Palette size={28} color="#FFFFFF" />,
        title: 'Customize Colors',
        description: 'Change notebook cover colors using the rainbow gradient color picker',
      },
      {
        icon: <ImageIcon size={28} color="#FFFFFF" />,
        title: 'Add Background Images',
        description: 'Personalize each notebook with custom photos and adjust transparency',
      },
    ],
  },
  {
    title: 'Organize Your Notes',
    color: '#EC4899',
    gradientColors: ['#EC4899CC', '#EC489966', '#000000'],
    backgroundImage: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/jy6e8sl3j36iy603hfv9f',
    features: [
      {
        icon: <BookOpen size={28} color="#FFFFFF" />,
        title: 'Multiple Notebooks',
        description: 'Create unlimited notebooks to organize different topics or projects',
      },
      {
        icon: <PaintBucket size={28} color="#FFFFFF" />,
        title: 'Individual Note Colors',
        description: 'Customize background and text colors for each individual note',
      },
      {
        icon: <Layers size={28} color="#FFFFFF" />,
        title: 'Transparency Control',
        description: 'Adjust image transparency with a slider for perfect visibility (0-100%)',
      },
      {
        icon: <Share2 size={28} color="#FFFFFF" />,
        title: 'Share Your Notes',
        description: 'Easily share notes via WhatsApp, messaging apps, or email',
      },
    ],
  },
  {
    title: 'Personalize Everything',
    color: '#D4A574',
    gradientColors: ['#D4A574CC', '#D4A57466', '#000000'],
    backgroundImage: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/tsztq9kr3o0hadg5evytc',
    features: [
      {
        icon: <ImageIcon size={28} color="#FFFFFF" />,
        title: 'Notebook Background Images',
        description: 'Add custom photos to individual notebook covers with ghosted transparency',
      },
      {
        icon: <ImageIcon size={28} color="#FFFFFF" />,
        title: 'Home Screen Background',
        description: 'Set a background image for your entire home screen',
      },
      {
        icon: <Moon size={28} color="#FFFFFF" />,
        title: 'Dark Mode',
        description: 'Toggle between light and dark themes for comfortable viewing',
      },
      {
        icon: <Pencil size={28} color="#FFFFFF" />,
        title: 'Rename Notebooks',
        description: 'Tap on notebook names to quickly rename and organize your collection',
      },
    ],
  },
  {
    title: 'Advanced Features',
    color: '#0891B2',
    gradientColors: ['#0891B2CC', '#0891B266', '#000000'],
    backgroundImage: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/iuszs9lf5ys2r6os6ax6r',
    features: [
      {
        icon: <Trash2 size={28} color="#FFFFFF" />,
        title: 'Delete Notes & Notebooks',
        description: 'Long-press notebooks or swipe notes to delete unwanted items',
      },
      {
        icon: <Eye size={28} color="#FFFFFF" />,
        title: 'Lined Paper View',
        description: 'Notes display on realistic lined paper for a familiar writing experience',
      },
      {
        icon: <Save size={28} color="#FFFFFF" />,
        title: 'Auto-Save',
        description: 'All your notes are automatically saved locally on your device',
      },
      {
        icon: <Fingerprint size={28} color="#FFFFFF" />,
        title: 'No Account Required',
        description: 'Privacy-focused: no login needed, all data stays on your device',
      },
    ],
  },
];

export default function OnboardingSlideshow({ visible, onComplete }: OnboardingSlideshowProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentSlideIndex < SLIDES.length - 1) {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete();
  };

  const handleGetStarted = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex !== currentSlideIndex) {
      setCurrentSlideIndex(slideIndex);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent transparent={false} presentationStyle="fullScreen">
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {SLIDES.map((slide, index) => (
            <View key={index} style={styles.slide}>
              <Image
                source={{ uri: slide.backgroundImage }}
                style={styles.backgroundImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={slide.gradientColors}
                style={styles.gradient}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              >
                <View style={styles.slideContent}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.slideTitle}>{slide.title}</Text>
                  </View>

                  <View style={styles.featuresContainer}>
                    {slide.features.map((feature, featureIndex) => (
                      <View key={featureIndex} style={styles.featureCard}>
                        <View style={styles.iconContainer}>{feature.icon}</View>
                        <View style={styles.featureTextContainer}>
                          <Text style={styles.featureTitle}>{feature.title}</Text>
                          <Text style={styles.featureDescription}>{feature.description}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomSection}>
          <View style={styles.paginationContainer}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentSlideIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            {currentSlideIndex < SLIDES.length - 1 ? (
              <>
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  slide: {
    width,
    height,
  },
  backgroundImage: {
    position: 'absolute' as const,
    width: '100%',
    height: '100%',
    opacity: 0.25,
  },
  gradient: {
    flex: 1,
  },
  slideContent: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 160,
    paddingHorizontal: 24,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  featuresContainer: {
    flex: 1,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 22,
  },
  bottomSection: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingBottom: 40,
    paddingTop: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 32,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  nextButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#000000',
  },
  getStartedButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  getStartedButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#000000',
  },
});
