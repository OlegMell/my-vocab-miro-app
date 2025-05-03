import { NextRequest, NextResponse } from 'next/server';
import usersModel from '../../core/models/db/users.model';
import initMiroAPI from '../../../utils/initMiroAPI';
import { User } from '../../core/models/user.inteface';
import { withAuth } from '../../lib/withAuth';

async function GET( req: any, res: any, userId?: any ) {

    // const { userId: currentUserId, accessToken, miro } = initMiroAPI();

    // USER VERIFICATION ------------------------------------------------------

    // if ( !currentUserId?.trim() ) {
    //     return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
    // } else if ( !accessToken?.trim() ) {
    //     return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
    // }

    // const miroApi = miro.as( currentUserId );

    // try {
    //     const verifyAccessTokenResponse = await miroApi.tokenInfo();

    //     if ( verifyAccessTokenResponse.user.id !== currentUserId ) {
    //         return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
    //     }
    // } catch ( err: any ) {
    //     return NextResponse.json( err.body, { status: err.statusCode } );
    // }

    // END USER VERIFICATION ------------------------------------------

    const users = await usersModel.findOne( { userId } )
        .populate( 'students' )
        .exec();

    return res.json( { data: users ?? [] } );
};

const GETHandler = withAuth( GET );
export { GETHandler as GET };

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

    const body = await req.json();

    const user = await usersModel.findOne( { userId: currentUserId } ).exec();

    if ( !user ) {
        return NextResponse.json( { message: 'fail', error: 'User not found' }, { status: 404 } );
    }

    user.students = user.students.filter( ( student: User ) => student._id.toString() !== body.id );
    await user.save();

    return NextResponse.json( { data: user._id } );
}
