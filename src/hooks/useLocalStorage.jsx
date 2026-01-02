import { useState, useEffect } from "react";

function useLocalStorage(key, initialVal) {
    const [value, setValue] = useState(() => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : initialVal;
        } catch (error) {
            console.error("Error reading localStorage", error);
            return initialVal;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving to localStorage", error);
        }
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage;