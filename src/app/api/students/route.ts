import { NextRequest, NextResponse } from 'next/server';
import usersModel from '../../core/models/db/users.model';
import initMiroAPI from '../../../utils/initMiroAPI';
import { User } from '../../core/models/user.inteface';

export async function GET( req: NextRequest ) {

    const { userId: currentUserId, accessToken } = initMiroAPI();

    if ( !currentUserId?.trim() || !accessToken?.trim() ) {
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

    const users = await usersModel.findOne( { userId: currentUserId } )
        .populate( 'students' )
        .exec();

    return NextResponse.json( { data: users ?? [] } );
}

export async function DELETE( req: NextRequest ) {
    const { userId: currentUserId, accessToken } = initMiroAPI();

    if ( !currentUserId?.trim() || !accessToken?.trim() ) {
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

    const body = await req.json();

    const user = await usersModel.findOne( { userId: currentUserId } ).exec();

    if ( !user ) {
        return NextResponse.json( { message: 'fail', error: 'User not found' }, { status: 404 } );
    }

    user.students = user.students.filter( ( student: User ) => student._id.toString() !== body.id );
    await user.save();

    return NextResponse.json( { data: user._id } );
}