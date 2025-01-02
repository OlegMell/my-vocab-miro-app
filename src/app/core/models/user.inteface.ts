export interface User {
    _id: string;
    userId: string;
    name: string;
    email: string;
    purchesed: boolean;
    level: string;
    type: any;
    topics: any[];
    students?: User[];
}