import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    api.get("/auth/me")
      .then((res) => { setUser(res.data); setLoading(false); })
      .catch(() => { navigate("/login"); });
  }, [navigate]);

  async function handleChangePassword(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.put("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMessage("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.detail || "Password change failed");
    }
  }

  if (loading) return <p className="loading">Loading profile...</p>;
  if (!user) return null;

  return (
    <div className="profile">
      <h2>My Profile</h2>
      <div className="profile-info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role_name}</p>
      </div>

      <h3>Change Password</h3>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleChangePassword} className="password-form">
        <input
          type="password" placeholder="Current password"
          value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required
        />
        <input
          type="password" placeholder="New password"
          value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default Profile;
