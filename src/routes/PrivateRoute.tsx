import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const PrivateRoute = () => {
  const { accessToken } = useAuthStore();

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
