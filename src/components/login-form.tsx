"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [activeTab, setActiveTab] = useState<"email" | "mobile">("email");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md bg-white  p-8 rounded-lg">
      <h2 className="text-3xl font-semibold mb-4 text-gray-900">
        Login <span className="font-normal text-[#606060]">with</span>
      </h2>

      {/* Tabs */}
      <div className="flex mb-6 bg-gray-200  rounded-md p-1">
        {["email", "mobile"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`flex-1 py-2 px-4 rounded-md text-center font-medium transition-colors ${
              activeTab === tab
                ? "bg-white "
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab as "email" | "mobile")}
          >
            {tab === "email" ? "Email" : "Mobile"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label htmlFor="credential" className="block text-gray-600">
            {activeTab === "email" ? "Email" : "Mobile Number"}
          </label>
          <input
            type={activeTab === "email" ? "email" : "tel"}
            id="credential"
            name={activeTab}
            defaultValue={activeTab === "email" ? "User123@gmail.com" : ""}
            placeholder={activeTab === "email" ? "Enter email" : "Enter mobile number"}
            className="w-full p-3 bg-gray-100  text-black rounded-md border border-gray-300 "
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-gray-600">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              defaultValue="User213"
              placeholder="Enter password"
              className="w-full p-3 bg-gray-100  text-black  rounded-md border border-gray-300 pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Forgot Password (Placeholder) */}
        <div className="text-right">
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm"
            onClick={() => console.log("Forgot password clicked")}
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-md font-medium transition-colors"
        >
          Login
        </button>

        {/* Register (Placeholder) */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium"
            onClick={() => console.log("Register clicked")}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
