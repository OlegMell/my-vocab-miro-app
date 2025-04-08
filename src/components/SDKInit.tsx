'use client';

import { useEffect } from 'react';

export const MiroSDKInit = () => {
  console.log( 'MiroSDKInit COMP' )
  useEffect( () => {

    console.log( miro )

    const f = async () => {
      console.log( '[canOpenPanel]: ', await miro.board.ui.canOpenPanel() )
    }

    f();

    miro.board.ui.on( 'icon:click', async ( e ) => {
      console.log( 'icon:click', e );
      await miro.board.ui.openPanel( { url: '/' } );
    } );
  } );

  return null;
};
