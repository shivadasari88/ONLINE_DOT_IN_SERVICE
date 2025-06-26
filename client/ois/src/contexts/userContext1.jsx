import axios from 'axios';
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Load from localStorage on first render
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    useEffect(() => {
        // Only fetch if not already in state
        if (!user) {
            axios.get('/profile')
                .then(({ data }) => {
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data)); // Save to localStorage
                })
                .catch((error) => {
                    console.error("Failed to fetch user profile:", error);
                });
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
