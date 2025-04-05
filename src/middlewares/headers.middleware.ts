import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { MiddlewareFactory } from './stackHandler';

export const withUser: MiddlewareFactory = ( next ) => {
    return async ( request: NextRequest, _next: NextFetchEvent ) => {
        // Store the response so we can modify its headers
        const response = NextResponse.next();

        // Set custom header
        response.headers.set( 'Cache-Control', 'no-cache, no-store' );
        response.headers.set( 'Referrer-Policy', 'strict-origin-when-cross-origin' );
        response.headers.set( 'Permissions-Policy', 'geolocation=(), camera=(), microphone=(), fullscreen=()' );
        // response.headers.set( 'content-security-policy', `default-src 'unsafe-inline' 'unsafe-eval' data: blob: filesystem: about: miroapp: wss: ws: *; frame-src 'unsafe-inline' 'unsafe-eval' data: blob: miroapp: *; base-uri 'unsafe-inline' about: data: *; form-action 'unsafe-inline'` );
        response.headers.set( 'X-Content-Type-Options', 'nosniff' );
        response.headers.set( 'x-xss-protection', '1; mode=block' );

        // Return response
        return next( request, _next );
    };
};