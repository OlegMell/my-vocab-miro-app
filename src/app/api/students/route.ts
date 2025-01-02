import { NextRequest, NextResponse } from 'next/server';
import usersModel from '../../core/models/db/users.model';
import initMiroAPI from '../../../utils/initMiroAPI';
import { User } from '../../core/models/user.inteface';

export async function GET( req: NextRequest ) {
    const { userId: currentUserId } = initMiroAPI();

    const users = await usersModel.findOne( { userId: currentUserId } )
        .populate( 'students' )
        .exec();

    return NextResponse.json( { data: users } );
}

export async function DELETE( req: NextRequest ) {
    const { userId: currentUserId } = initMiroAPI();

    const body = await req.json();

    const user = await usersModel.findOne( { userId: currentUserId } ).exec();

    if ( !user ) {
        return NextResponse.json( { message: 'fail', error: 'User not found' }, { status: 404 } );
    }

    user.students = user.students.filter( ( student: User ) => student._id.toString() !== body.id );
    await user.save();

    return NextResponse.json( { data: user._id } );
}