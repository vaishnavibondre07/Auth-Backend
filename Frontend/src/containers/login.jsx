import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoginUserMutation, useCreateCaptchaMutation, useGoogleLoginMutation} from "../api/authApi";

import MessageBox from "../components/MessageBox";
import { validateEmail, validatePassword } from "../utils/validations";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice";

// reusable components
import AuthInput   from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import  CaptchaBox from "../components/auth/CaptchaBox";
import AuthButton  from "../components/auth/AuthButton";

export const LoginUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [createCaptcha] = useCreateCaptchaMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

 const [captcha, setCaptcha] = useState({
  question: "",
  answer: "",
  id: "",
});

  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchCaptcha = async () => {
    try {
      const res = await createCaptcha().unwrap();
      setCaptcha({
        question: res.question,
        id: res.captchaId,
        answer: "",
      });
    } catch {
      setMessage({ type: "error", text: "Failed to load captcha" });
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleVerifyEmail = () => {
            setTimeout(() => {
                navigate("/verify-email", { state: { email } });
            }, 1000);
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage({ type: "", text: "" });

    console.log(email, password, captcha.answer);
    

    if (!email || !password || !captcha.answer) {
      return setMessage({ type: "error", text: "All fields are required" });
    }

    if (!validateEmail(email)) {
      return setMessage({ type: "error", text: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return setMessage({
        type: "error",
        text: "Password must be 8+ chars with number & special char",
      });
    }

    try {
      const res = await loginUser({
        email,
        password,
        role,
        captchaId : captcha.id,
        captchaAnswer : captcha.answer,
      }).unwrap();

      dispatch(setUser(res.data));

      setMessage({ type: "success", text: res.message });

      navigate(res.data.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      const data = err?.data;

      if (data?.code === "EMAIL_NOT_VERIFIED") {
          navigate("/verify-email", {
          state: { email: data.email }
       });
       return;
      }

  setMessage({
    type: "error",
    text: data?.message || "Login failed",
  });
      fetchCaptcha();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">

        {message.text && (
           <MessageBox
            type={message.type}
            text={message.text}
            onClose={() => setMessage({ type: "", text: "" })}
         />
       )}

      <section className="w-full max-w-md bg-white shadow-xl rounded-2xl p-5 sm:p-8 text-gray-800">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Login to your account
          </p>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div className="mt-4">
            <MessageBox
              type={message.type}
              text={message.text}
              onClose={() => setMessage({ type: "", text: "" })}
            />
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">


          {/* EMAIL */}
          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
          />

          {/* PASSWORD + FORGOT PASSWORD */}
          <div className="flex flex-wrap justify-between items-center gap-1 mb-1">
            <label htmlFor="forgetPassword" className="text-sm text-gray-600">Password</label>
            <Link
              to="/forgot-password"
              id="forgetPassword"
              className="text-xs text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <PasswordInput
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* CAPTCHA */}
           <CaptchaBox
                           captchaQuestion={captcha.question}
                           captchaAnswer={captcha.answer}
                           setCaptcha={setCaptcha}
                           fetchCaptcha={fetchCaptcha}
                       />

          {/* BUTTON */}
          <AuthButton loading={isLoading}>
            Login
          </AuthButton>
        </form>

        <button onClick={handleVerifyEmail}>
             Verify Your email
        </button>

        {/* DIVIDER */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-xs text-gray-700 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* GOOGLE LOGIN */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (cred) => {
              try {
                const res = await googleLogin(
                  cred.credential
                ).unwrap();

                dispatch(setUser(res.data));
                setMessage({
                  type: "success",
                  text: res.message,
                });

                navigate("/profile");
              } catch (err) {
                setMessage({
                  type: "error",
                  text:
                    err?.data?.message ||
                    "Google login failed",
                });
              }
            }}
            onError={() =>
              setMessage({
                type: "error",
                text: "Google login failed",
              })
            }
          />
        </div>

        {/* SIGNUP */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>

      </section>
    </main>
  );
};



// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useLoginUserMutation, useCreateCaptchaMutation, useGoogleLoginMutation} from "../api/authApi";
// import MessageBox from "../components/MessageBox";
// import { validateEmail, validatePassword} from "../utils/validations";
// import { GoogleLogin } from "@react-oauth/google";
// import { useDispatch } from "react-redux";
// import { setUser } from "../features/authSlice";

// export const LoginUser = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [loginUser, { isLoading }] = useLoginUserMutation();
//   const [createCaptcha] = useCreateCaptchaMutation();
//   const [googleLogin] = useGoogleLoginMutation();


//   const [captchaQuestion, setCaptchaQuestion] = useState("");
//   const [captchaInput, setCaptchaInput] = useState("");
//   const [captchaId, setCaptchaId] = useState("");

//   const [showPassword, setShowPassword] = useState(false);

//   const [message, setMessage] = useState({
//     type: "",
//     text: "",
//   });

//   const [role, setRole] = useState("user");

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const fetchCaptcha = async () => {
//     try {
//       const response = await createCaptcha().unwrap();

//       setCaptchaQuestion(response.question);
//       setCaptchaId(response.captchaId);

//       setCaptchaInput("");
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: "Failed to load captcha.",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchCaptcha();
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     setMessage({
//       type: "",
//       text: "",
//     });

//     if (!email || !password || !captchaInput) {
//       return setMessage({
//         type: "error",
//         text: "All fields are required.",
//       });
//     }

//     if (!validateEmail(email)) {
//       return setMessage({
//         type: "error",
//         text: "Please enter a valid email address.",
//       });
//     }

//     if (!validatePassword(password)) {
//       return setMessage({
//         type: "error",
//         text:
//           "Password must contain at least 8 characters, one number and one special character.",
//       });
//     }

//     try {
//       const response = await loginUser({
//         email,
//         password,
//         captchaId,
//         captchaAnswer : captchaInput,
//       }).unwrap();

//       dispatch(setUser(response.data));

//       console.log(response);

//       setMessage({
//         type: "success",
//         text: response.message,
//       });

//       // Navigate based on role
//       if (response.data.role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/profile");
//       }
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text:
//           error?.data?.message ||
//           "Invalid credentials.",
//       });

//       // refresh captcha on failed login
//       fetchCaptcha();
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

//       <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

//         {/* HEADER */}

//         <h1 className="text-2xl font-bold text-center text-gray-800">
//           Welcome Back
//         </h1>

//         <p className="text-center text-gray-500 text-sm mt-1">
//           Securely access your account
//         </p>

//         {/* MESSAGE */}

//         {message.text && (
//           <div className="mt-4">
//             <MessageBox
//               type={message.type}
//               text={message.text}
//               onClose={() => setMessage({ type: "", text: "" })}
//             />
//           </div>
//         )}

//         {/* FORM */}

//         <form
//           onSubmit={handleLogin}
//           className="mt-6"
//         >

//           {/* ROLE SELECT */}

//           <div>
//             <label className="text-sm text-gray-600">
//               Login As
//             </label>

//             <select
//               className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//             >
//               <option value="user">
//                 User
//               </option>

//               <option value="admin">
//                 Admin
//               </option>
//             </select>
//           </div>

//           {/* EMAIL */}

//           <div className="mt-4">
//             <label className="text-sm text-gray-600">
//               Email Address
//             </label>

//             <input
//               type="email"
//               placeholder="name@company.com"
//               className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={email}
//               onChange={(e) =>
//                 setEmail(e.target.value)
//               }
//             />
//           </div>

//           {/* PASSWORD */}

//           <div className="mt-4">

//             <div className="flex justify-between items-center">

//               <label className="text-sm text-gray-600">
//                 Password
//               </label>

//               <Link
//                 to="/forgot-password"
//                 className="text-blue-600 text-sm font-medium hover:underline"
//               >
//                 Forgot Password?
//               </Link>

//             </div>

//             <div className="relative mt-1">

//               <input
//                 type={
//                   showPassword
//                     ? "text"
//                     : "password"
//                 }
//                 placeholder="••••••••"
//                 className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={password}
//                 onChange={(e) =>
//                   setPassword(e.target.value)
//                 }
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowPassword(!showPassword)
//                 }
//                 className="absolute right-3 top-3 text-sm text-gray-500"
//               >
//                 {showPassword
//                   ? "Hide"
//                   : "Show"}
//               </button>

//             </div>
//           </div>

//           {/* CAPTCHA */}

//           <div className="mt-5 border rounded-lg p-4 bg-gray-50">

//             <div className="flex items-center justify-between">

//               <div className="flex items-center gap-2">

//                 <span className="text-blue-600">
//                   🛡️
//                 </span>

//                 <span className="font-medium text-gray-700">
//                   {captchaQuestion}
//                 </span>

//               </div>

//               <button
//                 type="button"
//                 onClick={fetchCaptcha}
//                 className="text-blue-600 text-sm font-medium hover:underline"
//               >
//                 Refresh
//               </button>

//             </div>

//             <input
//               type="text"
//               placeholder="Enter captcha answer"
//               className="w-full mt-3 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={captchaInput}
//               onChange={(e) =>
//                 setCaptchaInput(e.target.value)
//               }
//             />

//           </div>

//           {/* LOGIN BUTTON */}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
//           >
//             {isLoading
//               ? "Logging in..."
//               : "Login →"}
//           </button>

//         </form>

//         {/* DIVIDER */}

//         <div className="flex items-center my-5">

//           <div className="flex-1 h-px bg-gray-200"></div>

//           <span className="px-3 text-xs text-gray-400">
//             OR CONTINUE WITH
//           </span>

//           <div className="flex-1 h-px bg-gray-200"></div>

//         </div>

//         {/* GOOGLE LOGIN */}

//        <div className="flex justify-center">
//                 <GoogleLogin  
//                                 onSuccess={async (credentialResponse) => {
//                                        try {
//                                         const response =await googleLogin( credentialResponse.credential).unwrap();

//                                        setMessage({type: "success", text:response.message  });

//                                         navigate("/profile");
//                                    } catch (err) {
//                                           setMessage({ type: "error", text: err?.data?.message   });
//                                     }
//                               }}

//                               onError={() => { setMessage({type: "error", text: "Google login failed" });}}
//                         />
//                    </div>

//         {/* SIGNUP */}

//         <p className="text-center text-sm text-gray-600 mt-5">

//           Don’t have an account?{" "}

//           <Link
//             to="/"
//             className="text-blue-600 font-medium hover:underline"
//           >
//             Sign Up
//           </Link>

//         </p>

//       </div>
//     </div>
//   );
// };