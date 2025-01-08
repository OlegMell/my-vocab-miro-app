import { Word } from '../core/models/word.interface';

export const pinWord = async ( word: Word ) => {
    const body = JSON.stringify( {
        wordId: word._id,
        pinned: !word.pinned
    } );

    return await fetch( 'api/pin-word', {
        body,
        method: 'PATCH'
    } ).catch( err => err );
}