"use client";

import { useAppSelector } from "@/lib/hooks";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const RoleRoute = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user.userInfo);

  if (pathname.startsWith("/admin") && user?.role?.permissions.length > 0) {
    return <>{children}</>;
  } else {
    return <div>Không phải admin</div>;
  }
};

export default RoleRoute;
