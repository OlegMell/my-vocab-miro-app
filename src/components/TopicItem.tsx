'use client';

import React, { useState } from 'react';
import { Topic } from '../app/core/models/topic.interface';
import { Word } from '../app/core/models/word.interface';
import { Words } from './Words';
import { WordsRequest } from '../app/core/models/backend/words-request.interface';
import styles from './styles.module.css';
import Loader from './Loader';

interface TopicItemProps {
    readonly topic: Topic;
    readonly userId?: string;
    addWordClicked?: ( topic?: Topic ) => void;
}

export function TopicItem( { topic, userId, addWordClicked }: TopicItemProps ): React.ReactElement {

    const [ words, setWords ] = useState<Word[] | undefined>( undefined );
    const [ fetching, setFetching ] = React.useState<boolean>( false );

    const handleTopicClick = async () => {
        setFetching( true );

        const res = await fetch( `/api/words?topicId=${ topic._id }${ userId ? `&userId=${ userId }` : '' } `, );
        const words: WordsRequest = await res.json();

        if ( words && words.data ) {
            setWords( words.data );
        }

        setFetching( false );
    }

    function handleAddWordClick(): void {
        if ( addWordClicked ) {
            addWordClicked( topic );
        }
    }

    return (
        <>
            <li
                className={`${ styles[ 'clickable-item' ] } ${ styles[ 'actionable' ] } ${ styles[ 'topic' ] }`}
                onClick={handleTopicClick}>{topic.name}

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
                    <p style={{ fontSize: '1.1rem', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <i>No words were added to this topic!</i>
                        <button
                            onClick={handleAddWordClick}
                            className='button button-small button-primary'>Add word</button>
                    </p>
                )
            }
        </>
    )
}