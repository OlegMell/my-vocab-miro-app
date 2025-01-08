'use client';

import React from 'react';
import Link from 'next/link';
import styles from './styles.module.css';
import { Word as IWord } from '../app/core/models/word.interface';
import { Word } from './Word';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { LocalStorageKeys } from '../app/core/enums/local-storage-keys.enum';
import { shuffle } from '../app/core/utils';
import { pinWord } from '../app/lib/pinWord';
import { deleteWord } from '../app/lib/deleteWord';

interface WordsProps {
    readonly words: IWord[];
    readonly addWordClicked?: () => void;
}

export function Words( { words, addWordClicked }: WordsProps ): React.ReactElement {

    const [ _words, setWords ] = React.useState( words );

    const handleDelete = async ( word: IWord ) => {
        const res = await deleteWord( word._id );

        const responseJson = await res.json(); ``
        if ( responseJson && responseJson.data ) {
            const copy = [ ..._words ];
            const index = copy.findIndex( ( w: IWord ) => w._id === responseJson.data );
            copy.splice( index, 1 );
            setWords( [ ...copy ] );
        }
    }

    const shuffleWords = () => {
        const shuffledWords = shuffle( _words );
        setWords( shuffledWords );
    }

    const goToCards = () => {
        try {
            localStorage.setItem( LocalStorageKeys.WORDS, JSON.stringify( _words ) );
        } catch ( e ) {
            alert( 'Something went wrong!' );
        }
    }

    async function pin( word: IWord ) {
        const res = await pinWord( word );

        const updatedWord = await res.json();
        if ( updatedWord && updatedWord.data ) {
            const copy = [ ..._words ];
            copy.find( ( w: IWord ) => w._id === updatedWord.data )!.pinned = !word.pinned;
            setWords( [ ...copy ] );
        }
    }

    return (
        <div className='sub-items'>
            <h2 className={`title words-title`}>
                Words

                <div>
                    <Link href='/cards'>
                        <button
                            data-tooltip-id='goToCardsTootip'
                            aria-label='Flash cards'
                            type='button'
                            onClick={goToCards}
                            className={styles[ 'icon-button' ]}>
                            <span className="icon icon-cards"></span>
                        </button>
                    </Link>

                    <button
                        data-tooltip-id='shuffleTooltip'
                        aria-label='Shuffle words'
                        type='button'
                        onClick={shuffleWords}
                        className={styles[ 'icon-button' ]}>
                        <span className="icon icon-shuffle"></span>
                    </button>

                    {
                        addWordClicked ? <button
                            type='button'
                            data-tooltip-id='addWordTooltip'
                            onClick={addWordClicked}
                            className={styles[ 'icon-button' ]}>
                            <span className="icon icon-plus"></span>
                        </button> : ''
                    }
                </div>
            </h2>
            {
                !words || words.length === 0 && <p>No words</p>
            }
            {
                !!words.length && (
                    <ul className='list'>
                        {
                            _words
                                .sort( ( a, b ) => a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1 )
                                .map( word => <Word
                                    pin={pin}
                                    key={word._id}
                                    word={word}
                                    onDelete={handleDelete}
                                /> )
                        }
                    </ul>
                )
            }

            <ReactTooltip
                id="goToCardsTootip"
                place="bottom"
                content="Learn by cards"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />

            <ReactTooltip
                id="shuffleTooltip"
                place="bottom"
                content="Shuffle words"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />

            <ReactTooltip
                id="addWordTooltip"
                place="bottom"
                content="Add word"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />
        </div>
    );
}
