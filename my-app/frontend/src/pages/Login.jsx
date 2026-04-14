import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/projects";

    const handleFakeLogin = () => {
        localStorage.setItem('token', 'dummy-jwt-token');
        
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