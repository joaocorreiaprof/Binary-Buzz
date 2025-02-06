import { useEffect, useState } from "react";
import "../styles/GlobalChat.css";
import { FaUserAstronaut } from "react-icons/fa6";

const GlobalChat = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/display-all");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="global-chat">
      <p className="bbFreaks">B&B Freaks</p>
      <input
        type="text"
        placeholder="Search usernames..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      {loading ? (
        <p className="loading">Loading...</p>
      ) : filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <div key={user.id} className="user-card">
            <FaUserAstronaut className="user-icon" />
            <p>{user.username}</p>
          </div>
        ))
      ) : (
        <p className="no-users">No users available</p>
      )}
    </div>
  );
};

export default GlobalChat;
