import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import MessageBox from "../components/MessageBox";
import RegisterForm from "../containers/register/RegisterForm";
import SocialLogin from "../containers/register/SocialLogin";

import { useCreateCaptchaMutation, useRegisterUserMutation, useGoogleLoginMutation } from "../api/authApi";

import { validateUsername, validateEmail,  validatePassword } from "../utils/validations";

const Register = () => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

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

    const handleSubmit = async (e) => {
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
            await registerUser({
                username,
                email,
                password,
                captchaId: captcha.id,
                captchaAnswer: captcha.answer,
            }).unwrap();

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
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 px-4 py-8">

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

export default Register;





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