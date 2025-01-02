'use client';

import React from 'react';
import { TopicItem } from './TopicItem';
import { Topic } from '../app/core/models/topic.interface';

interface TopicsProps {
    readonly topics: Topic[];
    readonly userId?: string;
    addWordClicked?: () => void;
}

export function Topics( { topics, userId, addWordClicked }: TopicsProps ): React.ReactElement {
    return (
        <>
            <h2 className={`title topics-title`}>
                Topics

                {/* <button type='button' className={styles[ 'icon-button' ]}>
                    <span className="icon icon-plus"></span>
                </button> */}
            </h2>
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
        </>
    )
}
