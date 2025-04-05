import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import initMiroAPI from '../../../utils/initMiroAPI';

// handle redirect with code and exchange it for the access token
export async function GET( request: NextRequest ) {
  const { miro, userId } = initMiroAPI();

  // Make sure the code is in query parameters
  const code = request.nextUrl.searchParams.get( 'code' );
  const teamId = request.nextUrl.searchParams.get( 'team_id' );

  if ( typeof code !== 'string' ) {
    redirect( '/?missing-code' );
    return;
  }

  try {
    const token = await miro.exchangeCodeForAccessToken( userId, code );
    console.log( { token } );
  } catch ( error ) {
    redirect( '/?error' );
  }
  redirect( `https://miro.com/app-install-completed/?client_id=3458764611114746267&team_id=${ teamId }` );
}
