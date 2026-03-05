import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import CustomerHome from './pages/CustomerHome';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

// Public Route - Redirect if already logged in
const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }
    
    if (user) {
        return <Navigate to={user.role === 'owner' ? '/owner' : '/staff'} replace />;
    }
    
    return children;
};

function App() {
    return (
        <>
            <Toaster 
                position="top-right" 
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '8px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <Routes>
                {/* Public Route - Customer Home */}
                <Route path="/" element={<CustomerHome />} />
                
                {/* Public Route - Login (redirect if already logged in) */}
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                
                {/* Protected Routes */}
                <Route 
                    path="/owner" 
                    element={
                        <ProtectedRoute allowedRole="owner">
                            <OwnerDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/staff" 
                    element={
                        <ProtectedRoute allowedRole="staff">
                            <StaffDashboard />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;