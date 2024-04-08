import React from "react";
import BotMessage from "./../Messages/BotMessage";
import UserMessage from "./../Messages/UserMessage";
import JumpingDots from "./../Messages/JumpingDots";
import './ChatMessages.css';

const ChatMessages = ({
    messages,
    isTyping,
    messagesEndRef,
}) => {
    return (
        <div className="messageList">
            {messages.map((message, index) => {
                if (message?.sender === "bot"
                    || message?.id === 1
                    || message?.id === 2
                    || message?.text === "Sorry, dat is niet het juiste antwoord."
                    || message?.text === "Goed gedaan! Hier is je volgende hint.."
                ) {
                    return <BotMessage key={`message-${index}`} message={message} />
                } else if(message?.sender === "user") {
                    return <UserMessage key={`message-${index}`} message={message} />
                }
                else {
                    return null;
                }
            })}
            {isTyping && (
                <JumpingDots />
            )}
            {/* We use this as a scroll-to anchor */}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default ChatMessages;