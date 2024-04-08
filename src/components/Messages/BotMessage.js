import React from "react";  
import avatar from "./images/avatar.png";
import clue1 from "./images/clue1.jpg";
import clue2 from "./images/clue2.jpg";
import einde from "./images/einde.jpg";

const BotMessage = ({ message }) => {
    return (
        <div className="botResponse">
            <div className="botAvatar">
                <img src={avatar} alt="Hacker" />
            </div>
            <div className="botMessage">
                { message.text }
                { message.image && message.image === "clue1" && clue1 && <img src={clue1} alt={message.text} /> }
                { message.image && message.image === "clue2" && clue2 && <img src={clue2} alt={message.text} /> }
                { message.image && message.image === "einde" && einde && <img src={einde} alt={message.text} /> }
            </div>
        </div>
    )
}

export default BotMessage;