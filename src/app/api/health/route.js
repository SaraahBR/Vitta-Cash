//
// Rota de health check

import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json(healthCheck);
}
