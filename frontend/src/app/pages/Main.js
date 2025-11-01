"use client"
/* eslint-disable @next/next/no-html-link-for-pages */
import React from 'react';
import { useRouter } from "next/navigation";

export default function Main() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userOrgId");
    router.push("/pages/login"); // redirect to login after logout
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-800 bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-12">Welcome to the CRM</h1>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Existing Users</h2>
          <a
            href="/pages/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded shadow hover:bg-blue-700 transition"
          >
            Login
          </a>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </div>
  );
}
