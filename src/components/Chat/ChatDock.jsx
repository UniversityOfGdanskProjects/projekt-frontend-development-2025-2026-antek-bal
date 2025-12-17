import {useChat} from "../../context/ChatContext.jsx"
import ChatWindow from "./ChatWindow.jsx"
import {useAuth} from "../../context/AuthContext.jsx";
import "./Chat.scss"

const ChatDock = () => {
    const {activeChats, minimizedChats, openChat} = useChat();
    const {allUsers, currentUser} = useAuth();

    if (!currentUser) return null;

    return (
        <div className="chat-dock">
            <div className="chat-minimalized">
                {minimizedChats.map(userId => {
                        const user = allUsers.find(u => u.id === userId);
                        if (!user) return null;
                        return (
                            <div key={userId} className="bubble" onClick={() => openChat(userId)}>
                                <img src={user.avatar} alt={user.name}/>
                            </div>
                        )
                    })}
            </div>

            <div className="open-windows">
                {activeChats.filter(id => !minimizedChats.includes(id)).map(userId =>(
                    <ChatWindow key={userId} partnerId={userId} />
                ))}
            </div>
        </div>
    )
}

export default ChatDock;