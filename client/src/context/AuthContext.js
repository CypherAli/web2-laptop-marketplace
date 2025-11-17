import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                
                // Check if token is expired
                const currentTime = Date.now() / 1000;
                if (decodedUser.exp < currentTime) {
                    console.warn("Token has expired");
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('token');
                    return;
                }
                
                setUser(decodedUser);
                localStorage.setItem('token', token);
            } catch (error) {
                console.error("Invalid token:", error);
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        } else {
            setUser(null);
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/auth/login', { email, password });
            
            // Show warning if partner not approved
            if (res.data.warning) {
                console.warn('⚠️', res.data.warning);
                // You can also use a toast notification here if available
            }
            
            setToken(res.data.token);
            return res.data; // Return response for component to handle
        } catch (err) {
            console.error('Login failed', err);
            throw err;
        }
    };

    const register = async (username, email, password, role = 'client', shopName = null) => {
        try {
            const payload = { username, email, password, role };
            if (role === 'partner' && shopName) {
                payload.shopName = shopName;
            }
            await axios.post('/auth/register', payload);
        } catch (err) {
            console.error('Registration failed', err);
            throw err;
        }
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;