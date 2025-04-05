import { NextRequest, NextResponse } from 'next/server';

import usersModel from '../../core/models/db/users.model';
import { User } from '../../core/models/user.inteface';
import topicModel from '../../core/models/db/topic.model';
import initMiroAPI from '../../../utils/initMiroAPI';

export async function GET( req: NextRequest ) {
    const { userId: currentUserId, accessToken } = initMiroAPI();

    if ( !currentUserId?.trim() ) {
        return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
    } else if ( !accessToken?.trim() ) {
        return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
    }

    const res = await fetch( 'https://api.miro.com/v1/oauth-token', {
        headers: {
            Authorization: `Bearer ${ accessToken.trim() }`,
        },
    } );

    const verifyAccessTokenResponse = await res.json();

    if ( !verifyAccessTokenResponse ) {
        return NextResponse.json( { msg: 'Cannot verify access token' }, { status: 500 } );
    }

    if ( verifyAccessTokenResponse.user.id !== currentUserId ) {
        return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
    }

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

    const { userId: currentUserId, accessToken } = initMiroAPI();

    if ( !currentUserId?.trim() ) {
        return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
    } else if ( !accessToken?.trim() ) {
        return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
    }

    const res = await fetch( 'https://api.miro.com/v1/oauth-token', {
        headers: {
            Authorization: `Bearer ${ accessToken.trim() }`,
        },
    } );

    const verifyAccessTokenResponse = await res.json();

    if ( !verifyAccessTokenResponse ) {
        return NextResponse.json( { msg: 'Cannot verify access token' }, { status: 500 } );
    }

    if ( verifyAccessTokenResponse.user.id !== currentUserId ) {
        return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
    }

    if ( !await initMiroAPI()?.miro?.isAuthorized ) {
        return NextResponse.json( { message: 'no authorized user!' } );
    }

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


/**
 * Patch user
 */
export async function PATCH( req: NextRequest ) {
    const { userId: currentUserId, accessToken } = initMiroAPI();

    if ( !currentUserId?.trim() ) {
        return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
    } else if ( !accessToken?.trim() ) {
        return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
    }

    const res = await fetch( 'https://api.miro.com/v1/oauth-token', {
        headers: {
            Authorization: `Bearer ${ accessToken.trim() }`,
        },
    } );

    const verifyAccessTokenResponse = await res.json();

    if ( !verifyAccessTokenResponse ) {
        return NextResponse.json( { msg: 'Cannot verify access token' }, { status: 500 } );
    }

    if ( verifyAccessTokenResponse.user.id !== currentUserId ) {
        return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
    }

    const studentId: { id: string } = await req.json();

    const user = await usersModel.findOne( { userId: currentUserId } );
    user.students.push( studentId.id );
    await user.save();

    return NextResponse.json( { data: user, message: 'success' } );
}