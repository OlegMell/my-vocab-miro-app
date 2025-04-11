import { NextRequest, NextResponse } from 'next/server';
import wordModel from '../../core/models/db/word.model';
import { WordsRequest } from '../../core/models/backend/words-request.interface';
import initMiroAPI from '../../../utils/initMiroAPI';
import usersModel from '../../core/models/db/users.model';
import mongoose from 'mongoose';

export async function GET( req: NextRequest ) {

    const { userId: currentUserId, accessToken, miro } = initMiroAPI();

    console.log( { currentUserId } );
    console.log( { accessToken } );

    console.log( 'isAuthorized', await miro.isAuthorized( currentUserId ) );

    // USER VERIFICATION ------------------------------------------------------

    if ( !currentUserId?.trim() ) {
        return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
    } else if ( !accessToken?.trim() ) {
        return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
    }

    const miroApi = miro.as( currentUserId );

    try {
        const verifyAccessTokenResponse = await miroApi.tokenInfo();

        console.log( { verifyAccessTokenResponse } );

        if ( verifyAccessTokenResponse.user.id !== currentUserId ) {
            return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
        }
    } catch ( err: any ) {
        return NextResponse.json( err.body, { status: err.statusCode } );
    }

    // END USER VERIFICATION ------------------------------------------

    const searchParams = req.nextUrl.searchParams;
    const topicId = searchParams.get( 'topicId' );
    const userId = searchParams.get( 'userId' );

    if ( !userId ) {
        const { userId: currentUserId } = initMiroAPI();
        const user = await usersModel.findOne( { userId: currentUserId } ).exec();

        const words = await wordModel.find( {
            topicId: new mongoose.mongo.ObjectId( topicId! ),
            userId: user._id
        } ).exec();

        return NextResponse.json( { data: words || [] } as WordsRequest );
    } else {
        const words = await wordModel.find( {
            topicId: new mongoose.Types.ObjectId( `${ topicId! }` ),
            userId: new mongoose.Types.ObjectId( `${ userId! }` )
        } ).exec();
        return NextResponse.json( { data: words || [] } as WordsRequest );
    }
}

export async function DELETE( req: NextRequest ) {

    const { userId: currentUserId, accessToken, miro } = initMiroAPI();

    // USER VERIFICATION ------------------------------------------------------

    if ( !currentUserId?.trim() ) {
        return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
    } else if ( !accessToken?.trim() ) {
        return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
    }

    const miroApi = miro.as( currentUserId );

    try {
        const verifyAccessTokenResponse = await miroApi.tokenInfo();

        if ( verifyAccessTokenResponse.user.id !== currentUserId ) {
            return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
        }
    } catch ( err: any ) {
        return NextResponse.json( err.body, { status: err.statusCode } );
    }

    // END USER VERIFICATION ------------------------------------------

    const searchParams = req.nextUrl.searchParams;
    const wordId = searchParams.get( 'id' );

    const word = await wordModel.findOne( { _id: wordId } ).exec();

    const uid = await initMiroAPI().userId;

    const user = await usersModel.findOne( { _id: word.userId } ).exec();

    if ( !user ) {
        return NextResponse.json( { message: 'User is not found' }, { status: 404 } );
    }

    if ( user.userId !== uid ) {
        return NextResponse.json( { message: 'provided word id is not connected to current user!' }, { status: 240 } );
    }

    await wordModel.deleteOne( { _id: wordId } ).exec();

    return NextResponse.json( { data: wordId } );
}

/**
 * Add new word
 */
export async function POST( req: NextRequest ) {
    const { userId: currentUserId, accessToken, miro } = initMiroAPI();

    // USER VERIFICATION ------------------------------------------------------

    if ( !currentUserId?.trim() ) {
        return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
    } else if ( !accessToken?.trim() ) {
        return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
    }

    const miroApi = miro.as( currentUserId );

    try {
        const verifyAccessTokenResponse = await miroApi.tokenInfo();

        if ( verifyAccessTokenResponse.user.id !== currentUserId ) {
            return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
        }
    } catch ( err: any ) {
        return NextResponse.json( err.body, { status: err.statusCode } );
    }

    // END USER VERIFICATION ------------------------------------------

    const { word } = await req.json();

    const user = await usersModel.findOne( { _id: word.userId } ).exec();

    if ( !user ) {
        return NextResponse.json( { message: 'User is not found' }, { status: 404 } );
    }

    if ( await initMiroAPI().userId && await initMiroAPI().userId !== user.userId ) {
        return NextResponse.json( { message: 'provided user id is not equal to current user!' }, { status: 240 } );
    }

    const createdWord = new wordModel( {
        word: word.word,
        translation: word.translation,
        level: word.level,
        lang: word.lang,
        date: new Date().getDate(),
        pinned: word.pinned,
        marked: word.marked,
        userId: new mongoose.Types.ObjectId( `${ word.userId! }` ),
        topicId: new mongoose.Types.ObjectId( `${ word.topicId! }` ),
    } );

    await createdWord.save();

    return NextResponse.json( { data: createdWord } );
}
