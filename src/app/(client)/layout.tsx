import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../scss/globals.scss";

import StoreProvider from "@/contexts/StoreProvider";
import UserAuthentication from "@/contexts/UserAuthentication";
import LayoutClient from "@/components/Layout/LayoutClient";
import "viewerjs/dist/viewer.css";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StoreProvider>
          <UserAuthentication>
            <LayoutClient>{children}</LayoutClient>
          </UserAuthentication>
        </StoreProvider>
      </body>
    </html>
  );
}
