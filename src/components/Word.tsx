'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import { Word as IWord } from '../app/core/models/word.interface';
import { LocalStorageKeys } from '../app/core/enums/local-storage-keys.enum';
import { Tooltip as ReactTooltip } from "react-tooltip";

export interface WordProps {
    readonly word: IWord;
    readonly pin: ( word: IWord ) => void,
    readonly onDelete: ( word: IWord ) => void
}

export function Word( { word, pin, onDelete }: WordProps ): React.ReactElement {

    const [ _word, setWord ] = useState( word );

    async function addSticky() {
        const stickyNote = await miro.board.createStickyNote( {
            content: `${ _word.word } - ${ _word.translation }`,
        } );
        await miro.board.viewport.zoomTo( stickyNote );
    }

    async function addText() {
        const stickyNote = await miro.board.createText( {
            content: `${ _word.word } - ${ _word.translation }`,
        } );
        await miro.board.viewport.zoomTo( stickyNote );
    }

    const handleCheck = () => {
        let wordsList: any = localStorage.getItem( LocalStorageKeys.WORDS );
        if ( !wordsList ) {
            wordsList = [];
        } else {
            wordsList = JSON.parse( wordsList );
        }

        wordsList.push( _word );
        localStorage.setItem( LocalStorageKeys.WORDS, JSON.stringify( wordsList ) );
    }

    return (
        <li
            className={`${ styles[ 'clickable-item' ] } ${ styles[ 'actionable' ] } ${ styles[ 'word' ] }  `}
            key={word._id}>
            {
                _word.pinned && (
                    <span
                        title='Unpin'
                        aria-label='Unpin'
                        onClick={() => pin( _word )}
                        className="animate__animated animate__bounceIn icon icon-pin pinned">
                    </span>
                )
            }

            <label className="checkbox word-checkbox">
                <input type="checkbox" onClick={handleCheck} />
                <span></span>
            </label>

            <p className='word-text'>
                <b>{_word.word}</b> - {_word.translation}
            </p>

            <div className={`${ styles[ 'word-item-actions' ] }`}>
                <button data-tooltip-id='stickyTooltip' type='button' onClick={addSticky} className={styles[ 'icon-button' ]}>
                    <span className="icon icon-sticky"></span>
                </button>
                <button data-tooltip-id='textTooltip' type='button' onClick={addText} className={styles[ 'icon-button' ]}>
                    <span className="icon icon-text"></span>
                </button>
                {/* <button type='button' className={styles[ 'icon-button' ]}>
                    <span className="icon icon-star"></span>
                </button> */}
                {
                    !_word.pinned && <button data-tooltip-id='pinTooltip' type='button' onClick={() => pin( _word )} className={styles[ 'icon-button' ]}>
                        <span className="icon icon-pin"></span>
                    </button>
                }
                <button data-tooltip-id='removeTooltip' type='button' onClick={() => onDelete( _word )} className={styles[ 'icon-button' ]}>
                    <span className="icon icon-trash"></span>
                </button>

                <p title='level' style={{ marginLeft: 'auto' }}>
                    <b>{_word.level}</b>
                </p>
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
                content="Remove word"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />


            <ReactTooltip
                id="pinTooltip"
                place="top"
                content="Pin word"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />

        </li>
    )
}