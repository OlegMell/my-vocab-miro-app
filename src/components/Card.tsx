'use client'

import React, { ReactElement, useState } from 'react';
import { Tooltip as ReactTooltip } from "react-tooltip";

import styles from './../components/styles.module.css';

interface CardProps {
    readonly id: string;
    readonly frontSide: string;
    readonly backSide: string;
    readonly onRemove: ( id: string ) => void;
}

export default function Card( { id, frontSide, backSide, onRemove }: CardProps ): ReactElement {
    const [ flipped, setFlipped ] = useState<boolean>( false );

    const flip = () => {
        setFlipped( !flipped );
    }

    async function addSticky( e ) {
        e.stopPropagation();
        const stickyNote = await miro.board.createStickyNote( {
            content: `${ frontSide } - ${ backSide }`,
        } );
        await miro.board.viewport.zoomTo( stickyNote );
    }

    async function addText( e ) {
        e.stopPropagation();

        const stickyNote = await miro.board.createText( {
            content: `${ frontSide } - ${ backSide }`,
        } );
        await miro.board.viewport.zoomTo( stickyNote );
    }

    const remove = ( e ) => {
        e.stopPropagation();
        onRemove( id );
    }

    return (
        <div className="flip-card" onClick={flip}>
            <button data-tooltip-id='stickyTooltip' onClick={addSticky} type='button' className={styles[ 'icon-button' ]}>
                <span className="icon icon-sticky"></span>
            </button>
            <button data-tooltip-id='textTooltip' onClick={addText} type='button' className={styles[ 'icon-button' ]}>
                <span className="icon icon-text"></span>
            </button>
            <button data-tooltip-id='removeTooltip' type='button' onClick={remove} className={styles[ 'icon-button' ]}>
                <span className="icon icon-trash"></span>
            </button>
            <div className="flip-card-inner" style={flipped ? { 'transform': 'rotateY(180deg)' } : {}}>
                <div className="flip-card-front">
                    <p className='text'>{frontSide}</p>
                </div>
                <div className="flip-card-back">
                    <p className='text'>{backSide}</p>
                </div>

            </div>

            <ReactTooltip
                id="stickyTooltip"
                place="top"
                content="Create sticky"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />

            <ReactTooltip
                id="textTooltip"
                place="top"
                content="Create text"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />

            <ReactTooltip
                id="removeTooltip"
                place="top"
                content="Remove card"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />
        </div>
    )
}