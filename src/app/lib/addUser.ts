import { User } from '../core/models/user.inteface';

export const addUserToDB = async ( user: Partial<User> ) => {
    const body = user;

    return await fetch( '/api/users', {
        method: 'POST',
        body: JSON.stringify( body )
    } ).then( ( res ) => res.json() );
} 