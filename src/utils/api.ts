import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

if (!baseURL) {
    throw new Error('REACT_APP_API_BASE_URL is not defined in the .env file');
}

const apiClient = axios.create({
    baseURL,
    withCredentials: true,
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
 * Verify the authenticated user's info based on the JWT in cookies.
 * @returns {Promise<any>} The user's info if authenticated.
 */
export const verifyUser = async () => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
};

export const logoutUser = async () => {
  await apiClient.post('/auth/logout');
};

export default apiClient;
