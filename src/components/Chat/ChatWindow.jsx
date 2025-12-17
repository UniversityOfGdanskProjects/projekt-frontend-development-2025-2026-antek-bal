import {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx"
import {useChat} from "../../context/ChatContext.jsx"
import "./Chat.scss"

function ChatWindow({partnerId}) {
    const {allUsers, currentUser} = useAuth();
    const {messages, sendMessage, closeChat, minimizeChat, markConversationAsRead } = useChat();
    const [text, setText] = useState("");

    const bodyRef = useRef(null);

    const partner = allUsers.find(u => u.id === partnerId)

    const chatMessages = messages.filter(msg =>
        (msg.senderId === currentUser.id && msg.receiverId === partnerId) ||
        (msg.senderId === partnerId && msg.receiverId === currentUser.id)
    );

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

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        sendMessage(partnerId, text);
        setText("");
    }

    if (!partner) return null;

    return (
        <div className="chat-window">
            <div className="chat-header" onClick={() => minimizeChat(partnerId)}>
                <div className="user-info">
                    <img src={partner.avatar} alt="avatar" />
                    <span>{partner.name}</span>
                </div>
                <div className="actions">
                    <button onClick={(e) => { e.stopPropagation(); closeChat(partnerId); }}>x</button>
                </div>
            </div>

            <div className="chat-body" ref={bodyRef}>
                {chatMessages.map(msg => (
                    <div
                        key={msg.id}
                        className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            <form className="chat-footer" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </form>
        </div>
    );
}

export default ChatWindow;
