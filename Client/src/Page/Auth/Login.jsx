import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Stores/UserAuthslicer';
import { toast } from "sonner";
import Language from '@/Components/Language/Language';

const Login = ({user,isAuthenticated}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading} = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [localError, setLocalError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await dispatch(loginUser(formData));

      if (result.meta.requestStatus === 'fulfilled' && result.payload?.success) {
        // Success: Display success message from backend
        toast.success(result.payload.message || 'Login successful!');

        // Clear form
        setFormData({
          email: "",
          password: "",
        });

        // Navigate based on user role
        const userRole = result.payload.user?.role;
        console.log('User role after login:', userRole);
        
        // Store user data in local storage if needed
        if (result.payload.user) {
          localStorage.setItem('user', JSON.stringify(result.payload.user));
        }

        // Navigate based on user role
        const roleRoutes = {
          'Admin': '/admin/home',
          'Patient': '/patient/home',
          'Doctor': '/doctor/home',
          'Nurse': '/nurse/home',
          'Receptionist': '/receptionist'
        };

        navigate(roleRoutes[userRole] || '/dashboard');
      } else {
        // Error: Display error message from backend
        const errorMessage = result.payload?.message || result.error?.message || 'Login failed';
        toast.error(errorMessage);
      }
    } catch (error) {
      // Unexpected error
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Welcome Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center min-h-[40vh] md:h-[100vh] bg-[var(--six)] p-6 md:p-10">
        <h1 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
          Welcome to Batu Hospital
        </h1>
        <p className="text-white text-center mb-6 md:mb-10">
          Please login to access your account
        </p>
        <Language /> 
      </div>

      {/* Login Form Section */}
      <div className="w-full md:w-1/2 min-h-[60vh] md:h-[100vh] bg-[var(--two)] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-[var(--six)] p-6 md:p-10 rounded-2xl w-full">
            <h1 className="text-xl md:text-2xl font-bold text-white text-center">
              Login
            </h1>
            <p className="text-white text-center mb-6 md:mb-10">
              Enter your credentials to continue
            </p>

          

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e)=>setFormData({...formData,email:e.target.value})}
                className="border text-white bg-transparent border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--two)]"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                 onChange={(e)=>setFormData({...formData,password:e.target.value})}
                className="border text-white bg-transparent border-gray-300 rounded-md p-2 md:p-3 focus:outline-none focus:ring-2 focus:ring-[var(--two)]"
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[var(--one)] text-black font-bold p-2 md:p-3 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Optional: Link to registration */}
            <p className="text-white text-center mt-4">
              Don't have an account?{' '}
              <a href="/register" className="text-[var(--one)] hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
