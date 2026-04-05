import type { GameMode } from '../../types';

interface MainMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

const GAME_MODES = [
  {
    mode: 'sequence' as const,
    emoji: '🔢',
    title: 'Month Sequence',
    subtitle: 'Подредете месеците',
    description: 'Arrange months in the correct order',
    color: 'bg-indigo-500 hover:bg-indigo-600',
    disabled: false,
  },
  {
    mode: 'seasons' as const,
    emoji: '🌈',
    title: 'Season Sorting',
    subtitle: 'Сортирайте по сезони',
    description: 'Match months to their seasons',
    color: 'bg-emerald-500 hover:bg-emerald-600',
    disabled: false,
  },
  {
    mode: 'quiz' as const,
    emoji: '❓',
    title: 'Quick Quiz',
    subtitle: 'Бърз тест',
    description: 'Test your knowledge',
    color: 'bg-amber-500 hover:bg-amber-600',
    disabled: false,
  },
] as const;

export function MainMenu({ onSelectMode }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 pt-2 pb-8">
      <p className="text-center text-gray-600 mb-6 text-base">
        Learn the months and seasons! 🎓
        <br />
        <span className="text-sm text-gray-400">Научете месеците и сезоните!</span>
      </p>

      <div className="flex flex-col gap-4 w-full">
        {GAME_MODES.map(({ mode, emoji, title, subtitle, description, color, disabled }) => (
          <button
            key={mode}
            onClick={() => !disabled && onSelectMode(mode)}
            disabled={disabled}
            className={`
              relative w-full text-left p-5 rounded-2xl text-white
              shadow-lg transition-all duration-200
              active:scale-[0.98] min-h-[80px]
              ${disabled ? 'bg-gray-300 cursor-not-allowed opacity-60' : color}
            `}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl" aria-hidden="true">{emoji}</span>
              <div>
                <div className="font-bold text-lg leading-tight">{title}</div>
                <div className="text-white/80 text-sm">{subtitle}</div>
                <div className="text-white/60 text-xs mt-0.5">{description}</div>
              </div>
            </div>
            {disabled && (
              <span className="absolute top-3 right-3 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
