import { NextRequest, NextResponse } from 'next/server';
import wordModel from '../../core/models/db/word.model';
import { WordsRequest } from '../../core/models/backend/words-request.interface';
import initMiroAPI from '../../../utils/initMiroAPI';

export async function PATCH( req: NextRequest ) {
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

    const body = await req.json();
    await wordModel.updateOne( { _id: body.wordId }, { $set: { pinned: body.pinned } } ).exec();
    return NextResponse.json( { data: body.wordId } as WordsRequest );
}
