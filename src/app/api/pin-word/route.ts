import { NextRequest, NextResponse } from 'next/server';
import wordModel from '../../core/models/db/word.model';
import { WordsRequest } from '../../core/models/backend/words-request.interface';
import initMiroAPI from '../../../utils/initMiroAPI';

export async function PATCH( req: NextRequest ) {
    const { userId: currentUserId, accessToken } = initMiroAPI();

    if ( !currentUserId?.trim()  ) {
        return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
    } else if ( !accessToken?.trim() ) {
        return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
    }

    const res = await fetch( 'https://api.miro.com/v1/oauth-token', {
        headers: {
            Authorization: `Bearer ${ accessToken.trim() }`,
        },
    } );

    const verifyAccessTokenResponse = await res.json();

    if ( !verifyAccessTokenResponse ) {
        return NextResponse.json( { msg: 'Cannot verify access token' }, { status: 500 } );
    }

    if ( verifyAccessTokenResponse.user.id !== currentUserId ) {
        return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
    }

    const body = await req.json();
    await wordModel.updateOne( { _id: body.wordId }, { $set: { pinned: body.pinned } } ).exec();
    return NextResponse.json( { data: body.wordId } as WordsRequest );
}