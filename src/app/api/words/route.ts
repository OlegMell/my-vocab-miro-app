import { NextRequest, NextResponse } from 'next/server';
import TopicModel from './../../core/models/db/topic.model';
import wordModel from '../../core/models/db/word.model';
import { WordsRequest } from '../../core/models/backend/words-request.interface';
import initMiroAPI from '../../../utils/initMiroAPI';
import usersModel from '../../core/models/db/users.model';
import mongoose from 'mongoose';

export async function GET( req: NextRequest ) {
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
    const searchParams = req.nextUrl.searchParams;
    const wordId = searchParams.get( 'id' );

    const word = await wordModel.findOneAndDelete( { _id: wordId } ).exec();

    return NextResponse.json( { data: wordId } );
}

/**
 * Add new word
 */
export async function POST( req: NextRequest ) {
    const { word } = await req.json();

    console.log( word );

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

    // await TopicModel.updateOne( { _id: word.topic }, { $push: { words: createdWord._id } } ).exec();

    return NextResponse.json( { data: createdWord } );
}