"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/admin");
    } else {
      router.replace("/login");
    }
  }, []);

  return null;
};

export default Home;
