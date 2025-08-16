import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Debug logging (remove in production)
  console.log(`Middleware: ${request.nextUrl.pathname}, User: ${user ? 'authenticated' : 'not authenticated'}`);

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/expenses', '/categories', '/gamification', '/quick-expenses'];
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  
  console.log(`Is protected route: ${isProtectedRoute}, Path: ${request.nextUrl.pathname}`);
  
  // Redirect unauthenticated users to login
  if (isProtectedRoute && !user) {
    console.log(`Redirecting to login from ${request.nextUrl.pathname}`);
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    // Store the original URL to redirect back after login
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    const url = request.nextUrl.clone();
    // Check if there's a redirectTo parameter to use instead of default dashboard
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    url.pathname = redirectTo && protectedRoutes.some(route => redirectTo.startsWith(route)) ? redirectTo : '/dashboard';
    url.search = ''; // Clear search params
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}