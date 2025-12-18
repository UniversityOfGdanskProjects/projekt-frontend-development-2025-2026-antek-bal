import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../../context/AuthContext.jsx"
import { useChat } from "../../context/ChatContext.jsx"

import "./Chat.scss"

const ChatHeader = ({partner, onMinimize, onClose}) => (
    <div className="chat-header" onClick={() => onMinimize(partner.id)}>
        <div className="user-info">
            <img src={partner.avatar} alt="avatar"/>
            <span>{partner.name}</span>
        </div>
        <div className="actions">
            <button onClick={(e) => {e.stopPropagation(); onClose(partner.id)}}>x</button>
        </div>
    </div>
)

const MessageBubble = ({message, isMine}) => (
    <div className={`message ${isMine ? "sent" : "received"}`}>
        {message.content}
    </div>
)

const ChatInput = ({onSend}) => {
    const [text, setText] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text)
        setText("")
    }

    return (
        <form className="chat-footer" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </form>
    )
}


function ChatWindow({partnerId}) {
    const {allUsers, currentUser} = useAuth();
    const {messages, sendMessage, closeChat, minimizeChat, markConversationAsRead } = useChat();
    const bodyRef = useRef(null);

    const partner = useMemo(() =>
        allUsers.find(u => u.id === partnerId),
        [allUsers, partnerId],
    )

    const chatMessages = useMemo(() =>
        messages.filter(msg =>
            (msg.senderId === currentUser.id && msg.receiverId === partnerId) ||
            (msg.senderId === partnerId && msg.receiverId === currentUser.id)
        )
    )

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [chatMessages]);

    useEffect(() => {
        const hasUnread = chatMessages.some(
            msg => !msg.isRead && msg.senderId === partnerId
        );
        if (hasUnread) {
            markConversationAsRead(partnerId);
        }
    }, [chatMessages, partnerId, markConversationAsRead]);

    if (!partner) return null;

    return (
        <div className="chat-window">
            <ChatHeader
                partner={partner}
                onMinimize={minimizeChat}
                onClose={closeChat}
            />

            <div className="chat-body" ref={bodyRef}>
                {chatMessages.map(msg => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        isMine={msg.senderId === currentUser.id}
                    />
                ))}
            </div>

            <ChatInput onSend={(text) => sendMessage(partnerId, text)} />
        </div>
    );
}

export default ChatWindow;
