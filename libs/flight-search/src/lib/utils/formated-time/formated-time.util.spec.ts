import { formatDuration } from './formated-time.util';

describe('formatDuration', () => {
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  it('should return "0m" for zero or negative values', () => {
    expect(formatDuration(0)).toBe('0м');
    expect(formatDuration(-5000)).toBe('0м');
  });

  it('should format minutes only correctly', () => {
    expect(formatDuration(15 * MINUTE)).toBe('15м');
    expect(formatDuration(59 * MINUTE)).toBe('59м');
  });

  it('should format hours and minutes correctly', () => {
    expect(formatDuration(1 * HOUR + 30 * MINUTE)).toBe('1ч 30м');
    expect(formatDuration(5 * HOUR)).toBe('5ч');
  });

  it('should include "0h" if days are present but there are no full hours', () => {
    expect(formatDuration(1 * DAY + 5 * MINUTE)).toBe('1д 0ч 5м');
  });

  it('should correctly format days, hours, and minutes', () => {
    const complexTime = 2 * DAY + 3 * HOUR + 45 * MINUTE;
    expect(formatDuration(complexTime)).toBe('2д 3ч 45м');
  });

  it('should handle exactly 24 hours correctly', () => {
    expect(formatDuration(24 * HOUR)).toBe('1д 0ч');
  });

  it('should format very long durations (multiple days)', () => {
    expect(formatDuration(3 * DAY + 12 * HOUR)).toBe('3д 12ч');
  });
});
