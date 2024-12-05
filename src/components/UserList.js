import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/");
      const response = await getUsers(page);
      setUsers(response.data.data);
    };
    fetchUsers();
  }, [page, navigate]);

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>User List</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="form-control mb-3"
      />
      <div className="row">
        {filteredUsers.map((user) => (
          <div key={user.id} className="col-md-4">
            <div className="card">
              <img src={user.avatar} alt={user.first_name} className="card-img-top" />
              <div className="card-body">
                <h5>{user.first_name} {user.last_name}</h5>
                <button onClick={() => navigate(`/edit/${user.id}`)} className="btn btn-warning me-2">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} className="btn btn-secondary">Previous</button>
      <button onClick={() => setPage((prev) => prev + 1)} className="btn btn-secondary">Next</button>
    </div>
  );
};

export default UserList;