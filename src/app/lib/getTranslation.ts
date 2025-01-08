import { TranslateRequest } from '../core/models/backend/translate-request.interface';

export const getTranslation = async ( text: string, from: string, to: string ) => {
    try {
        const body: string = JSON.stringify( {
            text,
            to,
            from,
        } as TranslateRequest );

        return await fetch( '/api/translate', {
            body,
            method: 'POST',
        } ).catch( err => err );
    } catch ( e ) {
        alert( 'Something went wrong!' );
        return new Promise( ( resolve, reject) => {
            reject('Error')
        });
    }
}