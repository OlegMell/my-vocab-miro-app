'use client';

import React, { useState } from 'react';
import { useTabsContext } from './TabsProvider';
import { Students } from './Students';
import { Topics } from './Topics';
import { AddWord } from './AddWord';
import { Topic } from '../app/core/models/topic.interface';
import { LocalStorageKeys } from '../app/core/enums/local-storage-keys.enum';
import { TABS_ID } from './Tabs';

interface PageContentProps {
    readonly userSerialized: string;
}

export function PageContent({ userSerialized }: PageContentProps): React.ReactElement {

    // TODO Add try catch
    const [ user, setUser ] = useState(JSON.parse(userSerialized));

    const tabsContext = useTabsContext();

    const goToAddWord = (topic: Topic | undefined) => {
        localStorage.setItem(LocalStorageKeys.TOPIC_ID, topic!._id);
        tabsContext.handleTabClick(TABS_ID.AddWord);
    }

    const TAB_MAP: Record<TABS_ID, React.ReactElement> = {
        [TABS_ID.Vocab]: <Topics userId={ user.id || user._id } addWordClicked={ goToAddWord } topics={ user.topics }/>,
        [TABS_ID.AddWord]: <AddWord user={ user } topics={ user.topics }/>,
        [TABS_ID.Students]: <Students/>
    }

    return (
        <>
            {
                TAB_MAP[tabsContext.activeTab as TABS_ID]
            }
            {/*{*/ }
            {/*    tabsContext.activeTab === TABS_ID.Vocab &&*/ }
            {/*    <Topics userId={ user.id || user._id } addWordClicked={ goToAddWord } topics={ user.topics }/>*/ }
            {/*}*/ }
            {/*{*/ }
            {/*    tabsContext.activeTab === TABS_ID.AddWord && <AddWord user={ user } topics={ user.topics }/>*/ }
            {/*}*/ }
            {/*{*/ }
            {/*    tabsContext.activeTab === TABS_ID.Students && <Students/>*/ }
            {/*}*/ }
        </>
    )
}
