import {useAuth} from "../../context/AuthContext.jsx";
import {useChat} from "../../context/ChatContext.jsx"

import ChatWindow from "./ChatWindow.jsx"

import "./Chat.scss"

const ChatBubble = ({userId, allUsers, onOpen}) => {
    const user = allUsers.find(u => u.id === userId);

    if (!user) return null;

    return (
        <div className="bubble" onClick={() => onOpen(userId)}>
            <img src={user.avatar} alt={user.name} />
        </div>
    )
}

const ChatDock = () => {
    const {activeChats, minimizedChats, openChat} = useChat();
    const {allUsers, currentUser} = useAuth();

    if (!currentUser) return null;

    const visibleChats = activeChats.filter(id => !minimizedChats.includes(id))

    return (
        <div className="chat-dock">
            <div className="chat-minimalized">
                {minimizedChats.map(userId => (
                    <ChatBubble
                        key={userId}
                        userId={userId}
                        allUsers={allUsers}
                        onOpen={openChat}
                    />
                ))}
            </div>

            <div className="open-windows">
                {visibleChats.map(userId => (
                    <ChatWindow
                        key={userId}
                        partnerId={userId}
                    />
                ))}
            </div>
        </div>
    )
}

export default ChatDock;