// routers.tsx
import { createRootRoute, createRoute, redirect } from "@tanstack/react-router";
import Home from './views/home/pages/HomePage';
import { isAuthenticated } from "@/utils/auth";
import Layout from "@/components/layout";
import Login from "@/views/Login/pages/LoginPage"
import SignUp from "@/views/SignUp/pages/SignUpPage";
import Terms from "@/views/Terms/pages/TermsPage";
import NotFoundPage from "./views/NotFoundPage";
import AuthGuard from "./components/AuthGuard";


const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <AuthGuard requireAuth={true}>
      <Home/>
    </AuthGuard>
  ),
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});



const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <AuthGuard requireAuth={false}>
      <Login />
    </AuthGuard>
  ),
  // beforeLoad: () => {
  //   if (isAuthenticated()) {
  //     throw redirect({
  //       to: "/",
  //     });
  //   }
  // },
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: () => (
    <AuthGuard requireAuth={false}>
      <SignUp />
    </AuthGuard>
  ),
});



const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: Terms
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/404",
  component: NotFoundPage,
});

// Define a catch-all route ("/*") that redirects to the "/404" route
const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/*",
  beforeLoad: () => {
    throw redirect({ to: "/404" });
  },
});


export const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signUpRoute,
  termsRoute,
  notFoundRoute,
  catchAllRoute,
]);


