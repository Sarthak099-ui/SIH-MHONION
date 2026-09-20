import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const res = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check demo cookie fallback for seamless local prototyping
  const demoRole = request.cookies.get('sih_demo_role')?.value;

  let userRole = demoRole || null;
  let isAuthenticated = !!demoRole;

  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          },
        },
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        isAuthenticated = true;
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (profile?.role) {
          userRole = profile.role;
        }
      }
    } catch {
      // Fallback to demo role if Supabase is offline/unreachable
    }
  }

  // Protected route matching
  const isFarmerRoute = pathname.startsWith('/farmer');
  const isGraderRoute = pathname.startsWith('/grader');
  const isBuyerRoute = pathname.startsWith('/buyer');
  const isAdminRoute = pathname.startsWith('/admin');

  const isProtectedRoute = isFarmerRoute || isGraderRoute || isBuyerRoute || isAdminRoute;

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role Enforcement
    if (isAdminRoute && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    if (isFarmerRoute && userRole !== 'farmer' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    if (isGraderRoute && userRole !== 'grader' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
    if (isBuyerRoute && userRole !== 'buyer' && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/farmer/:path*',
    '/grader/:path*',
    '/buyer/:path*',
    '/admin/:path*',
  ],
};
