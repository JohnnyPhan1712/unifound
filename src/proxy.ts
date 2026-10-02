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
  const { pathname, search } = request.nextUrl;
  const isProtected = PROTECTED.some((re) => re.test(pathname));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    if (isProtected) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          if (headers) {
            Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
          }
        },
      },
    });

    // Không chèn code giữa createServerClient và getClaims (theo hướng dẫn Supabase SSR).
    const { data } = await supabase.auth.getClaims();

    if (!data?.claims && isProtected) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(redirectUrl);
    }
  } catch (err) {
    console.error("[Proxy Middleware Error]:", err);
    if (isProtected) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
