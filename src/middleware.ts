import { NextResponse } from 'next/server';

export default function middleware() {
    const response = NextResponse.next();

    response.headers.set( 'Cache-Control', 'no-cache, no-store' );
    response.headers.set( 'Referrer-Policy', 'strict-origin-when-cross-origin' );
    response.headers.set( 'Permissions-Policy', 'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()' );
    response.headers.set( 'Content-Security-Policy', `frame-ancestors https://miro.com` );
    response.headers.set( 'X-Content-Type-Options', 'nosniff' );
    response.headers.set( 'X-XSS-Protection', '1; mode=block' );

    return response;
}