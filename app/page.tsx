"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
};

export default Dashboard;