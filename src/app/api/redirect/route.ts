import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import initMiroAPI from '../../../utils/initMiroAPI';

export async function GET( request: NextRequest ) {
  const { miro, userId } = initMiroAPI();

  const code = request.nextUrl.searchParams.get( 'code' );
  const teamId = request.nextUrl.searchParams.get( 'team_id' );
  const clientId = request.nextUrl.searchParams.get( 'client_id' );

  if ( typeof code !== 'string' ) {
    redirect( '/?missing-code' );
    return;
  }

  try {
    await miro.exchangeCodeForAccessToken( userId, code );
  } catch ( error ) {
    redirect( '/?error' );
  }
  redirect( `https://miro.com/app-install-completed/?client_id=${ clientId }&team_id=${ teamId }` );
}
