import React, { SelectHTMLAttributes } from 'react';

export interface ValueLabel {
    value: string;
    label: string;
}

export interface LangSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    langs: ValueLabel[];
    ref: React.LegacyRef<HTMLSelectElement> | undefined;
    hasAuto?: boolean;
}

export const LangSelect = ({
                               langs,
                               ref,
                               hasAuto,
                               onChange,
                               defaultValue,
                               className
                           }: LangSelectProps) => {
    return (
        <select
            ref={ ref }
            defaultValue={ defaultValue }
            onChange={ onChange }
            className={ className }>
            { hasAuto && <option selected value="auto">Auto</option> }
            {
                langs.map((lang) => (
                        <option value={ lang.value }>{ lang.label }</option>
                    )
                )
            }
        </select>
    )
}
