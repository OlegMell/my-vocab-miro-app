'use client';

import React, { useRef, useState } from 'react';
import { TranslateForm } from './TranslateForm';
import { User } from '../app/core/models/user.inteface';
import { Topic } from '../app/core/models/topic.interface';
import { useTabsContext } from './TabsProvider';

export interface AddWordProps {
    user: User;
    topics: Topic[];
    addedCallback?: () => Promise<void>;
}

export function AddWord( { user, topics, addedCallback }: AddWordProps ): React.ReactElement {

    const [ word, setWord ] = useState<string>( '' );
    const [ translation, setTranslation ] = useState<string>( '' );
    const [ lang, setLang ] = useState<string>( '' );

    const topicRef = useRef<HTMLSelectElement>( null );
    const levelRef = useRef<HTMLSelectElement>( null );

    const tabsContext = useTabsContext();

    const addWord = async () => {

        const body = {
            word: {
                word,
                lang,
                translation,
                level: levelRef.current?.value,
                pinned: false,
                marked: false,
                userId: localStorage.getItem( 'SELECTED_USER' ) ?? user._id,
                topicId: topicRef.current?.value
            },
        };

        const res = await fetch( '/api/words', {
            body: JSON.stringify( body ),
            method: 'POST',
        } );

        if ( addedCallback ) {
            addedCallback();
        } else {
            tabsContext.handleTabClick( 0 );
        }
    }

    const handleWordChange = ( word: string ) => {
        setWord( word );
    }

    const handleTranslationChange = ( translation: string ) => {
        setTranslation( translation );
    }

    const handleLangChange = ( lang: string ) => {
        setLang( lang );
    }

    const getTopics = () => {
        return topics.map( ( topic: any ) => {
            return <option key={topic._id} value={topic._id}>{topic.name}</option>
        } );
    }

    return (
        <>

            <div className="form-group">
                <label htmlFor="topic">Topic</label>
                <select ref={topicRef} className="select select-small" id='topic'>
                    {getTopics()}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="level">Level</label>
                <select ref={levelRef} className="select select-small" id='level'>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                </select>
            </div>

            <TranslateForm
                onWordChange={handleWordChange}
                onTranslationChange={handleTranslationChange}
                onLangChange={handleLangChange}
            />

            <button
                onClick={addWord}
                style={{ position: 'fixed', bottom: '20px', left: '20px', right: '20px' }}
                className='button button-primary'>Add to vocab</button>
        </>
    )
}