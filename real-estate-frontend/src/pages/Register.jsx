// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiHome,
  FiMapPin,
  FiUserPlus
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { signup, createAdmin } = useAuth();

  const [formData, setFormData] = useState({
    userType: 'buyer',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '', // ✅ added
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (formData.userType === 'admin') {
      toast.error(
        'Admin accounts cannot be created from this form. Contact site administrator.'
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const { success, user, error } = await signup(formData);
      if (success) {
        const role =
          user?.role ?? (formData.userType === 'agent' ? 'agent' : 'user');

        if (role === 'admin') navigate('/admin/dashboard', { replace: true });
        else if (role === 'agent')
          navigate('/agent/dashboard', { replace: true });
        else navigate('/', { replace: true });
      } else {
        toast.error(error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(
        'An error occurred during registration. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { success, error } = await createAdmin(
        'admin@example.com',
        'admin123'
      );
      if (success) {
        toast.success('Admin account created and logged in (dev only).');
        navigate('/admin/dashboard', { replace: true });
      } else {
        toast.error(error || 'Failed to create admin account');
      }
    } catch (err) {
      console.error('Create admin error:', err);
      toast.error('An error occurred while creating admin account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Join our community and find your dream property
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* User Type */}
            <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  formData.userType === 'buyer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700'
                }`}
                onClick={() =>
                  setFormData((p) => ({ ...p, userType: 'buyer' }))
                }
              >
                I'm a Buyer
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  formData.userType === 'agent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700'
                }`}
                onClick={() =>
                  setFormData((p) => ({ ...p, userType: 'agent' }))
                }
              >
                I'm an Agent
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  formData.userType === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-700'
                }`}
                onClick={() =>
                  setFormData((p) => ({ ...p, userType: 'admin' }))
                }
              >
                I'm an Admin
              </button>
            </div>

            {/* Full Name */}
            <div className="relative">
              <FiUser className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="Full Name"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="Email Address"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <FiPhone className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="Phone Number"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="Password"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FiLock className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="Confirm Password"
              />
            </div>

            {/* Address */}
            <div className="relative">
              <FiHome className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="Street Address"
              />
            </div>

            

            {/* City / State / Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="City"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="State"
              />
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="ZIP Code"
              />
            </div>
            {/* Country */}
            <div className="relative">
              <FiMapPin className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="pl-10 w-full px-3 py-2 border rounded-md dark:bg-gray-700"
                placeholder="Country"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center text-sm mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
