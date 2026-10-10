import { computeStreakOnActivity, toUtcDateOnly } from './streak';

function utcDate(iso: string): Date {
  return new Date(iso);
}

describe('computeStreakOnActivity', () => {
  it('starts a new streak on first-ever activity', () => {
    const result = computeStreakOnActivity(utcDate('2026-01-05T10:00:00Z'), {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
    });

    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-05T00:00:00Z')),
    });
  });

  it('is idempotent for a second completion on the same UTC day', () => {
    const result = computeStreakOnActivity(utcDate('2026-01-05T22:00:00Z'), {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-05T08:00:00Z')),
    });

    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-05T00:00:00Z')),
    });
  });

  it('increments the streak on a consecutive day', () => {
    const result = computeStreakOnActivity(utcDate('2026-01-06T09:00:00Z'), {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-05T00:00:00Z')),
    });

    expect(result).toEqual({
      currentStreak: 2,
      longestStreak: 2,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-06T00:00:00Z')),
    });
  });

  it('bumps longestStreak when currentStreak sets a new personal best', () => {
    const result = computeStreakOnActivity(utcDate('2026-01-10T09:00:00Z'), {
      currentStreak: 4,
      longestStreak: 4,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-09T00:00:00Z')),
    });

    expect(result).toEqual({
      currentStreak: 5,
      longestStreak: 5,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-10T00:00:00Z')),
    });
  });

  it('resets currentStreak to 1 after a gap of exactly 2 days', () => {
    const result = computeStreakOnActivity(utcDate('2026-01-08T09:00:00Z'), {
      currentStreak: 5,
      longestStreak: 5,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-06T00:00:00Z')),
    });

    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 5,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-08T00:00:00Z')),
    });
  });

  it('resets currentStreak to 1 after a larger gap, preserving longestStreak', () => {
    const result = computeStreakOnActivity(utcDate('2026-02-01T09:00:00Z'), {
      currentStreak: 5,
      longestStreak: 5,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-06T00:00:00Z')),
    });

    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 5,
      lastActiveDate: toUtcDateOnly(utcDate('2026-02-01T00:00:00Z')),
    });
  });

  it('defends against an inconsistent row (lastActiveDate set, longestStreak 0) on reset', () => {
    // This function's own transitions never produce this combination — it
    // would only arise from a row edited outside recordActivity (e.g. by
    // hand during testing/ops). Documents that the reset branch still
    // produces a sane longestStreak >= currentStreak rather than 0.
    const result = computeStreakOnActivity(utcDate('2026-02-01T09:00:00Z'), {
      currentStreak: 5,
      longestStreak: 0,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-06T00:00:00Z')),
    });

    expect(result).toEqual({
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: toUtcDateOnly(utcDate('2026-02-01T00:00:00Z')),
    });
  });

  it('treats activity just after UTC midnight as the next calendar day', () => {
    const result = computeStreakOnActivity(utcDate('2026-01-06T00:01:00Z'), {
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-05T23:59:00Z')),
    });

    expect(result).toEqual({
      currentStreak: 2,
      longestStreak: 2,
      lastActiveDate: toUtcDateOnly(utcDate('2026-01-06T00:00:00Z')),
    });
  });
});

describe('toUtcDateOnly', () => {
  it('truncates a timestamp to its UTC calendar date at midnight', () => {
    expect(toUtcDateOnly(utcDate('2026-03-15T23:59:59Z'))).toEqual(
      new Date('2026-03-15T00:00:00.000Z'),
    );
  });
});
