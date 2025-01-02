export interface Word {
    _id: string;
    word: string;
    translation: string;
    date: number;
    lang: string;
    level: string;
    pinned: boolean;
    marcked: boolean;
}