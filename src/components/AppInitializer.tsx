// src/AppInitializer.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import apiClient from "@/api/apiClient";
import { isAuthenticated } from "@/utils/auth";
import {
  fetchUserFailure,
  fetchUserStart,
  fetchUserSuccess,
} from "@/redux/userSlice";
import { userInfoSchema } from "@/api/schemas/usersSchema";

export const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      // Only fetch user data if the user is authenticated

      if (!isAuthenticated()) return;

      dispatch(fetchUserStart());

      try {
        const response = await apiClient.get("/session/info");

        // Validate the response data with Zod
        const validatedUserData = userInfoSchema.parse(response.data);

        // Update Redux with user data
        dispatch(fetchUserSuccess(validatedUserData));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch user data";
        console.error("Error initializing app:", errorMessage);
        dispatch(fetchUserFailure(errorMessage));
      }
    };

    initializeApp();
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default AppInitializer;
