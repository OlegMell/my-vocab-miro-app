'use client'

import React, { ReactElement, useState } from 'react';

interface CardProps {
    readonly frontSide: string;
    readonly backSide: string;
}

export default function Card( { frontSide, backSide }: CardProps ): ReactElement {
    const [ flipped, setFlipped ] = useState<boolean>( false );

    const flip = () => {
        setFlipped( !flipped );
    }

    return (
        <div className="flip-card" onClick={flip}>
            <div className="flip-card-inner" style={flipped ? { 'transform': 'rotateY(180deg)' } : {}}>
                <div className="flip-card-front">
                    <p className='text'>{frontSide}</p>
                </div>
                <div className="flip-card-back">
                    <p className='text'>{backSide}</p>
                </div>
            </div>
        </div>
    )
}