import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']),
});

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'user',
    },
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    setSuccess(false);
    
    try {
      const result = await registerUser(data.username, data.password, data.role);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-blue-100 to-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md flex flex-col items-center gap-8 bg-white rounded-3xl shadow-2xl p-10 border border-blue-100"
      >
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2 tracking-tight drop-shadow">
            Create Account
          </h1>
          <p className="text-gray-500">Join NexBoard! Please enter your details to register.</p>
        </div>

        <div className="w-full">
          <label htmlFor="username" className="block text-sm font-semibold text-blue-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register('username')}
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="username"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
          )}
        </div>

        <div className="w-full relative">
          <label htmlFor="password" className="block text-sm font-semibold text-blue-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 placeholder:text-blue-300 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-8 text-blue-500 hover:text-blue-700 text-xs font-semibold px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            tabIndex={-1}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="role" className="block text-sm font-semibold text-blue-700 mb-1">
            Role
          </label>
          <select
            id="role"
            {...register('role')}
            className="w-full px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2 font-medium">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-sm text-center mt-2 font-medium">Registration successful! Redirecting...</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition disabled:opacity-50 shadow-lg mt-2"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center">
          <span className="text-gray-500 text-sm">Already have an account? </span>
          <a href="/login" className="text-blue-600 hover:underline font-semibold text-sm">
            Sign In
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
