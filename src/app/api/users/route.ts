import { NextRequest, NextResponse } from 'next/server';

import usersModel from '../../core/models/db/users.model';
import { User } from '../../core/models/user.inteface';
import topicModel from '../../core/models/db/topic.model';
import initMiroAPI from '../../../utils/initMiroAPI';

export async function GET( req: NextRequest ) {
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


/**
* Add new user
*/
export async function POST( req: NextRequest ) {
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

    // const topics = await topicModel.find().exec();

    // const createdUser = new usersModel( user );

    // createdUser.topics.push( ...topics );

    // await createdUser.save();

    // return NextResponse.json( { data: createdUser } );

}


/**
 * Patch user
 */
export async function PATCH( req: NextRequest ) {
    const studentId: { id: string } = await req.json();

    const { userId: currentUserId } = initMiroAPI();

    const user = await usersModel.findOne( { userId: currentUserId } );
    user.students.push( studentId.id );
    await user.save();

    return NextResponse.json( { data: user, message: 'success' } );
}