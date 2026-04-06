import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we came from a protected page, otherwise default to projects
    const from = location.state?.from?.pathname || "/projects";

    const handleFakeLogin = () => {
        // Save a dummy token to test the Auth guard
        localStorage.setItem('token', 'dummy-jwt-token');
        
        // Redirect the user back to where they were trying to go
        navigate(from, { replace: true });
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Login Page</h1>
            <p>This is a placeholder for your full login form.</p>
            <button onClick={handleFakeLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                Simulate Login
            </button>
        </div>
    );
};

export default Login;