import { NextResponse } from 'next/server';

export default function middleware() {
    // Store the response so we can modify its headers
    const response = NextResponse.next();

    // Set custom header
    response.headers.set( 'Cache-Control', 'no-cache, no-store' );
    response.headers.set( 'Referrer-Policy', 'strict-origin-when-cross-origin' );
    response.headers.set( 'content-security-policy', `default-src 'unsafe-inline' 'unsafe-eval' data: blob: filesystem: about: miroapp: wss: ws: *; frame-src 'unsafe-inline' 'unsafe-eval' data: blob: miroapp: *; base-uri 'unsafe-inline' about: data: *; form-action 'unsafe-inline'` );
    response.headers.set( 'X-Content-Type-Options', 'nosniff' );
    response.headers.set( 'X-Frame-Options', 'SAMEORIGIN' );
    response.headers.set( 'x-xss-protection', '1; mode=block' );

    // Return response
    return response;
}