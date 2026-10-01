import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Trang cần đăng nhập. Trang vẫn tự kiểm tra lại phía server (requireUser).
const PROTECTED = [
  /^\/profile/,
  /^\/reports\/new/,
  /^\/reports\/[^/]+\/(edit|claim)/,
  /^\/my/,
  /^\/claims/,
  /^\/matches/,
  /^\/notifications/,
  /^\/admin/,
];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    }
  );

  // Không chèn code giữa createServerClient và getClaims (theo hướng dẫn Supabase SSR).
  const { data } = await supabase.auth.getClaims();

  const { pathname, search } = request.nextUrl;
  if (!data?.claims && PROTECTED.some((re) => re.test(pathname))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
