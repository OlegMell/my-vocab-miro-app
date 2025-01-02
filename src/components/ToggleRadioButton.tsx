'use client'

import React, { ReactElement } from 'react';

interface ToggleRadioButtonProps {
    readonly id: string;
    readonly label?: string;
    readonly value: string;
    readonly name: string;
    readonly handleClick: ( e ) => void;
}

export default function ToggleRadioButton(
    { id, label, value, name, handleClick }: ToggleRadioButtonProps
): ReactElement {
    return (
        <div className='toggle-radio'>
            <input onClick={handleClick} name={name} value={value} id={id} type="radio" />
            <label htmlFor={id}>{label || ''}</label>
        </div>
    )
}