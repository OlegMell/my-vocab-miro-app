'use client';

import React, { useState } from 'react';
import { useTabsContext } from './TabsProvider';
import { Students } from './Students';
import { Topics } from './Topics';
import { AddWord } from './AddWord';
import { Topic } from '../app/core/models/topic.interface';
import { LocalStorageKeys } from '../app/core/enums/local-storage-keys.enum';

interface PageContentProps {
    readonly userSerialized: string;
}

export function PageContent( { userSerialized }: PageContentProps ): React.ReactElement {

    // TODO Add try catch
    const [ user, setUser ] = useState( JSON.parse( userSerialized ) );

    const tabsContext = useTabsContext();

    const goToAddWord = ( topic: Topic | undefined ) => {
        localStorage.setItem( LocalStorageKeys.TOPIC_ID, topic!._id );
        tabsContext.handleTabClick( 1 );
    }

    return (
        <>
            {
                tabsContext.activeTab === 0 && <Topics userId={user.id || user._id} addWordClicked={goToAddWord} topics={user.topics} />
            }
            {
                tabsContext.activeTab === 1 && <AddWord user={user} topics={user.topics} />
            }
            {
                tabsContext.activeTab === 2 && <Students />
            }
        </>
    )
}