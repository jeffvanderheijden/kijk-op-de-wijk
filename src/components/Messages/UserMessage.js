import React from "react";

const UserMessage = ({ message }) => {
    return (
        <div className="userMessage">
            {message.text}
        </div>
    )
}

export default UserMessage;