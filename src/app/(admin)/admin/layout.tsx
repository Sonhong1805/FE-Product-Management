import StoreProvider from "@/contexts/StoreProvider";
import type { Metadata } from "next";
import UserAuthentication from "@/contexts/UserAuthentication";
import ProtectedRoute from "@/contexts/ProtectedRoute";
import LayoutAdmin from "@/components/Layout/LayoutAdmin";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <UserAuthentication>
        <ProtectedRoute>
          <LayoutAdmin>{children}</LayoutAdmin>
        </ProtectedRoute>
      </UserAuthentication>
    </StoreProvider>
  );
}
