import * as React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `BookArcade - Indo`,
    description:
      "Aplikasi membaca dan menulis novel atau cerpen serta memberikan ulasan pada buku yang di baca",
    authors: [{ name: "Mogo Studio", url: `${process.env.NEXT_PUBLIC_API_URL}` }],
  };
}

const inter = Inter({ subsets: ["latin"] });

import Global from "./global";
import AdSense from "@/components/fragments/adsense";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="bg-white dark:bg-primary-dark" lang="en">
      <head>
        <AdSense pId="4121473407235803" />
      </head>
      <body
        className={`${inter.className} flex overflow-x-hidden bg-white dark:bg-primary-dark min-h-screen`}
      >
        <Global>{children}</Global>
      </body>
    </html>
  );
}
