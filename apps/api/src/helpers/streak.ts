export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date | null;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function toUtcDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function diffInUtcDays(a: Date, b: Date): number {
  return Math.round(
    (toUtcDateOnly(a).getTime() - toUtcDateOnly(b).getTime()) / MS_PER_DAY,
  );
}

/**
 * Pure streak-update function: given "now" and the user's current streak
 * state, returns the next state after a day's worth of activity (a task
 * completion). The day boundary is the server's UTC calendar day. The streak
 * only ever ratchets forward — this function is only ever called when a task
 * transitions TODO -> COMPLETED, never on un-completion, so there's no
 * decrement case to handle here.
 */
export function computeStreakOnActivity(
  now: Date,
  state: StreakState,
): StreakState {
  const today = toUtcDateOnly(now);

  if (!state.lastActiveDate) {
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, state.longestStreak),
      lastActiveDate: today,
    };
  }

  const gap = diffInUtcDays(today, state.lastActiveDate);

  if (gap === 0) {
    return { ...state, lastActiveDate: today };
  }

  if (gap === 1) {
    const currentStreak = state.currentStreak + 1;
    return {
      currentStreak,
      longestStreak: Math.max(currentStreak, state.longestStreak),
      lastActiveDate: today,
    };
  }

  return {
    currentStreak: 1,
    longestStreak: Math.max(1, state.longestStreak),
    lastActiveDate: today,
  };
}
