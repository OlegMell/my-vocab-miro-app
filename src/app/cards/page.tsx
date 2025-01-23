'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ActionPanel from '../../components/ActionPanel';
import { Tooltip as ReactTooltip } from "react-tooltip";
import '../../assets/style.css';
import { Word } from '../core/models/word.interface';
import { LocalStorageKeys } from '../core/enums/local-storage-keys.enum';
import Card from '../../components/Card';
import { Carousel } from 'react-responsive-carousel';
import styles from './../../components/styles.module.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { shuffle } from '../core/utils';
import { Footer } from '../../components/Footer';

const TOGGLES = [
    {
        id: 'word',
        value: 'word',
        label: 'Word',
    },
    {
        id: 'translation',
        value: 'translation',
        label: 'Translation',
    },
]

export default function Page() {
    const [ mode, setMode ] = useState<string>( 'word' );
    const [ words, setWords ] = useState<Word[]>( [] );
    const [ cards, setCards ] = useState<{ id: string, frontSide: string, backSide: string }[]>( [] );

    const router = useRouter();

    useEffect( () => {
        const ls = localStorage.getItem( LocalStorageKeys.WORDS );
        if ( ls ) {
            try {
                const _words = JSON.parse( ls )
                setWords( _words );

                if ( _words ) {
                    setCards( createCards( _words, mode ) );
                }
            } catch ( e ) {
                console.log( e )
            }
        }
    }, [] );

    const goBack = () => {
        localStorage.removeItem( LocalStorageKeys.WORDS );
        router.back();
    }

    const changeMode = ( { target }: any ) => {
        setMode( target.value );
        setCards( createCards( words, target.value ) );
    }

    const createCards = ( words: Word[], mode: string ) => {
        if ( mode === 'word' ) {
            return words.map( ( w: Word ) => {
                return {
                    id: w._id,
                    frontSide: w.word,
                    backSide: w.translation
                }
            } );
        } else {
            return words.map( ( w: Word ) => {
                return {
                    id: w._id,
                    frontSide: w.translation,
                    backSide: w.word
                }
            } );
        }
    }

    const onRemove = ( id: string ) => {
        setCards( createCards( words.filter( w => w._id !== id ), mode ) );
    }

    const shuffleWords = () => {
        const shuffledWords = shuffle( words );
        setWords( shuffledWords );
        setCards( createCards( words, mode ) );
    }

    return (
        <div className='cards-page'>

            <h1 className='page-title'>
                <span onClick={goBack} className='icon icon-back-1'></span>
                Cards
            </h1>

            {
                words && words.length ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <h4>Mode</h4>
                                <ActionPanel handleClick={changeMode} actions={TOGGLES} />
                            </div>

                            <div>
                                <button
                                    data-tooltip-id='shuffleTooltip'
                                    aria-label='Shuffle words'
                                    type='button'
                                    onClick={shuffleWords}
                                    className={styles[ 'icon-button' ]}>
                                    <span className="icon icon-shuffle"></span>
                                </button>
                            </div>

                        </div>

                        <div>
                            <Carousel
                                width={'100%'}
                                useKeyboardArrows={true}
                                showStatus={false}
                                showThumbs={false}
                                emulateTouch={true}
                            >
                                {
                                    cards.map( c => <Card
                                        data-tooltip-id='cardTooltip'
                                        onRemove={onRemove}
                                        id={c.id}
                                        key={c.frontSide}
                                        frontSide={c.frontSide}
                                        backSide={c.backSide}
                                    /> )
                                }
                            </Carousel>
                        </div>
                    </>
                )
                    : <p>No words were choosen</p>
            }

            <Footer />

            <ReactTooltip
                id="shuffleTooltip"
                place="bottom"
                content="Shuffle cards"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />

            

        </div>
    )
}