import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../styles/Groups.css";

const Groups = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("/api/groups/all-groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!newGroupName) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        "/api/groups/create-group",
        { name: newGroupName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGroups([...groups, response.data]);
      setNewGroupName("");
      setIsCreatingGroup(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  const handleGroupClick = (groupId, groupName) => {
    navigate("/groups", {
      state: { selectedGroup: groupId, groupName: groupName, user: user },
    });
    window.location.reload();
  };

  return (
    <div className="groups-container">
      <h2 className="groups-title">All Groups</h2>
      <div className="groups-create-section">
        {!isCreatingGroup ? (
          <button
            className="groups-create-btn"
            onClick={() => setIsCreatingGroup(true)}
          >
            +
          </button>
        ) : (
          <form className="groups-form" onSubmit={handleCreateGroup}>
            <input
              type="text"
              placeholder="Enter group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="groups-input"
            />
            <button type="submit" className="groups-submit-btn">
              Create Group
            </button>
            <button
              type="button"
              className="groups-cancel-btn"
              onClick={() => setIsCreatingGroup(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className="groups-list">
        {groups.length > 0 ? (
          <ul className="groups-ul">
            {groups.map((group) => (
              <li
                key={group.id}
                className="groups-item"
                onClick={() => handleGroupClick(group.id, group.name)}
              >
                {group.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="groups-no-groups">No groups found.</p>
        )}
      </div>
    </div>
  );
};

Groups.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Groups;
