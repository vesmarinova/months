import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { MONTHS } from '../../data/months';
import { shuffle } from '../../utils/shuffle';
import { MonthCard, MonthCardContent } from './MonthCard';
import { GameResult } from './GameResult';
import type { Month } from '../../types';

export function MonthSequence({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<Month[]>(() => shuffle([...MONTHS]));
  const [activeId, setActiveId] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [isChecked, setIsChecked] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [correctMap, setCorrectMap] = useState<Record<number, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeMonth = useMemo(
    () => items.find((m) => m.id === activeId) ?? null,
    [items, activeId]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as number);
    // Clear check state when user starts dragging again
    setIsChecked(false);
    setCorrectMap({});
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((m) => m.id === active.id);
        const newIndex = prev.findIndex((m) => m.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  const checkOrder = useCallback(() => {
    setAttempts((prev) => prev + 1);
    setIsChecked(true);

    const newCorrectMap: Record<number, boolean> = {};
    let allCorrect = true;

    items.forEach((month, index) => {
      const correct = month.id === index + 1;
      newCorrectMap[month.id] = correct;
      if (!correct) allCorrect = false;
    });

    setCorrectMap(newCorrectMap);

    if (allCorrect) {
      setElapsedSeconds(Math.round((Date.now() - startTime) / 1000));
      setIsComplete(true);
    }
  }, [items, startTime]);

  const resetGame = useCallback(() => {
    setItems(shuffle([...MONTHS]));
    setAttempts(0);
    setStartTime(Date.now());
    setIsChecked(false);
    setIsComplete(false);
    setCorrectMap({});
    setElapsedSeconds(0);
  }, []);

  // Auto-detect completion after drag
  useEffect(() => {
    if (isChecked || isComplete) return;
    const allCorrect = items.every((month, index) => month.id === index + 1);
    if (allCorrect) {
      const timer = setTimeout(() => {
        setAttempts((prev) => prev + 1);
        setElapsedSeconds(Math.round((Date.now() - startTime) / 1000));
        setIsComplete(true);
        const newCorrectMap: Record<number, boolean> = {};
        items.forEach((month) => { newCorrectMap[month.id] = true; });
        setCorrectMap(newCorrectMap);
        setIsChecked(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [items, isChecked, isComplete, startTime]);

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
      <div className="flex items-center justify-between w-full mb-4">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 p-2 -ml-2 rounded-lg
                     hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px]
                     flex items-center justify-center"
          aria-label="Back to menu"
        >
          ← Back
        </button>
        <div className="text-sm text-gray-500">
          Attempts: <span className="font-bold text-gray-700">{attempts}</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">
        Put the Months in Order
      </h2>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Подредете месеците по ред
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2 w-full" role="list" aria-label="Sortable months list">
            {items.map((month) => (
              <MonthCard
                key={month.id}
                month={month}
                isCorrect={isChecked ? correctMap[month.id] ?? null : null}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeMonth ? (
            <MonthCardContent month={activeMonth} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      <button
        onClick={checkOrder}
        className="mt-6 w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700
                   text-white font-bold text-lg rounded-xl shadow-lg
                   hover:shadow-xl transition-all duration-200
                   active:scale-[0.98] min-h-[48px]"
      >
        Check Order / Проверка ✓
      </button>
    </div>
  );
}
