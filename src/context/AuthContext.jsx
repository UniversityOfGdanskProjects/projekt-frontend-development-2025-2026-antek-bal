import { createContext, useContext } from "react"
import { users } from "../data/mockData.js"
import useLocalStorage from "../hooks/useLocalStorage.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [allUsers, updateUsers] = useLocalStorage("users", users);
    const [currentUser, setCurrentUser] = useLocalStorage("current-user", null);
    const [notifications, setNotifications] = useLocalStorage("notifications", []);

    const userUpdate = (cb) => {
        const updatedUsers = allUsers.map(cb);
        updateUsers(updatedUsers);

        if (currentUser) {
            const updatedMe = updatedUsers.find(u => u.id === currentUser.id);
            if (updatedMe) setCurrentUser(updatedMe);
        }
    }

    const login = (username, password) => {
        const passwordHash = btoa(password);
        const user = allUsers.find(u => u.username === username && u.password === passwordHash);

        if (!user) return false;

        if (user.isBlocked) {
            alert("Your account has been suspended")
            return false
        }

        setCurrentUser(user);
        return true;
    }

    const register = (username, password, name, surname, avatar) => {
        if (allUsers.some(u => u.username === username)) return false;

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
            "role": null,
            "isBlocked": false,
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

        userUpdate(user => {
            if (user.id === currentUser.id) {
                const newFollowing = isFollowing
                    ? user.following.filter(id => id !== targetUserId)
                    : [...user.following, targetUserId];
                return { ...user, following: newFollowing };
            }

            if (user.id === targetUserId) {
                const newFollowers = isFollowing
                    ? user.followers.filter(id => id !== currentUser.id)
                    : [...user.followers, currentUser.id];

                if (!isFollowing) {
                    sendNotification(user.id, `${currentUser.name} started following you`, "follow", currentUser.id);
                }
                return {...user, followers: newFollowers};
            }
            return user;
        });
    };

    const sendFriendRequest = (targetUserId) => {
        if (!currentUser) return;
        const targetUser = allUsers.find(u => u.id === targetUserId);

        if (targetUser?.friendRequests?.includes(currentUser.id) ||
            targetUser?.friends?.includes(currentUser.id)) return;

        userUpdate(user => {
            if (user.id === targetUserId) {
                return {...user, friendRequests: [...(user.friendRequests || []), currentUser.id]
                };
            }
            return user;
        });

        sendNotification(targetUserId, `${currentUser.name} ${currentUser.surname} sent you a friend request!`, "friend", currentUser.id)
    };

    const acceptFriendRequest = (senderId) => {
        if (!currentUser) return;

        userUpdate(user => {
            if (user.id === currentUser.id) {
                return {
                    ...user,
                    friendRequests: user.friendRequests.filter(id => id !== senderId),
                    friends: [...user.friends, senderId]
                };
            }

            if (user.id === senderId) {
                return {...user, friends: [...user.friends, currentUser.id]};
            }
            return user;
        });

        sendNotification(senderId, `${currentUser.name} accepted your friend request!`, "friend", currentUser.id);
    };

    const declineFriendRequest = (senderId) => {
        if (!currentUser) return;

        userUpdate(user => {
            if (user.id === currentUser.id) {
                return {
                    ...user,
                    friendRequests: user.friendRequests.filter(id => id !== senderId)
                };
            }
            return user;
        });
    };

    const removeFriend = (friendId) => {
        if (!currentUser) return;

        userUpdate(user => {
            if (user.id === currentUser.id) {
                return {...user, friends: user.friends.filter(id => id !== friendId)};
            }
            if (user.id === friendId) {
                return {...user, friends: user.friends.filter(id => id !== currentUser.id)};
            }
            return user;
        });
    };

    const updateProfile = (userId, updatedData) => {
        userUpdate(user => {
            if (user.id === userId) {
                return {...user, ...updatedData}
            }
            return user;
        })
    }

    const toggleBlockUser = (userId) => {
        userUpdate(user => {
            if (user.id === userId) {
                return { ...user, isBlocked: !user.isBlocked };
            }
            return user;
        });
    };

    const sendNotification = (receiverId, content, type = "info", referenceId = null) => {
        const notification = {
            "id": Date.now(),
            "senderId": currentUser ? currentUser.id : null,
            "receiverId": receiverId,
            "content": content,
            "isRead": false,
            "date": new Date().toISOString(),
            "type": type,
            "referenceId": referenceId
        }
        setNotifications(prev => [notification, ...prev]);
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
        markAsRead,
        toggleFollow,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        removeFriend,
        updateProfile,
        toggleBlockUser,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);