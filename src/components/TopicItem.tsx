'use client';

import React, { useState } from 'react';
import { Topic } from '../app/core/models/topic.interface';
import { Word } from '../app/core/models/word.interface';
import { Words } from './Words';
import { WordsRequest } from '../app/core/models/backend/words-request.interface';
import styles from './styles.module.css';
import Loader from './Loader';
import { fetchWords } from '../app/lib/fetchWords';
import { StickyNote } from '@mirohq/websdk-types';
import { addWordRequest } from '../app/lib/addWord';

interface TopicItemProps {
    readonly topic: Topic;
    readonly userId?: string;
    addWordClicked?: ( topic?: Topic ) => void;
}

export function TopicItem( { topic, userId, addWordClicked }: TopicItemProps ): React.ReactElement {

    const [ words, setWords ] = useState<Word[] | undefined>( undefined );
    const [ fetching, setFetching ] = React.useState<boolean>( false );

    const handleTopicClick = async ( e?: any ) => {
        if ( e && e.key?.toLowerCase() === 'tab' ) {
            return;
        }

        setFetching( true );

        const words: WordsRequest = await fetchWords( topic._id, userId );

        if ( words && words.data ) {
            setWords( words.data );
        }

        setFetching( false );
    }

    async function handleAddWordClick(): Promise<void> {

        // Get selected items
        let selectedItems = await miro.board.getSelection();

        // Filter sticky notes from selected items
        let stickyNotes = selectedItems.filter( ( item ) => item.type === 'sticky_note' );

        if ( stickyNotes && stickyNotes.length ) {

            const [ word, translation ] = ( stickyNotes[ 0 ] as StickyNote ).content.split( '-' );

            if ( !word || !translation ) {
                return;
            }

            addWordRequest( {
                word: word.trim(),
                lang: 'auto',
                translation: translation.trim(),
                level: '-',
                pinned: false,
                marked: false,
                topicId: topic._id,
            }, userId! ).catch( () => {
                handleTopicClick();
            } )
        } else {
            if ( !addWordClicked ) {
                return;
            }

            addWordClicked( topic );
        }

    }

    return (
        <>
            <li
                tabIndex={1}
                onKeyUp={( e ) => handleTopicClick( e )}
                className={`${ styles[ 'clickable-item' ] } ${ styles[ 'actionable' ] } ${ styles[ 'topic' ] }`}
                onClick={( e ) => handleTopicClick( e )}>{topic.name}

                <div className={`${ styles[ 'item-actions' ] }`}>
                    {fetching && <Loader />}
                </div>

            </li>
            {
                !!words && words.length ? (
                    <Words addWordClicked={addWordClicked} words={words!} />
                ) : ''
            } {
                ( words && !words.length && !fetching ) && (
                    <p style={{ fontSize: '.8rem', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <i>Select sticky with word and click "Add word" button or just click the button</i>
                        <button
                            tabIndex={1}
                            onClick={handleAddWordClick}
                            className='button button-small button-primary'>Add word</button>
                    </p>
                )
            }
        </>
    )
}