import type { Clock } from '@shared/core/domain/clock';

export const systemClock: Clock = { now: () => new Date() };
