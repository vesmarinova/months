import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Month } from '../../types';
import { SEASONS } from '../../data/months';

interface MonthCardContentProps {
  month: Month;
  isCorrect?: boolean | null;
  isDragging?: boolean;
  isDragOverlay?: boolean;
  style?: React.CSSProperties;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
  listeners?: Record<string, (event: React.SyntheticEvent) => void>;
  setNodeRef?: (node: HTMLElement | null) => void;
}

/**
 * Presentational component — renders the card UI.
 * Separated from sortable logic to avoid useSortable id collisions
 * when rendering inside DragOverlay (per dnd-kit best practices).
 *
 * Uses a drag handle pattern: only the grip icon captures drag events,
 * allowing the rest of the card to support normal touch scrolling.
 */
export function MonthCardContent({
  month,
  isCorrect,
  isDragging,
  isDragOverlay,
  style,
  attributes,
  listeners,
  setNodeRef,
}: MonthCardContentProps) {
  const season = SEASONS[month.season];

  const cardStyle: React.CSSProperties = {
    ...style,
    borderColor: season.borderColor,
    backgroundColor: isDragging ? '#f3f4f6' : season.bgColor,
  };

  const correctnessClasses =
    isCorrect === true
      ? 'ring-2 ring-green-500'
      : isCorrect === false
        ? 'ring-2 ring-red-400 animate-shake'
        : '';

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      className={`
        flex items-center gap-2 pl-1 pr-3 py-2
        rounded-xl border-2 select-none
        transition-shadow duration-200
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}
        ${isDragOverlay ? 'shadow-xl scale-105 rotate-1' : ''}
        ${correctnessClasses}
      `}
      {...(attributes ?? {})}
    >
      {/* Drag handle — only this element captures touch/pointer for dragging */}
      <div
        className="flex items-center justify-center w-8 h-10 shrink-0
                   cursor-grab active:cursor-grabbing touch-none
                   text-gray-400 hover:text-gray-600 rounded-lg
                   hover:bg-black/5 transition-colors"
        aria-label="Drag handle"
        {...(listeners ?? {})}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </div>

      <span className="text-xl shrink-0" aria-hidden="true">
        {month.emoji}
      </span>

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-gray-800 leading-tight">
          {month.name.en}
        </span>
        <span className="text-xs text-gray-500 leading-tight">
          {month.name.bg}
        </span>
      </div>

      <div className="ml-auto shrink-0">
        {isCorrect === true && (
          <span className="text-green-500 text-lg font-bold" aria-label="correct">✓</span>
        )}
        {isCorrect === false && (
          <span className="text-red-400 text-lg font-bold" aria-label="incorrect">✗</span>
        )}
        {isCorrect == null && (
          <span className="text-gray-300 text-sm">⠿</span>
        )}
      </div>
    </div>
  );
}

interface MonthCardProps {
  month: Month;
  isCorrect?: boolean | null;
}

/**
 * Sortable wrapper — calls useSortable and delegates rendering
 * to MonthCardContent. Only use this inside a SortableContext.
 */
export function MonthCard({ month, isCorrect }: MonthCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: month.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <MonthCardContent
      month={month}
      isCorrect={isCorrect}
      isDragging={isDragging}
      style={style}
      attributes={attributes}
      listeners={listeners as unknown as Record<string, (event: React.SyntheticEvent) => void>}
      setNodeRef={setNodeRef}
    />
  );
}
