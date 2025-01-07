'use client';

import React from 'react';
import styles from './styles.module.css';
import { useTabsContext } from './TabsProvider';
import { Word as IWord } from '../app/core/models/word.interface';
import { Word } from './Word';
import Link from 'next/link';

interface WordsProps {
    readonly words: IWord[];
    addWordClicked?: () => void;
}

export function Words( { words, addWordClicked }: WordsProps ): React.ReactElement {

    const [ _words, setWords ] = React.useState( words );

    const tabsContext = useTabsContext();

    const handleDelete = async ( word: IWord ) => {
        const res = await fetch( `api/words?id=${ word._id }`, {
            method: 'DELETE'
        } );

        const tmp = await res.json();

        if ( tmp && tmp.data ) {
            const copy = [ ..._words ];
            const index = copy.findIndex( ( w: IWord ) => w._id === tmp.data );
            copy.splice( index, 1 );
            setWords( [ ...copy ] );
        }
    }

    const shuffleWords = () => {
        const shuffledWords = shuffle( _words );
        setWords( shuffledWords );
    }

    const goToCards = () => {
    }

    async function pin( word: IWord ) {

        const body = {
            wordId: word._id,
            pinned: !word.pinned
        };

        const res = await fetch( 'api/pin-word', {
            body: JSON.stringify( body ),
            method: 'PATCH'
        } );

        const tmp = await res.json();

        if ( tmp && tmp.data ) {
            const copy = [ ..._words ];
            copy.find( ( w: IWord ) => w._id === tmp.data )!.pinned = !word.pinned;
            setWords( [ ...copy ] );
        }

    }

    const handleAddWordClick = () => {
        tabsContext.handleTabClick( 1 );
    }

    return (
        <div className='sub-items'>
            <h2 className={`title words-title`}>
                Words

                <div>

                    <Link href='/cards'>
                        <button
                            title='Flash cards'
                            aria-label='Flash cards'
                            type='button'
                            onClick={goToCards}
                            className={styles[ 'icon-button' ]}>
                            <span className="icon icon-cards"></span>
                        </button>
                    </Link>

                    <button
                        title='Shuffle words'
                        aria-label='Shuffle words'
                        type='button'
                        onClick={shuffleWords}
                        className={styles[ 'icon-button' ]}>
                        <span className="icon icon-shuffle"></span>
                    </button>

                    {
                        addWordClicked ? <button
                            type='button'
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

            <button
                onClick={handleAddWordClick}
                type='button'
                className={`button button-primary ${ styles[ 'sticky-bottom' ] }`}>
                Add word
            </button>
        </div>
    );
}

function shuffle( words: IWord[], excludePinned = true ): IWord[] {
    let pinnedwords: IWord[] = [];

    if ( excludePinned ) {
        pinnedwords = words.filter( w => w.pinned );
    }

    const shuffled = [ ...words.filter( w => !w.pinned ) ];
    for ( let i = shuffled.length - 1; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ shuffled[ i ], shuffled[ j ] ] = [ shuffled[ j ], shuffled[ i ] ];
    }
    return [ ...pinnedwords, ...shuffled ];
}
