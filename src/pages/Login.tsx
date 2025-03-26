import LoginForm from '../components/Auth/LoginForm';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { authState } = useAuth();

  // Redirect to home if already authenticated
  if (authState.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <LoginForm />
    </MainLayout>
  );
};

export default Login;