import { Word } from '../core/models/word.interface';

export const addWordRequest = async ( word: Partial<Word>, userId: string ) => {

    const body = {
        word: {
            ...word,
            userId,
        },
    };

    return await fetch( '/api/words', {
        body: JSON.stringify( body ),
        method: 'POST',
    } );
}