import React from 'react';

export default async function Page() {
    return (
        <div
            style={{
                display: 'flex',
                width: '100vw',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <p style={{ width: '300px', fontSize: '2rem' }}>
                You have been successfully logged in "My Vocab" Miro App!
                <br />
                <i>now you can close this tab and go back to Miro</i>
            </p>
        </div>
    )
}