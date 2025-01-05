'use client';

import React, { useState } from 'react';
import { Topic } from '../app/core/models/topic.interface';
import { Word } from '../app/core/models/word.interface';
import { Words } from './Words';
import { WordsRequest } from '../app/core/models/backend/words-request.interface';
import styles from './styles.module.css';
import loaderIco from './../assets/ico/loader.svg';
import Image from 'next/image';

interface TopicItemProps {
    readonly topic: Topic;
    readonly userId?: string;
    addWordClicked?: () => void;
}

export function TopicItem( { topic, userId, addWordClicked }: TopicItemProps ): React.ReactElement {

    const [ words, setWords ] = useState<Word[] | undefined>( undefined );
    const [ fetching, setFetching ] = React.useState<boolean>( false );

    const handleTopicClick = async () => {
        setFetching( true );

        const res = await fetch( `/api/words?topicId=${ topic._id }${ userId ? `&userId=${ userId }` : '' } `, );
        const words: WordsRequest = await res.json();

        if ( words && words.data && words.data.length ) {
            setWords( words.data );
        }

        setFetching( false );
    }

    return (
        <>
            <li
                className={`${ styles[ 'clickable-item' ] } ${ styles[ 'actionable' ] } ${ styles[ 'topic' ] }`}
                onClick={handleTopicClick}>{topic.name}

                <div className={`${ styles[ 'item-actions' ] }`}>
                    {fetching && <Image className='rotation' src={loaderIco} alt='loader icon' />}
                </div>

            </li>
            {
                !!words && words.length ? (
                    <Words addWordClicked={addWordClicked} words={words!} />
                ) : ''
            }
        </>
    )
}