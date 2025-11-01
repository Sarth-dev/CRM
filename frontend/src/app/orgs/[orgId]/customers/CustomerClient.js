"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomersClient({ orgId }) {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ uid: "", device_id: "", name: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchCustomers = () => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (!orgId) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/customers`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load customers");
        return res.json();
      })
      .then((data) => {
        setCustomers(data.data || []);
        setError("");
      })
      .catch(() => setError("Failed to load customers"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, [orgId]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add customer");
      }

      const newCustomer = await res.json();
      setCustomers((prev) => [...prev, newCustomer]);
      setForm({ uid: "", device_id: "", name: "", email: "" });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const startEdit = (customer) => {
    setEditingId(customer.id);
    setForm({
      uid: customer.uid,
      device_id: customer.device_id,
      name: customer.name,
      email: customer.email || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ uid: "", device_id: "", name: "", email: "" });
    setError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updatePayload = { ...form };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/customers/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update customer");
      }

      const updatedCustomer = await res.json();
      setCustomers((prev) => prev.map((c) => (c.id === editingId ? updatedCustomer : c)));
      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete customer");
      }
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Customers for Organisation {orgId}</h1>

      {error && <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>}

      <form onSubmit={editingId ? handleUpdate : handleAdd} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-2">
        <input
          type="text"
          name="uid"
          placeholder="UID"
          value={form.uid}
          onChange={handleChange}
          required
          className="p-2 border rounded md:col-span-1"
        />
        <input
          type="text"
          name="device_id"
          placeholder="Device ID"
          value={form.device_id}
          onChange={handleChange}
          required
          className="p-2 border rounded md:col-span-1"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="p-2 border rounded md:col-span-1"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-2 border rounded md:col-span-1"
        />

        <div className="md:col-span-1 flex gap-2">
          <button type="submit" disabled={loading} className="w-full py-2 rounded text-white font-semibold bg-green-600 hover:bg-green-700 transition">
            {loading ? (editingId ? "Saving..." : "Adding...") : editingId ? "Save" : "Add"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} disabled={loading} className="w-full py-2 rounded bg-gray-400 hover:bg-gray-500 text-white font-semibold transition">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && !editingId ? (
        <p>Loading customers...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-800">
              <th className="p-2">UID</th>
              <th className="p-2">Device ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b text-center last:border-none">
                <td className="p-2">{c.uid}</td>
                <td className="p-2">{c.device_id}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button onClick={() => startEdit(c)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-600">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
