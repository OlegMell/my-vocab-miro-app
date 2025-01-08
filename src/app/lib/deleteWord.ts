export const deleteWord = async ( wordId: string ) => {
    return await fetch( `api/words?id=${ wordId }`, {
        method: 'DELETE'
    } );
}