import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Modal, TextInput, ScrollView } from "react-native";
import { useNotebookStore } from "../state/notebookStore";
import { CRAYON_COLORS, BACKGROUND_COLORS } from "../types/notebook";
import { Ionicons } from "@expo/vector-icons";

interface NotebookModalProps {
  visible: boolean;
  onClose: () => void;
  notebookId?: string | null;
}

export const NotebookModal: React.FC<NotebookModalProps> = ({
  visible,
  onClose,
  notebookId,
}) => {
  const addNotebook = useNotebookStore((s) => s.addNotebook);
  const updateNotebook = useNotebookStore((s) => s.updateNotebook);
  const getNotebook = useNotebookStore((s) => s.getNotebook);
  const deleteNotebook = useNotebookStore((s) => s.deleteNotebook);

  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(CRAYON_COLORS[0].hex);
  const [selectedTextColor, setSelectedTextColor] = useState(CRAYON_COLORS[11].hex);
  const [selectedBgColor, setSelectedBgColor] = useState(BACKGROUND_COLORS[0].hex);

  useEffect(() => {
    if (notebookId) {
      const notebook = getNotebook(notebookId);
      if (notebook) {
        setName(notebook.name);
        setSelectedColor(notebook.color);
        setSelectedTextColor(notebook.textColor);
        setSelectedBgColor(notebook.backgroundColor);
      }
    } else {
      setName("");
      setSelectedColor(CRAYON_COLORS[0].hex);
      setSelectedTextColor(CRAYON_COLORS[11].hex);
      setSelectedBgColor(BACKGROUND_COLORS[0].hex);
    }
  }, [notebookId, visible]);

  const handleSave = () => {
    if (!name.trim()) return;

    if (notebookId) {
      updateNotebook(notebookId, {
        name: name.trim(),
        color: selectedColor,
        textColor: selectedTextColor,
        backgroundColor: selectedBgColor,
      });
    } else {
      addNotebook({
        name: name.trim(),
        color: selectedColor,
        textColor: selectedTextColor,
        backgroundColor: selectedBgColor,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (notebookId) {
      deleteNotebook(notebookId);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-900">
            {notebookId ? "Edit Notebook" : "New Notebook"}
          </Text>
          <Pressable onPress={onClose} className="p-2 active:opacity-70">
            <Ionicons name="close" size={24} color="#374151" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          <Text className="text-base font-semibold text-gray-900 mb-3">Notebook Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter notebook name"
            className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900 mb-8"
            placeholderTextColor="#9CA3AF"
          />

          <Text className="text-base font-semibold text-gray-900 mb-3">Cover Color</Text>
          <View className="flex-row flex-wrap mb-8">
            {CRAYON_COLORS.map((color, index) => (
              <Pressable
                key={`cover-${index}-${color.hex}`}
                onPress={() => setSelectedColor(color.hex)}
                className="w-12 h-12 rounded-full mr-3 mb-3 active:opacity-70"
                style={{
                  backgroundColor: color.hex,
                  borderWidth: selectedColor === color.hex ? 4 : 0,
                  borderColor: "#374151",
                }}
              />
            ))}
          </View>

          <Text className="text-base font-semibold text-gray-900 mb-3">Text Color</Text>
          <View className="flex-row flex-wrap mb-8">
            {CRAYON_COLORS.map((color, index) => (
              <Pressable
                key={`text-${index}-${color.hex}`}
                onPress={() => setSelectedTextColor(color.hex)}
                className="w-12 h-12 rounded-full mr-3 mb-3 active:opacity-70"
                style={{
                  backgroundColor: color.hex,
                  borderWidth: selectedTextColor === color.hex ? 4 : 0,
                  borderColor: "#374151",
                }}
              />
            ))}
          </View>

          <Text className="text-base font-semibold text-gray-900 mb-3">Background Color</Text>
          <View className="flex-row flex-wrap mb-8">
            {[...BACKGROUND_COLORS, ...CRAYON_COLORS].map((color, index) => (
              <Pressable
                key={`bg-${index}-${color.hex}`}
                onPress={() => setSelectedBgColor(color.hex)}
                className="w-12 h-12 rounded-full mr-3 mb-3 active:opacity-70"
                style={{
                  backgroundColor: color.hex,
                  borderWidth: selectedBgColor === color.hex ? 4 : 0,
                  borderColor: "#374151",
                }}
              />
            ))}
          </View>

          <Pressable
            onPress={handleSave}
            disabled={!name.trim()}
            className="bg-blue-600 rounded-xl py-4 items-center mb-4 active:opacity-70"
            style={{ opacity: !name.trim() ? 0.5 : 1 }}
          >
            <Text className="text-white text-lg font-bold">
              {notebookId ? "Save Changes" : "Create Notebook"}
            </Text>
          </Pressable>

          {notebookId && (
            <Pressable
              onPress={handleDelete}
              className="bg-red-600 rounded-xl py-4 items-center mb-4 active:opacity-70"
            >
              <Text className="text-white text-lg font-bold">Delete Notebook</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
