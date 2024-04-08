// ====================================================================================
// TODO: 
// 1. Every group of students needs to start at a different question. (Message !!!!)
// 2. Add data to local storage as a database
// ====================================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useGlitch } from 'react-powerglitch';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import placeholderMessages from '../Messages/messages.json';
import './ChatBot.css';

const ChatBot = () => {
    const glitch = useGlitch({ glitchTimeSpan: false });
    const [messages, setMessages] = useState(placeholderMessages.slice(0, 2));
    const [initialQuestions] = useState(placeholderMessages);
    const [currentQuestion, setCurrentQuestion] = useState(placeholderMessages[1]);
    const [isTyping, setIsTyping] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Check if the user has already started the chat
    useEffect(() => {
        const previousMessages = localStorage.getItem('kijk-op-de-wijk');
        if (previousMessages) {
            const parsedPrevMessages = JSON.parse(previousMessages);
            setMessages(parsedPrevMessages);
            if (parsedPrevMessages[parsedPrevMessages.length - 1].currentQuestion) {
                setCurrentQuestion(parsedPrevMessages[parsedPrevMessages.length - 1].currentQuestion);
            } else {
                setCurrentQuestion(null);
            }
        }
    }, []);

    // Checks if the last question was answered, if so start glitching the app
    useEffect(() => {
        if (!currentQuestion) {
            const doGlitch = setTimeout(() => setIsGlitching(true) && scrollToBottom(), 0);            
            return () => {
                clearTimeout(doGlitch);                
            }
        }
    }, [currentQuestion, setIsGlitching]);

    // Stop glitching after 2 seconds
    useEffect(() => {
        if (isGlitching) {
            const undoGlitch = setTimeout(() => glitch.stopGlitch() && scrollToBottom(), 2000);
            return () => {
                clearTimeout(undoGlitch);                
            }
        }
    }, [isGlitching, glitch]);

    // Scroll to bottom everytime user enters a message
    useEffect(() => {
        const bottomScroll = setTimeout(() => scrollToBottom(), 100);
        return () => {
            clearTimeout(bottomScroll);
        }
    }, [messages, isTyping]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            {!isGlitching ? (
                <div>
                    <div>
                        <ChatMessages 
                            messages={messages}
                            currentQuestion={currentQuestion}
                            isTyping={isTyping}
                            messagesEndRef={messagesEndRef}
                        />
                        {currentQuestion && (
                            <ChatInput 
                                messages={messages}
                                setMessages={setMessages}
                                initialQuestions={initialQuestions}
                                currentQuestion={currentQuestion}
                                setCurrentQuestion={setCurrentQuestion}
                                setIsTyping={setIsTyping}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <div ref={glitch.ref}>
                        <ChatMessages 
                            messages={messages}
                            currentQuestion={currentQuestion}
                            isTyping={isTyping}
                            messagesEndRef={messagesEndRef}
                        />
                        {currentQuestion && (
                            <ChatInput 
                                messages={messages}
                                setMessages={setMessages}
                                initialQuestions={initialQuestions}
                                currentQuestion={currentQuestion}
                                setCurrentQuestion={setCurrentQuestion}
                                setIsTyping={setIsTyping}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatBot;