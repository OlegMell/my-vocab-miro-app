'use client'

import React, { useEffect, useRef, useState } from 'react'
import { TranslateRequest } from '../app/core/models/backend/translate-request.interface';
import { TranslateResponse } from '../app/core/models/backend/translate-response.interface';
import { TranslatedList } from './TranslatedList';
import { useDebounce } from '../app/core/hooks/useDebouse';
import { getNavigatorLanguage } from '../app/core/utils';

export interface TranslateFormProps {
    onWordChange: ( word: string ) => void;
    onTranslationChange: ( translation: string ) => void;
    onLangChange: ( lang: string ) => void;
}

export function TranslateForm( {
    onWordChange,
    onTranslationChange,
    onLangChange }: TranslateFormProps
): React.ReactElement {

    const [ searchVal, setSearchVal ] = useState( "" );
    const [ debounceVal, setDebounceVal ] = useState( "" );

    const debounceValue = useDebounce( searchVal, 300 );

    const [ translated, setTranslated ] = useState<string | undefined>();
    const [ partsMap, setPartsMap ] = useState<{ key: string, values: any[] }[] | undefined>( undefined );
    const [ langTo, setLangTo ] = useState<string | undefined>( getNavigatorLanguage() );

    const inpFromRef: any = useRef();
    const inpToRef: any = useRef();
    const fromRef: any = useRef();
    const toRef: any = useRef();

    useEffect( () => {
        setDebounceVal( searchVal );
    }, [ debounceValue ] );

    useEffect( () => {
        if ( debounceVal ) {
            submit( debounceVal );
        }
    }, [ debounceVal ] );

    const handleChange = ( e: any ) => {
        setSearchVal( e.target.value );
    };

    const submit = async ( value: string ) => {

        const body: string = JSON.stringify( {
            text: value,
            to: toRef.current?.value,
            from: fromRef.current?.value
        } as TranslateRequest );

        const res = await fetch( '/api/translate', {
            body,
            method: 'POST',
        } );

        const ttt: TranslateResponse = await res.json();

        if ( ttt.raw && ttt.raw.length && ttt.raw[ 1 ] ) {
            const parts = ttt.raw[ 1 ];

            const partsTmp = [];

            if ( parts.length ) {
                for ( const part of parts ) {
                    partsTmp.push( {
                        key: part[ 0 ],
                        values: part[ 2 ]
                    } );
                };
            }

            setPartsMap( partsTmp );
        }

        onWordChange( value );
        onTranslationChange( ttt.translated );
        onLangChange( fromRef.current.value );

        setTranslated( ttt.translated );

        // inpToRef.current.focus();
    }

    const swap = () => {
        const from = fromRef.current.value;
        fromRef.current.value = toRef.current.value;
        toRef.current.value = from;

        const fromLang = inpFromRef.current.value;
        inpFromRef.current.value = inpToRef.current.value;
        inpToRef.current.value = fromLang;
    }

    const handleTranslationChange = ( translation: string ) => {
        inpToRef.current.value = translation;
        setTranslated( translation );
        onTranslationChange( translation );
    }

    return (
        <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                <div className="form-group">
                    <label htmlFor="select-1">Translate from</label>
                    <select ref={fromRef} className="select select-small">
                        <option value="en">English</option>
                        <option value="fr">France</option>
                        <option value="ru">Russian</option>
                        <option value="uk">Ukrainian</option>
                    </select>
                </div>
                <div className="form-group">
                    <textarea
                        ref={inpFromRef}
                        onChange={handleChange}
                        className="textarea"
                        placeholder="Enter text to translate"
                        spellCheck="true"
                    />
                </div>
                <button onClick={swap} title='Swap translation' type='button' className={`swap-button`}>
                    <span style={{ 'transform': "rotate(90deg)" }} className="icon icon-fit"></span>
                </button>
                <div className="form-group">
                    <label htmlFor="select-1">Translate to</label>
                    <select ref={toRef} defaultValue={langTo} className="select select-small">
                        <option value="en">English</option>
                        <option value="fr">France</option>
                        <option value="ru">Russian</option>
                        <option value="uk">Ukrainian</option>
                    </select>
                </div>
                <div className="form-group">
                    <textarea
                        ref={inpToRef}
                        value={translated}
                        className="textarea"
                        placeholder="Translation"
                        spellCheck="true"
                        id="textarea-example"
                    />
                </div>
            </div>

            <TranslatedList
                changeTranslation={handleTranslationChange}
                translated={!!translated}
                partsMap={partsMap}
            />

        </form >
    )
}