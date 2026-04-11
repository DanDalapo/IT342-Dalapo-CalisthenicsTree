import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if the vault has a token
    const token = localStorage.getItem('token');

    // If yes, render the Dashboard. If no, kick them to /login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;