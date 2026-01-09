export const CRAYON_COLORS = [
  '#ED0A3F', '#C32148', '#FD0E35', '#CB4154',
  '#FF681F', '#FFB97B', '#FBE870', '#01A638',
  '#0066FF', '#8359A3', '#AF593E', '#000000',
  '#FFFFFF', '#FFA6C9', '#F7468A', '#FF681F',
  '#BB3385', '#FFAE42', '#ACBF60', '#00B7A9',
  '#6456B7', '#D99A6C', '#8B8680', '#FDD5B1',
  '#02A4D3', '#FED85D', '#B0E313', '#5D76CB',
  '#F653A6', '#CA3435', '#FEBAAD', '#B99B6B',
  '#FFCBA4', '#C3CDE6', '#01786F', '#843179',
  '#D27D46', '#665233', '#FF91A4', '#93DFB8',
  '#9E5B40', '#A6AAAE', '#ECEBBD', '#D8BFD8',
  '#6CDAE7', '#7A89B8', '#C9A0DC', '#FF7034',
  '#E97451', '#6699CC', '#A9B2C3', '#93CCEA',
  '#5FA777', '#E6BE8A', '#F2C649', '#E6E6FA',
  '#F2C649', '#1974D2', '#E29CD2', '#9678B6'
] as const;

export const HIGHLIGHT_COLORS = [
  '#FFEB3B',
  '#4CAF50',
  '#E91E63',
  '#FF9800',
  '#2196F3',
] as const;

export const BACKGROUND_COLORS = [
  '#FFFFFF',
  '#FFFDD0',
  '#FFF9C4',
] as const;

export const DEFAULT_NOTEBOOKS = [
  { name: 'Red Notebook', color: '#E63946', backgroundColor: '#FFFFFF', textColor: '#000000' },
  { name: 'Blue Notebook', color: '#457B9D', backgroundColor: '#FFFFFF', textColor: '#000000' },
] as const;

export const THEME_COLORS = {
  light: {
    background: '#FEF3C7',
    text: '#78350F',
    button: '#FDE68A',
    accent: '#2563EB',
    card: '#FFFFFF',
    border: '#E5E7EB',
    placeholder: '#9CA3AF',
  },
  dark: {
    background: '#000000',
    text: '#A855F7',
    button: '#1F1F1F',
    accent: '#A855F7',
    card: '#1F1F1F',
    border: '#374151',
    placeholder: '#6B7280',
  },
} as const;

export default {
  light: THEME_COLORS.light,
  dark: THEME_COLORS.dark,
  crayon: CRAYON_COLORS,
  highlight: HIGHLIGHT_COLORS,
  background: BACKGROUND_COLORS,
};
