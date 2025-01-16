"use client";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard");
  }, [router]);

  return (
    <div className="position-fixed top-0 start-0 bottom-0 end-0 bg-light">
      <Loading />
    </div>
  );
};

export default Page;
