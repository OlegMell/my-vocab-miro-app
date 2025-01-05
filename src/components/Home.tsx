'use client'

import React, { ReactElement, useState } from 'react'
import { TabsProvider } from './TabsProvider';
import { Tabs } from './Tabs';
import { PageContent } from './PageContent';
import Welcome from './Welcome';
import { findUserByUserId } from '../app/lib/findUser';

export default function Home( { user, userId }: any ): ReactElement {

    const [ currentUser, setCurrentUser ] = useState( user !== 'null' ? JSON.parse( user ) : undefined );

    const updateUser = async () => {
        const user = await findUserByUserId( userId );
        if ( user ) {
            setCurrentUser( user.data );
        }
    }

    return (
        <>
            {
                currentUser ? (
                    <TabsProvider>
                        <Tabs userType={currentUser.type} />
                        <PageContent userSerialized={JSON.stringify( currentUser )} />
                    </TabsProvider>
                ) : (
                    <Welcome
                        updateUser={updateUser}
                        userId={userId}
                    />
                )
            }
        </>
    )
}