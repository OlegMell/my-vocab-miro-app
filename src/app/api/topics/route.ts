import { NextRequest, NextResponse } from 'next/server';
import usersModel from '../../core/models/db/users.model';
import topicModel from './../../core/models/db/topic.model';
import initMiroAPI from '../../../utils/initMiroAPI';

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

    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get( 'studentId' );

    const user = await usersModel
        .findOne( { _id: studentId } ).populate( { path: 'topics', model: topicModel } ).exec();

    return NextResponse.json( { data: user ? user.topics : [] } );
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

    const searchParams = req.nextUrl.searchParams;
    const topicId = searchParams.get( 'id' );

    const topic = await topicModel.findOneAndDelete( { _id: topicId } ).exec();

    console.log( topic )

    return NextResponse.json( { data: topicId } );
}