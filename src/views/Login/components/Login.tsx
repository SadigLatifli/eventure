import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import PasswordInput from "@/components/PasswordInput";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { useUserAuth } from "@/api/queries/authQueries";
import { LoginPayload } from "@/api/schemas/authSchema";
import  Illustration  from "../../../assets/event_draw.svg?react";



function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const { loginMutation } = useUserAuth();

  const onSubmit = async (data: LoginPayload) => {
    data.admin = true;
    loginMutation.mutate(data, {
      onSuccess: () => {
        console.log("go to the market");
        navigate({ to: "/" });
      },
      onError: (error) => {
        console.error("Login error:", error);
      },
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-2/5 bg-primary text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* <h1 className="text-4xl font-bold mb-4 z-10">Welcome Back!</h1>
        <p className="text-lg text-center max-w-md z-10">Book Mood</p> */}
        {/* Grid Pattern */}
        <div className="z-10">
          <Illustration />
        </div>
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
          ]}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
            "absolute inset-0 h-full w-full skew-y-12"
          )}
        />
      </div>

      {/* Right Section */}
      <div className="w-3/5 flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* email Field */}
            <div>
              <label className="block text-sm font-medium mb-1">email</label>
              <Controller
                name="email"
                control={control}
                rules={{ required: "email is required" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    className="w-full"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    placeholder="Enter your password"
                    className="w-full"
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isLoading}
              className="w-full text-white"
            >
              {loginMutation.isLoading ? "Loading..." : "Login"}
            </Button>

            {/* Signup Link */}
            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <Link
                to="/signup" // Replace with the actual path to your signup page
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Login;
