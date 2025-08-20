'use client';

import React from 'react';
import { useTabsContext } from './TabsProvider';
import { UserType } from '../app/core/enums/user-type.enum';

export enum TABS_ID {
    Vocab,
    AddWord,
    Students
}

const TABS = [
    { id: TABS_ID.Vocab, name: 'Vocab' },
    { id: TABS_ID.AddWord, name: 'New word' },
];

const getTabs = ( userType: string ) => {
    if ( userType === UserType.Teacher ) {
        return [
            ...TABS,
            { id: TABS.length, name: 'Students' },
        ];
    }

    return TABS;
}

export function Tabs( { userType }: { userType: string } ): React.ReactElement {
    const { activeTab, handleTabClick } = useTabsContext();

    return (
        <div style={{ marginBottom: '10px' }} className="tabs">
            <div className="tabs-header-list">
                {
                    getTabs( userType )
                        .map( ( tab ) => (
                            <div
                                key={tab.id}
                                onClick={() => handleTabClick( tab.id )}
                                className={`tab ${ activeTab === tab.id ? 'tab-active' : '' }`}>
                                <div className='tab-text'>{tab.name}</div>
                            </div>
                        ) )
                }
            </div>
        </div>
    )
}