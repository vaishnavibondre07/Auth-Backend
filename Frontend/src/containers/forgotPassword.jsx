import React from "react";
import { useEffect, useState, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import  OTPVerification from "../components/OTPVerification";
import MessageBox from "../components/MessageBox";

import { useForgotPasswordMutation, useVerifyForgotPasswordOTPMutation, useResetPasswordMutation} from "../api/authApi";

const ForgotPassword = () =>{

    const navigate = useNavigate();

    const [forgotPassword] = useForgotPasswordMutation();
    const [verifyOtp] = useVerifyForgotPasswordOTPMutation();
    const [resetPassword] = useResetPasswordMutation();

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState({type: "", text: ""});

    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const steps = ["Email", "OTP", "Reset"];

    // TIMER
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        if (timer === 0) setCanResend(true);

        return () => clearInterval(interval);
    }, [timer, step]);

    const showMessage = (type, msg) => {
        setMessageType(type);
        setMessage(msg);
    };

    // STEP 1
    const handleSendOtp = useCallback(async (e) => {
        e.preventDefault();

        if (!email.includes("@")) {
            showMessage("error", "Enter valid email");
            return;
        }

        try {
            setLoading(true);
            await forgotPassword({ email }).unwrap();

            showMessage("success", "OTP sent successfully");

            setStep(2);
            setTimer(60);
            setCanResend(false);

        } catch (err) {
            showMessage("error", err?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    });

    // RESEND OTP
    const handleResendOtp = useCallback(async () => {
        try {
            await forgotPassword({ email }).unwrap();

            showMessage("success", "OTP resent");

            setTimer(60);
            setCanResend(false);

        } catch {
            showMessage("error", "Failed to resend OTP");
        }
    });

    // STEP 2
    const handleVerifyOtp = useCallback(async (otp) => {

        if (!otp) {
            showMessage("error", "Enter OTP");
            return;
        }

        try {
            setLoading(true);

            await verifyOtp({ email, otp }).unwrap();

            showMessage("success", "Email verified");

            setStep(3);

        } catch (err) {
            showMessage("error", err?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    });

    // STEP 3
    const handleResetPassword = useCallback(async (e) => {
        e.preventDefault();

        if (!password) {
            showMessage("error", "Enter password");
            return;
        }

        try {
            setLoading(true);

            await resetPassword({ newPassword: password }).unwrap();

            showMessage("success", "Password reset successful");

            setTimeout(() => navigate("/login"), 1000);

        } catch (err) {
            showMessage("error", err?.data?.message || "Reset failed");
        } finally {
            setLoading(false);
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">

            {message.text && (
              <MessageBox
                 type={message.type}
                 text={message.text}
                 onClose={() => setMessage({ type: "", text: "" })}
              />
            )}

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-5 sm:p-8">

                <div className="flex justify-between gap-1 sm:gap-2 mb-6 text-xs sm:text-sm">
                    {steps.map((s, i) => (
                        <div key={i} className="flex-1 min-w-0 text-center">
                            <div className={`h-1 mb-2 rounded ${
                                step > i + 1 ? "bg-green-500" :
                                step === i + 1 ? "bg-blue-500" : "bg-gray-300"
                            }`} />
                            <span className={`truncate block ${step === i + 1 ? "font-semibold text-gray-800" : "text-gray-400"}`}>
                                {s}
                            </span>
                        </div>
                    ))}
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-4">

                        <h1 className="text-lg sm:text-xl font-semibold text-center">
                            Forgot Password
                        </h1>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="w-full p-3 min-h-[44px] text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />

                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 min-h-[44px] rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>

                        <p
                            onClick={() => navigate("/login")}
                            className="text-center text-sm text-gray-500 cursor-pointer"
                        >
                            Back to login
                        </p>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <OTPVerification
                        embedded
                        title="Verify OTP"
                        subtitle="Enter the code sent to"
                        email={email}
                        buttonText={loading ? "Verifying..." : "Verify"}
                        onSubmit={handleVerifyOtp}
                        onResend={handleResendOtp}
                        canResend={canResend}
                        timer={timer}
                        onBack={() => setStep(1)}
                    />
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">

                        <h1 className="text-lg sm:text-xl font-semibold text-center">
                            Reset Password
                        </h1>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full p-3 min-h-[44px] text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />

                        <button
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 min-h-[44px] rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                    </form>
                )}

            </div>
        </div>
    );
}

export default React.memo(ForgotPassword);

