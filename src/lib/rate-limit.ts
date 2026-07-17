const tracker = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(ip: string, limit = 15, windowMs = 60 * 1000): RateLimitResult {
  const now = Date.now();
  const userRecord = tracker.get(ip);

  // If no record or window elapsed, reset
  if (!userRecord || now > userRecord.resetTime) {
    const record = { count: 1, resetTime: now + windowMs };
    tracker.set(ip, record);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: record.resetTime,
    };
  }

  userRecord.count += 1;
  const remaining = Math.max(0, limit - userRecord.count);

  if (userRecord.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: userRecord.resetTime,
    };
  }

  return {
    success: true,
    limit,
    remaining,
    reset: userRecord.resetTime,
  };
}
