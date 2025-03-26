import RegisterForm from '../components/Auth/RegisterForm';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const { authState } = useAuth();

  // Redirect to home if already authenticated
  if (authState.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <MainLayout>
      <RegisterForm />
    </MainLayout>
  );
};

export default Register;