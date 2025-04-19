// ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      setIsAuth(!!token); // Простая проверка наличия токена
    };
    checkAuth();
  }, []);

  if (isAuth === null) return <div>Проверка доступа...</div>;
  return isAuth ? children : <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectedRoute