import {Navigate, useLocation} from 'react-router-dom';

function Auth({ children }) {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if(!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
}

export default Auth;