import { Link } from "react-router-dom";
import { useState } from "react";
import { useForgotPasswordMutation, useLoginUserMutation, useCreateCaptchaMutation } from "../api/api";
import MessageBox from "../components/MessageBox";


export const Login = () => {

  const [loginUser, {isLoading, error}] = useLoginUserMutation();

  const [createCaptcha] = useCreateCaptchaMutation();

  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 text-sm mt-1">
          Securely access your account.
        </p>

        {/* Email */}
        <div className="mt-6">
          <label className="text-sm text-gray-600">Email Address</label>
          <input
            type="email"
            placeholder="name@company.com"
            className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <label className="text-sm text-gray-600">Password</label>
            <Link to="/forgot-password" className="text-blue-600 font-semibold">
              Forgot Password?  
            </Link>
          </div>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? "show" : "hide"}
            </button>
          </div>
        </div>

        {/* CAPTCHA Box (UI only) */}
        <div className="mt-5 flex items-center justify-between border rounded-lg p-3 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-blue-600">🛡️</span>
            <span>16 + 6 =</span>
            <input
              type="text"
              className="w-12 border rounded px-2 py-1 text-center"
            />
          </div>

          <span className="text-base text-gray-500">
            VERIFY HUMAN INTERACTION
          </span>
        </div>

        {/* Login Button */}
        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
          Login →
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-xs text-gray-400">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Login */}
        <button className="w-full flex items-center justify-center gap-2 border py-3 rounded-lg hover:bg-gray-50 transition">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />
          <span className="text-sm font-medium text-gray-700">
            Login with Google
          </span>
        </button>

        {/* Sign up */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account?{" "}
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}