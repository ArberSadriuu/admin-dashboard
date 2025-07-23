import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']),
});

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
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

  const onSubmit = async (_data: FormData) => {
    setError('');
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md flex flex-col items-center gap-6 bg-transparent">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Register for NexBoard</h1>

        <div className="w-full">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            id="username"
            type="text"
            {...register('username')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="username"
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div className="w-full">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoComplete="new-password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="w-full">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            id="role"
            {...register('role')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        {error && <p className="text-red-500 text-xs italic text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">Registration successful! Redirecting...</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>

        <div className="mt-4 text-center">
          <span className="text-gray-500 text-sm">Already have an account? </span>
          <a href="/login" className="text-blue-600 hover:underline font-semibold">Sign In</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
