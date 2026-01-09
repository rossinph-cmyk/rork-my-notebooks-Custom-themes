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
  highlights?: HighlightRange[];
  createdAt: number;
  updatedAt: number;
}

export interface Notebook {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
  textColor: string;
  backgroundImage?: string;
  backgroundImageOpacity?: number;
  notes: Note[];
  createdAt: number;
}

export const CRAYON_COLORS = [
  { name: "Red", hex: "#ED0A3F" },
  { name: "Maroon", hex: "#C32148" },
  { name: "Scarlet", hex: "#FD0E35" },
  { name: "Brick Red", hex: "#C62D42" },
  { name: "Orange", hex: "#FF681F" },
  { name: "Macaroni", hex: "#FFB97B" },
  { name: "Yellow", hex: "#FBE870" },
  { name: "Green", hex: "#01A638" },
  { name: "Blue", hex: "#0066FF" },
  { name: "Violet", hex: "#8359A3" },
  { name: "Brown", hex: "#AF593E" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Carnation Pink", hex: "#FFA6C9" },
  { name: "Violet Red", hex: "#F7468A" },
  { name: "Red Orange", hex: "#FF681F" },
  { name: "Red Violet", hex: "#BB3385" },
  { name: "Yellow Orange", hex: "#FFAE42" },
  { name: "Yellow Green", hex: "#C5E17A" },
  { name: "Blue Green", hex: "#00AAE4" },
  { name: "Blue Violet", hex: "#6456B7" },
  { name: "Tan", hex: "#D99A6C" },
  { name: "Gray", hex: "#8B8680" },
  { name: "Apricot", hex: "#FDD5B1" },
  { name: "Cerulean", hex: "#02A4D3" },
  { name: "Dandelion", hex: "#FEDF00" },
  { name: "Green Yellow", hex: "#F1E788" },
  { name: "Indigo", hex: "#184FA1" },
  { name: "Magenta", hex: "#F653A6" },
  { name: "Mahogany", hex: "#CA3435" },
  { name: "Melon", hex: "#FEBAAD" },
  { name: "Olive Green", hex: "#B5B35C" },
  { name: "Peach", hex: "#FFCBA4" },
  { name: "Periwinkle", hex: "#C3CDE6" },
  { name: "Pine Green", hex: "#01786F" },
  { name: "Plum", hex: "#843179" },
  { name: "Raw Sienna", hex: "#D27D46" },
  { name: "Raw Umber", hex: "#715E64" },
  { name: "Salmon", hex: "#FF91A4" },
  { name: "Sea Green", hex: "#93DFB8" },
  { name: "Sepia", hex: "#9E5B40" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Spring Green", hex: "#ECEBBD" },
  { name: "Thistle", hex: "#EBC7DF" },
  { name: "Turquoise Blue", hex: "#6CDAE7" },
  { name: "Violet Blue", hex: "#324AB2" },
  { name: "Wisteria", hex: "#C9A0DC" },
  { name: "Yellow Orange", hex: "#FFAE42" },
  { name: "Burnt Orange", hex: "#FF7034" },
  { name: "Burnt Sienna", hex: "#E97451" },
  { name: "Blue Gray", hex: "#C8C8CD" },
  { name: "Cadet Blue", hex: "#A9B2C3" },
  { name: "Cornflower", hex: "#93CCEA" },
  { name: "Forest Green", hex: "#5FA777" },
  { name: "Gold", hex: "#E6BE8A" },
  { name: "Goldenrod", hex: "#FCD667" },
  { name: "Lavender", hex: "#BF8FCC" },
  { name: "Maize", hex: "#F2C649" },
  { name: "Navy Blue", hex: "#0066CC" },
  { name: "Orchid", hex: "#E29CD2" },
  { name: "Purple Mountains", hex: "#9678B6" },
  { name: "Red Orange", hex: "#FF3F34" },
  { name: "Sky Blue", hex: "#76D7EA" },
  { name: "Tumbleweed", hex: "#DEA681" },
];

export const BACKGROUND_COLORS = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Yellow", hex: "#FFF9C4" },
];
