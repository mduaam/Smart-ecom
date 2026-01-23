import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // Check if it's an admin route first
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow public access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        let response = NextResponse.next({
            request: {
                headers: request.headers,
            },
        });

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

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }

        return response;
    }

    // Standard next-intl processing for other routes
    const response = handleI18nRouting(request);

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

    return response;
}

export const config = {
    // Match only internationalized pathnames
    // Skip internal paths and static files
    // EXCLUDE /admin from this matcher so next-intl doesn't try to localize it
    matcher: ['/', '/(en|fr|es|nl)/:path*', '/((?!_next|_vercel|admin|auth|.*\\..*).*)', '/admin/:path*']
};
