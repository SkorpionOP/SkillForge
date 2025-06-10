// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            ("Auth State Changed: user is", user ? user.uid : "null"); // <-- ADD THIS LOG
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const getIdToken = async () => {
        if (currentUser) {
            return await currentUser.getIdToken();
        }
        return null;
    };

    const logout = async () => { // Made async to await signOut
        ("Attempting to log out..."); // <-- ADD THIS LOG
        try {
            await signOut(auth); // Await the signOut promise
            ("Sign out successful!"); // <-- ADD THIS LOG
        } catch (error) {
            console.error("Error during Firebase signOut:", error); // <-- ADD THIS LOG
            alert("Logout failed: " + error.message); // Provide immediate feedback to user
        }
    };

    const value = {
        currentUser,
        loading,
        getIdToken,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};