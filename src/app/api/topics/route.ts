import { NextRequest, NextResponse } from 'next/server';
import usersModel from '../../core/models/db/users.model';
import topicModel from './../../core/models/db/topic.model';

export async function GET( req: NextRequest ) {
    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get( 'studentId' );

    const user = await usersModel
        .findOne( { _id: studentId } ).populate( { path: 'topics', model: topicModel } ).exec();

    return NextResponse.json( { data: user ? user.topics : [] } );
}

export async function DELETE( req: NextRequest ) {
    const searchParams = req.nextUrl.searchParams;
    const topicId = searchParams.get( 'id' );

    const topic = await topicModel.findOneAndDelete( { _id: topicId } ).exec();

    console.log( topic )

    return NextResponse.json( { data: topicId } );
}