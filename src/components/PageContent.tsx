'use client';

import React, { useState } from 'react';
import { useTabsContext } from './TabsProvider';
import { Students } from './Students';
import { Topics } from './Topics';
import { AddWord } from './AddWord';

interface PageContentProps {
    userSerialized: string;
}

export function PageContent( { userSerialized }: PageContentProps ): React.ReactElement {

    const [ user, setUser ] = useState( JSON.parse( userSerialized ) );

    const tabsContext = useTabsContext();

    return (
        <>
            {
                tabsContext.activeTab === 0 && <Topics topics={user.topics} />
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