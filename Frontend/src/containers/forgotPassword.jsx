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


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { OTPVerification } from "../components/OTPVerification";
// import {
//     useForgotPasswordMutation,
//     useVerifyForgotPasswordOTPMutation,
//     useResetPasswordMutation
// } from "../api/api";

// export function ForgotPassword() {

//     const navigate = useNavigate();

//     const [forgotPassword] = useForgotPasswordMutation();
//     const [verifyOtp] = useVerifyForgotPasswordOTPMutation();
//     const [resetPassword] = useResetPasswordMutation();

//     const [step, setStep] = useState(1);
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     // STEP 1
//     const handleSendOtp = async (e) => {
//         e.preventDefault();

//         if (!email.includes("@")) {
//             alert("Enter valid email");
//             return;
//         }

//         try {
//             await forgotPassword({ email }).unwrap();
//             setStep(2);
//         } catch (err) {
//             alert(err?.data?.message || "Failed to send OTP");
//         }
//     };

//     // STEP 2
//     const handleVerifyOtp = async (otp) => {
//         if (!otp) {
//             alert("Enter OTP");
//             return;
//         }

//         try {
//             await verifyOtp({ email, otp }).unwrap();
//             setStep(3);
//         } catch (err) {
//             alert(err?.data?.message || "Invalid OTP");
//         }
//     };

//     // STEP 3
//     const handleResetPassword = async (e) => {
//         e.preventDefault();

//         if (!password || !confirmPassword) {
//             alert("Fill all fields");
//             return;
//         }

//         if (password !== confirmPassword) {
//             alert("Passwords do not match");
//             return;
//         }

//         try {
//             await resetPassword({ newPassword: password }).unwrap();

//             alert("Password reset successful");

//             // redirect to login
//             navigate("/login");

//         } catch (err) {
//             alert(err?.data?.message || "Reset failed");
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

//             <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">

//                 {/* ICON */}
//                 <div className="flex justify-center mb-4">
//                     <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                         🔑
//                     </div>
//                 </div>

//                 {/* STEP 1 */}
//                 {step === 1 && (
//                     <form onSubmit={handleSendOtp} className="space-y-4">

//                         <h1 className="text-2xl font-semibold text-center">
//                             Forgot password?
//                         </h1>

//                         <p className="text-center text-gray-500 text-sm">
//                             No worries, we’ll send you reset instructions.
//                         </p>

//                         <div>
//                             <label className="text-sm font-medium">Email</label>
//                             <input
//                                 type="email"
//                                 placeholder="name@company.com"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             />
//                         </div>

//                         <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
//                             Send OTP
//                         </button>

//                         <p className="text-center text-sm text-gray-500 cursor-pointer">
//                             ← Back to login
//                         </p>
//                     </form>
//                 )}

//                 {/* STEP 2 */}
//                 {step === 2 && (
//                     <OTPVerification
//                         title="Verify email"
//                         subtitle="Enter OTP sent to your email"
//                         buttonText="Verify email"
//                         onSubmit={handleVerifyOtp}
//                     />
//                 )}

//                 {/* STEP 3 */}
//                 {step === 3 && (
//                     <form onSubmit={handleResetPassword} className="space-y-4">

//                         <h1 className="text-2xl font-semibold text-center">
//                             Reset password
//                         </h1>

//                         <p className="text-center text-gray-500 text-sm">
//                             Please enter your new password below.
//                         </p>

//                         <div>
//                             <label className="text-sm font-medium">New password</label>
//                             <input
//                                 type="password"
//                                 placeholder="Min. 8 characters"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             />
//                         </div>

//                         <div>
//                             <label className="text-sm font-medium">Confirm password</label>
//                             <input
//                                 type="password"
//                                 placeholder="Repeat your new password"
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                             />
//                         </div>

//                         <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
//                             Reset password
//                         </button>

//                         <p className="text-center text-sm text-gray-500 cursor-pointer">
//                             ← Back to login
//                         </p>
//                     </form>
//                 )}

//             </div>
//         </div>
//     );
// }



// // import { useState } from "react";
// // import { OTPVerification } from "../components/OTPVerification";
// // import {
// //     useForgotPasswordMutation,
// //     useVerifyForgotPasswordOTPMutation,
// //     useResetPasswordMutation
// // } from "../api/api";

// // export function ForgotPassword() {

// //     const [forgotPassword] = useForgotPasswordMutation();
// //     const [verifyOtp] = useVerifyForgotPasswordOTPMutation();
// //     const [resetPassword] = useResetPasswordMutation();

// //     const [step, setStep] = useState(1);
// //     const [email, setEmail] = useState("");
// //     const [password, setPassword] = useState("");
// //     const [confirmPassword, setConfirmPassword] = useState("");

// //     // STEP 1: Send OTP
// //     const handleSendOtp = async (e) => {
// //         e.preventDefault();

// //         if (!email || !email.includes("@")) {
// //             alert("Enter a valid email");
// //             return;
// //         }

// //         try {
// //             await forgotPassword({ email }).unwrap();
// //             setStep(2);
// //         } catch (err) {
// //             alert(err?.data?.message);
// //         }
// //     };

// //     // STEP 2: Verify OTP
// //     const handleVerifyOtp = async (otp) => {
// //         if (!otp) {
// //             alert("Enter OTP");
// //             return;
// //         }

// //         try {
// //             await verifyOtp({ email, otp }).unwrap();
// //             setStep(3);
// //         } catch (err) {
// //             alert(err?.data?.message);
// //         }
// //     };

// //     // STEP 3: Reset Password
// //     const handleResetPassword = async (e) => {
// //         e.preventDefault();

// //         if (!password || !confirmPassword) {
// //             alert("Fill all fields");
// //             return;
// //         }

// //         if (password !== confirmPassword) {
// //             alert("Passwords do not match");
// //             return;
// //         }

// //         try {
// //             await resetPassword({ newPassword : password }).unwrap();

// //             alert("Password reset successful");

// //             // reset everything
// //             setStep(1);
// //             setEmail("");
// //             setPassword("");
// //             setConfirmPassword("");

// //         } catch (err) {
// //             alert(err?.data?.message);
// //         }
// //     };

// //     return (
// //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

// //             <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">

// //                 {/* STEP 1 */}
// //                 {step === 1 && (
// //                     <form onSubmit={handleSendOtp} className="space-y-4">

// //                         <h1 className="text-2xl font-bold text-center text-gray-800">
// //                             Forgot Password
// //                         </h1>

// //                         <input
// //                             type="email"
// //                             placeholder="Enter your email"
// //                             value={email}
// //                             onChange={(e) => setEmail(e.target.value)}
// //                             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
// //                         />

// //                         <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
// //                             Send OTP
// //                         </button>
// //                     </form>
// //                 )}

// //                 {/* STEP 2 */}
// //                 {step === 2 && (
// //                     <OTPVerification
// //                         title="Verify OTP"
// //                         subtitle="Enter OTP sent to your email"
// //                         buttonText="Verify OTP"
// //                         onSubmit={handleVerifyOtp}
// //                     />
// //                 )}

// //                 {/* STEP 3 */}
// //                 {step === 3 && (
// //                     <form onSubmit={handleResetPassword} className="space-y-4">

// //                         <h1 className="text-2xl font-bold text-center text-gray-800">
// //                             Reset Password
// //                         </h1>

// //                         <input
// //                             type="password"
// //                             placeholder="New Password"
// //                             value={password}
// //                             onChange={(e) => setPassword(e.target.value)}
// //                             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
// //                         />

// //                         <input
// //                             type="password"
// //                             placeholder="Confirm Password"
// //                             value={confirmPassword}
// //                             onChange={(e) => setConfirmPassword(e.target.value)}
// //                             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
// //                         />

// //                         <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
// //                             Reset Password
// //                         </button>
// //                     </form>
// //                 )}

// //             </div>
// //         </div>
// //     );
// // }