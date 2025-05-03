import { NextResponse } from 'next/server';

import usersModel from '../../core/models/db/users.model';
import { User } from '../../core/models/user.inteface';
import topicModel from '../../core/models/db/topic.model';
import { withAuth } from '../../lib/withAuth';

async function GET( req: any ) {

    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get( 'email' );
    const userId = searchParams.get( 'userId' );

    let user;
    if ( email ) {
        user = await usersModel.findOne( { email } ).exec();
    } else if ( userId ) {
        user = await usersModel.findOne( { userId } ).populate( 'topics' ).exec();
    }

    return NextResponse.json( { data: user } );
}

const GETHandler = withAuth( GET );
export { GETHandler as GET };


/**
 * Add new user
 */
async function POST( req: any ) {

    const user: Partial<User> = await req.json();

    const foundUser = await usersModel.findOne( { email: user.email } ).exec();

    if ( foundUser ) {
        return NextResponse.json( {
            message: 'failed',
            error: 'User with such email already exists'
        }, { status: 400 } );
    } else {
        const topics = await topicModel.find().exec();

        const createdUser = new usersModel( user );
        createdUser.topics.push( ...topics );
        await createdUser.save();

        return NextResponse.json( { data: createdUser } );
    }

}

const POSTHandler = withAuth( POST );
export { POSTHandler as POST };


/**
 * Patch user
 */
async function PATCH( req: any, res: any, userId?: any ) {

    const studentId: { id: string } = await req.json();

    const user = await usersModel.findOne( { userId } );
    user.students.push( studentId.id );
    await user.save();

    return NextResponse.json( { data: user, message: 'success' } );
}

const PATCHHandler = withAuth( PATCH );
export { PATCHHandler as PATCH };