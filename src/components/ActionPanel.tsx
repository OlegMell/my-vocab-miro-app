'use client'

import React, { ReactElement } from 'react';
import ToggleRadioButton from './ToggleRadioButton';

interface ActionPanelProps {
    readonly actions: {
        id: string,
        value: string,
        label: string,
    }[];
    readonly handleClick: ( e ) => void;
}

export default function ActionPanel( { actions, handleClick }: ActionPanelProps ): ReactElement {

    const getToggleButtons = () => {
        return actions
            .map( t => <ToggleRadioButton
                key={t.id}
                name={'mode'}
                id={t.id}
                value={t.value}
                label={t.label}
                handleClick={handleClick}
            />
            );
    }

    return (
        <div className='action-panel'>
            {getToggleButtons()}
        </div>
    )
}