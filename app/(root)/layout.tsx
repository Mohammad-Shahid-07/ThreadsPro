import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs";


// Components
import TopBar from '@/components/shared/Topbar';
import LeftSidebar from '@/components/shared/Leftbar';
import RightSidebar from '@/components/shared/Rightbar';
import BottomBar from '@/components/shared/Bottombar';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Threads Pro',
  description: 'Threads Pro is a social media platform for Users to be mad at Everyone.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <TopBar />
        <main className='flex flex-row'>
          <LeftSidebar />
          <section className='main-container'>
            <div className='w-full max-w-4xl'>
              {children}
            </div>
          </section>
          <RightSidebar />
        </main>
        <BottomBar />
        </body>
    </html>
    </ClerkProvider>
  )
}
