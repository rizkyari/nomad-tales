import axios from 'axios';
import Cookies from 'js-cookie';
import { clearAuth } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store';

const baseURL = process.env.REACT_APP_API_BASE_URL;

if (!baseURL) {
    throw new Error('REACT_APP_API_BASE_URL is not defined in the .env file');
}

const apiClient = axios.create({
    baseURL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = Cookies.get('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Register a new user.
 * @param {string} email - The user's email address.
 * @param {string} username - The desired username.
 * @param {string} password - The desired password.
 * @returns {Promise<any>} The server response, including JWT and user info.
 */
export const registerUser = async (email: string, username: string, password: string) => {
    const response = await apiClient.post('/api/auth/local/register', { email, username, password });
    return response.data;
};

/**
 * Login.
 * @param {string} identifier - The user's email address.
 * @param {string} password - The desired password.
 * @returns {Promise<any>} The server response, including JWT and user info.
 */
export const userLogin = async (identifier: string, password: string) => {
    const response = await apiClient.post('/api/auth/local', { identifier, password });
    return response.data;
};


/**
 * Verify the authenticated user's info based on the JWT in cookies.
 * @returns {Promise<any>} The user's info if authenticated.
 */
export const verifyUser = async () => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
};

/**
 * Logs out the user by removing the JWT and clearing Redux state.
 * @param dispatch - The Redux dispatch function.
 */
export const logoutUser = (dispatch: AppDispatch) => {
    Cookies.remove('jwt');
    dispatch(clearAuth());
};

export default apiClient;
