'use client';

import React from 'react';
import { User } from '../app/core/models/user.inteface';
import { Topic } from '../app/core/models/topic.interface';
import { Topics } from './Topics';
import styles from './styles.module.css';
import Image from 'next/image';
import loaderIco from './../assets/ico/loader.svg';
import { LocalStorageKeys } from '../app/core/enums/local-storage-keys.enum';
import { AddWord } from './AddWord';
import { deleteStudent } from '../app/lib/deleteStudent';

interface StudentProps {
    readonly student: User;
    readonly updateStudents: () => void;
}

export function StudentItem( { student, updateStudents }: StudentProps ): React.ReactElement {

    const [ topics, setTopics ] = React.useState<Topic[] | undefined>( undefined );
    const [ fetching, setFetching ] = React.useState<boolean>( false );
    const [ showAddWord, setShowAddWord ] = React.useState<boolean>( false );

    const handleStudentClick = async () => {
        setFetching( true );

        localStorage.setItem( LocalStorageKeys.SELECTED_USER, student._id );

        const res = await fetch( `/api/topics?studentId=${ student._id }` );
        const topics = await res.json();

        if ( topics ) {
            setTopics( topics.data );
        }

        setFetching( false );
    }

    const addWordClicked = () => {
        setShowAddWord( true );
    }

    const handleDelete = async ( e: any ) => {
        e.stopPropagation();
        await deleteStudent( student._id );
        updateStudents();
    }

    const handleWordAdded = async () => {
        setShowAddWord( false );
    }

    return (
        <>
            <li
                className={`${ styles[ 'clickable-item' ] } ${ styles[ 'actionable' ] } ${ styles[ 'student' ] }`}
                onClick={handleStudentClick}
                key={student._id}>{student.name || student.email}

                <div className={`${ styles[ 'item-actions' ] }`}>
                    {fetching && <Image className='rotation' src={loaderIco} alt='' />}

                    <button type='button' onClick={handleDelete} className={styles[ 'icon-button' ]}>
                        <span className="icon icon-trash"></span>
                    </button>

                </div>

            </li>
            {
                !showAddWord && !!topics && topics.length > 0 && (
                    <div className='sub-items'>
                        <Topics addWordClicked={addWordClicked} userId={student._id} topics={topics} />
                    </div>
                )
            }
            {
                showAddWord && (
                    <AddWord
                        addedCallback={handleWordAdded}
                        user={student}
                        topics={topics || []}
                    />
                )
            }
        </>
    );

}