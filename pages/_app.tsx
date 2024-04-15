import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'; // Adjust the path as needed
import { ClerkProvider } from '@clerk/nextjs';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <ClerkProvider>
            <Component {...pageProps} />
        </ClerkProvider>

    );
}


export default MyApp;