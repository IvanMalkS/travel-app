import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform milliseconds to formatted string', () => {
    const oneHourThirtyMins = 1 * 60 * 60 * 1000 + 30 * 60 * 1000;
    expect(pipe.transform(oneHourThirtyMins)).toBe('1ч 30м');
  });

  it('should handle zero value', () => {
    expect(pipe.transform(0)).toBe('0м');
  });
});
