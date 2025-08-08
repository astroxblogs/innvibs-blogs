// astroxblogs-innvibs-admin-client/src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import AdminBlogList from './Pages/AdminBlogList'; // <-- NEW IMPORT
import { getAuthToken, removeAuthToken } from './utils/localStorage';
import api from './services/api';

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const verifyAdminToken = useCallback(async () => {
        const token = getAuthToken();
        if (!token) {
            navigate('/login');
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/api/admin/verify-token');
            if (response.status === 200) {
                setIsAuthenticated(true);
            } else {
                removeAuthToken();
                navigate('/login');
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            removeAuthToken();
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        verifyAdminToken();
    }, [verifyAdminToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : null;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<AdminLogin />} />
                    <Route path="/" element={<AdminLogin />} />
                    <Route
                        path="/dashboard" // <-- REMOVED `/*` since it's no longer a parent route
                        element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />
                    {/* --- NEW ROUTE FOR BLOG LIST --- */}
                    <Route
                        path="/admin/blogs"
                        element={
                            <PrivateRoute>
                                <AdminBlogList />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;