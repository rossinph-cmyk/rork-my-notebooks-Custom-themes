export interface HighlightRange {
  start: number;
  end: number;
  color: string;
}

export interface Note {
  id: string;
  text: string;
  backgroundColor?: string;
  textColor?: string;
  highlights: HighlightRange[];
  createdAt: number;
  updatedAt: number;
}

export interface Notebook {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
  textColor: string;
  coverImage?: string;
  coverImageOpacity?: number;
  coverImageColor?: string;
  coverImageColorOpacity?: number;
  backgroundImage?: string;
  backgroundImageOpacity?: number;
  backgroundImageColor?: string;
  backgroundImageColorOpacity?: number;
  notes: Note[];
  createdAt: number;
}
