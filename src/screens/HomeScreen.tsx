import React, { useState, useRef } from "react";
import { View, Text, Pressable, ScrollView, Modal, TextInput, Keyboard, PanResponder, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useNotebookStore } from "../state/notebookStore";
import { Ionicons } from "@expo/vector-icons";
import { NotebookModal } from "../components/NotebookModal";
import { OnboardingSlideshow } from "../components/OnboardingSlideshow";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const notebooks = useNotebookStore((s) => s.notebooks);
  const darkMode = useNotebookStore((s) => s.darkMode);
  const toggleDarkMode = useNotebookStore((s) => s.toggleDarkMode);
  const updateNotebook = useNotebookStore((s) => s.updateNotebook);
  const updateNotebookBackgroundImage = useNotebookStore((s) => s.updateNotebookBackgroundImage);
  const homeBackgroundImage = useNotebookStore((s) => s.homeBackgroundImage);
  const homeBackgroundImageOpacity = useNotebookStore((s) => s.homeBackgroundImageOpacity);
  const updateHomeBackgroundImage = useNotebookStore((s) => s.updateHomeBackgroundImage);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNotebook, setEditingNotebook] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("#E63946");
  const [originalColor, setOriginalColor] = useState("#E63946");
  const [sliderPosition, setSliderPosition] = useState(0);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [imageOpacity, setImageOpacity] = useState(0.15);
  const [selectedImageUri, setSelectedImageUri] = useState<string | undefined>(undefined);
  const [showHomeImagePicker, setShowHomeImagePicker] = useState(false);
  const [homeImageOpacity, setHomeImageOpacity] = useState(0.15);
  const [selectedHomeImageUri, setSelectedHomeImageUri] = useState<string | undefined>(undefined);
  const [showFeaturesSlideshow, setShowFeaturesSlideshow] = useState(false);
  const sliderWidth = 280;

  const handleResetApp = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert("App Reset", "Please reload the app to see the privacy policy and onboarding screens.");
    } catch (error) {
      Alert.alert("Error", "Failed to reset the app.");
    }
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const getColorFromPosition = (position: number): string => {
    const hue = position * 360;
    return hslToHex(hue, 100, 50);
  };

  const getPositionFromColor = (hexColor: string): number => {
    // Convert hex to RGB
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Convert RGB to HSL to get hue
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;

    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return h; // Return normalized position (0-1)
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const x = evt.nativeEvent.locationX;
        const newPosition = Math.max(0, Math.min(1, x / sliderWidth));
        setSliderPosition(newPosition);
        setSelectedColor(getColorFromPosition(newPosition));
      },
      onPanResponderMove: (evt) => {
        const x = evt.nativeEvent.locationX;
        const newPosition = Math.max(0, Math.min(1, x / sliderWidth));
        setSliderPosition(newPosition);
        setSelectedColor(getColorFromPosition(newPosition));
      },
      onPanResponderRelease: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    })
  ).current;

  const handleNotebookPress = (notebookId: string) => {
    navigation.navigate("Notebook", { notebookId });
  };

  const handleAddNotebook = () => {
    setEditingNotebook(null);
    setModalVisible(true);
  };

  const handleEditNotebook = (notebookId: string) => {
    setEditingNotebook(notebookId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingNotebook(null);
  };

  const handleNamePress = (notebookId: string, currentName: string) => {
    setEditingNameId(notebookId);
    setEditingNameValue(currentName);
  };

  const handleNameSave = () => {
    if (editingNameId && editingNameValue.trim()) {
      updateNotebook(editingNameId, { name: editingNameValue.trim() });
    }
    setEditingNameId(null);
    setEditingNameValue("");
    Keyboard.dismiss();
  };

  const handleNameCancel = () => {
    setEditingNameId(null);
    setEditingNameValue("");
    Keyboard.dismiss();
  };

  const handleColorPress = (notebookId: string, currentColor: string) => {
    setEditingColorId(notebookId);
    setSelectedColor(currentColor);
    setOriginalColor(currentColor);
    const position = getPositionFromColor(currentColor);
    setSliderPosition(position);
    setShowColorPicker(true);
  };

  const handleResetColor = () => {
    setSelectedColor(originalColor);
    const position = getPositionFromColor(originalColor);
    setSliderPosition(position);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveColor = () => {
    if (editingColorId && selectedColor) {
      updateNotebook(editingColorId, { color: selectedColor });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowColorPicker(false);
    setEditingColorId(null);
  };

  const handleCloseColorPicker = () => {
    setShowColorPicker(false);
    setEditingColorId(null);
  };

  const handleImagePress = async (notebookId: string) => {
    const notebook = notebooks.find((nb) => nb.id === notebookId);
    if (!notebook) return;

    setEditingImageId(notebookId);
    setSelectedImageUri(notebook.backgroundImage);
    setImageOpacity(notebook.backgroundImageOpacity || 0.15);
    setShowImagePicker(true);
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library to select an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageUri(undefined);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveImage = () => {
    if (editingImageId) {
      updateNotebookBackgroundImage(editingImageId, selectedImageUri, imageOpacity);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowImagePicker(false);
    setEditingImageId(null);
  };

  const handleCloseImagePicker = () => {
    setShowImagePicker(false);
    setEditingImageId(null);
  };

  const handleHomeImagePress = () => {
    setSelectedHomeImageUri(homeBackgroundImage);
    setHomeImageOpacity(homeBackgroundImageOpacity || 0.15);
    setShowHomeImagePicker(true);
  };

  const handlePickHomeImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library to select an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedHomeImageUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRemoveHomeImage = () => {
    setSelectedHomeImageUri(undefined);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveHomeImage = () => {
    updateHomeBackgroundImage(selectedHomeImageUri, homeImageOpacity);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowHomeImagePicker(false);
  };

  const handleCloseHomeImagePicker = () => {
    setShowHomeImagePicker(false);
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["top", "bottom"]}
      style={{ backgroundColor: darkMode ? "#000000" : "#FEF3C7" }}
    >
      {/* Home Background Image */}
      {homeBackgroundImage && (
        <Image
          source={{ uri: homeBackgroundImage }}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: homeBackgroundImageOpacity || 0.15 }}
          resizeMode="cover"
        />
      )}
      <View className="flex-1 px-6 pt-8">
        {/* Header with title and controls */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1 flex-row items-center">
            <Text
              className="text-4xl font-bold"
              style={{ color: darkMode ? "#A855F7" : "#78350F" }}
            >
              My Notebooks
            </Text>
            <View className="ml-3 p-2 rounded-full" style={{ backgroundColor: darkMode ? "#A855F7" : "#78350F" }}>
              <Ionicons
                name="mic"
                size={24}
                color={darkMode ? "#000000" : "#FFFFFF"}
              />
            </View>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Reset App",
                  "Reset app to first-time startup? This will show the privacy policy and onboarding screens again.",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Reset", style: "destructive", onPress: handleResetApp }
                  ]
                );
              }}
              onLongPress={() => {
                Alert.alert(
                  "Reset App",
                  "Reset app to first-time startup? This will show the privacy policy and onboarding screens again.",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Reset", style: "destructive", onPress: handleResetApp }
                  ]
                );
              }}
              className="p-2 rounded-full active:opacity-70"
              style={{ backgroundColor: darkMode ? "#1F1F1F" : "#FDE68A" }}
            >
              <Ionicons
                name="refresh"
                size={28}
                color={darkMode ? "#A855F7" : "#78350F"}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setShowFeaturesSlideshow(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="p-2 rounded-full active:opacity-70"
              style={{ backgroundColor: darkMode ? "#1F1F1F" : "#FDE68A" }}
            >
              <Ionicons
                name="help-circle-outline"
                size={28}
                color={darkMode ? "#A855F7" : "#78350F"}
              />
            </Pressable>
            <Pressable
              onPress={handleHomeImagePress}
              className="p-2 rounded-full active:opacity-70"
              style={{ backgroundColor: darkMode ? "#1F1F1F" : "#FDE68A" }}
            >
              <Ionicons
                name="image-outline"
                size={28}
                color={darkMode ? "#A855F7" : "#78350F"}
              />
            </Pressable>
            <Pressable
              onPress={toggleDarkMode}
              className="p-2 rounded-full active:opacity-70"
              style={{ backgroundColor: darkMode ? "#1F1F1F" : "#FDE68A" }}
            >
              <Ionicons
                name={darkMode ? "sunny" : "moon"}
                size={28}
                color={darkMode ? "#A855F7" : "#78350F"}
              />
            </Pressable>
          </View>
        </View>
        <Text
          className="text-base mb-8"
          style={{ color: darkMode ? "#A855F7" : "#92400E" }}
        >
          Tap to open or create a new notebook
        </Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Two notebooks displayed horizontally */}
          <View className="flex-row justify-between mb-8">
            {notebooks.slice(0, 2).map((notebook) => (
              <Pressable
                key={notebook.id}
                onPress={() => handleNotebookPress(notebook.id)}
                onLongPress={() => handleEditNotebook(notebook.id)}
                className="w-[48%] aspect-[1/1.6] rounded-2xl shadow-lg overflow-hidden active:opacity-70"
                style={{
                  backgroundColor: notebook.color,
                }}
              >
                {/* Background Image */}
                {notebook.backgroundImage && (
                  <Image
                    source={{ uri: notebook.backgroundImage }}
                    className="absolute inset-0 w-full h-full"
                    style={{ opacity: notebook.backgroundImageOpacity || 0.15 }}
                    resizeMode="cover"
                  />
                )}
                <View className="flex-1 p-6 justify-between">
                  <View className="flex-row items-center justify-between">
                    <Ionicons name="book-outline" size={36} color="#FFFFFF" />
                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleColorPress(notebook.id, notebook.color);
                        }}
                        className="bg-white/20 p-2 rounded-full active:opacity-70"
                      >
                        <Ionicons name="color-palette-outline" size={20} color="#FFFFFF" />
                      </Pressable>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          handleImagePress(notebook.id);
                        }}
                        className="bg-white/20 p-2 rounded-full active:opacity-70"
                      >
                        <Ionicons name="image-outline" size={20} color="#FFFFFF" />
                      </Pressable>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => handleNamePress(notebook.id, notebook.name)}
                    className="active:opacity-70"
                  >
                    <Text
                      className="text-xl font-bold text-white"
                      numberOfLines={2}
                    >
                      {notebook.name}
                    </Text>
                  </Pressable>
                  <Text className="text-lg text-white opacity-80">
                    {notebook.notes.length} {notebook.notes.length === 1 ? "note" : "notes"}
                  </Text>
                </View>

                {/* Ring binder effect */}
                <View className="absolute left-0 top-0 bottom-0 w-9 flex-col justify-around items-center py-8">
                  {[...Array(5)].map((_, i) => (
                    <View
                      key={i}
                      className="w-5 h-5 rounded-full bg-gray-400 border-2 border-gray-300"
                      style={{ shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 2, shadowOffset: { width: 1, height: 1 } }}
                    />
                  ))}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Additional notebooks in grid layout */}
          {notebooks.length > 2 && (
            <View className="flex-row flex-wrap">
              {notebooks.slice(2).map((notebook, index) => (
                <Pressable
                  key={notebook.id}
                  onPress={() => handleNotebookPress(notebook.id)}
                  onLongPress={() => handleEditNotebook(notebook.id)}
                  className="w-[48%] aspect-[1/1.6] mb-6 rounded-2xl shadow-lg overflow-hidden active:opacity-70"
                  style={{
                    backgroundColor: notebook.color,
                    marginRight: index % 2 === 0 ? "4%" : 0,
                  }}
                >
                  {/* Background Image */}
                  {notebook.backgroundImage && (
                    <Image
                      source={{ uri: notebook.backgroundImage }}
                      className="absolute inset-0 w-full h-full"
                      style={{ opacity: notebook.backgroundImageOpacity || 0.15 }}
                      resizeMode="cover"
                    />
                  )}
                  <View className="flex-1 p-6">
                    <View className="flex-row items-center justify-between mb-4">
                      <Ionicons name="book-outline" size={32} color="#FFFFFF" />
                      <View className="flex-row gap-2">
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            handleColorPress(notebook.id, notebook.color);
                          }}
                          className="bg-white/20 p-2 rounded-full active:opacity-70"
                        >
                          <Ionicons name="color-palette-outline" size={18} color="#FFFFFF" />
                        </Pressable>
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            handleImagePress(notebook.id);
                          }}
                          className="bg-white/20 p-2 rounded-full active:opacity-70"
                        >
                          <Ionicons name="image-outline" size={18} color="#FFFFFF" />
                        </Pressable>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => handleNamePress(notebook.id, notebook.name)}
                      className="active:opacity-70"
                    >
                      <Text
                        className="text-xl font-bold text-white"
                        numberOfLines={3}
                      >
                        {notebook.name}
                      </Text>
                    </Pressable>
                    <View className="absolute bottom-6 left-6 right-6">
                      <Text className="text-base text-white opacity-80">
                        {notebook.notes.length} {notebook.notes.length === 1 ? "note" : "notes"}
                      </Text>
                    </View>
                  </View>

                  {/* Ring binder effect */}
                  <View className="absolute left-0 top-0 bottom-0 w-9 flex-col justify-around items-center py-8">
                    {[...Array(5)].map((_, i) => (
                      <View
                        key={i}
                        className="w-5 h-5 rounded-full bg-gray-400 border-2 border-gray-300"
                        style={{ shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 2, shadowOffset: { width: 1, height: 1 } }}
                      />
                    ))}
                  </View>
                </Pressable>
              ))}

              {/* Add new notebook button in grid */}
              <Pressable
                onPress={handleAddNotebook}
                className="w-[48%] aspect-[1/1.6] rounded-2xl border-4 border-dashed border-amber-300 bg-amber-100 items-center justify-center active:opacity-70"
                style={{
                  marginRight: notebooks.slice(2).length % 2 === 0 ? "4%" : 0,
                }}
              >
                <Ionicons name="add" size={48} color="#D97706" />
                <Text className="text-xl font-semibold text-amber-900 mt-2">New Notebook</Text>
              </Pressable>
            </View>
          )}

          {/* Add new notebook button for initial layout */}
          {notebooks.length <= 2 && notebooks.length % 2 === 0 && (
            <View className="flex-row justify-between">
              <Pressable
                onPress={handleAddNotebook}
                className="w-[48%] aspect-[1/1.6] rounded-2xl border-4 border-dashed border-amber-300 bg-amber-100 items-center justify-center active:opacity-70"
              >
                <Ionicons name="add" size={48} color="#D97706" />
                <Text className="text-xl font-semibold text-amber-900 mt-2">New Notebook</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>

      <NotebookModal
        visible={modalVisible}
        onClose={handleCloseModal}
        notebookId={editingNotebook}
      />

      {/* Name editing modal */}
      <Modal
        visible={editingNameId !== null}
        animationType="fade"
        transparent
        onRequestClose={handleNameCancel}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center px-8"
          onPress={handleNameCancel}
        >
          <Pressable
            className="w-full bg-white rounded-2xl p-6"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-xl font-bold text-gray-900 mb-4">Edit Notebook Name</Text>
            <TextInput
              value={editingNameValue}
              onChangeText={setEditingNameValue}
              placeholder="Enter notebook name"
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900 mb-4"
              placeholderTextColor="#9CA3AF"
              autoFocus
              onSubmitEditing={handleNameSave}
            />
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleNameCancel}
                className="flex-1 bg-gray-200 rounded-xl py-3 items-center active:opacity-70"
              >
                <Text className="text-gray-900 text-base font-semibold">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleNameSave}
                disabled={!editingNameValue.trim()}
                className="flex-1 bg-blue-600 rounded-xl py-3 items-center active:opacity-70"
                style={{ opacity: !editingNameValue.trim() ? 0.5 : 1 }}
              >
                <Text className="text-white text-base font-semibold">Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        animationType="slide"
        transparent
        onRequestClose={handleCloseColorPicker}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-gray-900">Color Change</Text>
              <Pressable
                onPress={handleCloseColorPicker}
                className="active:opacity-70"
              >
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
            </View>

            <Text className="text-base font-semibold text-gray-700 mb-4">
              Select Notebook Color
            </Text>

            {/* Original Color Option */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Original Color</Text>
              <Pressable
                onPress={() => {
                  setSelectedColor(originalColor);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="h-16 rounded-2xl items-center justify-center border-2"
                style={{
                  backgroundColor: originalColor,
                  borderColor: selectedColor === originalColor ? "#3B82F6" : "#E5E7EB"
                }}
              >
                <Ionicons name="book-outline" size={32} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Rainbow Gradient Slider */}
            <View className="mb-6 items-center">
              <View
                {...panResponder.panHandlers}
                style={{ width: sliderWidth, height: 60, borderRadius: 16, overflow: "hidden", marginBottom: 16 }}
              >
                <LinearGradient
                  colors={["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
                {/* Slider indicator */}
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: sliderPosition * sliderWidth - 3,
                    width: 6,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 3,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 4,
                  }}
                />
              </View>
            </View>

            {/* Color Preview */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Preview</Text>
              <View
                className="h-24 rounded-2xl items-center justify-center"
                style={{ backgroundColor: selectedColor }}
              >
                <Ionicons name="book-outline" size={48} color="#FFFFFF" />
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSaveColor}
              className="bg-blue-600 rounded-xl py-4 items-center active:opacity-70"
            >
              <Text className="text-white text-lg font-bold">Save Color</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        animationType="slide"
        transparent
        onRequestClose={handleCloseImagePicker}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-gray-900">Notebook Background</Text>
              <Pressable
                onPress={handleCloseImagePicker}
                className="active:opacity-70"
              >
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
            </View>

            <Text className="text-base font-semibold text-gray-700 mb-4">
              Choose an image or color for your notebook
            </Text>

            {/* Image Preview */}
            {selectedImageUri ? (
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Selected Image</Text>
                <View className="h-48 rounded-2xl overflow-hidden border-2 border-gray-200 mb-4">
                  <View className="flex-1" style={{ backgroundColor: editingImageId ? notebooks.find((nb) => nb.id === editingImageId)?.color : "#E63946" }}>
                    <Image
                      source={{ uri: selectedImageUri }}
                      className="w-full h-full"
                      style={{ opacity: imageOpacity }}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                {/* Transparency Slider */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Transparency: {Math.round(imageOpacity * 100)}%
                  </Text>
                  <View className="bg-gray-200 h-12 rounded-xl justify-center px-2">
                    <View
                      {...PanResponder.create({
                        onStartShouldSetPanResponder: () => true,
                        onMoveShouldSetPanResponder: () => true,
                        onPanResponderGrant: (evt) => {
                          const x = evt.nativeEvent.locationX - 16;
                          const maxWidth = sliderWidth - 32;
                          const newOpacity = Math.max(0, Math.min(1, x / maxWidth));
                          setImageOpacity(newOpacity);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        },
                        onPanResponderMove: (evt) => {
                          const x = evt.nativeEvent.locationX - 16;
                          const maxWidth = sliderWidth - 32;
                          const newOpacity = Math.max(0, Math.min(1, x / maxWidth));
                          setImageOpacity(newOpacity);
                        },
                      }).panHandlers}
                      style={{ width: sliderWidth, height: 48, justifyContent: "center" }}
                    >
                      <View className="bg-gray-300 h-2 rounded-full" />
                      <View
                        style={{
                          position: "absolute",
                          left: imageOpacity * (sliderWidth - 48),
                          width: 24,
                          height: 24,
                          backgroundColor: "#3B82F6",
                          borderRadius: 12,
                          borderWidth: 3,
                          borderColor: "#FFFFFF",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                        }}
                      />
                    </View>
                  </View>
                </View>

                {/* Remove Image Button */}
                <Pressable
                  onPress={handleRemoveImage}
                  className="bg-red-100 rounded-xl py-3 items-center active:opacity-70 mb-3"
                >
                  <Text className="text-red-600 text-base font-semibold">Remove Image</Text>
                </Pressable>
              </View>
            ) : (
              <View className="mb-6">
                <Pressable
                  onPress={handlePickImage}
                  className="h-48 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 items-center justify-center active:opacity-70"
                >
                  <Ionicons name="image-outline" size={64} color="#9CA3AF" />
                  <Text className="text-gray-600 text-base font-semibold mt-4">
                    Select an Image
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Buttons */}
            <View className="flex-row gap-3">
              {selectedImageUri && (
                <Pressable
                  onPress={handlePickImage}
                  className="flex-1 bg-gray-200 rounded-xl py-4 items-center active:opacity-70"
                >
                  <Text className="text-gray-900 text-base font-semibold">Change Image</Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleSaveImage}
                className="flex-1 bg-blue-600 rounded-xl py-4 items-center active:opacity-70"
              >
                <Text className="text-white text-base font-bold">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Home Background Image Picker Modal */}
      <Modal
        visible={showHomeImagePicker}
        animationType="slide"
        transparent
        onRequestClose={handleCloseHomeImagePicker}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-2xl font-bold text-gray-900">Home Background</Text>
              <Pressable
                onPress={handleCloseHomeImagePicker}
                className="active:opacity-70"
              >
                <Ionicons name="close" size={28} color="#374151" />
              </Pressable>
            </View>

            <Text className="text-base font-semibold text-gray-700 mb-4">
              Choose a background image for your home screen
            </Text>

            {/* Image Preview */}
            {selectedHomeImageUri ? (
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Selected Image</Text>
                <View className="h-48 rounded-2xl overflow-hidden border-2 border-gray-200 mb-4">
                  <View className="flex-1" style={{ backgroundColor: darkMode ? "#000000" : "#FEF3C7" }}>
                    <Image
                      source={{ uri: selectedHomeImageUri }}
                      className="w-full h-full"
                      style={{ opacity: homeImageOpacity }}
                      resizeMode="cover"
                    />
                  </View>
                </View>

                {/* Transparency Slider */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Transparency: {Math.round(homeImageOpacity * 100)}%
                  </Text>
                  <View className="bg-gray-200 h-12 rounded-xl justify-center px-2">
                    <View
                      {...PanResponder.create({
                        onStartShouldSetPanResponder: () => true,
                        onMoveShouldSetPanResponder: () => true,
                        onPanResponderGrant: (evt) => {
                          const x = evt.nativeEvent.locationX - 16;
                          const maxWidth = sliderWidth - 32;
                          const newOpacity = Math.max(0, Math.min(1, x / maxWidth));
                          setHomeImageOpacity(newOpacity);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        },
                        onPanResponderMove: (evt) => {
                          const x = evt.nativeEvent.locationX - 16;
                          const maxWidth = sliderWidth - 32;
                          const newOpacity = Math.max(0, Math.min(1, x / maxWidth));
                          setHomeImageOpacity(newOpacity);
                        },
                      }).panHandlers}
                      style={{ width: sliderWidth, height: 48, justifyContent: "center" }}
                    >
                      <View className="bg-gray-300 h-2 rounded-full" />
                      <View
                        style={{
                          position: "absolute",
                          left: homeImageOpacity * (sliderWidth - 48),
                          width: 24,
                          height: 24,
                          backgroundColor: "#3B82F6",
                          borderRadius: 12,
                          borderWidth: 3,
                          borderColor: "#FFFFFF",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.3,
                          shadowRadius: 4,
                        }}
                      />
                    </View>
                  </View>
                </View>

                {/* Remove Image Button */}
                <Pressable
                  onPress={handleRemoveHomeImage}
                  className="bg-red-100 rounded-xl py-3 items-center active:opacity-70 mb-3"
                >
                  <Text className="text-red-600 text-base font-semibold">Remove Image</Text>
                </Pressable>
              </View>
            ) : (
              <View className="mb-6">
                <Pressable
                  onPress={handlePickHomeImage}
                  className="h-48 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 items-center justify-center active:opacity-70"
                >
                  <Ionicons name="image-outline" size={64} color="#9CA3AF" />
                  <Text className="text-gray-600 text-base font-semibold mt-4">
                    Select an Image
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Buttons */}
            <View className="flex-row gap-3">
              {selectedHomeImageUri && (
                <Pressable
                  onPress={handlePickHomeImage}
                  className="flex-1 bg-gray-200 rounded-xl py-4 items-center active:opacity-70"
                >
                  <Text className="text-gray-900 text-base font-semibold">Change Image</Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleSaveHomeImage}
                className="flex-1 bg-blue-600 rounded-xl py-4 items-center active:opacity-70"
              >
                <Text className="text-white text-base font-bold">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <OnboardingSlideshow
        visible={showFeaturesSlideshow}
        onComplete={() => setShowFeaturesSlideshow(false)}
      />
    </SafeAreaView>
  );
};
