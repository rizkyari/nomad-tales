import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth, clearAuth } from '../redux/slices/authSlice';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      try {
        const decoded: { id: number; username: string; email: string } = jwtDecode(token);
        dispatch(setAuth(decoded)); // Update Redux state
      } catch (error) {
        console.error('Failed to decode token:', error);
        dispatch(clearAuth()); // Clear state if token is invalid
      }
    } else {
      dispatch(clearAuth());
    }
  }, [dispatch]);
};

export default useAuthInit;
