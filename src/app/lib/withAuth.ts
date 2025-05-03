import { NextApiRequest, NextApiResponse } from 'next';
import initMiroAPI from '../../utils/initMiroAPI';
import { NextResponse } from 'next/server';

export function withAuth( handler: ( req: NextApiRequest, res: NextApiResponse, userId?: any ) => Promise<any> ) {
    return async ( req: NextApiRequest, res: NextApiResponse ) => {

        const { userId, accessToken, miro } = initMiroAPI();

        // USER VERIFICATION ------------------------------------------------------

        if ( !userId?.trim() ) {
            return NextResponse.json( { msg: 'no user id set in cookie' }, { status: 401 } );
        } else if ( !accessToken?.trim() ) {
            return NextResponse.json( { msg: 'no access token set in cookie' }, { status: 401 } );
        }

        const miroApi = miro.as( userId );

        try {
            const verifyAccessTokenResponse = await miroApi.tokenInfo();

            if ( verifyAccessTokenResponse.user.id !== userId ) {
                return NextResponse.json( { msg: 'Access token did not pass the verification' }, { status: 401 } );
            }

            // If user is authenticated - go to endpoint
            return handler( req, res, userId );

        } catch ( err: any ) {
            return NextResponse.json( err.body, { status: err.statusCode } );
        }

        // END USER VERIFICATION ------------------------------------------
    };
}