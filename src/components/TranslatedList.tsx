import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import ico from './../assets/ico/arrow-down.svg';

export interface TranslatedListProps {
    translated: boolean | undefined;
    partsMap: { key: string; values: any[] }[] | undefined;
    changeTranslation: ( translation: string ) => void;
}

export function TranslatedList( { translated, partsMap, changeTranslation }: TranslatedListProps ): React.ReactElement {

    const [ isExpandedShowMorePanel, setisExpandedShowMorePanel ] = useState<boolean>( false );

    const toggleShowMore = () => {
        setisExpandedShowMorePanel( !isExpandedShowMorePanel );
    }

    return (
        <>
            {
                translated ? <div>
                    <div style={{ overflow: 'hidden', maxHeight: isExpandedShowMorePanel ? 'max-content' : '150px' }}>

                        {
                            partsMap && partsMap.map( ( part ) => (
                                <div key={part.key}>
                                    <h4 className='part-title'>{part.key}</h4>
                                    <ul>
                                        {part.values.map( ( value ) => (
                                            <li
                                                className='translation'
                                                onClick={
                                                    ( e ) => { e.stopPropagation; changeTranslation( value[ 0 ] ) }
                                                }
                                                key={new Date().getTime() * ( Math.random() / 100 )}>
                                                {value[ 0 ]}
                                            </li>
                                        ) )}
                                    </ul>
                                </div>
                            ) )
                        }

                    </div>
                    <button type='button' className={styles[ 'button-hollow' ]} onClick={toggleShowMore}>
                        {!isExpandedShowMorePanel ? 'Expand more' : 'Collapse'}
                        {
                            !isExpandedShowMorePanel
                                ? <Image src={ico} alt='ico' />
                                : <Image style={{ 'transform': "rotate(180deg)" }} src={ico} alt='ico' />}
                    </button>
                </div> : ''
            }
        </>
    );
}