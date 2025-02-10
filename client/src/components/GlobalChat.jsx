//Packages
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

//Styles
import "../styles/GlobalChat.css";
import { FaUserAstronaut } from "react-icons/fa6";

const GlobalChat = ({ user }) => {
  const [usersReceivers, setUsersReceivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/display-all");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsersReceivers(data);
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = usersReceivers.filter((userReceiver) =>
    userReceiver.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userReceiver) => {
    console.log("userid from GlobalChat:", user.id);
    console.log("userReceiver from GlobalChat:", userReceiver);

    navigate(`/chats/${user.id}/${userReceiver.id}`, {
      state: { userReceiver }, // Pass the whole object here
    });
  };

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
        filteredUsers.map((userReceiver) => (
          <div
            key={userReceiver.id}
            className="user-card"
            onClick={() => handleUserClick(userReceiver)}
          >
            <FaUserAstronaut className="user-icon" />
            <p>{userReceiver.username}</p>
          </div>
        ))
      ) : (
        <p className="no-users">No users available</p>
      )}
    </div>
  );
};

GlobalChat.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default GlobalChat;
