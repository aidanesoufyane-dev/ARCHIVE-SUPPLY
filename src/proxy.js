import { NextResponse } from "next/server";

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const adminPath = process.env.ADMIN_PATH || "/studio-control";
  const token = request.cookies.get("archive_admin_session")?.value;
  const authorized = Boolean(process.env.ADMIN_SESSION_TOKEN) && token === process.env.ADMIN_SESSION_TOKEN;

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (pathname === adminPath || pathname.startsWith(`${adminPath}/`)) {
    if (pathname === `${adminPath}/login`) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/login";
      return NextResponse.rewrite(url);
    }
    if (!authorized) return NextResponse.redirect(new URL(`${adminPath}/login`, request.url));
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(adminPath, "/dashboard") || "/dashboard";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
