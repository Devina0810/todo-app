import { useState } from 'react';
import { FaUser, FaLock, FaAt, FaPhone, FaLeaf, FaTree, FaMountain, FaArrowLeft } from 'react-icons/fa';
import { FaCheckCircle, FaClipboardList, FaRocket } from "react-icons/fa";


export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login validation
      if (!formData.username || !formData.password) {
        alert('Please enter both username and password');
        return;
      }
    } else {
      // Signup validation
      if (!formData.name || !formData.email || !formData.password) {
        alert('Please fill all required fields');
        return;
      }
    }

    // For demo - in real app you would call an API here
    const userData = isLogin
      ? { username: formData.username, rememberMe: formData.rememberMe }
      : { 
          name: formData.name,
          email: formData.email,
          username: formData.email.split('@')[0], // Generate username from email
          mobile: formData.mobile
        };

    // Save to localStorage if "Remember Me" is checked
    if (formData.rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
    }

    onLogin(userData); // Notify parent component
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        {/* Left Side - Nature Image */}
        <div className="relative w-full md:w-1/2 p-8 flex flex-col justify-center text-white bg-[url('https://images.unsplash.com/photo-1476231682828-37e571bc172f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-olive-700 bg-opacity-70"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome to TaskTrackr</h1>
            <p className="mb-6">Organize your life, one task at a time.</p>
            <div className="flex items-center space-x-2 mb-4">
              <FaCheckCircle className="text-xl" />
              <span>Plan and prioritize your daily tasks</span>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <FaClipboardList className="text-xl" />
              <span>Track progress and stay focused</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaRocket className="text-xl" />
              <span>Achieve your goals, one task at a time</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="bg-white w-full md:w-1/2 p-8 md:p-10">
          <div className="text-center mb-8">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="flex items-center text-olive-600 hover:text-olive-800 mb-4"
            >
              <FaArrowLeft className="mr-2" /> 
              {isLogin ? 'Create an account' : 'Back to login'}
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Login to Your Account' : 'Create an Account'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg input-focus focus:outline-none"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                {isLogin ? 'Username' : 'Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isLogin ? <FaUser className="text-gray-400" /> : <FaAt className="text-gray-400" />}
                </div>
                <input
                  type={isLogin ? 'text' : 'email'}
                  name={isLogin ? 'username' : 'email'}
                  value={isLogin ? formData.username : formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg input-focus focus:outline-none"
                  placeholder={isLogin ? 'Enter your username' : 'Enter your email'}
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg input-focus focus:outline-none"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg input-focus focus:outline-none"
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  required
                />
              </div>
              {!isLogin && (
                <div className="text-xs text-gray-500 mt-1">
                  Use 8 or more characters with a mix of letters, numbers & symbols
                </div>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-olive-600 focus:ring-olive-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button type="button" className="text-sm text-olive-600 hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    className="h-4 w-4 text-olive-600 focus:ring-olive-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-olive-600 hover:underline">Terms of Service</a> and{' '}
                    <a href="#" className="text-olive-600 hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
            )}

            {/* Submit Button - Now properly shown */}
            <button
              type="submit"
              className="w-full btn-olive py-2 px-4 rounded-lg font-medium mb-4"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}