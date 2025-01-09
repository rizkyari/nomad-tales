import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth, clearAuth } from '../redux/slices/authSlice';
import { verifyUser } from '../utils/api';

/**
 * Initializes the authentication state on app load.
 */
const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await verifyUser();
        dispatch(setAuth(user));
      } catch (error) {
        dispatch(clearAuth());
        console.error('User verification failed:', error);
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useAuthInit;
