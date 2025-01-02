'use client';

import React, { useEffect, useState } from 'react';
import { StudentItem } from './StudentItem';
import { User } from '../app/core/models/user.inteface';
import styles from './styles.module.css';
import AddStudent from './AddStudent';
import { findStudents } from '../app/lib/findUser';

interface StudentsProps {
    readonly students: User[] | undefined;
}

export function Students(): React.ReactElement {
    const [ showAddStudenForm, setShowAddStudentForm ] = useState( false );
    const [ _students, setStudents ] = useState();

    useEffect( () => {
        console.log( 'HERE' )
        updateStudent();
    }, [] );

    const handleAddedStudent = async () => {
        setShowAddStudentForm( false );
        const res = await findStudents();
        setStudents( res.data.students );
    }

    const updateStudent = async () => {
        const res = await findStudents();
        console.log( res )
        setStudents( res.data.students );
    }

    return (
        <>
            <h2 className={`title students-title`}>
                Students

                <button onClick={() => setShowAddStudentForm( !showAddStudenForm )} type='button' className={styles[ 'icon-button' ]}>
                    <span className="icon icon-shared-with"></span>
                </button>
            </h2>
            {
                showAddStudenForm && <AddStudent handleAdded={handleAddedStudent} />
            }
            <ul className={styles.students}>
                {
                    _students
                        ? _students.map( student => <StudentItem
                            updateStudents={updateStudent}
                            key={student._id}
                            student={student} /> )
                        : <li>No students</li>
                }
            </ul>
        </>
    );
}