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
        flex items-center gap-3 px-4 py-3
        rounded-xl border-2 cursor-grab active:cursor-grabbing
        select-none touch-none
        transition-shadow duration-200
        hover:shadow-md
        ${isDragging ? 'opacity-50 shadow-lg scale-105' : ''}
        ${isDragOverlay ? 'shadow-xl scale-105 rotate-1' : ''}
        ${correctnessClasses}
      `}
      {...(attributes ?? {})}
      {...(listeners ?? {})}
    >
      <span className="text-2xl shrink-0" aria-hidden="true">
        {month.emoji}
      </span>

      <div className="flex flex-col min-w-0">
        <span className="text-base font-bold text-gray-800 leading-tight">
          {month.name.en}
        </span>
        <span className="text-sm text-gray-500 leading-tight">
          {month.name.bg}
        </span>
      </div>

      <div className="ml-auto shrink-0">
        {isCorrect === true && (
          <span className="text-green-500 text-xl font-bold" aria-label="correct">✓</span>
        )}
        {isCorrect === false && (
          <span className="text-red-400 text-xl font-bold" aria-label="incorrect">✗</span>
        )}
        {isCorrect == null && (
          <span className="text-gray-300 text-lg">⠿</span>
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
