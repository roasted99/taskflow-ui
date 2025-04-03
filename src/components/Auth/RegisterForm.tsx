import { useState, FormEvent } from 'react';
import { useAuth } from '../../context/useAuth';
import Button from '../UI/Button';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const { register, authState } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear password match error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    console.log('been submit')
    
    // Destructure to remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = formData;
    await register(registerData);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Register</h2>
      
      {authState.error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {authState.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className='mb-4'>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        
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
        
        <div className="mb-4">
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
            minLength={6}
            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}
        </div>
        
        <Button
          type="submit"
          fullWidth
          className={authState.isLoading ? 'cursor-progress' : 'cursor-pointer'}
          disabled={authState.isLoading}
        >
          {authState.isLoading ? 'Registering...' : 'Register'}
        </Button>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;