import { Inter } from "next/font/google";

import { cn, constructMetadata } from "@/lib/utils";
import Provider from "@/trpc/Provider";

import "./globals.css";
import 'react-loading-skeleton/dist/skeleton.css'
import 'simplebar-react/dist/simplebar.min.css';

import NavBar from "@/components/NavBar.component";
import {Toaster} from '@/components/ui/toaster';

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <Provider>
        <body
          className={cn(
            "min-h-screen font-sans antialiased rounded grainy",
            inter.className
          )}
        >
          <Toaster/>
          <NavBar />
          {children}
        </body>
      </Provider>
    </html>
  );
}
