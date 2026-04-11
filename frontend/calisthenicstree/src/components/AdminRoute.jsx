import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // 1. If they aren't logged in at all, kick to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. If they are logged in but NOT an admin, kick to their normal dashboard!
    if (role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. If they have the token AND the admin role, let them in
    return children;
};

export default AdminRoute;