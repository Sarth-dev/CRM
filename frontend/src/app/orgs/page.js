/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../pages/AuthGuard";

export default function Organisations() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newOrgName, setNewOrgName] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchOrgs = () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load organisations");
        return r.json();
      })
      .then(setOrgs)
      .catch(() => setError("Failed to load organisations"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleAddOrg = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ name: newOrgName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add organisation");
        return res.json();
      })
      .then((org) => {
        setOrgs((prev) => [...prev, org]);
        setNewOrgName("");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Manage Organisations</h1>

        {error && <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>}

        <form onSubmit={handleAddOrg} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="New Organisation Name"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            required
            className="flex-grow p-2 border rounded"
          />
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 rounded">
            Add
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="border rounded divide-y divide-gray-300">
            {orgs.map((org) => (
              <li key={org.id} className="p-4 hover:bg-gray-100 hover:text-gray-800 flex justify-between items-center">
                <span>{org.name}</span>
                <div className="flex gap-4">
                  <a href={`/orgs/${org.id}/admins`} className="text-blue-600 hover:underline">
                    Manage Admins
                  </a>
                  <a href={`/orgs/${org.id}/customers`} className="text-green-600 hover:underline">
                    Manage Customers
                  </a>
                </div>
              </li>
            ))}
            {orgs.length === 0 && <li className="p-4 text-gray-600">No organisations found</li>}
          </ul>
        )}
      </div>
    </AuthGuard>
  );
}
