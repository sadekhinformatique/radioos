import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: ServiceStatus;
    storage: ServiceStatus;
    auth: ServiceStatus;
  };
  uptime: number;
}

interface ServiceStatus {
  status: 'up' | 'down' | 'degraded';
  latencyMs?: number;
  error?: string;
}

const startTime = Date.now();

export async function GET() {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    services: {
      database: { status: 'up' },
      storage: { status: 'up' },
      auth: { status: 'up' },
    },
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };

  try {
    // Check database
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const dbStart = Date.now();
    const { error: dbError } = await supabase.from('radios').select('id').limit(1);
    health.services.database.latencyMs = Date.now() - dbStart;
    
    if (dbError) {
      health.services.database.status = 'down';
      health.services.database.error = dbError.message;
    }

    // Check auth
    const authStart = Date.now();
    const { error: authError } = await supabase.auth.getSession();
    health.services.auth.latencyMs = Date.now() - authStart;
    
    if (authError) {
      health.services.auth.status = 'down';
      health.services.auth.error = authError.message;
    }

    // Determine overall status
    const services = Object.values(health.services);
    if (services.some(s => s.status === 'down')) {
      health.status = 'unhealthy';
    } else if (services.some(s => s.status === 'degraded')) {
      health.status = 'degraded';
    }

  } catch (error) {
    health.status = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : 
                     health.status === 'degraded' ? 200 : 503;

  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  });
}
