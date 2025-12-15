import {useState, createContext, useContext, useEffect} from "react";
import {users} from "../data/mockData.js";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [allUsers, updateUsers] = useState(() => {
        const savedUsers = localStorage.getItem("users");
        return savedUsers ? JSON.parse(savedUsers) : users;
    })

    const [currentUser, setCurrentUser] = useState(() => {
        const user = localStorage.getItem("current-user");
        return user ? JSON.parse(user) : null;
    });

    const [notifications, setNotifications] = useState(() => {
        const newNotifications = localStorage.getItem("notifications");
        return newNotifications ? JSON.parse(newNotifications) : [];
    });

    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(allUsers));
    }, [allUsers]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("current-user", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("current-user");
        }
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [notifications]);

    const login = (username, password) => {
        const passwordHash = btoa(password);
        const user = allUsers.find(u => u.username === username && u.password === passwordHash);
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    }

    const register = (username, password, name, surname, avatar) => {
        const usernameOccupied = allUsers.find(u => u.username === username);
        if (usernameOccupied) {
            return false;
        }

        const newUser = {
            "id": Date.now(),
            "username": username,
            "password": btoa(password),
            "name": name,
            "surname": surname,
            "avatar": avatar || "https://www.gravatar.com/avatar/?d=mp&s=256",
            "friends": [],
            "followers": [],
            "following": [],
            "friendRequests": []
        }

        updateUsers([...allUsers, newUser]);
        setCurrentUser(newUser);
        return true;
    }

    const logout = () => {
        setCurrentUser(null);
        return true;
    }

    const toggleFollow = (targetUserId) => {
        if (!currentUser) return;

        const isFollowing = currentUser.following.includes(targetUserId);

        const updatedUsers = allUsers.map(user => {
            if (user.id === currentUser.id) {
                let newFollowing;
                if (isFollowing) {
                    newFollowing = user.following.filter(id => id !== targetUserId);
                } else {
                    newFollowing = [...user.following, targetUserId];
                }
                return { ...user, following: newFollowing };
            }

            if (user.id === targetUserId) {
                let newFollowers;
                if (isFollowing) {
                    newFollowers = user.followers.filter(id => id !== currentUser.id);
                } else {
                    newFollowers = [...user.followers, currentUser.id];
                }
                return { ...user, followers: newFollowers };
            }

            return user;
        });

        updateUsers(updatedUsers);
        const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
        setCurrentUser(updatedCurrentUser);
    };

    const sendNotification = (receiverId, content) => {
        const notification = {
            "id": Date.now(),
            "receiverId": receiverId,
            "content": content,
            "isRead": false,
            "date": new Date().toISOString(),
        }

        setNotifications(prevNotifications => [notification, ...prevNotifications]);
    }

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? {...n, isRead: true} : n
        ));
    }

    const value = {
        allUsers,
        currentUser,
        login,
        logout,
        register,
        notifications,
        sendNotification,
        markAsRead
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);