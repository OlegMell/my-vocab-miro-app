import React from 'react';
import Image from 'next/image';
import logo from './../../assets/ico/logo.svg';

export default async function Page() {
    return (
        <div
            style={{
                display: 'flex',
                height: '80vh',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                whiteSpace: 'pretty'
            }}>
            <div>
                <Image src={logo} alt='app logo' />
            </div>
            <p style={{ width: 'max-content', fontSize: '2rem', padding: 0, margin: 0 }}>
                You have been successfully logged in "My Vocab" Miro App!
                <br />
                <br />
                <i>now you can close this tab and go back to your Miro board</i>
            </p>
        </div>
    )
}