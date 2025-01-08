import { Word } from './models/word.interface';

export const getNavigatorLanguage = () => ( navigator.languages && navigator.languages.length )
    ? navigator.languages[ 0 ].substring( 0, 2 ) : navigator.language || 'en';

export function shuffle( words: Word[], excludePinned = true ): Word[] {
    let pinnedwords: Word[] = [];

    if ( excludePinned ) {
        pinnedwords = words.filter( w => w.pinned );
    }

    const shuffled = [ ...words.filter( w => !w.pinned ) ];
    for ( let i = shuffled.length - 1; i > 0; i-- ) {
        const j = Math.floor( Math.random() * ( i + 1 ) );
        [ shuffled[ i ], shuffled[ j ] ] = [ shuffled[ j ], shuffled[ i ] ];
    }
    return [ ...pinnedwords, ...shuffled ];
}