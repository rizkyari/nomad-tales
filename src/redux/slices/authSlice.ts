import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: {
        id: number | null;
        username: string | null;
        email: string | null;
    };
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: {
        id: null,
        username: null,
        email: null,
    },
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<AuthState['user']>) => {
            console.log('setAuth Action Payload:', action.payload);
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearAuth: (state) => {
            state.user = { id: null, username: null, email: null };
            state.isAuthenticated = false;
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
