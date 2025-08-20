'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TranslateForm } from './TranslateForm';
import { User } from '../app/core/models/user.inteface';
import { Topic } from '../app/core/models/topic.interface';
import { useTabsContext } from './TabsProvider';
import { LocalStorageKeys } from '../app/core/enums/local-storage-keys.enum';
import { addWordRequest } from '../app/lib/addWord';
import { Tooltip as ReactTooltip, TooltipRefProps } from "react-tooltip";
import { TABS_ID } from './Tabs';

export interface AddWordProps {
    readonly user: User;
    readonly topics: Topic[];
    readonly addedCallback?: () => Promise<void>;
}

export function AddWord( { user, topics, addedCallback }: AddWordProps ): React.ReactElement {
    const [ word, setWord ] = useState<string>( '' );
    const [ translation, setTranslation ] = useState<string>( '' );
    const [ lang, setLang ] = useState<string>( '' );

    const topicRef = useRef<HTMLSelectElement>( null );
    const levelRef = useRef<HTMLSelectElement>( null );

    const tooltipRef = useRef<TooltipRefProps>( null );

    useEffect( () => {
        const topicId = localStorage.getItem( LocalStorageKeys.TOPIC_ID );
        if ( topicId ) {
            topicRef.current!.value = topicId;
        }
    }, [] )

    const tabsContext = useTabsContext();

    const addWord = async () => {
        if ( !word || !translation ) {
            return;
        }

        await addWordRequest( {
            word,
            lang,
            translation,
            level: levelRef.current?.value,
            pinned: false,
            marked: false,
            topicId: topicRef.current?.value
        }, localStorage.getItem( LocalStorageKeys.SELECTED_USER ) ?? user._id, );

        localStorage.removeItem( LocalStorageKeys.TOPIC_ID );

        if ( addedCallback ) {
            addedCallback();
        } else {
            tabsContext.handleTabClick( TABS_ID.Vocab );
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
        <div className='add-word-page'>
            <div className='row'>
                <div className="form-group">
                    <label htmlFor="topic">Topic</label>
                    <select ref={topicRef} className="select select-small" id='topic'>
                        {getTopics()}
                    </select>
                </div>

                <div className="form-group short">
                    <label htmlFor="level">Level</label>
                    <select ref={levelRef} className="select select-small" id='level'>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                    </select>
                </div>

                <span data-tooltip-id='tipTooltip' className='icon icon-info'></span>

                <ReactTooltip
                    ref={tooltipRef}
                    clickable={true}
                    id="tipTooltip"
                    place="top"
                    style={{ backgroundColor: '#090909', color: '#fff', zIndex: 10000, wordBreak: 'break-word', maxWidth: '150px' }}
                >
                    You can pick a sticky note with "word - translation" for quick adding
                </ReactTooltip>
            </div>

            <hr />

            <TranslateForm
                onWordChange={handleWordChange}
                onTranslationChange={handleTranslationChange}
                onLangChange={handleLangChange}
            />

            <button
                onClick={addWord}
                style={{ position: 'fixed', bottom: '55px', left: '20px', right: '20px' }}
                className='button button-primary'>Add to vocab</button>
        </div>
    )
}
