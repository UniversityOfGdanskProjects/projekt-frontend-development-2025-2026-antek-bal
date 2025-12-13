import {users} from '../data/mockData.js'
import {useState} from "react";

function AuthContext() {
    const [allUsers, updateUsers] = useState(() => {
        const savedUsers = localStorage.getItem("users");

        return savedUsers ? JSON.parse(savedUsers) : users;
    })
    const [currentUser, setCurrentUser] = useState(() => {
        const u = localStorage.getItem("current-user");
        return u ? JSON.parse(u) : null;
    });
}

export default AuthContext;