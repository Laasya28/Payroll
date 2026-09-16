import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                if (userData.token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
                }
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('userInfo');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // Store basic user data immediately for persistence
            const basicUserData = {
                _id: data._id,
                email: data.email,
                role: data.role,
                token: data.token
            };
            
            setUser(basicUserData);
            localStorage.setItem('userInfo', JSON.stringify(basicUserData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            
            // Try to fetch complete user data in background
            try {
                const userResponse = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${data.token}` }
                });
                const completeUserData = { ...basicUserData, ...userResponse.data };
                setUser(completeUserData);
                localStorage.setItem('userInfo', JSON.stringify(completeUserData));
                return completeUserData;
            } catch (profileError) {
                console.warn('Could not fetch complete profile:', profileError);
                // Continue with basic user data
                return basicUserData;
            }
        } catch (error) {
            console.error('Login error:', error);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
