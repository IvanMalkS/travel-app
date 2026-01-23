import { formatDuration } from './formated-time.util';

describe('formatDuration', () => {
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  it('should return "0m" for zero or negative values', () => {
    expect(formatDuration(0)).toBe('0m');
    expect(formatDuration(-5000)).toBe('0m');
  });

  it('should format minutes only correctly', () => {
    expect(formatDuration(15 * MINUTE)).toBe('15m');
    expect(formatDuration(59 * MINUTE)).toBe('59m');
  });

  it('should format hours and minutes correctly', () => {
    expect(formatDuration(1 * HOUR + 30 * MINUTE)).toBe('1h 30m');
    expect(formatDuration(5 * HOUR)).toBe('5h');
  });

  it('should include "0h" if days are present but there are no full hours', () => {
    expect(formatDuration(1 * DAY + 5 * MINUTE)).toBe('1d 0h 5m');
  });

  it('should correctly format days, hours, and minutes', () => {
    const complexTime = 2 * DAY + 3 * HOUR + 45 * MINUTE;
    expect(formatDuration(complexTime)).toBe('2d 3h 45m');
  });

  it('should handle exactly 24 hours correctly', () => {
    expect(formatDuration(24 * HOUR)).toBe('1d 0h');
  });

  it('should format very long durations (multiple days)', () => {
    expect(formatDuration(3 * DAY + 12 * HOUR)).toBe('3d 12h');
  });
});
