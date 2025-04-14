import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    role: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/accounts/users/");
      setUsers(res.data.results); // TO‘G‘RI
      setFiltered(res.data.results); // TO‘G‘RI
      setLoading(false);
    } catch (err) {
      console.error("Foydalanuvchilarni olishda xatolik:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    const result = users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
    setFiltered(result);
  }, [query, users]);

  const handleDelete = async (id) => {
    if (!window.confirm("Foydalanuvchini o‘chirishga ishonchingiz komilmi?"))
      return;
    try {
      await axios.delete(`/accounts/users/${id}/`);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("Foydalanuvchi o‘chirildi!");
    } catch (err) {
      toast.error("O‘chirishda xatolik yuz berdi");
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const res = await axios.patch(`/accounts/users/${user.id}/`, {
        is_active: !user.is_active,
      });
      // Update local state
      const updated = users.map((u) =>
        u.id === user.id ? { ...u, is_active: res.data.is_active } : u
      );
      setUsers(updated);
      toast.success("Status yangilandi");
    } catch (err) {
      toast.error("Statusni o‘zgartirishda xatolik");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `/accounts/users/${selectedUser.id}/`,
        editData
      );
      // Local yangilash
      const updated = users.map((u) =>
        u.id === selectedUser.id ? res.data : u
      );
      setUsers(updated);
      toast.success("Foydalanuvchi yangilandi");
      setSelectedUser(null);
    } catch (err) {
      toast.error("Tahrirlashda xatolik");
    }
  };

  return (
    <Wrapper>
      <Header>
        <h2>Foydalanuvchilar ro‘yxati</h2>
        <input
          type="text"
          placeholder="Qidiruv: username yoki email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Header>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_active ? "✅ Aktiv" : "⛔ Noaktiv"}</td>
                <td>
                  <Actions>
                    <button onClick={() => handleToggleActive(user)}>
                      {user.is_active ? "🛑 Bloklash" : "✅ Faollashtirish"}
                    </button>
                    <button onClick={() => handleDelete(user.id)}>
                      🗑 O‘chirish
                    </button>
                    <button onClick={() => openEditModal(user)}>
                      ✏️ Tahrirlash
                    </button>
                  </Actions>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {selectedUser && (
        <ModalOverlay>
          <ModalContent>
            <h3>Foydalanuvchini tahrirlash</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editData.username}
                onChange={(e) =>
                  setEditData({ ...editData, username: e.target.value })
                }
                placeholder="Username"
              />
              <input
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                placeholder="Email"
              />
              <select
                value={editData.role}
                onChange={(e) =>
                  setEditData({ ...editData, role: e.target.value })
                }
              >
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="courier">Courier</option>
                <option value="physical">Physical</option>
                <option value="legal">Legal</option>
              </select>
              <div className="modal-buttons">
                <button type="submit">Saqlash</button>
                <button type="button" onClick={() => setSelectedUser(null)}>
                  Bekor qilish
                </button>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  input {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 300px;
    font-size: 1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background: ${({ theme }) => theme.accent};
    color: white;
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background: #eee;
    color: #333;
    transition: 0.2s ease;

    &:hover {
      background-color: #f59023;
      color: white;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text};

  h3 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  input,
  select {
    width: 100%;
    padding: 0.5rem;
    margin: 0.75rem 0;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      background: #f59023;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        background: #d8771c;
      }
    }
  }
`;
