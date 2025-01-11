import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slices/authSlice';
import { registerUser } from '../utils/api';
import { isEmailValid, isPasswordMatch } from '../utils/validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = await registerUser(email, username, password);

            Cookies.set('jwt', data.jwt, {
                expires: 1,
                secure: true,
                sameSite: 'Strict',
              });

            dispatch(
                setAuth({
                    id: data.user.id,
                    username: data.user.username,
                    email: data.user.email,
                })
            );

            setMessage(`Registration successful! Welcome, ${data.user.username}`);
            navigate('/dashboard');
        } catch (error: any) {
            setMessage('Registration failed. Please try again.');
            console.error(error.response ? error.response.data : error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        email &&
        username &&
        password &&
        confirmPassword &&
        isEmailValid(email) &&
        isPasswordMatch(password, confirmPassword);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <form
                className="bg-light p-6 rounded shadow-md max-w-sm w-full"
                onSubmit={handleRegister}
            >
            <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
            {message && <p className="text-center mb-4 text-accent">{message}</p>}
        
            <div className="mb-4">
                <label htmlFor="email" className="block text-dark mb-1">Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                />
                {!isEmailValid(email) && email && <p className="text-red-500 text-sm">Invalid email format</p>}
            </div>
        
            <div className="mb-4">
                <label htmlFor="username" className="block text-dark mb-1">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                />
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
        
            <div className="mb-4">
                <label htmlFor="confirm-password" className="block text-dark mb-1">Confirm Password</label>
                <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                />
                {!isPasswordMatch(password, confirmPassword) && confirmPassword && <p className="text-red-500 text-sm">Passwords do not match</p>}
            </div>
        
            <button
                type="submit"
                className="w-full bg-dark text-light py-2 px-4 rounded hover:bg-accent"
                disabled={!isFormValid || isSubmitting}
            >
                {isSubmitting ? (<Loader text='Please Wait...'/>) : "Register"}
            </button>

            <p className="mt-4 text-center text-sm text-dark">
                Already have an account?{' '}
                    <Link to="/login" className="text-accent underline hover:text-dark">
                        Click here to login
                    </Link>
            </p>
        </form>
    </div>
  );
};

export default Register;
