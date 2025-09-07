import React from "react";
import "./ChatUI.css";

export default function ChatUI({ messages, onSend }) {
  const [input, setInput] = React.useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  React.useEffect(() => {
    const chatMessages = document.querySelector(".chat-messages");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Typ je antwoord..."
          autoFocus
        />
        <button type="submit">Verstuur</button>
      </form>
    </div>
  );
}