'use client'

import React, { useEffect, useRef, useState } from 'react'
import { TranslateResponse } from '../app/core/models/backend/translate-response.interface';
import { TranslatedList } from './TranslatedList';
import { useDebounce } from '../app/core/hooks/useDebouse';
import { getNavigatorLanguage } from '../app/core/utils';
import { LocalStorageKeys } from '../app/core/enums/local-storage-keys.enum';
import { getTranslation } from '../app/lib/getTranslation';
import { StickyNote } from '@mirohq/websdk-types';

export interface TranslateFormProps {
    readonly onWordChange: ( word: string ) => void;
    readonly onTranslationChange: ( translation: string ) => void;
    readonly onLangChange: ( lang: string ) => void;
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

        miro.board.ui.on( 'selection:update', async () => {

            let selectedItems = await miro.board.getSelection();

            // Filter sticky notes from selected items
            let stickyNotes = selectedItems.filter( ( item ) => item.type === 'sticky_note' );

            if ( stickyNotes && stickyNotes.length ) {
                const [ word, translation ] = ( stickyNotes[ 0 ] as StickyNote ).content.split( '-' );

                if ( !word || !translation ) {
                    return;
                }

                inpFromRef.current.value = word;
                inpToRef.current.value = translation;
                fromRef.current.value = 'auto';
                toRef.current.value = 'auto';

                onWordChange( word );
                onTranslationChange( translation );
            }

        } );

    }, [] )

    useEffect( () => {
        return () => {
            localStorage.removeItem( LocalStorageKeys.TOPIC_ID );
        }
    }, [] );

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
        const res = await getTranslation(
            value,
            fromRef.current?.value,
            toRef.current?.value
        );

        const translateResponse: TranslateResponse = await res.json();

        if ( translateResponse.raw && translateResponse.raw.length && translateResponse.raw[ 1 ] ) {
            const parts = translateResponse.raw[ 1 ];

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
        onTranslationChange( translateResponse.translated );
        onLangChange( fromRef.current.value );

        setTranslated( translateResponse.translated );
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

    const onTranslationLangChange = ( { target }: any ) => {
        submit( inpFromRef.current?.value );
    }

    return (
        <form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                <div className="form-group">
                    <select ref={fromRef} className="select select-small">
                        <option selected value="auto">Auto</option>
                        <option value="en">English</option>
                        <option value="fr">France</option>
                        <option value="de">German</option>
                        <option value="pl">Polish</option>
                        <option value="es">Spanish</option>
                        <option value="sk">Slovak</option>
                        <option value="cs">Czech</option>
                        <option value="sl">Slovenian</option>
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
                <br />
                <div className="form-group">
                    <label htmlFor="translation"></label>
                    <select id='translation' ref={toRef} defaultValue={langTo} onChange={onTranslationLangChange} className="select select-small">
                        <option value="en">English</option>
                        <option value="fr">France</option>
                        <option value="de">German</option>
                        <option value="pl">Polish</option>
                        <option value="es">Spanish</option>
                        <option value="sk">Slovak</option>
                        <option value="cs">Czech</option>
                        <option value="sl">Slovenian</option>
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