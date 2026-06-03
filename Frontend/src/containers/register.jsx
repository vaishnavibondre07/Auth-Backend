import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import  MessageBox from "../components/MessageBox";
import  RegisterForm from "../containers/register/RegisterForm";
import  SocialLogin  from "../containers/register/SocialLogin";

import { useCreateCaptchaMutation, useRegisterUserMutation, useGoogleLoginMutation } from "../api/authApi";

import { validateUsername, validateEmail,  validatePassword } from "../utils/validations";

const RegisterUser = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [captcha, setCaptcha] = useState({
        question: "",
        id: "",
        answer: "",
    });

    const [message, setMessage] = useState({ type: "", text: "" });

    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const [createCaptcha] = useCreateCaptchaMutation();
    const [googleLogin] = useGoogleLoginMutation();

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    });

    const fetchCaptcha = useCallback(async () => {
        try {
            const res = await createCaptcha().unwrap();
            setCaptcha({
                question: res.question,
                id: res.captchaId,
                answer: "",
            });
        } catch (err) {
            setMessage({
                type: "error",
                text: err?.data?.message || "Captcha error",
            });
        }
    }, [createCaptcha]);

    useEffect(() => {
        fetchCaptcha();
    }, [fetchCaptcha]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const { username, email, password, confirmPassword } = form;

        if (!username || !email || !password || !confirmPassword || !captcha.answer) {
            return setMessage({ type: "error", text: "All fields required" });
        }

        if (!validateUsername(username))
            return setMessage({ type: "error", text: "Invalid username" });

        if (!validateEmail(email))
            return setMessage({ type: "error", text: "Invalid email" });

        if (!validatePassword(password))
            return setMessage({ type: "error", text: "Weak password" });

        if (password !== confirmPassword)
            return setMessage({ type: "error", text: "Passwords mismatch" });

        try {
           const res = await registerUser({
                username,
                email,
                password,
                captchaId: captcha.id,
                captchaAnswer: captcha.answer,
            }).unwrap();

            console.log("REGISTER SUCCESS:", res);

            setMessage({ type: "success", text: "Registered successfully" });

            setTimeout(() => {
                navigate("/verify-email", { state: { email } });
            }, 1000);
            
        } catch (err) {
            setMessage({
                type: "error",
                text: err?.data?.message || "Registration failed",
            });

            fetchCaptcha();
        }
    });

    return (
        <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-100 via-blue-50 to-cyan-100 px-4 py-8">

            <section className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 sm:p-8 space-y-5">

                {/* HEADER */}
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-blue-700">
                        Create Account
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Join us and get started
                    </p>
                </div>

                {/* MESSAGE */}
                {message.text && (
                    <MessageBox
                        type={message.type}
                        text={message.text}
                        onClose={() => setMessage({ type: "", text: "" })}
                    />
                )}

                {/* FORM */}
                <RegisterForm
                    form={form}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    captcha={captcha}
                    setCaptcha={setCaptcha}
                    fetchCaptcha={fetchCaptcha}
                />

                {/* SOCIAL */}
                <SocialLogin
                    googleLogin={googleLogin}
                    setMessage={setMessage}
                    navigate={navigate}
                />

                {/* LOGIN */}
                <p className="text-center text-sm text-gray-600 pt-2">
                    Already have an account?{" "}
                    <Link className="text-blue-600 font-semibold" to="/login">
                        Login
                    </Link>
                </p>

            </section>
        </main>
    );
};

export default React.memo(RegisterUser);





// import { useState, useEffect, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import MessageBox from "../components/MessageBox";
// import RegisterForm from "../containers/register/RegisterForm";
// import SocialLogin from "../containers/register/SocialLogin";

// import {
//     useCreateCaptchaMutation,
//     useRegisterUserMutation,
//     useGoogleLoginMutation,
// } from "../api/authApi";

// import {
//     validateUsername,
//     validateEmail,
//     validatePassword,
// } from "../utils/validations";

// const Register = () => {
//     const navigate = useNavigate();

//     // FORM STATE (ONLY ONE SOURCE OF TRUTH)
//     const [form, setForm] = useState({
//         username: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//     });

//     // CAPTCHA STATE
//     const [captcha, setCaptcha] = useState({
//         question: "",
//         id: "",
//         answer: "",
//     });

//     // MESSAGE
//     const [message, setMessage] = useState({
//         type: "",
//         text: "",
//     });

//     // APIs
//     const [registerUser, { isLoading }] = useRegisterUserMutation();
//     const [createCaptcha] = useCreateCaptchaMutation();
//     const [googleLogin] = useGoogleLoginMutation();

//     // HANDLE INPUT CHANGE
//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // FETCH CAPTCHA
//     const fetchCaptcha = useCallback(async () => {
//         try {
//             const res = await createCaptcha().unwrap();

//             setCaptcha({
//                 question: res.question,
//                 id: res.captchaId,
//                 answer: "",
//             });
//         } catch (err) {
//             setMessage({
//                 type: "error",
//                 text: err?.data?.message || "Captcha error",
//             });
//         }
//     }, [createCaptcha]);

//     useEffect(() => {
//         fetchCaptcha();
//     }, [fetchCaptcha]);

//     // SUBMIT
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const { username, email, password, confirmPassword } = form;

//         if (!username || !email || !password || !confirmPassword || !captcha.answer) {
//             return setMessage({
//                 type: "error",
//                 text: "All fields required",
//             });
//         }

//         if (!validateUsername(username))
//             return setMessage({ type: "error", text: "Invalid username" });

//         if (!validateEmail(email))
//             return setMessage({ type: "error", text: "Invalid email" });

//         if (!validatePassword(password))
//             return setMessage({ type: "error", text: "Weak password" });

//         if (password !== confirmPassword)
//             return setMessage({ type: "error", text: "Passwords mismatch" });

//         try {
//             await registerUser({
//                 username,
//                 email,
//                 password,
//                 captchaId: captcha.id,
//                 captchaAnswer: captcha.answer,
//             }).unwrap();

//             setMessage({
//                 type: "success",
//                 text: "Registered successfully",
//             });

//             setTimeout(() => {
//                 navigate("/verify-email", { state: { email } });
//             }, 1000);

//         } catch (err) {
//             setMessage({
//                 type: "error",
//                 text: err?.data?.message || "Registration failed",
//             });

//             fetchCaptcha();
//         }
//     };

//     return (
//         <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 px-4">

//             <section className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

//                 {/* HEADER */}
//                 <div className="text-center mb-5">
//                     <h1 className="text-3xl font-bold text-blue-700">
//                         Create Account
//                     </h1>
//                     <p className="text-sm text-gray-500 mt-2">
//                         Join us and get started
//                     </p>
//                 </div>

//                 {/* MESSAGE */}
//                 {message.text && (
//                     <MessageBox
//                         type={message.type}
//                         text={message.text}
//                         onClose={() =>
//                             setMessage({ type: "", text: "" })
//                         }
//                     />
//                 )}

//                 {/* FORM */}
//                 <RegisterForm
//                     form={form}
//                     handleChange={handleChange}
//                     handleSubmit={handleSubmit}
//                     isLoading={isLoading}
//                     captcha={captcha}
//                     setCaptcha={setCaptcha}
//                     fetchCaptcha={fetchCaptcha}
//                 />

//                 {/* SOCIAL */}
//                 <SocialLogin
//                     googleLogin={googleLogin}
//                     setMessage={setMessage}
//                     navigate={navigate}
//                 />

//                 {/* LOGIN LINK */}
//                 <p className="text-center text-sm text-gray-600 mt-5">
//                     Already have an account?{" "}
//                     <Link to="/login" className="text-blue-600 font-semibold">
//                         Login
//                     </Link>
//                 </p>

//             </section>
//         </main>
//     );
// };

// export default Register;





// import { useState, useEffect, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { GoogleLogin } from "@react-oauth/google";

// import {
//     useCreateCaptchaMutation,
//     useRegisterUserMutation,
//     useGoogleLoginMutation,
// } from "../api/authApi";

// import MessageBox from "../components/MessageBox";
// import AuthInput from "../components/auth/AuthInput";
// import PasswordInput from "../components/auth/PasswordInput";
// import CaptchaBox from "../components/auth/CaptchaBox";

// import {
//     validateUsername,
//     validateEmail,
//     validatePassword,
// } from "../utils/validations";

// const RegisterUser = () => {

//     const navigate = useNavigate();

//     // FORM STATES
//     const [username, setUsername] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     // CAPTCHA STATES
//     const [captchaQuestion, setCaptchaQuestion] = useState("");
//     const [captchaInput, setCaptchaInput] = useState("");
//     const [captchaId, setCaptchaId] = useState("");

//     // MESSAGE STATE
//     const [message, setMessage] = useState({
//         type: "",
//         text: "",
//     });

//     // API HOOKS
//     const [registerUser, { isLoading }] =
//         useRegisterUserMutation();

//     const [createCaptcha] =
//         useCreateCaptchaMutation();

//     const [googleLogin] =
//         useGoogleLoginMutation();

//     // FETCH CAPTCHA
//     const fetchCaptcha = useCallback(async () => {

//         try {

//             const data =
//                 await createCaptcha().unwrap();

//             setCaptchaQuestion(data.question);
//             setCaptchaId(data.captchaId);
//             setCaptchaInput("");

//         } catch (err) {

//             setMessage({
//                 type: "error",
//                 text:
//                     err?.data?.message ||
//                     "Failed to load captcha",
//             });
//         }

//     }, [createCaptcha]);

//     useEffect(() => {
//         fetchCaptcha();
//     }, [fetchCaptcha]);

//     // REGISTER
//     const handleSubmit = async (e) => {

//         e.preventDefault();

//         // VALIDATIONS

//         if (
//             !username ||
//             !email ||
//             !password ||
//             !confirmPassword ||
//             !captchaInput
//         ) {
//             setMessage({
//                 type: "error",
//                 text: "All fields are required",
//             });

//             return;
//         }

//         if (!validateUsername(username)) {

//             setMessage({
//                 type: "error",
//                 text:
//                     "Username must be at least 3 characters",
//             });

//             return;
//         }

//         if (!validateEmail(email)) {

//             setMessage({
//                 type: "error",
//                 text: "Enter a valid email address",
//             });

//             return;
//         }

//         if (!validatePassword(password)) {

//             setMessage({
//                 type: "error",
//                 text:
//                     "Password must contain 8 characters, one number and one special character",
//             });

//             return;
//         }

//         if (password !== confirmPassword) {

//             setMessage({
//                 type: "error",
//                 text: "Passwords do not match",
//             });

//             return;
//         }

//         // API CALL

//         try {

//             await registerUser({
//                 username,
//                 email,
//                 password,
//                 captchaId,
//                 captchaAnswer: captchaInput,
//             }).unwrap();

//             setMessage({
//                 type: "success",
//                 text:
//                     "Registration successful! Redirecting...",
//             });

//             setTimeout(() => {

//                 navigate("/verify-email", {
//                     state: { email },
//                 });

//             }, 1200);

//         } catch (err) {

//             setMessage({
//                 type: "error",
//                 text:
//                     err?.data?.message ||
//                     "Registration failed",
//             });

//             fetchCaptcha();
//         }
//     };

//     return (

//         <main
//             className="
//                 min-h-screen
//                 flex
//                 items-center
//                 justify-center
//                 bg-gradient-to-br
//                 from-sky-100
//                 via-blue-50
//                 to-cyan-100
//                 px-4
//                 py-8
//             "
//         >

//             <section
//                 className="
//                     w-full
//                     max-w-md
//                     bg-white
//                     rounded-2xl
//                     shadow-xl
//                     p-5
//                     sm:p-8
//                 "
//             >

//                 {/* HEADER */}

//                 <div className="text-center mb-6">

//                     <h1
//                         className="
//                             text-2xl
//                             sm:text-3xl
//                             font-bold
//                             text-blue-700
//                         "
//                     >
//                         Create Account
//                     </h1>

//                     <p
//                         className="
//                             text-sm
//                             text-gray-600
//                             mt-2
//                         "
//                     >
//                         Join securely and start your journey.
//                     </p>

//                 </div>

//                 {/* MESSAGE */}

//                 {message.text && (

//                     <div className="mb-4">

//                         <MessageBox
//                             type={message.type}
//                             text={message.text}
//                             onClose={() =>
//                                 setMessage({
//                                     type: "",
//                                     text: "",
//                                 })
//                             }
//                         />

//                     </div>
//                 )}

//                 {/* FORM */}

//                 <form
//                     onSubmit={handleSubmit}
//                     className="space-y-4"
//                 >

//                     {/* USERNAME */}

//                     <AuthInput
//                         label="Username"
//                         placeholder="Enter username"
//                         value={username}
//                         onChange={(e) =>
//                             setUsername(e.target.value)
//                         }
//                     />

//                     {/* EMAIL */}

//                     <AuthInput
//                         label="Email Address"
//                         type="email"
//                         placeholder="name@example.com"
//                         value={email}
//                         onChange={(e) =>
//                             setEmail(e.target.value)
//                         }
//                     />

//                     {/* PASSWORD */}

//                     <PasswordInput
//                         label="Password"
//                         placeholder="Enter password"
//                         value={password}
//                         onChange={(e) =>
//                             setPassword(e.target.value)
//                         }
//                     />

//                     {/* CONFIRM PASSWORD */}

//                     <PasswordInput
//                         label="Confirm Password"
//                         placeholder="Confirm password"
//                         value={confirmPassword}
//                         onChange={(e) =>
//                             setConfirmPassword(
//                                 e.target.value
//                             )
//                         }
//                     />

//                     {/* CAPTCHA */}

//                     <CaptchaBox
//                         captchaQuestion={captchaQuestion}
//                         captchaInput={captchaInput}
//                         setCaptchaInput={setCaptchaInput}
//                         fetchCaptcha={fetchCaptcha}
//                     />

//                     {/* SUBMIT BUTTON */}

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="
//                             w-full
//                             bg-blue-500
//                             hover:bg-blue-600
//                             text-white
//                             py-2.5
//                             min-h-[44px]
//                             rounded-lg
//                             font-semibold
//                             transition
//                             disabled:bg-gray-400
//                         "
//                     >
//                         {isLoading
//                             ? "Creating Account..."
//                             : "Create Account"}
//                     </button>

//                     {/* DIVIDER */}

//                     <div className="flex items-center gap-3">

//                         <div className="flex-1 h-px bg-gray-300"></div>

//                         <span className="text-sm text-gray-500">
//                             OR
//                         </span>

//                         <div className="flex-1 h-px bg-gray-300"></div>

//                     </div>

//                     {/* GOOGLE LOGIN */}

//                     <div className="flex justify-center">

//                         <GoogleLogin

//                             onSuccess={async (
//                                 credentialResponse
//                             ) => {

//                                 try {

//                                     const response =
//                                         await googleLogin(
//                                             credentialResponse.credential
//                                         ).unwrap();

//                                     setMessage({
//                                         type: "success",
//                                         text: response.message,
//                                     });

//                                     navigate("/profile");

//                                 } catch (err) {

//                                     setMessage({
//                                         type: "error",
//                                         text:
//                                             err?.data?.message ||
//                                             "Google login failed",
//                                     });
//                                 }
//                             }}

//                             onError={() => {

//                                 setMessage({
//                                     type: "error",
//                                     text:
//                                         "Google login failed",
//                                 });
//                             }}
//                         />

//                     </div>

//                 </form>

//                 {/* LOGIN LINK */}

//                 <p
//                     className="
//                         text-center
//                         text-sm
//                         text-gray-600
//                         mt-6
//                     "
//                 >

//                     Already have an account?{" "}

//                     <Link
//                         to="/login"
//                         className="
//                             text-blue-600
//                             font-semibold
//                             hover:underline
//                         "
//                     >
//                         Log in
//                     </Link>

//                 </p>

//             </section>

//         </main>
//     );
// };

// export default RegisterUser;



// // import { useState, useEffect } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { GoogleLogin } from "@react-oauth/google";
// // import { useGoogleLoginMutation }from "../api/authApi";
// // import { useCreateCaptchaMutation, useRegisterUserMutation } from "../api/authApi";
// // import MessageBox from "../components/MessageBox";
// // import { validateUsername,  validateEmail,  validatePassword} from "../utils/validations";
// // import { useDispatch } from "react-redux";

// // export const RegisterUser = () => { 

// //     const navigate = useNavigate();
// //     const dispatch = useDispatch();

// //     const [username, setUsername] = useState("");
// //     const [email, setEmail] = useState("");
// //     const [password, setPassword] = useState("");
// //     const [confirmPassword, setConfirmPassword] = useState("");

// //     const [captchaQuestion, setCaptchaQuestion] = useState("");
// //     const [captchaInput, setCaptchaInput] = useState("");
// //     const [captchaId, setCaptchaId] = useState("");

// //     const [showPassword, setShowPassword] = useState(false);
// //     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// //     const [message, setMessage] = useState({
// //         type: "",
// //         text: "",
// //     });

// //     const [registerUser, {  isLoading }] = useRegisterUserMutation();

// //     const [createCaptcha] = useCreateCaptchaMutation();

// //     const [googleLogin] = useGoogleLoginMutation();

// //     // FETCH CAPTCHA

// //     const fetchCaptcha = async () => {
// //         try {
// //             const data =  await createCaptcha().unwrap();
// //             setCaptchaQuestion(data.question);
// //             setCaptchaId(data.captchaId);
// //             // clear old input
// //             setCaptchaInput("");
// //         } catch (err) {
// //             setMessage({  type: "error", text: err.message
// //             });
// //         }
// //     };

// //     useEffect(() => {
// //         fetchCaptcha();
// //     }, []);

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
    
// //         if ( !username || !email || !password ||  !confirmPassword || !captchaInput ) {
// //             setMessage({  type: "error", text: "All fields are required" });
// //             return;
// //         }
// //         if ( !validateUsername(username) ) {
// //               setMessage({ type: "error", text: "Username must be at least 3 characters", });
// //              return;
// //         }
// //         if ( !validateEmail(email)) {
// //             setMessage({ type: "error",  text:  "Enter a valid email address" });
// //             return;
// //         }
// //         if ( !validatePassword(password) ) {
// //              setMessage({ type: "error", text: "Password must contain 8 characters, one number and one special character",  });
// //             return;
// //         }
// //         if ( password !== confirmPassword ) {
// //             setMessage({ type: "error",  text: "Passwords do not match", });
// //             return;
// //         }
// //         try {
// //             await registerUser({  username, email, password, captchaId, captchaAnswer: captchaInput }).unwrap();
// //             console.log("user added");
            
// //             setMessage({ type: "success", text: "Registration successful! Redirecting...", });

// //             setTimeout(() => {
// //                 navigate( "/verify-email", { state: { email }, });
// //             }, 1200);

// //         } catch (err) {
// //             setMessage({  type: "error", text: err?.data?.message});
// //             fetchCaptcha();
// //         }
// //     };

// //     const handleGoogleSignup = () => {

// //     };

// //     return (

// //         <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">

// //             <section className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10">

// //                 <div className="text-center mb-8">
// //                     <h1 className="text-4xl font-bold text-gray-800">
// //                         Create Account
// //                     </h1>
// //                     <p className="text-gray-500 mt-3 text-base">
// //                         Join securely and start your journey today.
// //                     </p>
// //                 </div>

// //                 {message.text && (
// //                     <div className="mb-5">
// //                         <MessageBox
// //                             type={message.type}
// //                             text={message.text}
// //                             onClose={() => setMessage({ type: "", text: "" })}
// //                         />
// //                     </div>
// //                 )}
// //                 <form onSubmit={handleSubmit} className="space-y-5">
// //                     <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                             Username
// //                         </label>

// //                         <input
// //                             type="text"
// //                             placeholder="Enter username"
// //                             value={username}
// //                             onChange={(e) => setUsername(  e.target.value )}
// //                             className="w-full px-4 py-3 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>

// //                     <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                             Email Address
// //                         </label>
// //                         <input
// //                             type="email"
// //                             placeholder="name@example.com"
// //                             value={email}
// //                             onChange={(e) => setEmail( e.target.value )}
// //                             className="w-full px-4 py-3 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>

// //                     <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                             Password
// //                         </label>
// //                         <div className="relative">
// //                             <input   
// //                                 type={ showPassword  ? "text" : "password"  }
// //                                 placeholder="Enter password"
// //                                 value={password}
// //                                 onChange={(e) =>  setPassword(  e.target.value ) }
// //                                 className="w-full px-4 py-3 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                             />
// //                             <button
// //                                 type="button"
// //                                 onClick={() => setShowPassword(!showPassword) }
// //                                 className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600 font-semibold"
// //                             >
// //                                 {showPassword ? "Hide"  : "Show"}
// //                             </button>
// //                         </div>
// //                     </div>

// //                     <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                             Confirm Password
// //                         </label>
// //                         <div className="relative">
// //                             <input
// //                                 type={ showConfirmPassword ? "text"  : "password"  }
// //                                 placeholder="Confirm password"
// //                                 value={confirmPassword}
// //                                 onChange={(e) =>  setConfirmPassword( e.target.value  )
// //                                 }
// //                                 className="w-full px-4 py-3 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                             />
// //                             <button
// //                                 type="button"
// //                                 onClick={() =>  setShowConfirmPassword( !showConfirmPassword)
// //                                 }
// //                                 className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-blue-600 font-semibold"
// //                             >
// //                                 {showConfirmPassword ? "Hide": "Show"}
// //                             </button>
// //                         </div>
// //                     </div>

// //                     <div>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-3">
// //                                 Security Verification
// //                         </label>

// //                         <div className="border border-blue-100 bg-blue-50 rounded-2xl p-4">

// //                             <div className="flex flex-col sm:flex-row sm:items-center gap-4">

// //                                 <div className="flex items-center justify-between sm:min-w-[180px] bg-white border rounded-xl px-4 py-3">

// //                                     <span className="text-xl font-bold text-blue-700 tracking-wide">
// //                                          {captchaQuestion }
// //                                     </span>

// //                                     <button
// //                                         type="button"
// //                                         onClick={fetchCaptcha}
// //                                         className="ml-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
// //                                     >
// //                                          Refresh
// //                                     </button>

// //                                 </div>

// //                                 <input
// //                                     type="text"
// //                                     placeholder="Enter answer"
// //                                     value={captchaInput}
// //                                     onChange={(e) =>  setCaptchaInput( e.target.value ) }
// //                                     className="flex-1 w-full px-4 py-3 text-lg bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                 />
// //                              </div>
// //                        </div>
// //                    </div>

// //                     <button
// //                         type="submit"
// //                         disabled={isLoading}
// //                         className="w-full bg-blue-700 text-white py-3.5 rounded-xl text-lg font-semibold hover:bg-blue-800 transition disabled:bg-gray-400"
// //                     >
// //                         {isLoading
// //                             ? "Creating Account..."
// //                             : "Create Account"}
// //                     </button>

// //                     {/* DIVIDER */}

// //                     <div className="flex items-center gap-3">

// //                         <div className="flex-1 h-px bg-gray-300"></div>

// //                         <span className="text-sm text-gray-400">
// //                             OR
// //                         </span>

// //                         <div className="flex-1 h-px bg-gray-300"></div>

// //                     </div>

// //                     {/* GOOGLE */}

// //                    <div className="flex justify-center">
// //                            <GoogleLogin  
// //                                 onSuccess={async (credentialResponse) => {
// //                                        try {
// //                                         const response =await googleLogin( credentialResponse.credential).unwrap();

// //                                        setMessage({type: "success", text:response.message  });

// //                                         navigate("/profile");
// //                                    } catch (err) {
// //                                           setMessage({ type: "error", text: err?.data?.message   });
// //                                     }
// //                               }}

// //                               onError={() => { setMessage({type: "error", text: "Google login failed" });}}
// //                         />
// //                    </div>

// //                 </form>

// //                 <p className="text-center text-base text-gray-600 mt-8">
// //                     Already have an account?{" "}
// //                     <Link
// //                         to="/login"
// //                         className="text-blue-600 font-semibold hover:underline"
// //                     >
// //                         Log in
// //                     </Link>
// //                 </p>
// //             </section>

// //         </main>
// //     );
// //  };


// // import { useState, useEffect } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { useCreateCaptchaMutation, useRegisterUserMutation } from "../api/authApi";
// // import MessageBox from "../components/MessageBox";
// // import { validateUsername,validateEmail, validatePassword } from "../utils/validations";

// // export const Register = () => {
// //     const navigate = useNavigate();

// //     const [username, setUsername] = useState("");
// //     const [email, setEmail] = useState("");
// //     const [password, setPassword] = useState("");
// //     const [confirmPassword, setConfirmPassword] = useState("");
// //     const [captchaQuestion, setCaptchaQuestion] = useState("");
// //     const [captchaInput, setCaptchaInput] = useState("");
// //     const [captchaId, setCaptchaId] = useState("");

// //     const [message, setMessage] = useState({ type: "", text: "" });

// //     const [registerUser, { isLoading }] = useRegisterUserMutation();
// //     const [createCaptcha] = useCreateCaptchaMutation();

// //     useEffect(() => {
// //         const fetchCaptcha = async () => {
// //             try {
// //                 const data = await createCaptcha().unwrap();
// //                 setCaptchaQuestion(data.question);
// //                 setCaptchaId(data.captchaId);
// //             } catch (err) {
// //                 setMessage({ type: "error", text: err.message });
// //             }
// //         };

// //         fetchCaptcha();
// //     }, []);

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();

// //         if (password !== confirmPassword) {
// //             setMessage({ type: "error", text: "Passwords do not match" });
// //             return;
// //         }

// //         try {
// //             await registerUser({
// //                 username,
// //                 email,
// //                 password,
// //                 captchaId,
// //                 captchaAnswer: captchaInput,
// //             }).unwrap();

// //             setMessage({
// //                 type: "success",
// //                 text: "Registration successful! Redirecting...",
// //             });

// //             setTimeout(() => {
// //                 navigate("/verify-email", { state: { email } });
// //             }, 1200);

// //         } catch (err) {
// //             setMessage({
// //                 type: "error",
// //                 text: err?.data?.message || "Registration failed",
// //             });
// //         }
// //     };

// //     const handleGoogleSignup = () => {


// //     };

// //     return (
// //         <div className="min-h-screen flex items-center justify-center bg-[#eef2ff]">

// //             <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5">

// //                 {/* HEADER */}
// //                 <div className="text-center space-y-1">
// //                     <h1 className="text-2xl font-bold text-gray-800">
// //                         Create your account
// //                     </h1>
// //                     <p className="text-sm text-gray-500">
// //                         Start your journey with professional precision.
// //                     </p>
// //                 </div>

// //                 {message.text && (
// //                     <MessageBox type={message.type} text={message.text} />
// //                 )}

// //                 <form onSubmit={handleSubmit} className="space-y-4">

// //                     {/* USERNAME */}
// //                     <div>
// //                         <label className="text-xs font-semibold text-gray-500 uppercase">
// //                             Username
// //                         </label>
// //                         <input
// //                             type="text"
// //                             placeholder="e.g. reliant_user"
// //                             value={username}
// //                             onChange={(e) => setUsername(e.target.value)}
// //                             className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>

// //                     {/* EMAIL */}
// //                     <div>
// //                         <label className="text-xs font-semibold text-gray-500 uppercase">
// //                             Email Address
// //                         </label>
// //                         <input
// //                             type="email"
// //                             placeholder="name@company.com"
// //                             value={email}
// //                             onChange={(e) => setEmail(e.target.value)}
// //                             className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>

// //                     {/* PASSWORD ROW */}
// //                     <div className="grid grid-cols-2 gap-3">

// //                         <div>
// //                             <label className="text-xs font-semibold text-gray-500 uppercase">
// //                                 Password
// //                             </label>
// //                             <input
// //                                 type="password"
// //                                 value={password}
// //                                 onChange={(e) => setPassword(e.target.value)}
// //                                 className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                             />
// //                         </div>

// //                         <div>
// //                             <label className="text-xs font-semibold text-gray-500 uppercase">
// //                                 Confirm Password
// //                             </label>
// //                             <input
// //                                 type="password"
// //                                 value={confirmPassword}
// //                                 onChange={(e) => setConfirmPassword(e.target.value)}
// //                                 className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                             />
// //                         </div>
// //                     </div>

// //                     {/* CAPTCHA */}
// //                     <div>
// //                         <label className="text-xs font-semibold text-gray-500 uppercase">
// //                             Security Check
// //                         </label>

// //                         <div className="flex items-center justify-between mt-2 bg-blue-50 border rounded-md px-3 py-2">
// //                             <span className="text-blue-700 font-bold text-lg">
// //                                 {captchaQuestion || "Loading..."}
// //                             </span>

// //                             <input
// //                                 type="text"
// //                                 placeholder="Result"
// //                                 value={captchaInput}
// //                                 onChange={(e) => setCaptchaInput(e.target.value)}
// //                                 className="w-24 px-2 py-1 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                             />
// //                         </div>
// //                     </div>

// //                     {/* BUTTON */}
// //                     <button
// //                         type="submit"
// //                         disabled={isLoading}
// //                         className="w-full bg-blue-700 text-white py-2.5 rounded-md font-semibold hover:bg-blue-800 disabled:bg-gray-400"
// //                     >
// //                         {isLoading ? "Creating Account..." : "Create Account"}
// //                     </button>

// //                     {/* OR */}
// //                     <div className="flex items-center gap-2">
// //                         <div className="h-px bg-gray-300 flex-1"></div>
// //                         <span className="text-xs text-gray-400">OR</span>
// //                         <div className="h-px bg-gray-300 flex-1"></div>
// //                     </div>

// //                     {/* GOOGLE */}
// //                     <button
// //                         type="button"
// //                         onClick={handleGoogleSignup}
// //                         className="w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
// //                     >
// //                         <img
// //                             src="https://www.svgrepo.com/show/475656/google-color.svg"
// //                             className="w-5 h-5"
// //                         />
// //                         Sign up with Google
// //                     </button>

// //                 </form>

// //                 {/* LOGIN */}
// //                 <p className="text-center text-sm text-gray-600">
// //                     Already have an account?{" "}
// //                     <Link to="/login" className="text-blue-600 font-semibold">
// //                         Log in
// //                     </Link>
// //                 </p>

// //             </div>
// //         </div>
// //     );
// // };