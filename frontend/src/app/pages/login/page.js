"use client";

import { useState } from "react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreds, setShowCreds] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userOrgId", data.user.org_id);

        if (data.user.role === "superadmin") {
          window.location.href = "/orgs";
        } else if (data.user.role === "admin") {
          window.location.href = `/orgs/${data.user.org_id}/admins`;
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center text-gray-800 justify-center min-h-screen bg-gray-100 p-4">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
        onSubmit={handleLogin}
        aria-label="Login Form"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">CRM Login</h2>

        {error && (
          <div
            role="alert"
            className="mb-4 p-2 bg-red-100 text-red-600 rounded"
          >
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          aria-label="Email"
          autoComplete="email"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
          aria-label="Password"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
          aria-busy={loading}
          aria-label="Login"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center">
          Forgot credentials?{" "}
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => setShowCreds((v) => !v)}
            aria-expanded={showCreds}
          >
            {showCreds ? "Hide" : "Show"} Superadmin Credentials
          </button>
        </p>

        {showCreds && (
          <div className="mt-3 px-3 py-2 bg-gray-200 rounded text-sm" role="region" aria-live="polite">
            <div>
              <span className="font-semibold">Email:</span> superadmin@example.com
            </div>
            <div>
              <span className="font-semibold">Password:</span> password123
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
