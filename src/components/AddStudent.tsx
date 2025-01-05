'use client'

import React, { ReactElement, useState } from 'react'
import { addStudentToUser, findUserByEmail } from '../app/lib/findUser';
import { User } from '../app/core/models/user.inteface';

interface AddStudentProps {
    handleAdded: () => void;
}

export default function AddStudent( { handleAdded }: AddStudentProps ): ReactElement {
    const [ email, setEmail ] = useState();
    const [ foundUser, setFoundUser ] = useState<User>();

    const changeEmail = ( e ) => {
        setEmail( e.target.value );
    }

    const findStudent = async () => {
        const res = await findUserByEmail( email! );
        setFoundUser( res.data );
    }

    const addStudent = async () => {
        const res = await addStudentToUser( foundUser!._id );
        if ( res && res.message === 'success' ) {
            handleAdded();
        }
    }

    return (
        <div>
            <hr />
            <h3>Add student</h3>
            <br />
            <div className="form-group">
                <label htmlFor="name">Find student by email</label>
                <input
                    value={email}
                    onChange={changeEmail}
                    className="input"
                    id='name'
                    placeholder='Enter your student email for search..'
                    pattern='/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/'
                />
            </div>
            <button
                onClick={findStudent}
                className='button button-primary button-medium'>Find</button>

            {
                foundUser
                    ? (
                        <p onClick={addStudent} title='Click to add' className='found-user'>
                            {foundUser.name} | {foundUser.email}
                        </p>
                    )
                    : <p>User not found! Check email and try again!</p>
            }
        </div>
    )
}