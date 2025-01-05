'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import { Word as IWord } from '../app/core/models/word.interface';
import { LocalStorageKeys } from '../app/core/enums/local-storage-keys.enum';

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

    const handleCheck = ( e ) => {
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
            className={`${ styles[ 'clickable-item' ] } ${ styles[ 'actionable' ] } ${ styles[ 'word' ] }  `} key={word._id}>

            {
                _word.pinned && <span
                    title='Unpin'
                    aria-label='Unpin'
                    onClick={() => pin( _word )}
                    className="animate__animated animate__bounceIn icon icon-pin pinned">
                </span>
            }

            <label className="checkbox word-checkbox">
                <input type="checkbox" onClick={handleCheck} />
                <span></span>
            </label>

            <p className='word-text'>
                <b>{_word.word}</b> - {_word.translation}
            </p>

            <div className={`${ styles[ 'item-actions' ] }`}>
                <button type='button' onClick={addSticky} className={styles[ 'icon-button' ]}>
                    <span className="icon icon-sticky"></span>
                </button>
                <button type='button' onClick={addText} className={styles[ 'icon-button' ]}>
                    <span className="icon icon-text"></span>
                </button>
                {/* <button type='button' className={styles[ 'icon-button' ]}>
                    <span className="icon icon-star"></span>
                </button> */}
                {
                    !_word.pinned && <button type='button' onClick={() => pin( _word )} className={styles[ 'icon-button' ]}>
                        <span className="icon icon-pin"></span>
                    </button>
                }
                <button type='button' onClick={() => onDelete( _word )} className={styles[ 'icon-button' ]}>
                    <span className="icon icon-trash"></span>
                </button>
            </div>

        </li>
    )
}