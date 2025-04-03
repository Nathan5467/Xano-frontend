// src/redux/slice/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    userList: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateUser: (state, action) => {
      const updatedUser = action.payload;
      const index = state.userList.findIndex(user => user._id === updatedUser._id);
      if (index !== -1) {
        state.userList[index] = { ...state.userList[index], ...updatedUser };
      }
    },
    deleteUser: (state, action) => {
      state.userList = state.userList.filter(user => user._id !== action.payload);
    },
    setUsers: (state, action) => {
      state.userList = action.payload;
    },
  },
});

export const { updateUser, deleteUser, setUsers } = userSlice.actions;
export default userSlice.reducer;
