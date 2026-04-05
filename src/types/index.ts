export type Season = 'Winter' | 'Spring' | 'Summer' | 'Fall';

export interface Month {
  id: number;
  name: {
    en: string;
    bg: string;
  };
  abbreviation: {
    en: string;
    bg: string;
  };
  season: Season;
  daysInMonth: number;
  emoji: string;
}

export interface SeasonConfig {
  name: {
    en: string;
    bg: string;
  };
  color: string;
  bgColor: string;
  borderColor: string;
  emojis: string[];
}

export type GameMode = 'menu' | 'sequence' | 'seasons' | 'quiz';

export interface GameState {
  mode: GameMode;
  score: number;
  attempts: number;
  startTime: number | null;
  isComplete: boolean;
}
