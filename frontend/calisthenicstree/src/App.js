import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Registration />} />
        <Route path="/admin" element={<AdminRoute> <AdminDashboard /> </AdminRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute> <Layout> <Dashboard /> </Layout> </ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute> <Layout> <Profile /> </Layout> </ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;