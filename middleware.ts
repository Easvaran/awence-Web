import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user as any;
  const userRole = user?.role;

  console.log(`Middleware - Path: ${nextUrl.pathname}, LoggedIn: ${isLoggedIn}, Role: ${userRole}`);

  const isOnAdmin = nextUrl.pathname.startsWith("/admin");
  const isOnEmployee = nextUrl.pathname.startsWith("/employee");
  const isLoginPage = nextUrl.pathname === "/login";
  const isSignupPage = nextUrl.pathname === "/signup";

  if (nextUrl.pathname === "/employee portal") {
    return NextResponse.redirect(new URL("/employee/dashboard", nextUrl));
  }

  if (nextUrl.pathname === "/") {
    if (isLoggedIn) {
      const dashboard = userRole === "admin" ? "/admin" : "/employee/dashboard";
      console.log(`Middleware - Root redirect to ${dashboard}`);
      return NextResponse.redirect(new URL(dashboard, nextUrl));
    }
    return NextResponse.next();
  }

  if (isOnAdmin) {
    if (isLoggedIn && userRole === "admin") return NextResponse.next();
    console.log("Middleware - Admin access denied, redirecting to login");
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isOnEmployee) {
    if (isLoggedIn && (userRole === "employee" || userRole === "admin")) return NextResponse.next();
    console.log("Middleware - Employee portal access denied, redirecting to login");
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if ((isLoginPage || isSignupPage) && isLoggedIn) {
    const dashboard = userRole === "admin" ? "/admin" : "/employee/dashboard";
    console.log(`Middleware - Login/Signup redirect to ${dashboard}`);
    return NextResponse.redirect(new URL(dashboard, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/admin/:path*", "/employee/:path*", "/login", "/signup", "/employee portal"],
};
