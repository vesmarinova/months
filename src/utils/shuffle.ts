/**
 * Fisher-Yates shuffle algorithm.
 * Returns a new array with elements in random order.
 * Guarantees the result differs from the original order.
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // If the shuffle produced the same order, swap the first two elements
  const isSameOrder = shuffled.every((item, index) => item === array[index]);
  if (isSameOrder && shuffled.length > 1) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return shuffled;
}
