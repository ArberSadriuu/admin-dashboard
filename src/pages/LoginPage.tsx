import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const CREDENTIALS_KEY = 'admin-dashboard-credentials';

const LoginPage: React.FC = () => {
  const { login, setPersistUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  });

  useEffect(() => {
    const saved = localStorage.getItem(CREDENTIALS_KEY);
    if (saved) {
      try {
        const { username, password } = JSON.parse(saved);
        setValue('username', username);
        setValue('password', password);
        setValue('remember', true);
      } catch {}
    }
  }, [setValue]);

  useEffect(() => {
    if (!watch('remember')) {
      localStorage.removeItem(CREDENTIALS_KEY);
    }
  }, [watch('remember')]);

  const onSubmit = async (data: LoginFormData) => {
    setPersistUser(!!data.remember);
    setError('');
    if (data.remember) {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ username: data.username, password: data.password }));
    }
    const success = await login(data.username, data.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
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
            Sign In to NexBoard
          </h1>
          <p className="text-gray-500">Welcome back! Please enter your details to continue.</p>
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

        <div className="w-full flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 text-sm text-blue-700 cursor-pointer">
            <input
              type="checkbox"
              {...register('remember')}
              checked={watch('remember')}
              onChange={e => setValue('remember', e.target.checked)}
              className="accent-blue-600 rounded"
            />
            Remember Me
          </label>
          <a href="/register" className="text-blue-600 hover:underline font-semibold text-sm">
            Create Account
          </a>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2 font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition disabled:opacity-50 shadow-lg mt-2"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-700 mb-2">Demo Credentials:</h3>
          <div className="space-y-1 text-xs text-blue-600">
            <div><strong>Admin:</strong> admin / admin123</div>
            <div><strong>User:</strong> user / user123</div>
            <div><strong>User:</strong> arbersadriu / user12</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
