import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Check auth condition
  if (!session) {
    // If not logged in and trying to access protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/students') ||
        request.nextUrl.pathname.startsWith('/exercises') ||
        request.nextUrl.pathname.startsWith('/workouts') ||
        request.nextUrl.pathname.startsWith('/routines')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    // Get user role
    const role = session.user.user_metadata.role;

    // If logged in and trying to access auth pages
    if (request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Role-based access control
    if (role === 'student') {
      // Students can only access their workouts and profile
      if (request.nextUrl.pathname.startsWith('/students') ||
          request.nextUrl.pathname.startsWith('/exercises/create') ||
          request.nextUrl.pathname.startsWith('/exercises/edit') ||
          request.nextUrl.pathname.startsWith('/workouts/create')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};