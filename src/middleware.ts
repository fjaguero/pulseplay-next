import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a placeholder for Clerk authentication middleware
// Will be implemented in Phase 2
export function middleware(request: NextRequest) {
  // For now, this is a placeholder that doesn't restrict access
  // In Phase 2, this will be replaced with Clerk authentication
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Protected routes that will require authentication
    '/(dashboard)/:path*',
  ],
}; 