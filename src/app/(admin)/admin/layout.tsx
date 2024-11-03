import StoreProvider from "@/contexts/StoreProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../../../scss/globals.scss";
import UserAuthentication from "@/contexts/UserAuthentication";
import ProtectedRoute from "@/contexts/ProtectedRoute";
import LayoutAdmin from "@/components/Layout/LayoutAdmin";
import "viewerjs/dist/viewer.css";

const geistSans = localFont({
  src: "../../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../../fonts/GeistMonoVF.woff",
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
            <ProtectedRoute>
              <LayoutAdmin>{children}</LayoutAdmin>
            </ProtectedRoute>
          </UserAuthentication>
        </StoreProvider>
      </body>
    </html>
  );
}
