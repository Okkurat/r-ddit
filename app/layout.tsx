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
            <header>
                <div className="flex-col gap-4">
                  <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
                    <Link href="/" className="text-white hover:underline"><h1 className="text-2xl font-bold">R*ddit</h1></Link>
                    {topics.map((topic) => (
                      <Link key={topic.id} href={`/${topic.name}`} className="text-white hover:underline">
                        {topic.name}
                      </Link>
                    ))}
                    <UserButton />
                  </nav>
                </div>
            </header>
            <main className="flex-grow container mx-auto p-4">
              {props.children}
            </main>
          </SignedIn>
          <footer>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
