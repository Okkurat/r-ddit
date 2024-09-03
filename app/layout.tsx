import { ReactNode } from 'react';
import Link from 'next/link';
import {
  ClerkProvider,
  SignIn,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import './globals.css';

import connectDB from "@/lib/mongoose";
import Topic from "@/models/topic";

export const metadata = {
  title: 'My Next.js App',
  description: 'A simple Next.js application using the app directory with TypeScript',
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = async (props: RootLayoutProps) => {
  let topics = [];
  try {
    await connectDB();
    topics = await Topic.find();
    topics.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error: any) {
    throw Error(error.message || 'Failed to fetch topic' );
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <SignedOut>
            <div className="flex-grow flex items-center justify-center">
              <SignIn routing='hash' />
            </div>
          </SignedOut>
          <SignedIn>
            <header className="bg-gray-800 text-white p-4">
              <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <nav className="flex items-center space-x-4">
                    <Link href="/" className="text-white hover:underline"><h1 className="text-2xl font-bold">R*ddit</h1></Link>
                    {topics.map((topic) => (
                      <Link key={topic.id} href={`/${topic.name}`} className="text-white hover:underline">
                        {topic.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <UserButton />
              </div>
            </header>
            <main className="flex-grow container mx-auto p-4">
              {props.children}
            </main>
          </SignedIn>
          <footer className="bg-gray-800 text-white text-center p-4">
            <p>&copy; {new Date().getFullYear()} My Next.js App. All rights reserved.</p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
