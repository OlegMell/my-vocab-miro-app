import translate from '@iamtraction/google-translate';
import { NextRequest, NextResponse } from 'next/server';

import { TranslateRequest } from '../../core/models/backend/translate-request.interface';

export async function POST( req: NextRequest ) {
    const query: TranslateRequest = await req.json();
    // console.log( { query } );
    const res = await translate( query.text, { to: query.to, from: query.from || '', raw: true } );
    // console.dir( res.raw, { showHidden: true } )
    return NextResponse.json( { translated: res.text, raw: res.raw } );
}