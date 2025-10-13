import { HolidayType } from '../types';

export const HOLIDAY_TYPES: Record<string, HolidayType> = {
  HALLOWEEN: 'halloween',
  CHRISTMAS: 'christmas',
  EASTER: 'easter',
};

export const PROPERTY_TAGS: Record<HolidayType, string[]> = {
  halloween: [
    'halloween_lights',
    'pumpkins',
    'scary_props',
    'inflatables',
    'fog_machine',
    'skeleton_display',
    'witch_decor',
    'graveyard',
  ],
  christmas: [
    'christmas_lights',
    'santa_display',
    'nativity_scene',
    'animated_display',
    'music',
    'reindeer',
    'snowman',
    'inflatable_santa',
  ],
  easter: [
    'easter_eggs',
    'bunny_display',
    'pastel_lights',
    'egg_hunt',
    'easter_baskets',
    'spring_flowers',
  ],
};
