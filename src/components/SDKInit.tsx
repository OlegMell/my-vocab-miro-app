'use client';

import { useEffect } from 'react';

export const MiroSDKInit = () => {
  useEffect( () => {

    const f = async () => {
      console.log( '[canOpenPanel]: ', await miro.board.ui.canOpenPanel() )
    }

    f();

    miro.board.ui.on( 'icon:click', async () => {
      await miro.board.ui.openPanel( { url: '/' } );
    } );
  } );

  return null;
};
