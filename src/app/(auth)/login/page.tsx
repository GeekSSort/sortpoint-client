"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

import { AuthService } from "@/services";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@sortpoint.test");
  const [password, setPassword] = useState("correct-horse-battery-staple");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await AuthService.login({ email, pin: password });
      window.location.href = "/dashboard";
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] p-4 overflow-hidden">
      {/* Subtle Warm Dotted Grid Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          backgroundImage: `radial-gradient(#ECC878 1.2px, transparent 1.2px)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80">
        
        {/* Logo / Image Box */}
        <div className="mx-auto mb-6 flex items-center justify-center">
          <div className="w-[72px] h-[72px] rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25 relative overflow-hidden group">
            <Image 
              src="/image.png" 
              alt="Logo" 
              width={48} 
              height={48} 
              className="object-contain" 
            />
          </div>
        </div>

        {/* Headings */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            Sign in to continue to your ERPFLOW workspace.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-800 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-xl border border-amber-400/90 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
            />
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-800 mb-1.5"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-100/90 border border-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-amber-400/90 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-gray-300 accent-amber-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600">Remember Me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-amber-500 hover:text-amber-600 hover:underline transition-colors"
            >
              Forgot Password ?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 bg-[#F4B41A] hover:bg-[#E5A612] active:scale-[0.99] text-white font-medium rounded-xl shadow-md shadow-amber-500/25 transition-all text-sm flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}