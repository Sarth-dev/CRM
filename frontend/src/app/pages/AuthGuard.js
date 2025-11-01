"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token:",token)
    // If no token, redirect user to login
    if (!token) {
      router.push("/pages/login");
    }
  }, [router]);

  // Could add loading spinner here if desired

  return <>{children}</>;
}
