"use client";
import NotPermitted from "@/components/NotPermitted";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isFirstRender = useRef(true);
  const isAuthenticated = useAppSelector((state) => state.user.isAuthenticated);
  const userInfo = useAppSelector((state) => state.user.userInfo);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (userInfo.role && userInfo.role.permissions.length > 0) {
    return <>{children}</>;
  } else {
    return <NotPermitted />;
  }
};

export default ProtectedRoute;
