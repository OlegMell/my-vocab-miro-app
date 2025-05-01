import { Miro } from '@mirohq/miro-api';
import { cookies } from 'next/headers';
import { State } from '@mirohq/miro-api/dist/storage';

const tokensCookie = 'miro_tokens';

export default function initMiroAPI() {
  const cookieInstance = cookies();

  const getCookieValue = ( key: string = tokensCookie ) => {
    try {
      return JSON.parse( cookieInstance.get( key )?.value! ) as State;
    } catch ( err ) {
      return null;
    }
  };

  return {
    miro: new Miro( {
      storage: {
        get: () => {
          return getCookieValue();
        },
        set: ( _, state ) => {
          cookieInstance.set( tokensCookie, JSON.stringify( state ), {
            path: '/',
            httpOnly: true,
            sameSite: 'none',
            secure: true,
          } );
        },
      },
    } ),
    userId: getCookieValue()?.userId || '',
    accessToken: getCookieValue()?.accessToken || ''
  };
}
