import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect target
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && session?.user) {
            const userId = session.user.id;
            // Get locale from params, or try to infer, default to 'en'
            const locale = searchParams.get('locale') || 'en';

            const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development';

            // Construct the dashboard URL
            const dashboardPath = `/${locale}/account/${userId}/dashboard`;

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${dashboardPath}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${dashboardPath}`);
            } else {
                return NextResponse.redirect(`${origin}${dashboardPath}`);
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
