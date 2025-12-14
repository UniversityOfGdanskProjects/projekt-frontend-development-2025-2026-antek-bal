import {useState, createContext, useContext, useEffect} from "react";
import {users} from '../data/mockData.js';

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [allUsers, updateUsers] = useState(() => {
        const savedUsers = localStorage.getItem("users");
        return savedUsers ? JSON.parse(savedUsers) : users;
    })

    const [currentUser, setCurrentUser] = useState(() => {
        const user = localStorage.getItem("current-user");
        return user ? JSON.parse(user) : null;
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

    const login = (username, password) => {
        const passwordHash = btoa(password)
        const user = allUsers.find(u => u.username === username && u.password === passwordHash)
        if (user) {
            setCurrentUser(user);
            return true;
        }
        return false;
    }

    const register = (username, password, name, surname, avatar) => {
        const usernameOccupied = allUsers.find(u => u.username === username);
        if (usernameOccupied) {
            return false
        }

        const newUser = {
            "id": Date.now(),
            "username": username,
            "password": btoa(password),
            "name": name,
            "surname": surname,
            "avatar": avatar || "https://www.gravatar.com/avatar/?d=mp&s=256",
            "friends": []
        };

       updateUsers([...allUsers, newUser]);
       setCurrentUser(newUser);
       return true;
    }

    const logout = () => {
        setCurrentUser(null);
        return true
    }

    const value = {
        allUsers,
        currentUser,
        login,
        logout,
        register
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);