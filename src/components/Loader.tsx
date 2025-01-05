'use client'

import React from 'react';
import Image from 'next/image';

import loaderIco from './../assets/ico/loader.svg';

interface LoaderProps {
    readonly fullSize: boolean;
}

export default function Loader( { fullSize }: LoaderProps ): React.ReactElement {

    const styles = fullSize
        ? { width: '100%', height: '100%' }
        : { width: '24px', height: '24px' };

    return (
        <div className="loader" style={styles}>
            <Image
                className='rotation'
                src={loaderIco}
                alt='loader icon'
            />
        </div>
    )
}