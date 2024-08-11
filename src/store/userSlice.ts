import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  email: string | null;
}

const initialState: UserState = {
  email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearUser: (state) => {
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user.email;
export default userSlice.reducer;