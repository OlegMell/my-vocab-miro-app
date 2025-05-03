import { NextResponse } from 'next/server';
import usersModel from '../../core/models/db/users.model';
import { User } from '../../core/models/user.inteface';
import { withAuth } from '../../lib/withAuth';

async function GET( req: any, res: any, userId?: any ) {
    const users = await usersModel.findOne( { userId } )
        .populate( 'students' )
        .exec();

    return NextResponse.json( { data: users ?? [] } );
};

const GETHandler = withAuth( GET );
export { GETHandler as GET };

async function DELETE( req: any, res: any, userId?: any ) {
    const body = await req.json();

    const user = await usersModel.findOne( { userId } ).exec();

    if ( !user ) {
        return NextResponse.json( { message: 'fail', error: 'User not found' }, { status: 404 } );
    }

    user.students = user.students.filter( ( student: User ) => student._id.toString() !== body.id );
    await user.save();

    return NextResponse.json( { data: user._id } );
}

const DELETEHandler = withAuth( DELETE );
export { DELETEHandler as DELETE };