import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreateCaptchaMutation, useRegisterUserMutation } from "../api/api";
import MessageBox from "../components/MessageBox";

export const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [captchaQuestion, setCaptchaQuestion] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaId, setCaptchaId] = useState("");

    const [message, setMessage] = useState({ type: "", text: "" });

    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const [createCaptcha] = useCreateCaptchaMutation();

    useEffect(() => {
        const fetchCaptcha = async () => {
            try {
                const data = await createCaptcha().unwrap();
                setCaptchaQuestion(data.question);
                setCaptchaId(data.captchaId);
            } catch (err) {
                setMessage({ type: "error", text: err.message });
            }
        };

        fetchCaptcha();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match" });
            return;
        }

        try {
            await registerUser({
                username,
                email,
                password,
                captchaId,
                captchaAnswer: captchaInput,
            }).unwrap();

            setMessage({
                type: "success",
                text: "Registration successful! Redirecting...",
            });

            setTimeout(() => {
                navigate("/verify-email", { state: { email } });
            }, 1200);

        } catch (err) {
            setMessage({
                type: "error",
                text: err?.data?.message || "Registration failed",
            });
        }
    };

    const handleGoogleSignup = () => {


    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#eef2ff]">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5">

                {/* HEADER */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Create your account
                    </h1>
                    <p className="text-sm text-gray-500">
                        Start your journey with professional precision.
                    </p>
                </div>

                {message.text && (
                    <MessageBox type={message.type} text={message.text} />
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* USERNAME */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. reliant_user"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* PASSWORD ROW */}
                    <div className="grid grid-cols-2 gap-3">

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* CAPTCHA */}
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                            Security Check
                        </label>

                        <div className="flex items-center justify-between mt-2 bg-blue-50 border rounded-md px-3 py-2">
                            <span className="text-blue-700 font-bold text-lg">
                                {captchaQuestion || "Loading..."}
                            </span>

                            <input
                                type="text"
                                placeholder="Result"
                                value={captchaInput}
                                onChange={(e) => setCaptchaInput(e.target.value)}
                                className="w-24 px-2 py-1 border rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-700 text-white py-2.5 rounded-md font-semibold hover:bg-blue-800 disabled:bg-gray-400"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                    {/* OR */}
                    <div className="flex items-center gap-2">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    {/* GOOGLE */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5"
                        />
                        Sign up with Google
                    </button>

                </form>

                {/* LOGIN */}
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-semibold">
                        Log in
                    </Link>
                </p>

            </div>
        </div>
    );
};