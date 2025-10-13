import { HolidayType } from '../types';

// Holiday season date ranges (month is 0-indexed: 0=Jan, 11=Dec)
const holidaySeasons = {
  halloween: {
    start: { month: 8, day: 15 }, // September 15
    end: { month: 10, day: 5 }, // November 5
  },
  christmas: {
    start: { month: 10, day: 6 }, // November 6
    end: { month: 0, day: 7 }, // January 7 (next year)
  },
  easter: {
    start: { month: 1, day: 15 }, // February 15
    end: { month: 4, day: 30 }, // May 30
  },
};

// Manual override - set to specific holidays to force them active regardless of date
// Leave empty [] for automatic date-based behavior
const manualOverride: HolidayType[] = [
  // 'halloween',  // Uncomment to force Halloween active year-round
  // 'christmas',  // Uncomment to force Christmas active year-round
  // 'easter',     // Uncomment to force Easter active year-round
];

// Check if current date is within a holiday season
const isDateInSeason = (
  start: { month: number; day: number },
  end: { month: number; day: number }
): boolean => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  // Handle cross-year seasons (like Christmas: Nov 6 to Jan 7)
  if (start.month > end.month) {
    return (
      currentMonth > start.month ||
      (currentMonth === start.month && currentDay >= start.day) ||
      currentMonth < end.month ||
      (currentMonth === end.month && currentDay <= end.day)
    );
  }

  // Handle same-year seasons
  if (currentMonth < start.month || currentMonth > end.month) {
    return false;
  }
  if (currentMonth === start.month && currentDay < start.day) {
    return false;
  }
  if (currentMonth === end.month && currentDay > end.day) {
    return false;
  }
  return true;
};

// Get active holidays based on current date or manual override
export const getActiveHolidays = (): HolidayType[] => {
  // If manual override is set, use that
  if (manualOverride.length > 0) {
    return manualOverride;
  }

  // Otherwise, use date-based logic
  const active: HolidayType[] = [];

  if (
    isDateInSeason(holidaySeasons.halloween.start, holidaySeasons.halloween.end)
  ) {
    active.push('halloween');
  }
  if (
    isDateInSeason(holidaySeasons.christmas.start, holidaySeasons.christmas.end)
  ) {
    active.push('christmas');
  }
  if (isDateInSeason(holidaySeasons.easter.start, holidaySeasons.easter.end)) {
    active.push('easter');
  }

  // Fallback: if no holidays are active, show all (for off-season browsing)
  return active.length > 0 ? active : ['halloween', 'christmas', 'easter'];
};

// Check if a specific holiday is active
export const isHolidayActive = (holiday: HolidayType): boolean => {
  return getActiveHolidays().includes(holiday);
};

// Get the current holiday season name (for display purposes)
export const getCurrentSeasonName = (): string => {
  const active = getActiveHolidays();
  if (active.length === 1) {
    return active[0].charAt(0).toUpperCase() + active[0].slice(1);
  }
  if (active.length === 3) {
    return 'All Seasons';
  }
  return active.map((h) => h.charAt(0).toUpperCase() + h.slice(1)).join(' & ');
};
