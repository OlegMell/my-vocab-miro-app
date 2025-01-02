'use client';

import React, { useEffect } from 'react';

export function Button( { cb }: any ): React.ReactElement {

    useEffect( () => {
        document.addEventListener( 'paste', ( e ) => {
            console.log( e )
            cb( 'test' );
        } );
    } )

    const getTranslation = () => {
        cb();
    }

    return (
        <button onClick={getTranslation}>OK</button>
    )
}