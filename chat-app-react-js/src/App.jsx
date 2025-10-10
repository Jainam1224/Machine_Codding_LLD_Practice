import React, { useState } from "react";
import "./App.css";

// Dummy data for the chat app
const DUMMY_USERS = {
  currentUser: { id: "user1", name: "You", avatar: "👤" },
  otherUsers: [
    { id: "user2", name: "Alice Johnson", avatar: "👩" },
    { id: "user3", name: "Bob Smith", avatar: "👨" },
    { id: "user4", name: "Carol Davis", avatar: "👩‍💼" },
  ],
};

const DUMMY_MESSAGES = [
  {
    id: 1,
    userId: "user2",
    text: "Hey everyone! How is the project going?",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    userId: "user1",
    text: "Going well! Just finished the authentication module.",
    timestamp: "10:32 AM",
  },
  {
    id: 3,
    userId: "user3",
    text: "Great! I'm working on the database schema now.",
    timestamp: "10:35 AM",
  },
  {
    id: 4,
    userId: "user4",
    text: "Perfect timing! I can start on the frontend components.",
    timestamp: "10:37 AM",
  },
  {
    id: 5,
    userId: "user2",
    text: "Awesome! Let's sync up tomorrow morning.",
    timestamp: "10:40 AM",
  },
  {
    id: 6,
    userId: "user1",
    text: "Sounds good! I'll prepare the demo for the client.",
    timestamp: "10:42 AM",
  },
];

// Message component
const Message = ({ message, isCurrentUser, user }) => (
  <div className={`message ${isCurrentUser ? "current-user" : ""}`}>
    <div className="message-avatar">{user.avatar}</div>
    <div className="message-content">
      <div className="message-header">
        <span className="message-sender">{user.name}</span>
        <span className="message-time">{message.timestamp}</span>
      </div>
      <div className="message-text">{message.text}</div>
    </div>
  </div>
);

// Message input component
const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="message-input-field"
      />
      <button type="submit" className="send-button">
        Send
      </button>
    </form>
  );
};

// Main Chat App component
const ChatApp = () => {
  const [messages, setMessages] = useState(DUMMY_MESSAGES);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      userId: DUMMY_USERS.currentUser.id,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMessage]);
  };

  const getUserById = (userId) => {
    if (userId === DUMMY_USERS.currentUser.id) {
      return DUMMY_USERS.currentUser;
    }
    return DUMMY_USERS.otherUsers.find((user) => user.id === userId);
  };

  return (
    <div className="chat-app">
      {/* Header */}
      <div className="chat-header">
        <h1>Team Chat</h1>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => {
          const user = getUserById(message.userId);
          const isCurrentUser = message.userId === DUMMY_USERS.currentUser.id;
          return (
            <Message
              key={message.id}
              message={message}
              user={user}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatApp;
