import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import {
  AUTH_STATE,
  clearToken,
  isAuthenticated,
  TOKEN_KEY,
} from "@/utils/auth";
import { clearUserData } from "@/redux/userSlice";
import { useDispatch } from "react-redux";
import { useUserAuth } from "@/api/queries/authQueries";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = isAuthenticated();
  const dispatch = useDispatch();
  const {logoutMutation} = useUserAuth();

  useEffect(() => {
    // If authentication is required but user is not authenticated, redirect to login
    if (requireAuth && !authenticated) {
      
      navigate({
        to: "/login",
        search: {
          returnTo: location.pathname,
        },
      });
    }

    // If user is authenticated but on a public-only route (like login/signup), redirect to home
    if (
      !requireAuth &&
      authenticated &&
      (location.pathname === "/login" || location.pathname === "/signup")
    ) {
      navigate({ to: "/" });
    }
  }, [requireAuth, authenticated, navigate, location.pathname]);


  const handleUnauthorized = async () => {
    if (requireAuth && location.pathname !== "/login") {
      // Execute the logout mutation
      await logoutMutation.mutateAsync();
      
      // Navigate to login
      navigate({
        to: "/login",
        search: {
          returnTo: location.pathname !== "/login" ? location.pathname : undefined,
        },
      });
    }
  };

  useEffect(() => {
    const handleStorageChange = async (event: StorageEvent) => {
      // Only respond to changes in our auth-related keys
      if (event.key === AUTH_STATE || event.key === TOKEN_KEY) {
        const currentlyAuthenticated = isAuthenticated();

        // If auth state changed to not authenticated
        if (!currentlyAuthenticated && requireAuth) {
          // Clear any remaining auth data
          await handleUnauthorized();
          clearToken();
          // Clear Redux state
          dispatch(clearUserData());
          // Navigate to login
          navigate({
            to: "/login",
            search: {
              returnTo:
                location.pathname !== "/login" ? location.pathname : undefined,
            },
          });
        }
      }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Setup periodic check for token validity
    const checkInterval = setInterval(() => {
      // If the authentication state has changed, handle it
      if (requireAuth && !isAuthenticated()) {
        clearToken();
        handleUnauthorized();
        dispatch(clearUserData());
        navigate({ to: "/login" });
      }
    }, 5000); // Check every 5 seconds

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [navigate, requireAuth, dispatch, location.pathname]);

  // If requireAuth is true and user is not authenticated, don't render children
  if (requireAuth && !authenticated) {
    return null;
  }

  // If requireAuth is false (public route) and user is authenticated, don't render login/signup pages
  if (
    !requireAuth &&
    authenticated &&
    (location.pathname === "/login" || location.pathname === "/signup")
  ) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
