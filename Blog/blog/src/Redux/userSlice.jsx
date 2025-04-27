import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('token') || '', 
    user: JSON.parse(localStorage.getItem('user')) || {},
    role: localStorage.getItem('role') || '',
  },
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.user.role;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('role', action.payload.user.role);
    },

    logout: (state) => {
      state.token = '';
      state.user = {};
      state.role = '';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
