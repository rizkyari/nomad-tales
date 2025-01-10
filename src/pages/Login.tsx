import React, { useState } from 'react';
import { isEmailValid } from '../utils/validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate  } from 'react-router-dom';
import Cookies from 'js-cookie';
import { userLogin } from '../utils/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slices/authSlice';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await userLogin(identifier, password);

      Cookies.set('jwt', response.jwt, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });

      dispatch(
        setAuth({
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
        })
      );

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <form className="bg-light p-6 rounded shadow-md max-w-sm w-full" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-dark mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              required
              />
                {!isEmailValid(identifier) && identifier && <p className="text-red-500 text-sm">Invalid email format</p>}
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-dark mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              required
              />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 text-gray-500 hover:text-accent"
              aria-label="Toggle password visibility"
            >
              {<FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />}
            </button>
        </div>

        <button type="submit" className="w-full bg-dark text-light py-2 px-4 rounded hover:bg-accent">
          {isSubmitting ? 'Please Wait...' : 'Login'}
        </button>

        <p className="mt-4 text-center text-sm text-dark">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent underline hover:text-dark">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
