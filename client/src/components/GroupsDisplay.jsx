// Packages
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoSend } from "react-icons/io5";

// Styles
import "../styles/GroupsDisplay.css";

const GroupsDisplay = () => {
  const location = useLocation();
  const { selectedGroup, groupName, user } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!selectedGroup) {
      setError("No group selected");
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/groups/msg-group/${selectedGroup}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessages(response.data);
      } catch (err) {
        setError("Failed to load messages");
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedGroup]);

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/groups/new-msg-group/${selectedGroup}`,
        {
          senderId: user.id,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: response.data.id,
          sender: { username: user.username },
          content: newMessage,
          createdAt: new Date(),
        },
      ]);
      setNewMessage("");
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="groups-display-container">
      <h2>{groupName || "Group Chat"}</h2>

      <div className="messages-box">
        {messages.map((message) => (
          <div
            key={`${message.sender.username}-${new Date(
              message.createdAt
            ).getTime()}`}
            className={
              message.sender.username === user.username
                ? "self-message"
                : "other-message"
            }
          >
            <strong>{message.sender.username}:</strong>
            <p>{message.content}</p>
            <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="message-input-container">
        <textarea
          value={newMessage}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown} // Changed from onKeyPress
          placeholder="Type a message..."
        ></textarea>
        <button className="send-message-btn" onClick={handleSendMessage}>
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default GroupsDisplay;
