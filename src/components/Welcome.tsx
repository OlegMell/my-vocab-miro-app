'use client'

import React, { useState } from 'react';
import { addUserToDB } from '../app/lib/addUser';
import { useForm } from 'react-hook-form';

export default function Welcome( { userId, updateUser }: any ): React.ReactElement {

    const [ error, setError ] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = handleSubmit( async data => {
        const response = await addUserToDB( {
            userId,
            name: data.name,
            email: data.email,
            type: data.userType,
            purchesed: false,
            students: [],
            topics: [],
            level: data.level,
        } );

        if ( 'error' in response ) {
            setError( response.error );
            return;
        }

        updateUser();
    } );

    return (
        <>
            <h2>Welcome!</h2>
            <p>Here you can store your vocabulary and learn new words!</p>
            <br />
            <p>Let me know you better) <br />Please, answer a few questions below:</p>
            <br />

            <form
                onSubmit={e => e.preventDefault()}
                noValidate>

                <div className="form-group">
                    <label htmlFor="name">Your name *</label>
                    <input
                        className="input"
                        id='name'
                        placeholder='Enter your name or nickname'
                        {...register( 'name', {
                            required: {
                                value: true,
                                message: 'required',
                            },
                        } )}
                    />
                    {errors.name && <p className='validation-error'>Required</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                        id='email'
                        className="input"
                        type="text"
                        placeholder="Enter your email"
                        {...register( 'email', {
                            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                            required: {
                                value: true,
                                message: 'required',
                            },
                        } )}
                    />
                    {errors.email && <p className='validation-error'>Required</p>}
                </div>

                <hr />

                <p>You are: *</p>
                <br />
                <label className="radiobutton">
                    <input
                        type="radio"
                        name="type"
                        value='teacher'
                        {...register( 'userType', {
                            required: {
                                value: true,
                                message: 'required',
                            },
                        } )}
                    />
                    <span>Teacher</span>
                </label>
                <label className="radiobutton">
                    <input
                        type="radio"
                        name="type"
                        value='student'
                        {...register( 'userType', {
                            required: {
                                value: true,
                                message: 'required',
                            },
                        } )}
                    />
                    <span>Student</span>
                </label>

                {errors.userType && <p className='validation-error'>Required</p>}

                <hr />

                <p>What is your level of language proficiency? *</p>
                <br />
                <label className="radiobutton">
                    <input
                        type="radio"
                        name="level"
                        value='beginner'
                        {...register( 'level', {
                            required: {
                                value: true,
                                message: 'required',
                            },
                        } )}
                    />
                    <span>beginner</span>
                </label>
                <label className="radiobutton">
                    <input
                        type="radio"
                        name="level"
                        value='intermediate'
                        {...register( 'level', {
                            required: {
                                value: true,
                                message: 'required',
                            },
                        } )}
                    />
                    <span>intermediate</span>
                </label>
                <label className="radiobutton">
                    <input
                        type="radio"
                        name="level"
                        value='advanced'
                        {...register( 'level', {
                            required: {
                                value: true,
                                message: 'required',
                            },
                        } )}
                    />
                    <span>advanced</span>
                </label>

                {errors.level && <p className='validation-error'>Required</p>}

                <hr />

                {/* <p>Is progress in the form of statistics and achievements important to you?</p>
            <label className="checkbox">
                <input type="checkbox" onChange={handleProgress} />
                <span>Yes</span>
            </label> */}

                <button onClick={onSubmit} className='button button-primary'>Let's go!</button >
                {error && <p className='validation-error'>{error}</p>}
            </form>
        </>
    )
}