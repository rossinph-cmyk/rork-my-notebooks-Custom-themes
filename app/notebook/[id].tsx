import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useNotebooks, useNotebook } from '@/contexts/NotebookContext';
import { THEME_COLORS, CRAYON_COLORS, BACKGROUND_COLORS } from '@/constants/colors';
import {
  Keyboard,
  Type,
  Palette,
  Trash2,
  Share2,
  Image as ImageIcon,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const sliderWidth = width > 600 ? 400 : width - 80;

const LINE_HEIGHT = 44;

export default function NotebookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateNotebook, addNote, updateNote, deleteNote, darkMode } = useNotebooks();
  const notebook = useNotebook(id as string);

  const [showTextModal, setShowTextModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [colorPickerType, setColorPickerType] = useState<'background' | 'text' | 'notebook-bg' | 'notebook-text'>('background');
  const [showBgImagePicker, setShowBgImagePicker] = useState(false);
  const [selectedBgImageUri, setSelectedBgImageUri] = useState<string | undefined>(undefined);
  const [bgImageOpacity, setBgImageOpacity] = useState(0.3);
  const [bgImageColor, setBgImageColor] = useState('#3B82F6');
  const [bgImageColorOpacity, setBgImageColorOpacity] = useState(0.5);

  const theme = darkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  if (!notebook) {
    router.replace('/');
    return null;
  }

  const handleAddTextNote = () => {
    if (newNoteText.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      addNote(notebook.id, newNoteText.trim());
      setNewNoteText('');
      setShowTextModal(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          deleteNote(notebook.id, noteId);
        },
      },
    ]);
  };

  const handleShareNote = async (noteText: string) => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          try {
            await navigator.share({ text: noteText });
          } catch (shareError: any) {
            if (shareError.name === 'AbortError') {
              return;
            }
            if (shareError.name === 'NotAllowedError') {
              await navigator.clipboard.writeText(noteText);
              Alert.alert('Copied', 'Note copied to clipboard');
              return;
            }
          }
        } else {
          await navigator.clipboard.writeText(noteText);
          Alert.alert('Copied', 'Note copied to clipboard');
        }
        return;
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing Not Available', 'Sharing is not available on this device');
        return;
      }

      const tempFile = `${noteText.substring(0, 50)}.txt`;
      await Sharing.shareAsync(tempFile, {
        mimeType: 'text/plain',
        dialogTitle: 'Share Note',
        UTI: 'public.plain-text',
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Share Error', 'Unable to share note');
    }
  };

  const handlePickBackgroundImage = async () => {
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
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedBgImageUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleOpenBgImagePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBgImageUri(notebook.backgroundImage);
    setBgImageOpacity(notebook.backgroundImageOpacity || 0.3);
    setBgImageColor(notebook.backgroundImageColor || '#3B82F6');
    setBgImageColorOpacity(notebook.backgroundImageColorOpacity || 0.5);
    setShowBgImagePicker(true);
  };

  const handleSaveBgImage = () => {
    updateNotebook(notebook.id, {
      backgroundImage: selectedBgImageUri,
      backgroundImageOpacity: selectedBgImageUri ? bgImageOpacity : 0.3,
      backgroundImageColor: bgImageColor,
      backgroundImageColorOpacity: bgImageColorOpacity
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowBgImagePicker(false);
  };

  const handleRemoveBgImage = () => {
    setSelectedBgImageUri(undefined);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const openColorPicker = (noteId: string, type: 'background' | 'text') => {
    setEditingNoteId(noteId);
    setColorPickerType(type);
    setShowColorPicker(true);
  };

  const openNotebookColorPicker = (type: 'notebook-bg' | 'notebook-text') => {
    setEditingNoteId(null);
    setColorPickerType(type);
    setShowColorPicker(true);
  };

  const handleColorSelect = (color: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (colorPickerType === 'notebook-bg') {
      updateNotebook(notebook.id, { backgroundColor: color });
    } else if (colorPickerType === 'notebook-text') {
      updateNotebook(notebook.id, { textColor: color });
    } else if (editingNoteId) {
      if (colorPickerType === 'background') {
        updateNote(notebook.id, editingNoteId, { backgroundColor: color });
      } else {
        updateNote(notebook.id, editingNoteId, { textColor: color });
      }
    }
    setShowColorPicker(false);
  };

  const renderLinedPaper = (content: string, noteColor?: string, textColor?: string) => {
    const lines = Math.ceil(content.length / 40) + 3;
    return (
      <View style={styles.linedPaper}>
        {Array.from({ length: lines }).map((_, i) => (
          <View key={i} style={[styles.line, { borderBottomColor: notebook.textColor + '50' }]} />
        ))}
        <Text
          style={[
            styles.noteText,
            {
              color: textColor || notebook.textColor,
              lineHeight: LINE_HEIGHT,
            },
          ]}
        >
          {content}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: notebook.name,
          headerStyle: {
            backgroundColor: notebook.color,
          },
          headerTintColor: '#FFFFFF',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => openNotebookColorPicker('notebook-bg')}
                style={styles.headerButton}
              >
                <Palette size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOpenBgImagePicker} style={styles.headerButton}>
                <ImageIcon size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: notebook.backgroundColor || theme.background },
        ]}
      >
        {notebook.backgroundImage && (
          <>
            <View style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: notebook.backgroundImageColor || '#3B82F6', opacity: notebook.backgroundImageColorOpacity || 0.5 }
            ]} />
            <Image
              source={{ uri: notebook.backgroundImage }}
              style={[
                StyleSheet.absoluteFillObject,
                { opacity: notebook.backgroundImageOpacity || 0.3 },
              ]}
              contentFit="cover"
            />
          </>
        )}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notebook.notes.length === 0 && (
            <View style={styles.emptyState}>
              <Type size={48} color={theme.placeholder} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: theme.placeholder }]}>
                No notes yet. Tap the button below to add your first note!
              </Text>
            </View>
          )}

          {notebook.notes.map((note) => (
            <View
              key={note.id}
              style={[
                styles.noteCard,
                {
                  backgroundColor: note.backgroundColor || notebook.backgroundColor || '#FFFFFF',
                },
              ]}
            >
              {renderLinedPaper(note.text, note.backgroundColor, note.textColor)}
              <Text style={[styles.noteDate, { color: theme.placeholder }]}>
                {new Date(note.createdAt).toLocaleString()}
              </Text>
              <View style={styles.noteActions}>
                <TouchableOpacity
                  onPress={() => openColorPicker(note.id, 'background')}
                  style={[styles.actionButton, { backgroundColor: theme.button }]}
                >
                  <Palette size={16} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openColorPicker(note.id, 'text')}
                  style={[styles.actionButton, { backgroundColor: theme.button }]}
                >
                  <Text style={[styles.actionButtonText, { color: theme.text }]}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteNote(note.id)}
                  style={[styles.actionButton, { backgroundColor: theme.button }]}
                >
                  <Trash2 size={16} color={theme.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleShareNote(note.text)}
                  style={[styles.actionButton, { backgroundColor: theme.button }]}
                >
                  <Share2 size={16} color={theme.text} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.bottomBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowTextModal(true);
            }}
            style={[styles.addNoteButton, { backgroundColor: theme.accent }]}
          >
            <Keyboard size={40} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showTextModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTextModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTextModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={[styles.modalContent, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Text Note</Text>
            <View style={[styles.textAreaContainer, { backgroundColor: theme.background }]}>
              {Array.from({ length: 7 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.inputLine,
                    { borderBottomColor: theme.text + '40' },
                  ]}
                />
              ))}
              <TextInput
                style={[styles.textArea, { color: theme.text }]}
                placeholder="Type your note here..."
                placeholderTextColor={theme.placeholder}
                value={newNoteText}
                onChangeText={setNewNoteText}
                multiline
                numberOfLines={7}
                autoFocus
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: theme.border }]}
                onPress={() => setShowTextModal(false)}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.createButton, { backgroundColor: theme.accent }]}
                onPress={handleAddTextNote}
                disabled={!newNoteText.trim()}
              >
                <Text style={styles.buttonText}>Add Note</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showColorPicker}
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
            style={[styles.modalContent, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {colorPickerType === 'background' || colorPickerType === 'notebook-bg'
                ? 'Choose Background Color'
                : 'Choose Text Color'}
            </Text>
            <View style={styles.colorGrid}>
              {(colorPickerType === 'background' || colorPickerType === 'notebook-bg'
                ? [...BACKGROUND_COLORS, ...CRAYON_COLORS.slice(0, 20)]
                : CRAYON_COLORS
              ).map((color, index) => (
                <TouchableOpacity
                  key={`picker-${color}-${index}`}
                  style={[styles.colorGridOption, { backgroundColor: color }]}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showBgImagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBgImagePicker(false)}
      >
        <View style={styles.imageModalOverlay}>
          <View style={[styles.imageModalContent, { backgroundColor: theme.card }]}>
            <View style={styles.imageModalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Notebook Background</Text>
              <TouchableOpacity onPress={() => setShowBgImagePicker(false)}>
                <Text style={[styles.closeButton, { color: theme.accent }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
            {selectedBgImageUri ? (
              <View>
                <View style={[styles.imagePreview, { backgroundColor: notebook.backgroundColor || theme.background }]}>
                  <View style={[
                    StyleSheet.absoluteFillObject,
                    { backgroundColor: bgImageColor, opacity: bgImageColorOpacity }
                  ]} />
                  <Image
                    source={{ uri: selectedBgImageUri }}
                    style={[StyleSheet.absoluteFillObject, { opacity: bgImageOpacity }]}
                    contentFit="cover"
                  />
                  <View style={styles.previewContent}>
                    <Text style={[styles.previewText, { color: theme.text }]}>Preview</Text>
                  </View>
                </View>

                <View style={styles.opacityControl}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Image Transparency: {Math.round(bgImageOpacity * 100)}%
                  </Text>
                  <View style={styles.sliderContainer}>
                    <View
                      style={styles.sliderTrack}
                      onStartShouldSetResponder={() => true}
                      onResponderGrant={(evt) => {
                        const x = evt.nativeEvent.locationX;
                        const newOpacity = Math.max(0, Math.min(1, x / sliderWidth));
                        setBgImageOpacity(newOpacity);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      onResponderMove={(evt) => {
                        const x = evt.nativeEvent.locationX;
                        const newOpacity = Math.max(0, Math.min(1, x / sliderWidth));
                        setBgImageOpacity(newOpacity);
                      }}
                    >
                      <View style={[styles.sliderFill, { width: sliderWidth }]}>
                        <View style={styles.sliderBackground} />
                        <View
                          style={[
                            styles.sliderThumb,
                            { left: bgImageOpacity * (sliderWidth - 24) },
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
                          bgImageColor === color && styles.colorOptionSelected,
                        ]}
                        onPress={() => {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          setBgImageColor(color);
                        }}
                      />
                    ))}
                  </ScrollView>
                </View>

                <View style={styles.opacityControl}>
                  <Text style={[styles.label, { color: theme.text }]}>
                    Color Transparency: {Math.round(bgImageColorOpacity * 100)}%
                  </Text>
                  <View style={styles.sliderContainer}>
                    <View
                      style={styles.sliderTrack}
                      onStartShouldSetResponder={() => true}
                      onResponderGrant={(evt) => {
                        const x = evt.nativeEvent.locationX;
                        const newOpacity = Math.max(0, Math.min(1, x / sliderWidth));
                        setBgImageColorOpacity(newOpacity);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      onResponderMove={(evt) => {
                        const x = evt.nativeEvent.locationX;
                        const newOpacity = Math.max(0, Math.min(1, x / sliderWidth));
                        setBgImageColorOpacity(newOpacity);
                      }}
                    >
                      <View style={[styles.sliderFill, { width: sliderWidth }]}>
                        <View style={[styles.sliderBackground, { backgroundColor: bgImageColor }]} />
                        <View
                          style={[
                            styles.sliderThumb,
                            { left: bgImageColorOpacity * (sliderWidth - 24) },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.removeButton, { backgroundColor: '#FEE2E2' }]}
                  onPress={handleRemoveBgImage}
                >
                  <Text style={[styles.removeButtonText, { color: '#DC2626' }]}>Remove Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectImageButton}
                onPress={handlePickBackgroundImage}
              >
                <ImageIcon size={64} color="#9CA3AF" />
                <Text style={[styles.selectImageText, { color: theme.text }]}>Select an Image</Text>
              </TouchableOpacity>
            )}
            </ScrollView>

            <View style={styles.imageModalActions}>
              {selectedBgImageUri && (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.border }]}
                  onPress={handlePickBackgroundImage}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>Change Image</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.createButton, { backgroundColor: theme.accent }]}
                onPress={handleSaveBgImage}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  noteCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  linedPaper: {
    position: 'relative',
    minHeight: LINE_HEIGHT * 2,
  },
  line: {
    height: LINE_HEIGHT,
    borderBottomWidth: 1.5,
  },
  noteText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    fontSize: 18,
    paddingTop: 10,
  },
  noteDate: {
    fontSize: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopWidth: 1,
  },
  addNoteButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
  textAreaContainer: {
    position: 'relative',
    height: 308,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  inputLine: {
    height: 44,
    borderBottomWidth: 1.5,
  },
  textArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    fontSize: 18,
    lineHeight: 44,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
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
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 12,
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
});
