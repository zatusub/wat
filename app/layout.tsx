import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Amplify } from 'aws-amplify';
import config from '@/src/amplifyconfiguration.json';
import "./globals.css";

Amplify.configure(config);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "wat!?",
  description: "エラーから原因を特定するプログラミング学習ツールです",
  verification: {
    google: "Ofa0C5PcwYpoorFA5uh_QcP1YWGLyX3m-BeBY2TjEvE",
  },
  icons: {
    icon: "/topimage.png",
  },
  openGraph: {
    title: "wat!?",
    description: "エラーから原因を特定するプログラミング学習ツールです",
    images: ["/topimage.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/topimage.png"],
  },
};

import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
