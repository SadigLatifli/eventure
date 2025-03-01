// src/pages/SignUp.tsx
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PasswordInput from "@/components/PasswordInput";
import { Link, useNavigate } from "@tanstack/react-router";
import { RegisterPayload } from "@/api/schemas/authSchema";
import { useUserAuth } from "@/api/queries/authQueries";
import { showSuccessToast } from "@/utils/sonnerToastConfig";

function SignUp() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterPayload>({
    defaultValues: {
      address: "",
      branch: "",
      companyName: "",
      contactNo: "",
      email: "",
      firstName: "",
      fromInvitation: false,
      lastName: "",
      logoPath: "",
      password: "",
      position: "",
    },
  });
  const navigate = useNavigate();
  const { registerMutation } = useUserAuth();
  const onSubmit = async (data: RegisterPayload) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: "/login" });
        showSuccessToast("Account created successfully. Please login to continue.");
      },

    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 shadow-md w-1/4">
        <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Company Name Field */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company Name
            </label>
            <Controller
              name="companyName"
              control={control}
              rules={{ required: "Company name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your company name"
                  className="w-full"
                />
              )}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* First Name Field */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your first name"
                  className="w-full"
                />
              )}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your last name"
                  className="w-full"
                />
              )}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required" }}
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

          {/* Address Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your address"
                  className="w-full"
                />
              )}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Branch Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Branch</label>
            <Controller
              name="branch"
              control={control}
              rules={{ required: "Branch is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your branch"
                  className="w-full"
                />
              )}
            />
            {errors.branch && (
              <p className="text-red-500 text-sm mt-1">
                {errors.branch.message}
              </p>
            )}
          </div>

          {/* Contact Number Field */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Number
            </label>
            <Controller
              name="contactNo"
              control={control}
              rules={{ required: "Contact number is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your contact number"
                  className="w-full"
                />
              )}
            />
            {errors.contactNo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNo.message}
              </p>
            )}
          </div>

          {/* Position Field */}
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <Controller
              name="position"
              control={control}
              rules={{ required: "Position is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your position"
                  className="w-full"
                />
              )}
            />
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">
                {errors.position.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full text-white">
            Sign Up
          </Button>

          <p className="text-sm text-center mt-4">
            Have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default SignUp;
