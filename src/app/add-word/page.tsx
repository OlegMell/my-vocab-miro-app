'use server'

import React from 'react';
import { AddWord } from '../../components/AddWord';
import './../../assets/style.css';
import initMiroAPI from '../../utils/initMiroAPI';
import { getUserByMiroUserId } from '../core/server';

const getMiroUserId = async () => {
    const { userId } = initMiroAPI();
    return userId;
}

export default async function Page() {
    const userId = await getMiroUserId();
    const currentUser = await getUserByMiroUserId( userId! );

    console.log( currentUser )

    return (
        <>
            <h1>Add word page</h1>
            <AddWord serializedUser={JSON.stringify( currentUser )} serializedTopics={JSON.stringify( currentUser.topics )} />
        </>
    )
}