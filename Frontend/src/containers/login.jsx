import { Link, useNavigate } from "react-router-dom";
import React ,{ useEffect, useState, useCallback} from "react";
import { useLoginUserMutation, useCreateCaptchaMutation, useGoogleLoginMutation , useResendOTPMutation} from "../api/authApi";
import MessageBox from "../components/MessageBox";
import { validateEmail, validatePassword } from "../utils/validations";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import CaptchaBox from "../components/auth/CaptchaBox";
import AuthButton from "../components/auth/AuthButton";

const LoginUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [resendOtp] = useResendOTPMutation();

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [createCaptcha] = useCreateCaptchaMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [captcha, setCaptcha] = useState({ question: "", answer: "", id: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchCaptcha = useCallback(async () => {
    try {
      const res = await createCaptcha().unwrap();
      setCaptcha({ question: res.question, id: res.captchaId, answer: "" });
    } catch {
      setMessage({ type: "error", text: "Failed to load captcha" });
    }
  });

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email || !password || !captcha.answer) {
      return setMessage({ type: "error", text: "All fields are required" });
    }

    if (!validateEmail(email)) {
      return setMessage({ type: "error", text: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return setMessage({ type: "error", text: "Password must be 8+ chars with number & special char",});
    }

    try {
      const res = await loginUser({ email, password, role, captchaId: captcha.id, captchaAnswer: captcha.answer}).unwrap();

      dispatch(setUser(res.data));
      setMessage({ type: "success", text: res.message });
      navigate(res.data.role === "admin" ? "/admin" : "/profile");

    } catch (err) {
        const data = err?.data;

        if (data?.code === "EMAIL_NOT_VERIFIED") {
        try {
            await resendOtp(data?.email).unwrap();
        } catch {
      
        }

        setMessage({ type: "error", text: data?.message || "Please verify your email before logging in."});

        setTimeout(() => {
           navigate("/verify-email", { state: { email: data?.email } });
         }, 1500);
         return;

        }

        setMessage({ type: "error", text: data?.message || "Login failed" });

        fetchCaptcha();
    }
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <section className="w-full max-w-md bg-white shadow-xl rounded-2xl p-5 sm:p-8 text-gray-800">

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Login to your account</p>
        </div>

        {message.text && (
          <div className="mt-4">
            <MessageBox
              type={message.type}
              text={message.text}
              onClose={() => setMessage({ type: "", text: "" })}
            />
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />

          <div className="flex flex-wrap justify-between items-center gap-1 mb-1">
            <label htmlFor="forgetPassword" className="text-sm text-gray-600">Password</label>
            <Link to="/forgot-password" id="forgetPassword" className="text-xs text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <PasswordInput
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <CaptchaBox
            captchaQuestion={captcha.question}
            captchaAnswer={captcha.answer}
            setCaptcha={setCaptcha}
            fetchCaptcha={fetchCaptcha}
          />

          <AuthButton loading={isLoading}>Login</AuthButton>
        </form>

        {/* RESEND VERIFICATION */}
        <p className="text-center text-xs text-gray-500 mt-3">
          Email not verified?{" "}
          <button
            type="button"
            onClick={() => {
              if (!email) return setMessage({ type: "error", text: "Enter your email first." });
              navigate("/verify-email", { state: { email } });
            }}
            className="text-blue-600 hover:underline text:base"
          >
            Resend verification
          </button>
        </p>

        {/* DIVIDER */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-700 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (cred) => {
              try {
                const res = await googleLogin(cred.credential).unwrap();
                dispatch(setUser(res.data));
                setMessage({ type: "success", text: res.message });
                navigate("/profile");
              } catch (err) {
                setMessage({ type: "error", text: err?.data?.message || "Google login failed" });
              }
            }}
            onError={() => setMessage({ type: "error", text: "Google login failed" })}
          />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/" className="text-blue-600 font-medium hover:underline">Sign up</Link>
        </p>

      </section>
    </main>
  );
};

export default React.memo(LoginUser);

