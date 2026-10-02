import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authUrl } from "@/lib/auth/auth-url";

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
  // Khách vào trang cần đăng nhập: về bảng tin với popup đăng nhập, đăng nhập xong quay lại đúng trang.
  const toLogin = () => NextResponse.redirect(new URL(authUrl("login", { next: pathname + search }), request.url));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (isProtected) {
      return toLogin();
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
      return toLogin();
    }
  } catch (err) {
    console.error("[Proxy Middleware Error]:", err);
    if (isProtected) {
      return toLogin();
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
