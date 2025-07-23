import React, { useState, useMemo } from 'react';

// Demo user data
const initialUsers = [
  { id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', role: 'User', status: 'Inactive' },
  { id: 3, name: 'Alice Johnson', role: 'User', status: 'Active' },
  { id: 4, name: 'Bob Brown', role: 'User', status: 'Active' },
  { id: 5, name: 'Charlie Lee', role: 'Admin', status: 'Inactive' },
  { id: 6, name: 'Diana Prince', role: 'User', status: 'Active' },
  { id: 7, name: 'Eve Adams', role: 'User', status: 'Active' },
  { id: 8, name: 'Frank Miller', role: 'User', status: 'Inactive' },
];

const PAGE_SIZE = 5;

const DataTablePage: React.FC = () => {
  // State for users, search, sorting, pagination, and modal
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'status'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', role: 'User', status: 'Active' });

  // Filtered and sorted users
  const filtered = useMemo(() => {
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase()) ||
        u.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortBy].toString().toLowerCase();
      const bVal = b[sortBy].toString().toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortBy, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  // CSV export
  const handleExportCSV = () => {
    const header = 'Name,Role,Status\n';
    const rows = sorted.map((u) => `${u.name},${u.role},${u.status}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle sorting
  const handleSort = (col: 'name' | 'role' | 'status') => {
    if (sortBy === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
    setPage(1);
  };

  // Open modal for edit or add
  const openModal = (user: any | null) => {
    setEditUser(user);
    setForm(user ? { name: user.name, role: user.role, status: user.status } : { name: '', role: 'User', status: 'Active' });
    setModalOpen(true);
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save user (edit or add)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...form } : u)));
    } else {
      const newId = Math.max(...users.map((u) => u.id)) + 1;
      setUsers((prev) => [...prev, { id: newId, ...form }]);
    }
    setModalOpen(false);
    setEditUser(null);
    setForm({ name: '', role: 'User', status: 'Active' });
  };

  // Delete user
  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Data Table</h1>
        <p className="text-gray-500 text-base mb-8 text-center">
          View and manage your data in a structured table format.
        </p>
        {/* Search, export, and add */}
        <div className="w-full flex flex-col md:flex-row gap-4 mb-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-gray-50"
          />
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
            >
              Export CSV
            </button>
            <button
              onClick={() => openModal(null)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition"
            >
              Add User
            </button>
          </div>
        </div>
        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th
                  className="px-4 py-2 text-left text-gray-700 font-semibold cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  Name {sortBy === 'name' && (sortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-4 py-2 text-left text-gray-700 font-semibold cursor-pointer select-none"
                  onClick={() => handleSort('role')}
                >
                  Role {sortBy === 'role' && (sortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  className="px-4 py-2 text-left text-gray-700 font-semibold cursor-pointer select-none"
                  onClick={() => handleSort('status')}
                >
                  Status {sortBy === 'status' && (sortDir === 'asc' ? '▲' : '▼')}
                </th>
                <th className="px-4 py-2 text-center text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((user) => (
                <tr key={user.id} className="even:bg-blue-50">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">{user.status}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => openModal(user)}
                      className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 py-2 text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold disabled:opacity-50"
          >
            Next
          </button>
        </div>
        {/* Edit/Add Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              onSubmit={handleSave}
              className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4"
            >
              <h2 className="text-xl font-bold mb-2 text-blue-700">{editUser ? 'Edit User' : 'Add User'}</h2>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-gray-50"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-gray-50"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-gray-50"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTablePage; 