import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";

// Style & icons
import "../styles/GlobalChatDisplay.css";
import { AiOutlineGlobal } from "react-icons/ai";
import { IoSend } from "react-icons/io5";

const GlobalChatDisplay = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/groups/msg-global", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (err) {
        setError("Failed to load messages");
        console.error("Error fetching global messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/groups/new-msg-global",
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

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="global-chat-display">
      <div className="messages-container">
        <div className="global-chat-title-img">
          <AiOutlineGlobal className="global-img" />
          <p className="global-chat-title">Global Chat</p>
        </div>
        {messages.map((message) => (
          <div
            key={
              message.id ||
              `${message.sender.username}-${new Date(
                message.createdAt
              ).getTime()}`
            }
            className={`message ${
              message.sender.username === user.username ? "self" : "other"
            }`}
          >
            <strong>{message.sender.username}:</strong>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        ></textarea>
        <button className="send-button" onClick={handleSendMessage}>
          <IoSend />
        </button>
      </div>
    </div>
  );
};

GlobalChatDisplay.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
};

export default GlobalChatDisplay;
