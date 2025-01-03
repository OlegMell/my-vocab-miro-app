'use client';

import { useEffect } from 'react';

export const MiroSDKInit = () => {
  useEffect( () => {
    miro.board.ui.on( 'icon:click', async () => {
      // console.log( await miro.board.get() )
      await miro.board.ui.openPanel( { url: '/' } );
    } );
  } );

  return null;
};
