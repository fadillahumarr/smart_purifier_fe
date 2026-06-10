import { NextResponse, NextRequest } from "next/server";
import routes from "@/app/lib/routes";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const pathname = request.nextUrl.pathname;

    const isAuthPage = pathname === routes.login || pathname === routes.signup;

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL(routes.purifiers, request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL(routes.purifiers, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/monitoring/:path*", "/login", "/signup"],
};