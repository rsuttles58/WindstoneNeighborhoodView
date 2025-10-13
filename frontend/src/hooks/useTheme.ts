import { useEffect, useState } from 'react';
import { getActiveHolidays } from '../config/holidays';
import { getThemeForHolidays, applyTheme, Theme } from '../config/themes';
import { HolidayType } from '../types';

export const useTheme = () => {
  const [activeHolidays, setActiveHolidays] = useState<HolidayType[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Get active holidays
    const holidays = getActiveHolidays();
    setActiveHolidays(holidays);

    // Get and apply theme based on active holidays
    const theme = getThemeForHolidays(holidays);
    setCurrentTheme(theme);
    applyTheme(theme);

    // Add theme class to body
    const themeClass = holidays.length === 1 ? `theme-${holidays[0]}` : 'theme-default';
    document.body.className = themeClass;

    return () => {
      // Cleanup: remove theme class
      document.body.className = '';
    };
  }, []);

  return {
    activeHolidays,
    currentTheme,
    themeName: currentTheme?.name || 'Loading...',
  };
};

