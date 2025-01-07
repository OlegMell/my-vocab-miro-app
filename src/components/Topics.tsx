'use client';

import React from 'react';
import { TopicItem } from './TopicItem';
import { Topic } from '../app/core/models/topic.interface';
import { useTabsContext } from './TabsProvider';
import styles from './styles.module.css';

interface TopicsProps {
    readonly topics: Topic[];
    readonly userId?: string;
    addWordClicked?: ( topic?: Topic ) => void;
}

export function Topics( { topics, userId, addWordClicked }: TopicsProps ): React.ReactElement {
    const tabsContext = useTabsContext();

    const handleAddWordClick = () => {
        tabsContext.handleTabClick( 1 );
    }

    return (
        <>
            <h2 className={`title topics-title`}>Topics</h2>
            {
                topics
                    ? ( <ul className='list'>
                        {
                            topics.map( ( topic, index ) => (
                                <TopicItem addWordClicked={addWordClicked} userId={userId} key={index} topic={topic} />
                            ) )
                        }
                    </ul> )
                    : <p>No topics</p>
            }
            <button
                onClick={handleAddWordClick}
                type='button'
                className={`button button-primary ${ styles[ 'sticky-bottom' ] }`}>
                Add word
            </button>
        </>
    )
}
