import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoginUserMutation, useCreateCaptchaMutation, useGoogleLoginMutation} from "../api/authApi";
import MessageBox from "../components/MessageBox";
import { validateEmail, validatePassword} from "../utils/validations";
import { GoogleLogin } from "@react-oauth/google";

export const Login = () => {
  const navigate = useNavigate();

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [createCaptcha] = useCreateCaptchaMutation();
  const [googleLogin] = useGoogleLoginMutation();


  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaId, setCaptchaId] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [role, setRole] = useState("user");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchCaptcha = async () => {
    try {
      const response = await createCaptcha().unwrap();

      setCaptchaQuestion(response.question);
      setCaptchaId(response.captchaId);

      setCaptchaInput("");
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to load captcha.",
      });
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    if (!email || !password || !captchaInput) {
      return setMessage({
        type: "error",
        text: "All fields are required.",
      });
    }

    if (!validateEmail(email)) {
      return setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
    }

    if (!validatePassword(password)) {
      return setMessage({
        type: "error",
        text:
          "Password must contain at least 8 characters, one number and one special character.",
      });
    }

    try {
      const response = await loginUser({
        email,
        password,
        role,
        captchaId,
        captchaAnswer : captchaInput,
      }).unwrap();

      console.log(response);

      setMessage({
        type: "success",
        text: response.message,
      });

      // Navigate based on role
      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error?.data?.message ||
          "Invalid credentials.",
      });

      // refresh captcha on failed login
      fetchCaptcha();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        {/* HEADER */}

        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 text-sm mt-1">
          Securely access your account
        </p>

        {/* MESSAGE */}

        {message.text && (
          <div className="mt-4">
            <MessageBox
              type={message.type}
              text={message.text}
            />
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="mt-6"
        >

          {/* ROLE SELECT */}

          <div>
            <label className="text-sm text-gray-600">
              Login As
            </label>

            <select
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          {/* EMAIL */}

          <div className="mt-4">
            <label className="text-sm text-gray-600">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@company.com"
              className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          {/* PASSWORD */}

          <div className="mt-4">

            <div className="flex justify-between items-center">

              <label className="text-sm text-gray-600">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            <div className="relative mt-1">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3 text-sm text-gray-500"
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>
          </div>

          {/* CAPTCHA */}

          <div className="mt-5 border rounded-lg p-4 bg-gray-50">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <span className="text-blue-600">
                  🛡️
                </span>

                <span className="font-medium text-gray-700">
                  {captchaQuestion}
                </span>

              </div>

              <button
                type="button"
                onClick={fetchCaptcha}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Refresh
              </button>

            </div>

            <input
              type="text"
              placeholder="Enter captcha answer"
              className="w-full mt-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={captchaInput}
              onChange={(e) =>
                setCaptchaInput(e.target.value)
              }
            />

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading
              ? "Logging in..."
              : "Login →"}
          </button>

        </form>

        {/* DIVIDER */}

        <div className="flex items-center my-5">

          <div className="flex-1 h-px bg-gray-200"></div>

          <span className="px-3 text-xs text-gray-400">
            OR CONTINUE WITH
          </span>

          <div className="flex-1 h-px bg-gray-200"></div>

        </div>

        {/* GOOGLE LOGIN */}

       <div className="flex justify-center">
                <GoogleLogin  
                                onSuccess={async (credentialResponse) => {
                                       try {
                                        const response =await googleLogin( credentialResponse.credential).unwrap();

                                       setMessage({type: "success", text:response.message  });

                                        navigate("/profile");
                                   } catch (err) {
                                          setMessage({ type: "error", text: err?.data?.message   });
                                    }
                              }}

                              onError={() => { setMessage({type: "error", text: err.message,});}}
                        />
                   </div>

        {/* SIGNUP */}

        <p className="text-center text-sm text-gray-600 mt-5">

          Don’t have an account?{" "}

          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>

        </p>

      </div>
    </div>
  );
};