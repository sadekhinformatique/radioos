// Security headers for the application
import { NextResponse } from 'next/server';

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  media-src 'self' https://* blob:;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`;

export function getSecurityHeaders(request?: Request): Record<string, string> {
  const headers: Record<string, string> = {
    // Content Security Policy
    'Content-Security-Policy': ContentSecurityPolicy.replace(/\n/g, ' '),

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions policy
    'Permissions-Policy': 'camera=(), microphone=(self), geolocation=(), payment=()',

    // Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };

  // Add CORS headers for API routes
  if (request?.url?.includes('/api/')) {
    headers['Access-Control-Allow-Origin'] = process.env.NEXT_PUBLIC_APP_URL || '*';
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    headers['Access-Control-Max-Age'] = '86400';
  }

  return headers;
}

// Apply security headers to response
export function applySecurityHeaders(
  response: NextResponse,
  request?: Request
): NextResponse {
  const headers = getSecurityHeaders(request);
  
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }

  return response;
}
