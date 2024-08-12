import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  uid: string | null;
  email: string | null;
}

const initialState: UserState = {
  uid: null,
  email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

// Selector to get the entire user state
export const selectUser = (state: { user: UserState }) => state.user;

export default userSlice.reducer;