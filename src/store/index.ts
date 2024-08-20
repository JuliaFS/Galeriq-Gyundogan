import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Ensure the path is correct

const preloadedState = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = localStorage.getItem("user");

  if (isLoggedIn && user) {
    try {
      const parsedUser = JSON.parse(user);
      return {
        user: parsedUser,
      };
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return undefined;
    }
  }

  return undefined; // Use the default initialState if user data is not in localStorage
};

export const store = configureStore({
  reducer: {
    user: userReducer, // Ensure this matches the exported reducer name
  },
  preloadedState: preloadedState(),
});
