import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - navigate to dashboard
    navigate("/");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
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
            Welcome back
          </h1>
          <p className="text-[#6b7280] dark:text-[#94a3b8] text-sm mb-8">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-[#e5e7eb] rounded-lg px-4 py-3 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-[#e5e7eb] rounded-lg px-4 py-3 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="size-4 border-[#e5e7eb] rounded text-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]"
                />
                <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#3b82f6] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3b82f6] text-white font-medium rounded-lg px-4 py-3 hover:bg-[#2563eb] transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">
              Don't have an account?{" "}
              <Link to="#" className="text-[#3b82f6] hover:underline font-medium">
                Contact your administrator
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
              <Shield className="size-24 mx-auto mb-4 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-4">
            Smart Parking Enforcement
          </h2>
          <p className="text-blue-100 text-lg">
            Monitor, manage, and optimize your parking operations with real-time intelligence
          </p>
        </div>
      </div>
    </div>
  );
}