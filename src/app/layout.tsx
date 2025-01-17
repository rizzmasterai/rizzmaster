import type { Metadata } from "next";
import { Unbounded } from 'next/font/google'
import { Providers } from './providers';
import "./globals.css";
const unbounded = Unbounded({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-unbounded',
})

export const metadata: Metadata = {
  title: "rizzmaster69 - $master",
  description: "Level up your rizz game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${unbounded.variable} antialiased`}
      >
          <Providers>
        {children}

          </Providers>
      </body>
    </html>
  );
}
