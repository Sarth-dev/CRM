"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminsClient({ orgId }) {
  const router = useRouter();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [editingId, setEditingId] = useState(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchAdmins = () => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (!orgId) return; // wait for orgId
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/admins`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load admins");
        return res.json();
      })
      .then(setAdmins)
      .catch(() => setError("Failed to load admins"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, [orgId]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add admin");
      }
      const newAdmin = await res.json();
      setAdmins((prev) => [...prev, newAdmin]);
      setForm({ name: "", email: "", password: "", role: "admin" });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const startEdit = (admin) => {
    setEditingId(admin.id);
    setForm({ name: admin.name, email: admin.email, password: "", role: admin.role });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", email: "", password: "", role: "admin" });
    setError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const updatePayload = { ...form };
      if (!updatePayload.password) delete updatePayload.password;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/admins/${editingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify(updatePayload),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update admin");
      }
      const updatedAdmin = await res.json();
      setAdmins((prev) => prev.map((a) => (a.id === editingId ? updatedAdmin : a)));
      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admin user?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orgs/${orgId}/admins/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete admin");
      }
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Admin Users for Organisation {orgId}</h1>

      {error && <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">{error}</div>}

      <form
        onSubmit={editingId ? handleUpdate : handleAdd}
        className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-2"
      >
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
          required
          className="p-2 border rounded md:col-span-1"
        />
        <input
          type="password"
          name="password"
          placeholder={editingId ? "New password (optional)" : "Password"}
          value={form.password}
          onChange={handleChange}
          className="p-2 border rounded md:col-span-1"
          required={!editingId}
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="p-2 border bg-gray-800 rounded md:col-span-1"
          required
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <div className="md:col-span-1 flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold ${
              editingId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
            } transition`}
          >
            {loading ? (editingId ? "Saving..." : "Adding...") : editingId ? "Save" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={loading}
              className="w-full py-2 rounded bg-gray-400 hover:bg-gray-500 text-white font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && !editingId ? (
        <p>Loading admins...</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-800 text-center">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-b last:border-none text-center">
                <td className="p-2">{a.name}</td>
                <td className="p-2">{a.email}</td>
                <td className="p-2">{a.role}</td>
                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => startEdit(a)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-600">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
