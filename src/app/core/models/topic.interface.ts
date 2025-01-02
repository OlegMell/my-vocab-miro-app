import { Word } from './word.interface';

export interface Topic {
    readonly _id: string;
    readonly name: string;
    readonly description?: string;
    readonly words: Word[];
}