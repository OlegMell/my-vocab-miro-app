'use client';

import React, { useEffect, useState } from 'react';
import { StudentItem } from './StudentItem';
import { User } from '../app/core/models/user.inteface';
import styles from './styles.module.css';
import AddStudent from './AddStudent';
import { findStudents } from '../app/lib/findUser';
import Loader from './Loader';
import { Tooltip as ReactTooltip } from "react-tooltip";

export function Students(): React.ReactElement {
    const [ showAddStudenForm, setShowAddStudentForm ] = useState( false );
    const [ _students, setStudents ] = useState<User[]>();
    const [ fetching, setFetching ] = useState<boolean>( false );

    useEffect( () => {
        fetchStudent();
    }, [] );

    const handleAddedStudent = async () => {
        setShowAddStudentForm( false );
        fetchStudent();
    }

    const fetchStudent = async () => {
        setFetching( true );
        const res = await findStudents().catch( () => setFetching( false ) );
        setStudents( res.data.students );
        setFetching( false );
    }

    return (
        <>
            <h2 className={`title students-title`}>
                Students

                <div className={`${ styles[ 'item-actions' ] }`}>
                    {( fetching && _students ) && <Loader fullSize={false} />}

                    <button
                        data-tooltip-id='addStudentTooltip'
                        onClick={() => setShowAddStudentForm( !showAddStudenForm )}
                        type='button'
                        className={styles[ 'icon-button' ]}>
                        <span className="icon icon-shared-with"></span>
                    </button>
                </div>
            </h2>
            {
                showAddStudenForm && <AddStudent handleAdded={handleAddedStudent} />
            }
            {
                _students
                && <ul className={styles.students}>
                    {
                        _students
                            ? _students.map( student => <StudentItem
                                updateStudents={fetchStudent}
                                key={student._id}
                                student={student} /> )
                            : !fetching ? <li>No students</li> : ''
                    }
                </ul>
            }
            {( fetching && !_students ) && < Loader fullSize={true} />}

            <ReactTooltip
                id="addStudentTooltip"
                place="bottom"
                content="Add student"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            />
        </>
    );
}