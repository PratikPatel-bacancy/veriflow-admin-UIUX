import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Shield, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock - navigate to reset password
    navigate("/reset-password");
  };

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

          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:text-[#e8eef5] mb-8"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>

          <h1 className="font-semibold text-[#111827] dark:text-[#e8eef5] text-3xl mb-2">
            Forgot password?
          </h1>
          <p className="text-[#6b7280] dark:text-[#94a3b8] text-sm mb-8">
            No worries, we'll send you reset instructions
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#111827] dark:text-[#e8eef5] mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#6b7280] dark:text-[#94a3b8]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white border border-[#e5e7eb] rounded-lg pl-11 pr-4 py-3 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3b82f6] text-white font-medium rounded-lg px-4 py-3 hover:bg-[#2563eb] transition-colors"
            >
              Send reset link
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
              <Mail className="size-24 mx-auto mb-4 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-4">
            Account Recovery
          </h2>
          <p className="text-blue-100 text-lg">
            We'll send you a secure link to reset your password and regain access to your account
          </p>
        </div>
      </div>
    </div>
  );
}