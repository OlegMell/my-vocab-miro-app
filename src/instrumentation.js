import dbConnect from './db';

export async function register() {
    await dbConnect();
}