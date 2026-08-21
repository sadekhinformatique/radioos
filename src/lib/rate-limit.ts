// Simple in-memory rate limiter
// In production, use Redis (Upstash, etc.)

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000);

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
  message?: string;  // Error message
}

// Default rate limits
export const rateLimitConfigs = {
  // Auth endpoints - stricter
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,                    // 5 attempts
    message: 'Trop de tentatives. Réessayez dans 15 minutes.',
  },
  // API endpoints - moderate
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 60,             // 60 requests per minute
    message: 'Limite de requêtes atteinte.',
  },
  // Streaming endpoints - more lenient
  streaming: {
    windowMs: 60 * 1000, // 1 minute
    max: 120,            // 120 requests per minute
    message: 'Limite de requêtes streaming atteinte.',
  },
  // Public endpoints - moderate
  public: {
    windowMs: 60 * 1000, // 1 minute
    max: 30,             // 30 requests per minute
    message: 'Limite de requêtes atteinte.',
  },
};

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.max - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (entry.count >= config.max) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    remaining: config.max - entry.count,
    resetTime: entry.resetTime,
  };
}

// Get client IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

// Rate limit middleware helper
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): { success: boolean; headers: Record<string, string> } {
  const ip = getClientIp(request);
  const result = rateLimit(ip, config);

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(config.max),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
  };

  if (!result.success) {
    headers['Retry-After'] = String(Math.ceil((result.resetTime - Date.now()) / 1000));
  }

  return { success: result.success, headers };
}
