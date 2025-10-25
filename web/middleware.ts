import { NextResponse } from 'next/server'

function isAuthenticated(req: Request) {
  const cookies = req.headers.get('cookie') || ''
  return cookies.includes('better-auth.session-token')
}

export function middleware(req: Request) {
  const url = new URL(req.url)

  if (!isAuthenticated(req) && url.pathname !== '/auth/sign-in') {
    url.pathname = '/auth/sign-in'
    return NextResponse.redirect(url)
  }

  if (isAuthenticated(req) && url.pathname === '/auth/sign-in') {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
