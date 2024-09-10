import { ReactNode } from 'react';
import { dark } from '@clerk/themes';
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

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = async (props: RootLayoutProps) => {
  let topics = [];
  try {
    await connectDB();
    topics = await Topic.find();
    topics.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error: unknown) {
    if(error instanceof Error){
      throw Error(error.message || 'Failed to fetch topic' );
    }
    else {
      throw Error('A unknown error occured');
    }
  }

  return (
    <ClerkProvider appearance={{ baseTheme: dark, }}>
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
                <nav className="bg-[#2C2C32] flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
                  <Link href="/" className="text-white hover:underline">
                    <h1 className="text-2xl font-bold text-white" style={{
                      textShadow: `-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000`
                    }}>
                      R*ddit
                    </h1>
                  </Link>
                  {topics.map((topic) => (
                    <Link key={topic.id} href={`/${topic.name}`} className="text-[#C6C6D9] hover:underline">
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