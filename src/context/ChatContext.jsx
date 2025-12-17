import {createContext, useContext, useState, useEffect} from "react";
import {useAuth} from "./AuthContext";

const ChatContext = createContext(null);

export const ChatProvider = ({children}) => {
    const {currentUser} = useAuth();

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("chat-messages");
        return saved ? JSON.parse(saved) : [];
    });

    const [activeChats, setActiveChats] = useState([]);
    const [minimizedChats, setMinimizedChats] = useState([]);

    useEffect(() => {
        localStorage.setItem("chat-messages", JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (!currentUser) return;

        const interval = setInterval(() => {
            if (Math.random() > 0.9) {
                const randomUserId = Math.floor(Math.random() * 3) + 1;

                if (randomUserId !== currentUser.id) {
                    const fakeMsg = {
                        id: Date.now(),
                        senderId: randomUserId,
                        receiverId: currentUser.id,
                        content: "Hi this is fake message (" + new Date().toLocaleTimeString() + ")",
                        timestamp: new Date().toISOString(),
                        isRead: false
                    };

                    setMessages(prev => [...prev, fakeMsg]);
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentUser]);

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

    const openChat = (userId) => {
        if (!activeChats.includes(userId)) {
            setActiveChats(prev => [...prev, userId]);
        }

        if (minimizedChats.includes(userId)) {
            setMinimizedChats(prev => prev.filter(id => id !== userId));
        }
    };

    const minimizeChat = (userId) => {
        if (!minimizedChats.includes(userId)) {
            setMinimizedChats(prev => [...prev, userId]);
        }
    };

    const closeChat = (userId) => {
        setActiveChats(prev => prev.filter(id => id !== userId));
        setMinimizedChats(prev => prev.filter(id => id !== userId));
    };

    const markConversationAsRead = (senderId) => {
        if (!currentUser) return;

        setMessages(prev => prev.map(msg => {
            if (msg.senderId === senderId && msg.receiverId === currentUser.id && !msg.isRead) {
                return {...msg, isRead: true};
            }
            return msg;
        }));
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