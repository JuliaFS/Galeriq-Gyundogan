import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../components/types/UserProfile";


// Set initial state with default values
const initialState: UserProfile = {
  uid: '',
  email: '',
  displayName: '',
  address: '',
  profileImageUrl: ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      // Update the state with user profile data
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.address = action.payload.address;
      state.profileImageUrl = action.payload.profileImageUrl;
      
      // Store user data in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      // Clear the user state
      state.uid = '';
      state.email = '';
      state.displayName = '';
      state.address = '';
      state.profileImageUrl = '';
      
      // Remove user data from localStorage
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    },
  },
});

// Function to preload state from localStorage
const preloadedState = (): { user: UserProfile } | undefined => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = localStorage.getItem("user");

  if (isLoggedIn && user) {
    // Return the user state from localStorage
    const parsedUser: UserProfile = JSON.parse(user);
    return { user: parsedUser };
  }

  return undefined; // Use default `initialState` if no preloaded state
};

// Configure the Redux store
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
  preloadedState: preloadedState(),
});

// Log the initial state of the store for debugging
console.log("Initial Redux State:", store.getState());

// Export actions
export const { setUser, clearUser } = userSlice.actions;

// Selector to get the entire user state
export const selectUser = (state: { user: UserProfile }) => state.user;

export default userSlice.reducer;

