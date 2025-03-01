// src/api/queries/authQueries.ts

import { useDispatch } from 'react-redux';
import apiClient from '../apiClient';
import { LoginPayload, LoginResponse, loginResponseSchema, RegisterPayload, RegisterResponse, registerResponseSchema } from '../schemas/authSchema';
import { useAuth } from '@/context/AuthContext';
import { useMutation, useQuery } from 'react-query';
import { clearUserData, fetchUserFailure, fetchUserStart, fetchUserSuccess } from '@/redux/userSlice';
import { UserInfo, userInfoSchema } from '../schemas/usersSchema';


// Hook for user-related auth operations
export const useUserAuth = () => {
  const dispatch = useDispatch();
  const auth = useAuth();

  // Login mutation
  const loginMutation = useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (data: LoginPayload) => {
      const response = await apiClient.post<LoginResponse>('/auth/sign', data);

      // Extract and save token from response headers if present
      const tokenFromHeader = response.headers.authorization || response.headers.Authorization;
      if (tokenFromHeader) {
        const token = tokenFromHeader.replace('Bearer ', '');
        await auth.setTokenFromHeader(token);
      }
      // Validate response with Zod
      const validatedData = loginResponseSchema.parse(response.data || {});

      // After successful login, fetch user info
      try {
        dispatch(fetchUserStart());
        const userResponse = await apiClient.get<UserInfo>('/session/info');
        const validatedUserInfo = userInfoSchema.parse(userResponse.data);
        dispatch(fetchUserSuccess(validatedUserInfo));
      } catch (error) {
        dispatch(fetchUserFailure(error instanceof Error ? error.message : 'Failed to fetch user data'));
      }

      return validatedData;
    }
  });

  const registerMutation = useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: async (data: RegisterPayload) => {
      const response = await apiClient.post<RegisterResponse>('/auth/company/register', data);
      const validatedData = registerResponseSchema.parse(response.data || {}); ;
      return validatedData;
    }
  });
  
  const logoutMutation = useMutation<void, Error>({
    mutationFn: async () => {
      // Call the logout endpoint
      await apiClient.post('/auth/logout');
      // Execute client-side logout logic
      await auth.logout();
      // Optionally, clear any Redux user data
      dispatch(clearUserData());
    },
  });

  return { loginMutation, registerMutation , logoutMutation};

};

// Separate hook for fetching user info
export const useFetchUserInfo = () => {
  const dispatch = useDispatch();

  // Fetch user info query
  const fetchUserInfoQuery = useQuery<UserInfo, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      dispatch(fetchUserStart());
      try {
        const response = await apiClient.get<UserInfo>('/session/info');
        const validatedData = userInfoSchema.parse(response.data);
        dispatch(fetchUserSuccess(validatedData));
        return validatedData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data';
        dispatch(fetchUserFailure(errorMessage));
        throw error;
      }
    },
    enabled: false, // Don't run automatically, only when needed
  });

  const refetchUserInfo = () => {
    return fetchUserInfoQuery.refetch();
  };

  return {
    userInfo: fetchUserInfoQuery.data,
    isLoading: fetchUserInfoQuery.isLoading,
    error: fetchUserInfoQuery.error,
    refetchUserInfo
  };
};