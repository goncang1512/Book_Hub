import * as React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookHub - Indo",
  description:
    "Aplikasi membaca dan menulis novel atau cerpen serta memberikan ulasan pada buku yang di baca",
  authors: [{ name: "Mogo Studio", url: `${process.env.NEXT_PUBLIC_API_URL}` }],
};

const inter = Inter({ subsets: ["latin"] });

import Global from "./global";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex overflow-x-hidden`}>
        <Global>{children}</Global>
      </body>
    </html>
  );
}
