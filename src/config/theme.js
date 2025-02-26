import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1565C0',     // Primary school color (deep blue)
    accent: '#FFC107',      // Accent color (amber)
    background: '#FFFFFF',  // Background color
    surface: '#F5F5F5',     // Surface color for cards
    text: '#212121',        // Text color
    error: '#D32F2F',       // Error color
    success: '#388E3C',     // Success color
    info: '#0288D1',        // Info color
    warning: '#F57C00',     // Warning color
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};