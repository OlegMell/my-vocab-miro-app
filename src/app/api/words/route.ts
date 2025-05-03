import { NextResponse } from 'next/server';
import wordModel from '../../core/models/db/word.model';
import { WordsRequest } from '../../core/models/backend/words-request.interface';
import initMiroAPI from '../../../utils/initMiroAPI';
import usersModel from '../../core/models/db/users.model';
import mongoose from 'mongoose';
import { withAuth } from '../../lib/withAuth';

async function GET( req: any ) {

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

const GETHandler = withAuth( GET );
export { GETHandler as GET };

async function DELETE( req: any ) {

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

const DELETEHandler = withAuth( DELETE );
export { DELETEHandler as DELETE };

/**
 * Add new word
 */
async function POST( req: any ) {

    const { word } = await req.json();

    const user = await usersModel.findOne( { _id: word.userId } ).exec();

    if ( !user ) {
        return NextResponse.json( { message: 'User is not found' }, { status: 404 } );
    }

    if ( await initMiroAPI().userId && await initMiroAPI().userId !== user.userId ) {
        return NextResponse
            .json(
                { message: 'provided user id is not equal to current user!' },
                { status: 240 }
            );
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

const POSTHandler = withAuth( POST );
export { POSTHandler as POST };