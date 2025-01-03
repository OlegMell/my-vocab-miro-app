'use client';

import React, { createContext, useContext } from "react";
import { LocalStorageKeys } from '../app/core/enums/local-storage-keys.enum';

export interface TabsContextProps {
    activeTab: number;
    handleTabClick: ( index: number ) => void;
}

const TabsContext = createContext<TabsContextProps>( {} as TabsContextProps )

export function useTabsContext() {
    return useContext( TabsContext );
}

export function TabsProvider( { children }: { children: any } ): React.ReactElement {

    const [ activeTab, setActiveTab ] = React.useState( 0 );

    const handleTabClick = ( index: number ) => {
        localStorage.removeItem( LocalStorageKeys.SELECTED_USER );
        console.log( index )
        setActiveTab( index );
    }

    return (
        <TabsContext.Provider value={{ activeTab, handleTabClick }}>
            {children}
        </TabsContext.Provider>
    )
}