import React from 'react';
import { Board } from '@mirohq/miro-api';

import '../assets/style.css';

import initMiroAPI from '../utils/initMiroAPI';
import { getUserByMiroUserId } from './core/server';
import Home from '../components/Home';
import { Footer } from '../components/Footer';

const getBoards = async () => {
  const { miro, userId } = initMiroAPI();

  // redirect to auth url if user has not authorized the app
  if ( !userId || !( await miro.isAuthorized( userId ) ) ) {
    return {
      authUrl: miro.getAuthUrl(),
    };
  }

  const api = miro.as( userId );

  const boards: Board[] = [];
  try {
    for await ( const board of api.getAllBoards() ) {
      boards.push( board );
    }
  } catch ( e ) {
    return {
      userId
    }
  }

  return {
    boards,
    userId
  };
};

export default async function Page() {
  const { userId, authUrl } = await getBoards();

  console.log( authUrl );

  const currentUser = await getUserByMiroUserId( userId! );

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
      <Footer />
    </div >
  );
}
