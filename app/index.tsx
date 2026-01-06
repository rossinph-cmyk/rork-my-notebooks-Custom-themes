import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNotebooks } from '@/contexts/NotebookContext';
import { THEME_COLORS, CRAYON_COLORS } from '@/constants/colors';
import { BookOpen, Plus, Moon, Sun, Palette, Image as ImageIcon, HelpCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import OnboardingSlideshow from '@/components/OnboardingSlideshow';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width > 600 ? 280 : (width - 48) / 2;

export default function HomeScreen() {
  const router = useRouter();
  const { notebooks, darkMode, homeBackgroundImage, homeBackgroundImageOpacity, homeBackgroundColor, homeBackgroundColorOpacity, toggleDarkMode, createNotebook, updateNotebook, deleteNotebook, setHomeBackground, setHomeBackgroundOpacity, setHomeBackgroundColor, setHomeBackgroundColorOpacity } = useNotebooks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(CRAYON_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingNotebook, setEditingNotebook] = useState<string | null>(null);
  const [customColorHue, setCustomColorHue] = useState(0);
  const [customColorSaturation, setCustomColorSaturation] = useState(100);
  const [customColorLightness, setCustomColorLightness] = useState(50);
  const [customColorAlpha, setCustomColorAlpha] = useState(100);
  
  const hueSliderRef = useRef<View>(null);
  const saturationSliderRef = useRef<View>(null);
  const lightnessSliderRef = useRef<View>(null);
  const alphaSliderRef = useRef<View>(null);
  const imageOpacitySliderRef = useRef<View>(null);
  const imageBgColorOpacitySliderRef = useRef<View>(null);
  const homeImageOpacitySliderRef = useRef<View>(null);
  const homeBgColorOpacitySliderRef = useRef<View>(null);
  const [showFeaturesSlideshow, setShowFeaturesSlideshow] = useState(false);
  
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | undefined>(undefined);
  const [imageOpacity, setImageOpacity] = useState(0.15);
  const [imageBgColor, setImageBgColor] = useState('#3B82F6');
  const [imageBgColorOpacity, setImageBgColorOpacity] = useState(0.5);
  
  const [showHomeImagePicker, setShowHomeImagePicker] = useState(false);
  const [selectedHomeImageUri, setSelectedHomeImageUri] = useState<string | undefined>(undefined);
  const [homeImageOpacity, setHomeImageOpacity] = useState(0.15);
  const [homeBgColor, setHomeBgColor] = useState('#3B82F6');
  const [homeBgColorOpacity, setHomeBgColorOpacity] = useState(0.5);
  
  const sliderWidth = width > 600 ? 400 : width - 80;

  const theme = darkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  const handleCreateNotebook = () => {
    if (newNotebookName.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      createNotebook(newNotebookName.trim(), selectedColor, '#FFFFFF', '#000000');
      setNewNotebookName('');
      setShowCreateModal(false);
    }
  };

  const handleNotebookPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/notebook/${id}` as any);
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const handleDeleteNotebook = (id: string, name: string) => {
    Alert.alert(
      'Delete Notebook',
      `Are you sure you want to delete "${name}"? This will delete all notes inside.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            deleteNotebook(id);
          },
        },
      ]
    );
  };

  const handleOpenColorPicker = (notebookId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingNotebook(notebookId);
    setCustomColorHue(0);
    setCustomColorSaturation(100);
    setCustomColorLightness(50);
    setCustomColorAlpha(100);
    setShowColorPicker(true);
  };

  const handleColorSelect = (color: string) => {
    if (editingNotebook) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      updateNotebook(editingNotebook, { color });
      setShowColorPicker(false);
    }
  };

  const handleCustomColorSelect = () => {
    const hexColor = hslToHex(customColorHue, customColorSaturation, customColorLightness);
    const alpha = Math.round((customColorAlpha / 100) * 255).toString(16).padStart(2, '0');
    const colorWithAlpha = customColorAlpha === 100 ? hexColor : `${hexColor}${alpha}`;
    handleColorSelect(colorWithAlpha);
  };

  const handleOpenImagePicker = (notebookId: string) => {
    const notebook = notebooks.find((nb) => nb.id === notebookId);
    if (!notebook) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingImageId(notebookId);
    setSelectedImageUri(notebook.coverImage);
    setImageOpacity(notebook.coverImageOpacity || 0.15);
    setImageBgColor(notebook.coverImageColor || '#3B82F6');
    setImageBgColorOpacity(notebook.coverImageColorOpacity || 0.5);
    setShowImagePicker(true);
  };
  
  const handlePickImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Image picker is not available on web');
      return;
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedImageUri(result.assets[0].uri);
    }
  };
  
  const handleSaveImage = () => {
    if (editingImageId) {
      updateNotebook(editingImageId, { 
        coverImage: selectedImageUri,
        coverImageOpacity: selectedImageUri ? imageOpacity : 0.15,
        coverImageColor: imageBgColor,
        coverImageColorOpacity: imageBgColorOpacity
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowImagePicker(false);
    setEditingImageId(null);
  };
  
  const handleRemoveImage = () => {
    setSelectedImageUri(undefined);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleOpenHomeImagePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedHomeImageUri(homeBackgroundImage || undefined);
    setHomeImageOpacity(homeBackgroundImageOpacity || 0.15);
    setHomeBgColor(homeBackgroundColor || '#3B82F6');
    setHomeBgColorOpacity(homeBackgroundColorOpacity || 0.5);
    setShowHomeImagePicker(true);
  };
  
  const handlePickHomeImage = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Image picker is not available on web');
      return;
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedHomeImageUri(result.assets[0].uri);
    }
  };
  
  const handleSaveHomeImage = async () => {
    await setHomeBackground(selectedHomeImageUri || null);
    if (selectedHomeImageUri) {
      await setHomeBackgroundOpacity(homeImageOpacity);
    }
    await setHomeBackgroundColor(homeBgColor);
    await setHomeBackgroundColorOpacity(homeBgColorOpacity);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowHomeImagePicker(false);
  };
  
  const handleRemoveHomeImage = () => {
    setSelectedHomeImageUri(undefined);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderBinderRings = () => (
    <View style={styles.binderRings}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.binderRing} />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {homeBackgroundImage && (
        <>
          <View style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: homeBackgroundColor, opacity: homeBackgroundColorOpacity || 0.5 }
          ]} />
          <Image
            source={{ uri: homeBackgroundImage }}
            style={[
              StyleSheet.absoluteFillObject,
              { opacity: homeBackgroundImageOpacity || 0.3 },
            ]}
            contentFit="cover"
            placeholder={undefined}
            transition={200}
          />
        </>
      )}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            Tap to open or create new notebook
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowFeaturesSlideshow(true);
              }}
              style={[styles.featuresButton, { 
                backgroundColor: darkMode ? '#1F1F1F' : '#FDE68A'
              }]}
            >
              <HelpCircle size={28} color={darkMode ? '#A855F7' : '#78350F'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleOpenHomeImagePicker();
              }}
              style={[styles.headerButton, { backgroundColor: theme.button }]}
            >
              <ImageIcon size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleDarkMode();
              }}
              style={[styles.headerButton, { backgroundColor: theme.button }]}
            >
              {darkMode ? (
                <Sun size={20} color={theme.text} />
              ) : (
                <Moon size={20} color={theme.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.grid}>
          {notebooks.map((notebook) => (
            <TouchableOpacity
              key={notebook.id}
              style={[styles.notebookCard, { backgroundColor: notebook.color }]}
              onPress={() => handleNotebookPress(notebook.id)}
              onLongPress={() => handleDeleteNotebook(notebook.id, notebook.name)}
              activeOpacity={0.8}
            >
              {notebook.coverImage && (
                <>
                  <View style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: notebook.coverImageColor || '#3B82F6', opacity: notebook.coverImageColorOpacity || 0.5 }
                  ]} />
                  <Image
                    source={{ uri: notebook.coverImage }}
                    style={[
                      StyleSheet.absoluteFillObject,
                      { opacity: notebook.coverImageOpacity || 0.15 },
                    ]}
                    contentFit="cover"
                    placeholder={undefined}
                    transition={200}
                  />
                </>
              )}
              {renderBinderRings()}
              <View style={styles.cardContent}>
                <BookOpen size={48} color="#FFFFFF" strokeWidth={1.5} />
                <TextInput
                  style={styles.notebookName}
                  value={notebook.name}
                  onChangeText={(text) => updateNotebook(notebook.id, { name: text })}
                  onFocus={() => setEditingNotebook(notebook.id)}
                  onBlur={() => setEditingNotebook(null)}
                  maxLength={30}
                />
                <Text style={styles.noteCount}>
                  {notebook.notes.length} {notebook.notes.length === 1 ? 'note' : 'notes'}
                </Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleOpenColorPicker(notebook.id);
                  }}
                  style={styles.iconButton}
                >
                  <Palette size={18} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleOpenImagePicker(notebook.id);
                  }}
                  style={styles.iconButton}
                >
                  <ImageIcon size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.addCard, { borderColor: theme.accent }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowCreateModal(true);
            }}
            activeOpacity={0.7}
          >
            <Plus size={48} color={theme.accent} strokeWidth={1.5} />
            <Text style={[styles.addCardText, { color: theme.accent }]}>
              Add New Notebook
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCreateModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[styles.modalContent, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>Create New Notebook</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Notebook name"
              placeholderTextColor={theme.placeholder}
              value={newNotebookName}
              onChangeText={setNewNotebookName}
              autoFocus
              maxLength={30}
            />
            <Text style={[styles.label, { color: theme.text }]}>Cover Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
              {CRAYON_COLORS.slice(0, 20).map((color, index) => (
                <TouchableOpacity
                  key={`create-${color}-${index}`}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorOptionSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedColor(color);
                  }}
                />
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: theme.border }]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton, { backgroundColor: theme.accent }]}
                onPress={handleCreateNotebook}
                disabled={!newNotebookName.trim()}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showColorPicker && editingNotebook !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowColorPicker(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[styles.colorPickerModalContent, { backgroundColor: theme.card }]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Choose Cover Color</Text>
              
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Preset Colors</Text>
              <View style={styles.colorGrid}>
                {CRAYON_COLORS.map((color, index) => (
                  <TouchableOpacity
                    key={`${color}-${index}`}
                    style={[styles.colorGridOption, { backgroundColor: color }]}
                    onPress={() => handleColorSelect(color)}
                  />
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Custom Color</Text>
              
              <View style={[styles.customColorPreview, { 
                backgroundColor: hslToHex(customColorHue, customColorSaturation, customColorLightness),
                opacity: customColorAlpha / 100
              }]} />

              <View style={styles.colorSliderSection}>
                <Text style={[styles.sliderLabel, { color: theme.text }]}>Hue: {customColorHue}°</Text>
                <View style={styles.sliderContainer}>
                  <View
                    ref={hueSliderRef}
                    style={styles.sliderTrack}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={(evt) => {
                      hueSliderRef.current?.measure((fx, fy, width, height, px, py) => {
                        const x = evt.nativeEvent.pageX - px;
                        const newHue = Math.max(0, Math.min(360, (x / width) * 360));
                        setCustomColorHue(Math.round(newHue));
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      });
                    }}
                    onResponderMove={(evt) => {
                      hueSliderRef.current?.measure((fx, fy, width, height, px, py) => {
                        const x = evt.nativeEvent.pageX - px;
                        const newHue = Math.max(0, Math.min(360, (x / width) * 360));
                        setCustomColorHue(Math.round(newHue));
                      });
                    }}
                  >
                    <View style={[styles.sliderFill, { width: sliderWidth }]}>
                      <View style={styles.hueGradientContainer}>
                        {['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF0000'].map((color, i, arr) => (
                          <View
                            key={i}
                            style={[styles.hueSegment, { backgroundColor: color, width: sliderWidth / (arr.length - 1) }]}
                          />
                        ))}
                      </View>
                      <View
                        style={[
                          styles.sliderThumb,
                          { left: (customColorHue / 360) * (sliderWidth - 24) },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.colorSliderSection}>
                <Text style={[styles.sliderLabel, { color: theme.text }]}>Saturation: {customColorSaturation}%</Text>
                <View style={styles.sliderContainer}>
                  <View
                    ref={saturationSliderRef}
                    style={styles.sliderTrack}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={(evt) => {
                      saturationSliderRef.current?.measure((fx, fy, width, height, px, py) => {
                        const x = evt.nativeEvent.pageX - px;
                        const newSat = Math.max(0, Math.min(100, (x / width) * 100));
                        setCustomColorSaturation(Math.round(newSat));
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      });
                    }}
                    onResponderMove={(evt) => {
                      saturationSliderRef.current?.measure((fx, fy, width, height, px, py) => {
                        const x = evt.nativeEvent.pageX - px;
                        const newSat = Math.max(0, Math.min(100, (x / width) * 100));
                        setCustomColorSaturation(Math.round(newSat));
                      });
                    }}
                  >
                    <View style={[styles.sliderFill, { width: sliderWidth }]}>
                      <View style={[styles.sliderBackground, { backgroundColor: '#E5E7EB' }]} />
                      <View
                        style={[
                          styles.sliderThumb,
                          { left: (customColorSaturation / 100) * (sliderWidth - 24) },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.colorSliderSection}>
                <Text style={[styles.sliderLabel, { color: theme.text }]}>Lightness: {customColorLightness}%</Text>
                <View style={styles.sliderContainer}>
                  <View
                    ref={lightnessSliderRef}
                    style={styles.sliderTrack}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={(evt) => {
                      lightnessSliderRef.current?.measure((fx, fy, width, height, px, py) => {
                        const x = evt.nativeEvent.pageX - px;
                        const newLight = Math.max(0, Math.min(100, (x / width) * 100));
                        setCustomColorLightness(Math.round(newLight));
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      });
                    }}
                    onResponderMove={(evt) => {
                      lightnessSliderRef.current?.measure((fx, fy, width, height, px, py) => {
                        const x = evt.nativeEvent.pageX - px;
                        const newLight = Math.max(0, Math.min(100, (x / width) * 100));
                        setCustomColorLightness(Math.round(newLight));
                      });
                    }}
                  >
                    <View style={[styles.sliderFill, { width: sliderWidth }]}>
                      <View style={[styles.sliderBackground, { backgroundColor: '#E5E7EB' }]} />
                      <View
                        style={[
                          styles.sliderThumb,
                          { left: (customColorLightness / 100) * (sliderWidth - 24) },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.colorSliderSection}>
                <Text style={[styles.sliderLabel, { color: theme.text }]}>Transparency: {customColorAlpha}%</Text>
                <View style={styles.sliderContainer}>
                  <View
                    ref={alphaSliderRef}
                    style={styles.sliderTrack}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={(evt) => {
                      alphaSliderRef.current?.measure((fx, fy, width, height, px, py) => {
                        const x = evt.nativeEvent.pageX - px;
                        const newAlpha = Math.max(0, Math.min(100, (x / width) * 100));
                        setCustomColorAlpha(Math.round(newAlpha));
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      });
                    }}
                    onResponderMove={(evt) => {
                      alphaSliderRef.current?.measure((fx, fy, width, height, px, py) => {
                        const x = evt.nativeEvent.pageX - px;
                        const newAlpha = Math.max(0, Math.min(100, (x / width) * 100));
                        setCustomColorAlpha(Math.round(newAlpha));
                      });
                    }}
                  >
                    <View style={[styles.sliderFill, { width: sliderWidth }]}>
                      <View style={[styles.sliderBackground, { backgroundColor: '#E5E7EB' }]} />
                      <View
                        style={[
                          styles.sliderThumb,
                          { left: (customColorAlpha / 100) * (sliderWidth - 24) },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, styles.createButton, { backgroundColor: theme.accent, marginTop: 16 }]}
                onPress={handleCustomColorSelect}
              >
                <Text style={styles.buttonText}>Use Custom Color</Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showImagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.imageModalOverlay}>
          <View style={[styles.imageModalContent, { backgroundColor: theme.card }]}>
            <View style={styles.imageModalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Notebook Cover Image</Text>
              <TouchableOpacity onPress={() => setShowImagePicker(false)}>
                <Text style={[styles.closeButton, { color: theme.accent }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            {selectedImageUri ? (
              <View>
                <View style={[styles.imagePreview, { 
                  backgroundColor: editingImageId 
                    ? notebooks.find(nb => nb.id === editingImageId)?.color || '#E63946'
                    : '#E63946'
                }]}>
                  <View style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: imageBgColor, opacity: imageBgColorOpacity }
                  ]} />
                  <Image
                    source={{ uri: selectedImageUri }}
                    style={[StyleSheet.absoluteFillObject, { opacity: imageOpacity }]}
                    contentFit="cover"
                  />
                  <View style={styles.previewContent}>
                    <BookOpen size={48} color="#FFFFFF" strokeWidth={1.5} />
                    <Text style={styles.previewText}>
                      {editingImageId ? notebooks.find(nb => nb.id === editingImageId)?.name : 'Preview'}
                    </Text>
                  </View>
                </View>

                <View style={styles.opacityControl}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Image Transparency: {Math.round(imageOpacity * 100)}%
                  </Text>
                  <View style={styles.sliderContainer}>
                    <View
                      ref={imageOpacitySliderRef}
                      style={styles.sliderTrack}
                      onStartShouldSetResponder={() => true}
                      onResponderGrant={(evt) => {
                        imageOpacitySliderRef.current?.measure((fx, fy, width, height, px, py) => {
                          const x = evt.nativeEvent.pageX - px;
                          const newOpacity = Math.max(0, Math.min(1, x / width));
                          setImageOpacity(newOpacity);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        });
                      }}
                      onResponderMove={(evt) => {
                        imageOpacitySliderRef.current?.measure((fx, fy, width, height, px, py) => {
                          const x = evt.nativeEvent.pageX - px;
                          const newOpacity = Math.max(0, Math.min(1, x / width));
                          setImageOpacity(newOpacity);
                        });
                      }}
                    >
                      <View style={[styles.sliderFill, { width: sliderWidth }]}>
                        <View style={styles.sliderBackground} />
                        <View
                          style={[
                            styles.sliderThumb,
                            { left: imageOpacity * (sliderWidth - 24) },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.opacityControl}>
                  <Text style={[styles.label, { color: theme.text }]}>Background Color</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
                    {CRAYON_COLORS.map((color, index) => (
                      <TouchableOpacity
                        key={`${color}-${index}`}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          imageBgColor === color && styles.colorOptionSelected,
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setImageBgColor(color);
                        }}
                      />
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.opacityControl}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Color Transparency: {Math.round(imageBgColorOpacity * 100)}%
                  </Text>
                  <View style={styles.sliderContainer}>
                    <View
                      ref={imageBgColorOpacitySliderRef}
                      style={styles.sliderTrack}
                      onStartShouldSetResponder={() => true}
                      onResponderGrant={(evt) => {
                        imageBgColorOpacitySliderRef.current?.measure((fx, fy, width, height, px, py) => {
                          const x = evt.nativeEvent.pageX - px;
                          const newOpacity = Math.max(0, Math.min(1, x / width));
                          setImageBgColorOpacity(newOpacity);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        });
                      }}
                      onResponderMove={(evt) => {
                        imageBgColorOpacitySliderRef.current?.measure((fx, fy, width, height, px, py) => {
                          const x = evt.nativeEvent.pageX - px;
                          const newOpacity = Math.max(0, Math.min(1, x / width));
                          setImageBgColorOpacity(newOpacity);
                        });
                      }}
                    >
                      <View style={[styles.sliderFill, { width: sliderWidth }]}>
                        <View style={[styles.sliderBackground, { backgroundColor: imageBgColor }]} />
                        <View
                          style={[
                            styles.sliderThumb,
                            { left: imageBgColorOpacity * (sliderWidth - 24) },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.removeButton, { backgroundColor: '#FEE2E2' }]}
                  onPress={handleRemoveImage}
                >
                  <Text style={[styles.removeButtonText, { color: '#DC2626' }]}>Remove Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectImageButton}
                onPress={handlePickImage}
              >
                <ImageIcon size={64} color="#9CA3AF" />
                <Text style={[styles.selectImageText, { color: theme.text }]}>Select an Image</Text>
              </TouchableOpacity>
            )}
            </ScrollView>

            <View style={styles.imageModalActions}>
              {selectedImageUri && (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.border }]}
                  onPress={handlePickImage}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>Change Image</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.createButton, { backgroundColor: theme.accent }]}
                onPress={handleSaveImage}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showHomeImagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHomeImagePicker(false)}
      >
        <View style={styles.imageModalOverlay}>
          <View style={[styles.imageModalContent, { backgroundColor: theme.card }]}>
            <View style={styles.imageModalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Home Background Image</Text>
              <TouchableOpacity onPress={() => setShowHomeImagePicker(false)}>
                <Text style={[styles.closeButton, { color: theme.accent }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            {selectedHomeImageUri ? (
              <View>
                <View style={[styles.imagePreview, { backgroundColor: theme.background }]}>
                  <View style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: homeBgColor, opacity: homeBgColorOpacity }
                  ]} />
                  <Image
                    source={{ uri: selectedHomeImageUri }}
                    style={[StyleSheet.absoluteFillObject, { opacity: homeImageOpacity }]}
                    contentFit="cover"
                  />
                  <View style={styles.previewContent}>
                    <Text style={[styles.previewText, { color: theme.text }]}>Home Preview</Text>
                  </View>
                </View>

                <View style={styles.opacityControl}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Image Transparency: {Math.round(homeImageOpacity * 100)}%
                  </Text>
                  <View style={styles.sliderContainer}>
                    <View
                      ref={homeImageOpacitySliderRef}
                      style={styles.sliderTrack}
                      onStartShouldSetResponder={() => true}
                      onResponderGrant={(evt) => {
                        homeImageOpacitySliderRef.current?.measure((fx, fy, width, height, px, py) => {
                          const x = evt.nativeEvent.pageX - px;
                          const newOpacity = Math.max(0, Math.min(1, x / width));
                          setHomeImageOpacity(newOpacity);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        });
                      }}
                      onResponderMove={(evt) => {
                        homeImageOpacitySliderRef.current?.measure((fx, fy, width, height, px, py) => {
                          const x = evt.nativeEvent.pageX - px;
                          const newOpacity = Math.max(0, Math.min(1, x / width));
                          setHomeImageOpacity(newOpacity);
                        });
                      }}
                    >
                      <View style={[styles.sliderFill, { width: sliderWidth }]}>
                        <View style={styles.sliderBackground} />
                        <View
                          style={[
                            styles.sliderThumb,
                            { left: homeImageOpacity * (sliderWidth - 24) },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.opacityControl}>
                  <Text style={[styles.label, { color: theme.text }]}>Background Color</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorScroll}>
                    {CRAYON_COLORS.map((color, index) => (
                      <TouchableOpacity
                        key={`${color}-${index}`}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          homeBgColor === color && styles.colorOptionSelected,
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setHomeBgColor(color);
                        }}
                      />
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.opacityControl}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Color Transparency: {Math.round(homeBgColorOpacity * 100)}%
                  </Text>
                  <View style={styles.sliderContainer}>
                    <View
                      ref={homeBgColorOpacitySliderRef}
                      style={styles.sliderTrack}
                      onStartShouldSetResponder={() => true}
                      onResponderGrant={(evt) => {
                        homeBgColorOpacitySliderRef.current?.measure((fx, fy, width, height, px, py) => {
                          const x = evt.nativeEvent.pageX - px;
                          const newOpacity = Math.max(0, Math.min(1, x / width));
                          setHomeBgColorOpacity(newOpacity);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        });
                      }}
                      onResponderMove={(evt) => {
                        homeBgColorOpacitySliderRef.current?.measure((fx, fy, width, height, px, py) => {
                          const x = evt.nativeEvent.pageX - px;
                          const newOpacity = Math.max(0, Math.min(1, x / width));
                          setHomeBgColorOpacity(newOpacity);
                        });
                      }}
                    >
                      <View style={[styles.sliderFill, { width: sliderWidth }]}>
                        <View style={[styles.sliderBackground, { backgroundColor: homeBgColor }]} />
                        <View
                          style={[
                            styles.sliderThumb,
                            { left: homeBgColorOpacity * (sliderWidth - 24) },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.removeButton, { backgroundColor: '#FEE2E2' }]}
                  onPress={handleRemoveHomeImage}
                >
                  <Text style={[styles.removeButtonText, { color: '#DC2626' }]}>Remove Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectImageButton}
                onPress={handlePickHomeImage}
              >
                <ImageIcon size={64} color="#9CA3AF" />
                <Text style={[styles.selectImageText, { color: theme.text }]}>Select an Image</Text>
              </TouchableOpacity>
            )}
            </ScrollView>

            <View style={styles.imageModalActions}>
              {selectedHomeImageUri && (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.border }]}
                  onPress={handlePickHomeImage}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>Change Image</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.createButton, { backgroundColor: theme.accent }]}
                onPress={handleSaveHomeImage}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <OnboardingSlideshow
        visible={showFeaturesSlideshow}
        onComplete={() => setShowFeaturesSlideshow(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  notebookCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  binderRings: {
    position: 'absolute',
    left: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'space-evenly',
    paddingVertical: 16,
  },
  binderRing: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  notebookName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  noteCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.3,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed' as const,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  addCardText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  colorScroll: {
    marginBottom: 24,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#000',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  colorGridOption: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  colorPickerModalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  customColorPreview: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  colorSliderSection: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  hueGradientContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  hueSegment: {
    height: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {},
  createButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  featuresModal: {
    maxHeight: '80%',
  },
  featureItem: {
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  imageModalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  imageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '600' as const,
  },
  imagePreview: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginTop: 12,
  },
  opacityControl: {
    marginBottom: 24,
  },
  sliderContainer: {
    marginTop: 12,
  },
  sliderTrack: {
    height: 48,
    justifyContent: 'center',
  },
  sliderFill: {
    height: 48,
    justifyContent: 'center',
  },
  sliderBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  removeButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  selectImageButton: {
    height: 240,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed' as const,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  selectImageText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 16,
  },
  imageModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
