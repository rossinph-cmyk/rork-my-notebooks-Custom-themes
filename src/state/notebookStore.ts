import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { Notebook, Note, HighlightRange } from "../types/notebook";

interface NotebookState {
  notebooks: Notebook[];
  darkMode: boolean;
  homeBackgroundImage?: string;
  homeBackgroundImageOpacity?: number;
  hasAcceptedPrivacyPolicy: boolean;
  hasCompletedOnboarding: boolean;
  addNotebook: (notebook: Omit<Notebook, "id" | "createdAt" | "notes">) => void;
  updateNotebook: (id: string, updates: Partial<Notebook>) => void;
  deleteNotebook: (id: string) => void;
  addNote: (notebookId: string, noteText: string) => void;
  updateNote: (notebookId: string, noteId: string, text: string) => void;
  updateNoteColor: (notebookId: string, noteId: string, backgroundColor: string) => void;
  updateNoteTextColor: (notebookId: string, noteId: string, textColor: string) => void;
  addHighlight: (notebookId: string, noteId: string, highlight: HighlightRange) => void;
  removeHighlight: (notebookId: string, noteId: string, start: number, end: number) => void;
  clearHighlights: (notebookId: string, noteId: string) => void;
  deleteNote: (notebookId: string, noteId: string) => void;
  getNotebook: (id: string) => Notebook | undefined;
  toggleDarkMode: () => void;
  updateNotebookBackgroundImage: (id: string, imageUri: string | undefined, opacity?: number) => void;
  updateHomeBackgroundImage: (imageUri: string | undefined, opacity?: number) => void;
  acceptPrivacyPolicy: () => void;
  completeOnboarding: () => void;
}

export const useNotebookStore = create<NotebookState>()(
  persist(
    (set, get) => ({
      notebooks: [
        {
          id: "default-1",
          name: "Tap to rename",
          color: "#E63946",
          backgroundColor: "#FFFFFF",
          textColor: "#000000",
          notes: [],
          createdAt: Date.now(),
        },
        {
          id: "default-2",
          name: "Tap to rename",
          color: "#457B9D",
          backgroundColor: "#FFFFFF",
          textColor: "#000000",
          notes: [],
          createdAt: Date.now(),
        },
      ],
      darkMode: false,
      homeBackgroundImage: undefined,
      homeBackgroundImageOpacity: undefined,
      hasAcceptedPrivacyPolicy: false,
      hasCompletedOnboarding: false,

      addNotebook: (notebook) =>
        set((state) => ({
          notebooks: [
            ...state.notebooks,
            {
              ...notebook,
              id: uuidv4(),
              notes: [],
              createdAt: Date.now(),
            },
          ],
        })),

      updateNotebook: (id, updates) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === id ? { ...nb, ...updates } : nb
          ),
        })),

      deleteNotebook: (id) =>
        set((state) => ({
          notebooks: state.notebooks.filter((nb) => nb.id !== id),
        })),

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      addNote: (notebookId, noteText) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? {
                  ...nb,
                  notes: [
                    {
                      id: uuidv4(),
                      text: noteText,
                      createdAt: Date.now(),
                      updatedAt: Date.now(),
                    },
                    ...nb.notes,
                  ],
                }
              : nb
          ),
        })),

      updateNote: (notebookId, noteId, text) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? {
                  ...nb,
                  notes: nb.notes.map((note) =>
                    note.id === noteId
                      ? { ...note, text, updatedAt: Date.now() }
                      : note
                  ),
                }
              : nb
          ),
        })),

      updateNoteColor: (notebookId, noteId, backgroundColor) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? {
                  ...nb,
                  notes: nb.notes.map((note) =>
                    note.id === noteId
                      ? { ...note, backgroundColor, updatedAt: Date.now() }
                      : note
                  ),
                }
              : nb
          ),
        })),

      updateNoteTextColor: (notebookId, noteId, textColor) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? {
                  ...nb,
                  notes: nb.notes.map((note) =>
                    note.id === noteId
                      ? { ...note, textColor, updatedAt: Date.now() }
                      : note
                  ),
                }
              : nb
          ),
        })),

      addHighlight: (notebookId, noteId, highlight) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? {
                  ...nb,
                  notes: nb.notes.map((note) =>
                    note.id === noteId
                      ? {
                          ...note,
                          highlights: [...(note.highlights || []), highlight],
                          updatedAt: Date.now(),
                        }
                      : note
                  ),
                }
              : nb
          ),
        })),

      removeHighlight: (notebookId, noteId, start, end) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? {
                  ...nb,
                  notes: nb.notes.map((note) =>
                    note.id === noteId
                      ? {
                          ...note,
                          highlights: (note.highlights || []).filter(
                            (h) => h.start !== start || h.end !== end
                          ),
                          updatedAt: Date.now(),
                        }
                      : note
                  ),
                }
              : nb
          ),
        })),

      clearHighlights: (notebookId, noteId) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? {
                  ...nb,
                  notes: nb.notes.map((note) =>
                    note.id === noteId
                      ? {
                          ...note,
                          highlights: [],
                          updatedAt: Date.now(),
                        }
                      : note
                  ),
                }
              : nb
          ),
        })),

      deleteNote: (notebookId, noteId) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === notebookId
              ? {
                  ...nb,
                  notes: nb.notes.filter((note) => note.id !== noteId),
                }
              : nb
          ),
        })),

      getNotebook: (id) => {
        return get().notebooks.find((nb) => nb.id === id);
      },

      updateNotebookBackgroundImage: (id, imageUri, opacity = 0.15) =>
        set((state) => ({
          notebooks: state.notebooks.map((nb) =>
            nb.id === id
              ? {
                  ...nb,
                  backgroundImage: imageUri,
                  backgroundImageOpacity: imageUri ? opacity : undefined,
                }
              : nb
          ),
        })),

      updateHomeBackgroundImage: (imageUri, opacity = 0.15) =>
        set({
          homeBackgroundImage: imageUri,
          homeBackgroundImageOpacity: imageUri ? opacity : undefined,
        }),

      acceptPrivacyPolicy: () =>
        set({
          hasAcceptedPrivacyPolicy: true,
        }),

      completeOnboarding: () =>
        set({
          hasCompletedOnboarding: true,
        }),
    }),
    {
      name: "notebook-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to rehydrate store:", error);
        }
      },
      partialize: (state) => ({
        notebooks: state.notebooks,
        darkMode: state.darkMode,
        homeBackgroundImage: state.homeBackgroundImage,
        homeBackgroundImageOpacity: state.homeBackgroundImageOpacity,
        hasAcceptedPrivacyPolicy: state.hasAcceptedPrivacyPolicy,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
