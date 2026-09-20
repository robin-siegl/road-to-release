import { describe, expect, it } from 'vitest';
import { GameClock } from './GameClock';

describe('GameClock', () => {
  it('returns frame deltas in seconds', () => {
    const clock = new GameClock();
    expect(clock.getDelta(1_000)).toBe(0);
    expect(clock.getDelta(1_016)).toBeCloseTo(0.016);
  });

  it('caps large gaps after a suspended tab', () => {
    const clock = new GameClock();
    clock.getDelta(1_000);
    expect(clock.getDelta(10_000)).toBe(0.1);
  });
});
