import { useLocation } from "react-router-dom";
import "../styles/GroupsDisplay.css";

const GroupsDisplay = () => {
  const location = useLocation();
  const { selectedGroup, groupName, user } = location.state || {};

  return (
    <div className="groups-display">
      {selectedGroup ? (
        <>
          <h2>Group Name: {groupName}</h2>
          <p>Group ID: {selectedGroup}</p>
          <p>User: {user ? user.username : "No user data"}</p>
          <p>Display the conversation of the selected group</p>
        </>
      ) : (
        <p>Please select a group :)</p>
      )}
    </div>
  );
};

export default GroupsDisplay;
