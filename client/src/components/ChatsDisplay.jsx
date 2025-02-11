import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "../styles/ChatsDisplay.css";

const ChatsDisplay = ({ user }) => {
  const { receiverId } = useParams();
  const location = useLocation();
  const userReceiver = location.state?.userReceiver;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.id || !userReceiver?.id) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `/api/chats/${user.id}/${userReceiver.id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages(response.data.messages || []);
      } catch (err) {
        setError("Failed to load messages");
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user.id, receiverId, userReceiver]);

  if (!user.id || !userReceiver?.id) {
    return (
      <div className="select-conversation">
        Select a conversation to start :)
      </div>
    );
  }

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/chats/new-msg-ind",
        {
          senderId: user.id,
          receiverId: receiverId,
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chats-display">
      <p>Chat conversation with {userReceiver?.username || "Unknown User"}</p>

      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">Loading...</p>}

      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.sender?.username || "Unknown"}:</strong>{" "}
            {message.content}{" "}
          </div>
        ))}
      </div>

      <div className="message-input">
        <textarea
          value={newMessage}
          onChange={handleMessageChange}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

ChatsDisplay.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChatsDisplay;
