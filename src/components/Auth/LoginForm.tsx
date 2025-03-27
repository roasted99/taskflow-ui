import { useState, FormEvent } from 'react';
import { useAuth } from '../../context/useAuth'; 
import Button from '../UI/Button';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const { login, authState } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Login</h2>
      
      {authState.error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {authState.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <Button
          type="submit"
          fullWidth
          className={authState.isLoading ? 'cursor-progress' : 'cursor-pointer'}
          disabled={authState.isLoading}
        >
          {authState.isLoading ? 'Logging in...' : 'Login'}
        </Button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
