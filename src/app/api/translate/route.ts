import translate from '@iamtraction/google-translate';
import { NextRequest, NextResponse } from 'next/server';

import { TranslateRequest } from '../../core/models/backend/translate-request.interface';
import initMiroAPI from '../../../utils/initMiroAPI';

export async function POST( req: NextRequest ) {
    const { userId: currentUserId, accessToken } = initMiroAPI();

    if ( !currentUserId?.trim() ) {
        return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
    } else if ( !accessToken?.trim() ) {
        return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
    }

    const res1 = await fetch( 'https://api.miro.com/v1/oauth-token', {
        headers: {
            Authorization: `Bearer ${ accessToken.trim() }`,
        },
    } );

    const verifyAccessTokenResponse = await res1.json();

    if ( !verifyAccessTokenResponse ) {
        return NextResponse.json( { msg: 'Cannot verify access token' }, { status: 500 } );
    }

    if ( verifyAccessTokenResponse.user.id !== currentUserId ) {
        return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
    }

    const query: TranslateRequest = await req.json();
    const res = await translate( query.text, { to: query.to, from: query.from || '', raw: true } );
    return NextResponse.json( { translated: res.text, raw: res.raw } );
}