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
            "friendRequests": [],
            "role": null
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
                return {...user, following: newFollowing};
            }

            if (user.id === targetUserId) {
                let newFollowers;
                if (isFollowing) {
                    newFollowers = user.followers.filter(id => id !== currentUser.id);
                } else {
                    newFollowers = [...user.followers, currentUser.id];
                    sendNotification(
                        user.id,
                        `${currentUser.name} started following you!`,
                        "follow",
                        currentUser.id
                    );
                }
                return {...user, followers: newFollowers};
            }

            return user;
        });

        updateUsers(updatedUsers);
        const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
        setCurrentUser(updatedCurrentUser);
    };

    const sendNotification = (receiverId, content, type = "info", referenceId = null) => {
        const senderId = currentUser ? currentUser.id : null;
        const notification = {
            "id": Date.now(),
            "senderId": senderId,
            "receiverId": receiverId,
            "content": content,
            "isRead": false,
            "date": new Date().toISOString(),
            "type": type,
            "referenceId": referenceId
        }

        setNotifications(prevNotifications => [notification, ...prevNotifications]);
    }

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? {...n, isRead: true} : n
        ));
    }

    const sendFriendRequest = (targetUserId) => {
        if (!currentUser) return;

        const targetUser = allUsers.find(u => u.id === targetUserId);
        if (targetUser.friendRequests && targetUser.friendRequests.includes(currentUser.id)) return;
        if (targetUser.friends && targetUser.friends.includes(currentUser.id)) return;

        const updatedUsers = allUsers.map(user => {
            if (user.id === targetUserId) {
                return {
                    ...user,
                    friendRequests: [...(user.friendRequests || []), currentUser.id]
                };
            }
            return user;
        });

        updateUsers(updatedUsers);
        sendNotification(
            targetUserId,
            `${currentUser.name} ${currentUser.surname} sent you a friend request!`,
            "friend",
            currentUser.id
        )

    };

    const acceptFriendRequest = (senderId) => {
        if (!currentUser) return;

        const updatedUsers = allUsers.map(user => {
            if (user.id === currentUser.id) {
                return {
                    ...user,
                    friendRequests: user.friendRequests.filter(id => id !== senderId),
                    friends: [...user.friends, senderId]
                };
            }

            if (user.id === senderId) {
                return {
                    ...user,
                    friends: [...user.friends, currentUser.id]
                };
            }

            return user;
        });

        updateUsers(updatedUsers);
        const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
        setCurrentUser(updatedCurrentUser);

        sendNotification(
            senderId,
            `${currentUser.name} accepted your friend request!`,
            "friend",
            currentUser.id
        );
    };

    const declineFriendRequest = (senderId) => {
        if (!currentUser) return;

        const updatedUsers = allUsers.map(user => {
            if (user.id === currentUser.id) {
                return {
                    ...user,
                    friendRequests: user.friendRequests.filter(id => id !== senderId)
                };
            }
            return user;
        });

        updateUsers(updatedUsers);
        const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
        setCurrentUser(updatedCurrentUser);
    };

    const removeFriend = (friendId) => {
        if (!currentUser) return;

        const updatedUsers = allUsers.map(user => {
            if (user.id === currentUser.id) {
                return {...user, friends: user.friends.filter(id => id !== friendId)};
            }
            if (user.id === friendId) {
                return {...user, friends: user.friends.filter(id => id !== currentUser.id)};
            }
            return user;
        });

        updateUsers(updatedUsers);
        const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
        setCurrentUser(updatedCurrentUser);
    };

    const updateProfile = (userId, updatedData) => {
        const updatedUser = allUsers.map(user => {
            if (user.id === userId) {
                return {...user, ...updatedData}
            }
            return user;
        })

        updateUsers(updatedUser);

        if (currentUser && currentUser.id === userId) {
            setCurrentUser(prev => ({...prev, ...updatedData}));
        }
    }

    const value = {
        allUsers,
        currentUser,
        login,
        logout,
        register,
        notifications,
        sendNotification,
        markAsRead,
        toggleFollow,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);