import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(action.payload));  // Save the entire user object
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    },
  },
});

const preloadedState = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = localStorage.getItem("user");

  if (isLoggedIn && user) {
    const parsedUser = JSON.parse(user);
    return {
      user: parsedUser,
    };
  }

  return undefined; // This will use the default `initialState`
};


export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
  preloadedState: preloadedState(),
});


console.log("Initial Redux State:", store.getState());


export const { setUser, clearUser } = userSlice.actions;

// Selector to get the entire user state
export const selectUser = (state: { user: UserState }) => state.user;


export default userSlice.reducer;
