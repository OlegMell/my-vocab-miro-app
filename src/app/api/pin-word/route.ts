import { NextRequest, NextResponse } from 'next/server';
import wordModel from '../../core/models/db/word.model';
import { WordsRequest } from '../../core/models/backend/words-request.interface';

export async function PATCH( req: NextRequest ) {
    const body = await req.json();
    const r = await wordModel.updateOne( { _id: body.wordId }, { $set: { pinned: body.pinned } } ).exec();
    return NextResponse.json( { data: body.wordId } as WordsRequest );
}