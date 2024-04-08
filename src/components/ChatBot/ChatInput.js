import React, { useRef } from "react";
import './ChatInput.css';

const ChatInput = ({    
    messages,
    setMessages,
    initialQuestions,
    currentQuestion,
    setCurrentQuestion,
    setIsTyping
}) => { 
    const inputRef = useRef(null);

    const handleAnswer = () => {
        if (inputRef.current.value !== "" && currentQuestion) {
            // Handle the user input
            const inputValue = inputRef.current.value;
            const updatedMessages = [...messages, { id: messages.length + 1, sender: "user", text: inputValue }];
            inputRef.current.value = "";
            setMessages(updatedMessages);
            // Bot answers.. pretends to type
            const randomNum = 3000 + Math.random() * (5000 - 3000);
            const randomTimeout = Math.round(randomNum / 1000) * 1000;
            setTimeout(() => {
                setIsTyping(true);
            }, 500);
            setTimeout(() => {
                setIsTyping(false);
                // Check if the answer is correct
                if (inputValue !== currentQuestion.answer) {
                    setMessages([...updatedMessages, { id: updatedMessages.length + 1, sender: "bot", text: "Sorry, dat is niet het juiste antwoord.", answer: currentQuestion.answer}]);
                    localStorage.setItem('kijk-op-de-wijk', JSON.stringify(([...updatedMessages, { id: updatedMessages.length + 1, sender: "bot", text: "Sorry, dat is niet het juiste antwoord.", answer: currentQuestion.answer }])));
                } else {
                    setMessages([...updatedMessages, { id: updatedMessages.length + 1, sender: "bot", text: "Goed gedaan! Hier is je volgende hint.." }, initialQuestions.find(message => message.id === currentQuestion.id + 1)]);
                    localStorage.setItem('kijk-op-de-wijk', JSON.stringify(([...updatedMessages, { id: updatedMessages.length + 1, sender: "bot", text: "Goed gedaan! Hier is je volgende hint.." }, initialQuestions.find(message => message.id === currentQuestion.id + 1)])));
                    // Up the current question by one
                    if (initialQuestions.find(message => message.id === currentQuestion.id + 1)) {
                        setCurrentQuestion(initialQuestions.find(message => message.id === currentQuestion.id + 1));
                    } else {
                        setCurrentQuestion(null);
                        localStorage.setItem('kijk-op-de-wijk', JSON.stringify([{ id: updatedMessages.length + 1, sender: "bot", text: "Je bent beter dan ik dacht.. Hier is het sleutelwoord: explorer. De zoektocht is voorbij. Meld je weer bij het lokaal waar je les hebt.", image: "einde" }]));
                        setTimeout(() => {
                            setMessages([{ id: updatedMessages.length + 1, sender: "bot", text: "Je bent beter dan ik dacht.. Hier is het sleutelwoord: explorer. De zoektocht is voorbij. Meld je weer bij het lokaal waar je les hebt.", image: "einde" }]);
                        }, 1000);
                    }
                }
            }, randomTimeout);
        }
    }

    return (
        <div className="inputWrapper">
            <input ref={inputRef} type="text" placeholder="Typ je antwoord hier" />
            <button onClick={() => handleAnswer()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"/></svg>
            </button>
        </div>
    )
}

export default ChatInput;