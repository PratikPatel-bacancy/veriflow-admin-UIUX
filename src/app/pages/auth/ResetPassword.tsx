import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock - show success
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Success Message */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md text-center">
            {/* Logo */}
            <div className="flex items-center gap-2 justify-center mb-12">
              <div className="bg-[#3b82f6] rounded-lg size-10 flex items-center justify-center">
                <Shield className="size-6 text-white" />
              </div>
              <span className="font-semibold text-[#111827] dark:text-[#e8eef5] text-2xl tracking-tight">
                VeriFlow
              </span>
            </div>

            <div className="mb-8">
              <div className="bg-[#10b981] bg-opacity-10 rounded-full size-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="size-12 text-[#10b981]" />
              </div>
            </div>

            <h1 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-3xl mb-2">
              Password reset successful!
            </h1>
            <p className="text-[#6b7280] dark:text-[#94a3b8] text-sm mb-8">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#3b82f6] text-white font-medium rounded-lg px-4 py-3 hover:bg-[#2563eb] transition-colors"
            >
              Continue to login
            </button>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#10b981] to-[#059669] items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            <div className="mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
                <CheckCircle className="size-24 mx-auto mb-4 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-semibold mb-4">
              All Set!
            </h2>
            <p className="text-green-100 text-lg">
              Your account is now secure with your new password
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-[#3b82f6] rounded-lg size-10 flex items-center justify-center">
              <Shield className="size-6 text-white" />
            </div>
            <span className="font-semibold text-[#111827] dark:text-[#e8eef5] text-2xl tracking-tight">
              VeriFlow
            </span>
          </div>

          <h1 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-3xl mb-2">
            Set new password
          </h1>
          <p className="text-[#6b7280] dark:text-[#94a3b8] text-sm mb-8">
            Please enter your new password below
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] dark:text-[#94a3b8]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-white border border-[#e5e7eb] rounded-lg pl-11 pr-11 py-3 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:text-[#e8eef5]"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] dark:text-[#94a3b8]" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-white border border-[#e5e7eb] rounded-lg pl-11 pr-11 py-3 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:text-[#e8eef5]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3b82f6] text-white font-medium rounded-lg px-4 py-3 hover:bg-[#2563eb] transition-colors"
            >
              Reset password
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
              Remember your password?{" "}
              <Link to="/login" className="text-[#3b82f6] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#3b82f6] to-[#1e40af] items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
              <Lock className="size-24 mx-auto mb-4 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-4">
            Secure Your Account
          </h2>
          <p className="text-blue-100 text-lg">
            Create a strong password to protect your account and data
          </p>
        </div>
      </div>
    </div>
  );
}