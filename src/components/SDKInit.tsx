'use client';

import { useEffect } from 'react';

export const MiroSDKInit = () => {
  useEffect( () => {
    console.log( '[MiroSDKInit]', miro );

    miro.board.ui.on( 'icon:click', async ( e ) => {
      await miro.board.ui.openPanel( { url: '/' } );
    } );
  } );

  return null;
};
