import { NextResponse } from 'next/server';
import usersModel from '../../core/models/db/users.model';
import topicModel from './../../core/models/db/topic.model';
import { withAuth } from '../../lib/withAuth';

async function GET( req: any ) {
    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get( 'studentId' );

    const user = await usersModel
        .findOne( { _id: studentId } ).populate( { path: 'topics', model: topicModel } ).exec();

    return NextResponse.json( { data: user ? user.topics : [] } );
}

const GETHandler = withAuth( GET );
export { GETHandler as GET };

async function DELETE( req: any ) {
    const searchParams = req.nextUrl.searchParams;
    const topicId = searchParams.get( 'id' );

    await topicModel.findOneAndDelete( { _id: topicId } ).exec();

    return NextResponse.json( { data: topicId } );
}

const DELETEHandler = withAuth( DELETE );
export { DELETEHandler as DELETE };