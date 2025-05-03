import { NextResponse } from 'next/server';
import wordModel from '../../core/models/db/word.model';
import { WordsRequest } from '../../core/models/backend/words-request.interface';
import { withAuth } from '../../lib/withAuth';

async function PATCH( req: any ) {
    const body = await req.json();
    await wordModel.updateOne( { _id: body.wordId }, { $set: { pinned: body.pinned } } ).exec();
    return NextResponse.json( { data: body.wordId } as WordsRequest );
}

const PATHHandler = withAuth( PATCH );
export { PATHHandler as PATCH };