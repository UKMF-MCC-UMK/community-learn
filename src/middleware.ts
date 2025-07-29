import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Jika path adalah root (/)
  if (pathname === '/') {
    const token = await getToken({ req: request });
    
    // Jika user sudah login, redirect ke dashboard
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // Jika user belum login, redirect ke login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Konfigurasi path yang akan diproses oleh middleware
export const config = {
  matcher: ['/', '/login', '/signup', "/dashboard/:path*", "/profile/:path*"],
};
