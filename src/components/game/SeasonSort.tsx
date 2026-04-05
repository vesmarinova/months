import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
  closestCenter,
} from '@dnd-kit/core';
import { MONTHS, SEASONS } from '../../data/months';
import { shuffle } from '../../utils/shuffle';
import { GameResult } from './GameResult';
import type { Month, Season } from '../../types';

const SEASON_ORDER: Season[] = ['Winter', 'Spring', 'Summer', 'Fall'];
const DIFFICULTY_LEVELS = [4, 8, 12] as const;

function getMonthsForDifficulty(level: number): Month[] {
  if (level <= 4) {
    // One month per season
    return shuffle([MONTHS[0], MONTHS[3], MONTHS[6], MONTHS[9]]);
  }
  if (level <= 8) {
    // Two per season
    return shuffle([
      MONTHS[0], MONTHS[1], MONTHS[2], MONTHS[3],
      MONTHS[5], MONTHS[6], MONTHS[8], MONTHS[9],
    ]);
  }
  return shuffle([...MONTHS]);
}

/** Draggable month chip shown in the "unplaced" pool */
function DraggableMonth({ month }: { month: Month }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `month-${month.id}`,
    data: { month },
  });

  const season = SEASONS[month.season];

  return (
    <div
      ref={setNodeRef}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5
        rounded-lg border-2 cursor-grab active:cursor-grabbing
        touch-none select-none text-sm font-semibold
        transition-all duration-150
        ${isDragging ? 'opacity-30 scale-95' : 'hover:shadow-md'}
      `}
      style={{ borderColor: season.borderColor, backgroundColor: season.bgColor }}
      {...attributes}
      {...listeners}
    >
      <span aria-hidden="true">{month.emoji}</span>
      <span className="text-gray-800">{month.name.en}</span>
      <span className="text-gray-400 text-xs">/ {month.name.bg}</span>
    </div>
  );
}

/** Presentational month chip for the drag overlay */
function MonthChip({ month }: { month: Month }) {
  const season = SEASONS[month.season];
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5
                 rounded-lg border-2 text-sm font-semibold
                 shadow-xl scale-110 rotate-2"
      style={{ borderColor: season.borderColor, backgroundColor: season.bgColor }}
    >
      <span aria-hidden="true">{month.emoji}</span>
      <span className="text-gray-800">{month.name.en}</span>
      <span className="text-gray-400 text-xs">/ {month.name.bg}</span>
    </div>
  );
}

/** Droppable season zone */
function SeasonZone({
  season,
  placedMonths,
  wrongIds,
}: {
  season: Season;
  placedMonths: Month[];
  wrongIds: Set<number>;
}) {
  const config = SEASONS[season];
  const { setNodeRef, isOver } = useDroppable({ id: `season-${season}` });

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-2xl border-2 p-3 min-h-[80px]
        transition-all duration-200
        ${isOver ? 'ring-2 ring-indigo-400 scale-[1.02]' : ''}
      `}
      style={{ borderColor: config.borderColor, backgroundColor: config.bgColor }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{config.emojis[0]}</span>
        <span className="font-bold text-sm" style={{ color: config.color }}>
          {config.name.en} / {config.name.bg}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {placedMonths.map((m) => (
          <span
            key={m.id}
            className={`
              inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
              border transition-all duration-200
              ${wrongIds.has(m.id) ? 'border-red-400 bg-red-50 ring-1 ring-red-300' : 'border-gray-200 bg-white/80'}
            `}
          >
            {m.emoji} {m.name.en}
            {wrongIds.has(m.id) && <span className="text-red-400 ml-0.5">✗</span>}
          </span>
        ))}
        {placedMonths.length === 0 && (
          <span className="text-xs text-gray-400 italic">
            Drop months here / Пуснете месеци тук
          </span>
        )}
      </div>
    </div>
  );
}

export function SeasonSort({ onBack }: { onBack: () => void }) {
  const [difficultyIndex, setDifficultyIndex] = useState(0);
  const difficulty = DIFFICULTY_LEVELS[difficultyIndex];
  const [pool, setPool] = useState<Month[]>(() => getMonthsForDifficulty(difficulty));
  const [placed, setPlaced] = useState<Record<Season, Month[]>>({
    Winter: [], Spring: [], Summer: [], Fall: [],
  });
  const [activeMonth, setActiveMonth] = useState<Month | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [wrongIds, setWrongIds] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const totalPlaced = Object.values(placed).reduce((sum, arr) => sum + arr.length, 0);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const month = event.active.data.current?.month as Month | undefined;
    setActiveMonth(month ?? null);
    setWrongIds(new Set());
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveMonth(null);
    const { active, over } = event;
    if (!over) return;

    const month = active.data.current?.month as Month | undefined;
    if (!month) return;

    const targetSeason = (over.id as string).replace('season-', '') as Season;
    if (!SEASON_ORDER.includes(targetSeason)) return;

    // Move month from pool to season zone
    setPool((prev) => prev.filter((m) => m.id !== month.id));
    setPlaced((prev) => ({
      ...prev,
      [targetSeason]: [...prev[targetSeason], month],
    }));
  }, []);

  const checkAnswers = useCallback(() => {
    setAttempts((prev) => prev + 1);
    const newWrongIds = new Set<number>();
    let allCorrect = true;

    for (const season of SEASON_ORDER) {
      for (const month of placed[season]) {
        if (month.season !== season) {
          newWrongIds.add(month.id);
          allCorrect = false;
        }
      }
    }

    setWrongIds(newWrongIds);

    if (allCorrect && pool.length === 0) {
      // Check if we can advance difficulty
      if (difficultyIndex < DIFFICULTY_LEVELS.length - 1) {
        const nextIndex = difficultyIndex + 1;
        setDifficultyIndex(nextIndex);
        const nextMonths = getMonthsForDifficulty(DIFFICULTY_LEVELS[nextIndex]);
        setPool(nextMonths);
        setPlaced({ Winter: [], Spring: [], Summer: [], Fall: [] });
        setWrongIds(new Set());
      } else {
        setElapsedSeconds(Math.round((Date.now() - startTime) / 1000));
        setIsComplete(true);
      }
    } else if (!allCorrect) {
      // Return wrong ones back to pool
      setTimeout(() => {
        const wrongMonths: Month[] = [];
        const fixedPlaced = { ...placed };
        for (const season of SEASON_ORDER) {
          fixedPlaced[season] = placed[season].filter((m) => {
            if (newWrongIds.has(m.id)) {
              wrongMonths.push(m);
              return false;
            }
            return true;
          });
        }
        setPlaced(fixedPlaced);
        setPool((prev) => shuffle([...prev, ...wrongMonths]));
        setWrongIds(new Set());
      }, 800);
    }
  }, [placed, pool, difficultyIndex, startTime]);

  const resetGame = useCallback(() => {
    setDifficultyIndex(0);
    setPool(getMonthsForDifficulty(DIFFICULTY_LEVELS[0]));
    setPlaced({ Winter: [], Spring: [], Summer: [], Fall: [] });
    setAttempts(0);
    setStartTime(Date.now());
    setWrongIds(new Set());
    setIsComplete(false);
    setElapsedSeconds(0);
  }, []);

  if (isComplete) {
    return (
      <GameResult
        attempts={attempts}
        elapsedSeconds={elapsedSeconds}
        onPlayAgain={resetGame}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 pb-6">
      <div className="flex items-center justify-between w-full mb-3">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 p-2 -ml-2 rounded-lg
                     hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px]
                     flex items-center justify-center"
          aria-label="Back to menu"
        >
          ← Back
        </button>
        <div className="text-xs text-gray-400">
          Level {difficultyIndex + 1}/{DIFFICULTY_LEVELS.length} · {difficulty} months
        </div>
        <div className="text-sm text-gray-500">
          Attempts: <span className="font-bold text-gray-700">{attempts}</span>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-0.5 text-center">
        Sort by Season
      </h2>
      <p className="text-xs text-gray-500 mb-3 text-center">
        Сортирайте по сезони
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Unplaced months pool */}
        {pool.length > 0 && (
          <div className="w-full mb-4 p-3 bg-white/60 rounded-xl border border-gray-200">
            <div className="text-xs text-gray-400 mb-2 font-medium">
              Drag to the correct season ({pool.length} remaining)
            </div>
            <div className="flex flex-wrap gap-2">
              {pool.map((month) => (
                <DraggableMonth key={month.id} month={month} />
              ))}
            </div>
          </div>
        )}

        {/* Season drop zones */}
        <div className="grid grid-cols-2 gap-2 w-full">
          {SEASON_ORDER.map((season) => (
            <SeasonZone
              key={season}
              season={season}
              placedMonths={placed[season]}
              wrongIds={wrongIds}
            />
          ))}
        </div>

        <DragOverlay>
          {activeMonth ? <MonthChip month={activeMonth} /> : null}
        </DragOverlay>
      </DndContext>

      {pool.length === 0 && totalPlaced > 0 && (
        <button
          onClick={checkAnswers}
          className="mt-4 w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700
                     text-white font-bold text-lg rounded-xl shadow-lg
                     hover:shadow-xl transition-all duration-200
                     active:scale-[0.98] min-h-[48px]"
        >
          Check / Проверка ✓
        </button>
      )}
    </div>
  );
}
