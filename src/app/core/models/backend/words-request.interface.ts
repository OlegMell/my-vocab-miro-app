import { Word } from '../word.interface';

export interface WordsRequest {
    readonly data: Word[];
}