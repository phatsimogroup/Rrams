import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store';
import { User } from '@/types';

interface LoginFormData {
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const { setUser } = useStore();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    const mockUser: User = {
      id: '1',
      username: data.username,
      email: `${data.username}@example.com`,
      role: data.username === 'admin' ? 'admin' : data.username === 'engineer' ? 'engineer' : 'viewer',
      fullName: data.username.charAt(0).toUpperCase() + data.username.slice(1),
      active: true,
      createdAt: new Date(),
    };

    localStorage.setItem('token', 'mock-token-' + Date.now());
    setUser(mockUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">RRAMS</h1>
          <p className="text-gray-600">Road & Runway Asset Management System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              {...register('username', { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo credentials:</p>
          <p>admin / engineer / viewer (any password)</p>
        </div>
      </div>
    </div>
  );
};
