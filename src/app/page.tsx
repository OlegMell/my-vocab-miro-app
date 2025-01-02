import React from 'react';
import { Board } from '@mirohq/miro-api';

import '../assets/style.css';

import initMiroAPI from '../utils/initMiroAPI';
import { getUserByMiroUserId } from './core/server';
import Home from '../components/Home';

const getBoards = async () => {
  const { miro, userId } = initMiroAPI();

  console.log( 'AUTH ', userId );

  // redirect to auth url if user has not authorized the app
  if ( !userId || !( await miro.isAuthorized( userId ) ) ) {
    return {
      authUrl: miro.getAuthUrl(),
    };
  }

  const api = miro.as( userId );

  const boards: Board[] = [];
  for await ( const board of api.getAllBoards() ) {
    boards.push( board );
  }

  return {
    boards,
    userId
  };
};

export default async function Page() {
  const { boards, userId, authUrl } = await getBoards();

  const currentUser = await getUserByMiroUserId( userId! );

  console.log( '[USER_ID]', userId )

  // console.log( currentUser );

  return (
    <div>

      {
        authUrl ? (
          <a className="button button-primary" href={authUrl} target="_blank">
            Login
          </a>
        )
          : (
            <Home user={JSON.stringify( currentUser )} userId={userId} />
          )
      }


      {/* {
        authUrl ? (
          <a className="button button-primary" href={authUrl} target="_blank">
            Login
          </a>
        ) : (
          <>
            <p>This is a list of all the boards that your user has access to:</p>

            <ul>
              {boards?.map( ( board ) => (
                <li key={board.name}>{board.name}</li>
              ) )}
            </ul>
          </>
        )
      } */}
    </div >
  );
}
