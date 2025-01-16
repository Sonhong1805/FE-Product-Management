"use client";
import Loading from "@/components/Loading";
import { saveUserInfo } from "@/lib/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import AuthService from "@/services/auth";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const UserAuthentication = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const publicRoutes = [
    "/login",
    "/register",
    "/",
    "/blog",
    "/about",
    "/contact",
    "/product",
    "/shop",
    "/admin",
    "/password",
  ];

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("access_token")) {
        const response = await AuthService.account();
        if (response?.data) {
          dispatch(saveUserInfo(response.data.user));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isLoading ||
      publicRoutes.some((route) => pathname.startsWith(route)) ? (
        children
      ) : (
        <Loading />
      )}
    </>
  );
};

export default UserAuthentication;
