export const deleteStudent = async ( id: string ) => {
    return await fetch( '/api/students', {
        method: 'DELETE',
        body: JSON.stringify( { id } )
    } ).then( res => res.json() );
}