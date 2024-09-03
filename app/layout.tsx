import { ReactNode } from 'react';
import Link from 'next/link';
import {
  ClerkProvider,
  SignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

export const metadata = {
  title: 'My Next.js App',
  description: 'A simple Next.js application using the app directory with TypeScript',
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = (props: RootLayoutProps) => {

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    marginTop: '-10%',
  };

  return (
    <ClerkProvider>
    <html lang="en">
      <body>      
        <SignedOut>
          <div style={containerStyle}>
            <SignIn routing='hash'/>
            </div>
          </SignedOut>
          <SignedIn>
            <header>
          <h1>My Next.js App</h1>
          <nav>
            <UserButton />
            <Link href="/">Home</Link>
          </nav>
        </header>
        <main>{props.children}</main>
        </SignedIn>
        <footer>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
};

export default RootLayout;
