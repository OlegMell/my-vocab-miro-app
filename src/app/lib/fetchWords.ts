import { WordsRequest } from '../core/models/backend/words-request.interface';

export const fetchWords = async ( topicId: string, userId?: string ): Promise<WordsRequest> => {
    return await fetch( `/api/words?topicId=${ topicId }${ userId ? `&userId=${ userId }` : '' } ` )
        .then( ( res ) => res.json() );
}