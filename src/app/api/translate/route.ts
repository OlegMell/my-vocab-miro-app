import translate from '@iamtraction/google-translate';
import { NextRequest, NextResponse } from 'next/server';

import { TranslateRequest } from '../../core/models/backend/translate-request.interface';
import initMiroAPI from '../../../utils/initMiroAPI';

export async function POST( req: NextRequest ) {
    const { userId: currentUserId, accessToken, miro } = initMiroAPI();

    // USER VERIFICATION ------------------------------------------------------

    if (!currentUserId?.trim()) {
        return NextResponse.json({ msg: 'no user id set in cookie' }, { status: 401 });
    } else if (!accessToken?.trim()) {
        return NextResponse.json({ msg: 'no access token set in cookie' }, { status: 401 });
    }

    const miroApi = miro.as(currentUserId);

    try {
        const verifyAccessTokenResponse = await miroApi.tokenInfo();

        if (verifyAccessTokenResponse.user.id !== currentUserId) {
            return NextResponse.json({ msg: 'Access token did not pass the verification' }, { status: 401 });
        }
    } catch (err: any) {
        return NextResponse.json(err.body, { status: err.statusCode });
    }

    // END USER VERIFICATION ------------------------------------------

    const query: TranslateRequest = await req.json();
    const res = await translate( query.text, { to: query.to, from: query.from || '', raw: true } );
    return NextResponse.json( { translated: res.text, raw: res.raw } );
}
