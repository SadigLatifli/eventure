// src/store/slices/userSlice.ts
import { UserInfo } from '@/api/schemas/usersSchema';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface UserState {
  userData: UserInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  isLoading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUserSuccess: (state, action: PayloadAction<UserInfo>) => {
      state.userData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearUserData: (state) => {
      state.userData = null;
    },
    updateUserData: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    }
  }
});

export const {
  fetchUserStart,
  fetchUserSuccess,
  fetchUserFailure,
  clearUserData,
  updateUserData
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectUserData = (state: { user: UserState }) => state.user.userData;
export const selectIsUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;