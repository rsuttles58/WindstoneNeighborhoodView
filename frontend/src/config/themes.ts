import { HolidayType } from '../types';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    headerGradient: string;
    headerOverlay: string;
  };
}

export const themes: Record<HolidayType | 'default', Theme> = {
  halloween: {
    name: 'Halloween',
    colors: {
      primary: '#FF6B35',        // Orange
      primaryDark: '#D84315',    // Dark Orange
      secondary: '#8B4789',      // Purple
      accent: '#000000',         // Black
      background: '#1a1a1a',     // Dark gray
      surface: '#2d2d2d',        // Darker surface
      text: '#ffffff',           // White text
      textLight: '#e0e0e0',      // Light gray text
      headerGradient: 'linear-gradient(135deg, #FF6B35 0%, #D84315 25%, #8B4789 50%, #4B0082 75%, #000000 100%)',
      headerOverlay: 'rgba(0, 0, 0, 0.3)',
    },
  },
  christmas: {
    name: 'Christmas',
    colors: {
      primary: '#C41E3A',        // Christmas Red
      primaryDark: '#8B0000',    // Dark Red
      secondary: '#165B33',      // Christmas Green
      accent: '#FFD700',         // Gold
      background: '#FFFAF0',     // Snowy Cream (soft ivory)
      surface: '#ffffff',        // White surface
      text: '#2c3e50',           // Dark text
      textLight: '#555555',      // Gray text
      headerGradient: 'linear-gradient(135deg, #165B33 0%, #1e8449 25%, #C41E3A 50%, #8B0000 75%, #FFD700 100%)',
      headerOverlay: 'rgba(0, 0, 0, 0.15)',
    },
  },
  easter: {
    name: 'Easter',
    colors: {
      primary: '#FF69B4',        // Pink
      primaryDark: '#E91E63',    // Dark Pink
      secondary: '#9C27B0',      // Purple
      accent: '#FFC107',         // Yellow
      background: '#FFF9E6',     // Light cream
      surface: '#ffffff',        // White surface
      text: '#4A4A4A',           // Dark gray text
      textLight: '#666666',      // Medium gray text
      headerGradient: 'linear-gradient(135deg, #FF69B4 0%, #9C27B0 25%, #81C784 50%, #FFE082 75%, #64B5F6 100%)',
      headerOverlay: 'rgba(255, 255, 255, 0.1)',
    },
  },
  default: {
    name: 'All Seasons',
    colors: {
      primary: '#28a745',        // Green
      primaryDark: '#218838',    // Dark Green
      secondary: '#0066CC',      // Blue
      accent: '#F7931E',         // Orange
      background: '#f5f5f5',     // Light gray
      surface: '#ffffff',        // White surface
      text: '#333333',           // Dark text
      textLight: '#555555',      // Gray text
      headerGradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #C1272D 50%, #0066CC 75%, #8B4789 100%)',
      headerOverlay: 'rgba(0, 0, 0, 0.15)',
    },
  },
};

// Get theme based on active holidays
export const getThemeForHolidays = (activeHolidays: HolidayType[]): Theme => {
  // If only one holiday is active, use its theme
  if (activeHolidays.length === 1) {
    return themes[activeHolidays[0]];
  }
  
  // If multiple holidays or none, use default theme
  return themes.default;
};

// Apply theme to document root
export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
};

