"use client";
import { useAppSelector } from "@/lib/hooks";
import React from "react";

const Page = () => {
  const userPermissions = useAppSelector(
    (state) => state.user.userInfo.role.permissions
  );
  console.log(userPermissions);

  return <div>Dashboard</div>;
};

export default Page;
