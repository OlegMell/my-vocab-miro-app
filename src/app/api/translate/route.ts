import translate from '@iamtraction/google-translate';
import { NextResponse } from 'next/server';
import { TranslateRequest } from '../../core/models/backend/translate-request.interface';
import { withAuth } from '../../lib/withAuth';

async function POST( req: any ) {
    const query: TranslateRequest = await req.json();
    const res = await translate( query.text, { to: query.to, from: query.from || '', raw: true } );
    return NextResponse.json( { translated: res.text, raw: res.raw } );
}

const POSTHandler = withAuth( POST );
export { POSTHandler as POST };