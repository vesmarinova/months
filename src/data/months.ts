import type { Month, Season, SeasonConfig } from '../types';

export const MONTHS: Month[] = [
  { id: 1,  name: { en: 'January',   bg: 'Януари' },     abbreviation: { en: 'Jan', bg: 'Ян' },  season: 'Winter', daysInMonth: 31, emoji: '❄️' },
  { id: 2,  name: { en: 'February',  bg: 'Февруари' },   abbreviation: { en: 'Feb', bg: 'Фев' }, season: 'Winter', daysInMonth: 28, emoji: '⛄' },
  { id: 3,  name: { en: 'March',     bg: 'Март' },       abbreviation: { en: 'Mar', bg: 'Мар' }, season: 'Spring', daysInMonth: 31, emoji: '🌸' },
  { id: 4,  name: { en: 'April',     bg: 'Април' },      abbreviation: { en: 'Apr', bg: 'Апр' }, season: 'Spring', daysInMonth: 30, emoji: '🌷' },
  { id: 5,  name: { en: 'May',       bg: 'Май' },        abbreviation: { en: 'May', bg: 'Май' }, season: 'Spring', daysInMonth: 31, emoji: '🐰' },
  { id: 6,  name: { en: 'June',      bg: 'Юни' },       abbreviation: { en: 'Jun', bg: 'Юни' }, season: 'Summer', daysInMonth: 30, emoji: '☀️' },
  { id: 7,  name: { en: 'July',      bg: 'Юли' },       abbreviation: { en: 'Jul', bg: 'Юли' }, season: 'Summer', daysInMonth: 31, emoji: '🏖️' },
  { id: 8,  name: { en: 'August',    bg: 'Август' },    abbreviation: { en: 'Aug', bg: 'Авг' }, season: 'Summer', daysInMonth: 31, emoji: '🍉' },
  { id: 9,  name: { en: 'September', bg: 'Септември' }, abbreviation: { en: 'Sep', bg: 'Сеп' }, season: 'Fall',   daysInMonth: 30, emoji: '🍂' },
  { id: 10, name: { en: 'October',   bg: 'Октомври' },  abbreviation: { en: 'Oct', bg: 'Окт' }, season: 'Fall',   daysInMonth: 31, emoji: '🎃' },
  { id: 11, name: { en: 'November',  bg: 'Ноември' },   abbreviation: { en: 'Nov', bg: 'Ное' }, season: 'Fall',   daysInMonth: 30, emoji: '🦃' },
  { id: 12, name: { en: 'December',  bg: 'Декември' },  abbreviation: { en: 'Dec', bg: 'Дек' }, season: 'Winter', daysInMonth: 31, emoji: '🎄' },
];

export const SEASONS: Record<Season, SeasonConfig> = {
  Winter: {
    name: { en: 'Winter', bg: 'Зима' },
    color: '#1e40af',
    bgColor: '#dbeafe',
    borderColor: '#93c5fd',
    emojis: ['❄️', '⛄', '🎄'],
  },
  Spring: {
    name: { en: 'Spring', bg: 'Пролет' },
    color: '#166534',
    bgColor: '#dcfce7',
    borderColor: '#86efac',
    emojis: ['🌸', '🌷', '🐰'],
  },
  Summer: {
    name: { en: 'Summer', bg: 'Лято' },
    color: '#a16207',
    bgColor: '#fef9c3',
    borderColor: '#fde047',
    emojis: ['☀️', '🏖️', '🍉'],
  },
  Fall: {
    name: { en: 'Fall', bg: 'Есен' },
    color: '#9a3412',
    bgColor: '#ffedd5',
    borderColor: '#fdba74',
    emojis: ['🍂', '🎃', '🦃'],
  },
};
