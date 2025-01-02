export const findUserByEmail = async ( email: string ) => {
    return await fetch( `/api/users?email=${ email }` )
        .then( res => res.json() );
}

export const findUserByUserId = async ( userId: string ) => {
    return await fetch( `/api/users?userId=${ userId }` )
        .then( res => res.json() );
}

export const findStudents = async () => {
    return await fetch( `/api/students` )
        .then( r => r.json() );
}

export const addStudentToUser = async ( id: string ) => {
    return await fetch( `/api/users`, {
        method: 'PATCH',
        body: JSON.stringify( { id } )
    } ).then( res => res.json() );
} 