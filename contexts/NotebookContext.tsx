import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { Notebook, Note } from '@/types/notebook';
import { DEFAULT_NOTEBOOKS } from '@/constants/colors';

const STORAGE_KEY = 'voice-notepad-notebooks';
const DARK_MODE_KEY = 'voice-notepad-dark-mode';
const HOME_BG_IMAGE_KEY = 'voice-notepad-home-bg-image';
const HOME_BG_OPACITY_KEY = 'voice-notepad-home-bg-opacity';
const HOME_BG_COLOR_KEY = 'voice-notepad-home-bg-color';
const HOME_BG_COLOR_OPACITY_KEY = 'voice-notepad-home-bg-color-opacity';

export const [NotebookProvider, useNotebooks] = createContextHook(() => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [homeBackgroundImage, setHomeBackgroundImage] = useState<string | null>(null);
  const [homeBackgroundImageOpacity, setHomeBackgroundImageOpacity] = useState(0.3);
  const [homeBackgroundColor, setHomeBackgroundColor] = useState<string>('#3B82F6');
  const [homeBackgroundColorOpacity, setHomeBackgroundColorOpacity] = useState(0.5);

  const notebooksQuery = useQuery({
    queryKey: ['notebooks'],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Notebook[];
          return parsed;
        }
      } catch (error) {
        console.error('Error loading notebooks from storage:', error);
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
      
      const defaultNotebooks: Notebook[] = DEFAULT_NOTEBOOKS.map((nb, idx) => ({
        id: `notebook-${Date.now()}-${idx}`,
        name: nb.name,
        color: nb.color,
        backgroundColor: nb.backgroundColor,
        textColor: nb.textColor,
        backgroundImageOpacity: 0.5,
        notes: [],
        createdAt: Date.now(),
      }));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotebooks));
      return defaultNotebooks;
    },
  });

  const darkModeQuery = useQuery({
    queryKey: ['darkMode'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(DARK_MODE_KEY);
      return stored === 'true';
    },
  });

  const homeBgQuery = useQuery({
    queryKey: ['homeBackground'],
    queryFn: async () => {
      const imageUri = await AsyncStorage.getItem(HOME_BG_IMAGE_KEY);
      const opacity = await AsyncStorage.getItem(HOME_BG_OPACITY_KEY);
      const color = await AsyncStorage.getItem(HOME_BG_COLOR_KEY);
      const colorOpacity = await AsyncStorage.getItem(HOME_BG_COLOR_OPACITY_KEY);
      return {
        image: imageUri,
        opacity: opacity ? parseFloat(opacity) : 0.3,
        color: color || '#3B82F6',
        colorOpacity: colorOpacity ? parseFloat(colorOpacity) : 0.5,
      };
    },
  });

  const saveNotebooksMutation = useMutation({
    mutationFn: async (updatedNotebooks: Notebook[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotebooks));
      return updatedNotebooks;
    },
    onSuccess: (data) => {
      setNotebooks(data);
    },
  });

  const saveDarkModeMutation = useMutation({
    mutationFn: async (isDark: boolean) => {
      await AsyncStorage.setItem(DARK_MODE_KEY, isDark.toString());
      return isDark;
    },
    onSuccess: (data) => {
      setDarkMode(data);
    },
  });

  useEffect(() => {
    if (notebooksQuery.data) {
      setNotebooks(notebooksQuery.data);
    }
  }, [notebooksQuery.data]);

  useEffect(() => {
    if (darkModeQuery.data !== undefined) {
      setDarkMode(darkModeQuery.data);
    }
  }, [darkModeQuery.data]);

  useEffect(() => {
    if (homeBgQuery.data) {
      setHomeBackgroundImage(homeBgQuery.data.image);
      setHomeBackgroundImageOpacity(homeBgQuery.data.opacity);
      setHomeBackgroundColor(homeBgQuery.data.color);
      setHomeBackgroundColorOpacity(homeBgQuery.data.colorOpacity);
    }
  }, [homeBgQuery.data]);

  const createNotebook = (name: string, color: string, backgroundColor: string, textColor: string) => {
    const newNotebook: Notebook = {
      id: `notebook-${Date.now()}`,
      name,
      color,
      backgroundColor,
      textColor,
      backgroundImageOpacity: 0.5,
      notes: [],
      createdAt: Date.now(),
    };
    const updated = [newNotebook, ...notebooks];
    saveNotebooksMutation.mutate(updated);
  };

  const updateNotebook = (id: string, updates: Partial<Notebook>) => {
    const updated = notebooks.map(nb => 
      nb.id === id ? { ...nb, ...updates } : nb
    );
    saveNotebooksMutation.mutate(updated);
  };

  const deleteNotebook = (id: string) => {
    const updated = notebooks.filter(nb => nb.id !== id);
    saveNotebooksMutation.mutate(updated);
  };

  const addNote = (notebookId: string, text: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      text,
      highlights: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = notebooks.map(nb => 
      nb.id === notebookId 
        ? { ...nb, notes: [newNote, ...nb.notes] }
        : nb
    );
    saveNotebooksMutation.mutate(updated);
  };

  const updateNote = (notebookId: string, noteId: string, updates: Partial<Note>) => {
    const updated = notebooks.map(nb => 
      nb.id === notebookId 
        ? { 
            ...nb, 
            notes: nb.notes.map(note => 
              note.id === noteId 
                ? { ...note, ...updates, updatedAt: Date.now() }
                : note
            )
          }
        : nb
    );
    saveNotebooksMutation.mutate(updated);
  };

  const deleteNote = (notebookId: string, noteId: string) => {
    const updated = notebooks.map(nb => 
      nb.id === notebookId 
        ? { ...nb, notes: nb.notes.filter(note => note.id !== noteId) }
        : nb
    );
    saveNotebooksMutation.mutate(updated);
  };

  const toggleDarkMode = () => {
    saveDarkModeMutation.mutate(!darkMode);
  };

  const setHomeBackground = async (imageUri: string | null) => {
    if (imageUri) {
      await AsyncStorage.setItem(HOME_BG_IMAGE_KEY, imageUri);
    } else {
      await AsyncStorage.removeItem(HOME_BG_IMAGE_KEY);
    }
    setHomeBackgroundImage(imageUri);
  };

  const setHomeBackgroundOpacity = async (opacity: number) => {
    await AsyncStorage.setItem(HOME_BG_OPACITY_KEY, opacity.toString());
    setHomeBackgroundImageOpacity(opacity);
  };

  const setHomeBackgroundColorValue = async (color: string) => {
    await AsyncStorage.setItem(HOME_BG_COLOR_KEY, color);
    setHomeBackgroundColor(color);
  };

  const setHomeBackgroundColorOpacityValue = async (opacity: number) => {
    await AsyncStorage.setItem(HOME_BG_COLOR_OPACITY_KEY, opacity.toString());
    setHomeBackgroundColorOpacity(opacity);
  };

  return {
    notebooks,
    darkMode,
    homeBackgroundImage,
    homeBackgroundImageOpacity,
    homeBackgroundColor,
    homeBackgroundColorOpacity,
    isLoading: notebooksQuery.isLoading || darkModeQuery.isLoading,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    addNote,
    updateNote,
    deleteNote,
    toggleDarkMode,
    setHomeBackground,
    setHomeBackgroundOpacity,
    setHomeBackgroundColor: setHomeBackgroundColorValue,
    setHomeBackgroundColorOpacity: setHomeBackgroundColorOpacityValue,
  };
});

export function useNotebook(id: string) {
  const { notebooks } = useNotebooks();
  return useMemo(() => notebooks.find(nb => nb.id === id), [notebooks, id]);
}
