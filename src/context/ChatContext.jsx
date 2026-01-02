import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import useLocalStorage from "../hooks/useLocalStorage.jsx"

const ChatContext = createContext(null);

export const ChatProvider = ({children}) => {
    const {currentUser, allUsers} = useAuth();

    const [messages, setMessages] = useLocalStorage("chat-messages", []);

    const [activeChats, setActiveChats] = useState([]);
    const [minimizedChats, setMinimizedChats] = useState([]);

    useEffect(() => {
        if (!currentUser || !allUsers) return;

        const interval = setInterval(() => {
            if (Math.random() > 0.9) {
                const friendIds = currentUser.friends || [];
                if (friendIds.length === 0) return;

                const myFriends = allUsers.filter(u => friendIds.includes(u.id));
                if (myFriends.length === 0) return;

                const randomFriend = myFriends[Math.floor(Math.random() * myFriends.length)];

                const fakeMsg = {
                    id: Date.now(),
                    senderId: randomFriend.id,
                    receiverId: currentUser.id,
                    content: `Hi! (${new Date().toLocaleTimeString()})`,
                    timestamp: new Date().toISOString(),
                    isRead: false
                };

                setMessages(prev => [...prev, fakeMsg]);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentUser, allUsers, setMessages]);

    const sendMessage = (receiverId, content) => {
        if (!currentUser) return;

        const newMessage = {
            id: Date.now(),
            senderId: currentUser.id,
            receiverId: receiverId,
            content: content,
            timestamp: new Date().toISOString(),
            isRead: false
        };

        setMessages(prev => [...prev, newMessage]);
        openChat(receiverId);
    }

    const markConversationAsRead = (senderId) => {
        if (!currentUser) return;

        const hasUnread = messages.some(msg =>
            msg.senderId === senderId &&
            msg.receiverId === currentUser.id &&
            !msg.isRead
        )

        if (!hasUnread) return;

        setMessages(prev => prev.map(msg => {
            if (msg.senderId === senderId && msg.receiverId === currentUser.id && !msg.isRead) {
                return {...msg, isRead: true};
            }
            return msg;
        }));
    };

    const openChat = (userId) => {
        setActiveChats(prev => {
            if (prev.includes(userId)) return prev;
            return [...prev, userId]
        });

        setMinimizedChats(prev => prev.filter(id => id !== userId));
    };

    const minimizeChat = (userId) => {
        setMinimizedChats(prev => {
            if (prev.includes(userId)) return prev;
            return [...prev, userId]
        })
    };

    const closeChat = (userId) => {
        setActiveChats(prev => prev.filter(id => id !== userId));
        setMinimizedChats(prev => prev.filter(id => id !== userId));
    };

    const value = {
        messages,
        activeChats,
        minimizedChats,
        sendMessage,
        openChat,
        minimizeChat,
        closeChat,
        markConversationAsRead
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);