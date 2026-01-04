import React, { forwardRef, LegacyRef, SelectHTMLAttributes } from 'react';

export interface ValueLabel {
    value: string;
    label: string;
}

export interface LangSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    langs: ValueLabel[];
    hasAuto?: boolean;
}

export const LangSelect = forwardRef(({
                                          langs,
                                          hasAuto,
                                          onChange,
                                          defaultValue,
                                          className
                                      }: LangSelectProps, ref: LegacyRef<HTMLSelectElement> | undefined) => {
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
})
