import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if it's an admin route (handle optional locale prefix)
    const isAdminRoute = pathname.startsWith('/admin') ||
        routing.locales.some(locale => pathname.startsWith(`/${locale}/admin`));

    if (isAdminRoute) {
        // Allow public access to login page
        const isLoginPage = pathname === '/admin/login' ||
            routing.locales.some(locale => pathname === `/${locale}/admin/login`);

        if (isLoginPage) {
            return NextResponse.next();
        }

        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.error('[Middleware] Missing Supabase environment variables');
        }

        const supabase = createServerClient(
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
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        // 1. Check Auth Session
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }

        // 2. Role Check (Optimized)
        // Check Metadata first (Fast, no DB call, no recursion)
        const metadataRole = user.user_metadata?.role;
        const allowedRoles = ['admin', 'super_admin'];

        if (metadataRole && allowedRoles.includes(metadataRole)) {
            // Authorized via Metadata
            return response;
        }

        if (metadataRole && !allowedRoles.includes(metadataRole)) {
            // Unauthorized via Metadata
            console.warn(`[Middleware] Access Denied (Metadata): ${user.email} is ${metadataRole}`);
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }

        // 3. DB Fallback (Only if metadata is missing/stale)
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || !allowedRoles.includes(profile.role)) {
            console.warn(`[Middleware] Access Denied (DB): ${user.email} is ${profile?.role || 'None'}`);
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }

        return response;
    }

    // Standard next-intl processing for other routes
    const response = handleI18nRouting(request);

    try {
        // Create a Supabase client configured to use cookies (for session refreshing on localized pages)
        const supabase = createServerClient(
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
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        // Refresh session if expired
        await supabase.auth.getUser();
    } catch (err) {
        console.error('[Middleware] Global session refresh error:', err);
        // On network error, just return the i18n response and let the page handle it
        return response;
    }

    return response;
}

export const config = {
    // Match only internationalized pathnames
    // Skip internal paths and static files
    // EXCLUDE /admin from this matcher so next-intl doesn't try to localize it
    matcher: ['/', '/(en|fr|es|nl)/:path*', '/((?!_next|_vercel|admin|auth|.*\\..*).*)', '/admin/:path*']
};
