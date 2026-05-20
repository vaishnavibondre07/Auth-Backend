import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useVerifyEmailMutation, useResendOTPMutation } from "../api/api";

export const VerifyEmail = () => {
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);

    const inputRefs = useRef([]);

    const [verifyEmail] = useVerifyEmailMutation();
    const [resendOtp] = useResendOTPMutation();
    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

const handleResendOtp = async () => {
    try {
        setLoading(true);

        await resendOtp({ email }).unwrap();

        alert("OTP resent successfully!");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
    } catch (err) {
        alert("Failed to resend OTP: " + (err.data?.message || err.error));
    } finally {
        setLoading(false);
    }
};

    const handleVerify = async () => {
        const finalOtp = otp.join("");

        try {
            await verifyEmail({ email, otp: finalOtp }).unwrap();
            alert("Email verified successfully!");
        } catch (err) {
            alert("Verification failed: " + (err.data?.message || err.error));
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f7ff] text-[#0b1c30] font-sans">

            {/* HEADER */}
            <header className="h-20 flex items-center justify-between px-10 border-b border-[#d7def5] bg-white/80 backdrop-blur-md">
                <span className="text-sm font-medium text-gray-600 hidden md:flex items-center gap-2">
                    🔒 SECURE VERIFICATION
                </span>
            </header>

            {/* MAIN */}
            <main className="flex-1 flex items-center justify-center px-4">

                <div className="w-full max-w-md">

                    {/* CARD */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-[#d7def5] overflow-hidden">

                        {/* TOP BAR */}
                        <div className="h-1 bg-gradient-to-r from-[#003cc1] to-[#4a47d2]" />

                        <div className="p-10 text-center">

                            {/* ICON */}
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center text-4xl shadow-sm">
                                📩
                            </div>

                            {/* TITLE */}
                            <h1 className="text-3xl font-bold tracking-tight mb-2">
                                Verify your email
                            </h1>

                            {/* SUBTITLE */}
                            <p className="text-gray-600 text-base mb-8 leading-relaxed">
                                Enter the 6-digit code sent to{" "}
                                <span className="font-semibold text-[#0b1c30]">
                                    {email}
                                </span>
                            </p>

                            {/* OTP BOXES */}
                            <div className="flex justify-center gap-3 mb-10">

                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        value={digit}
                                        maxLength={1}
                                        onChange={(e) =>
                                            handleChange(e.target.value, index)
                                        }
                                        className="
                                            w-14 h-16
                                            text-center
                                            text-3xl font-bold
                                            bg-white
                                            border-2 border-[#c9d6ff]
                                            rounded-xl
                                            shadow-sm
                                            text-[#0b1c30]
                                            focus:outline-none
                                            focus:border-[#003cc1]
                                            focus:ring-4 focus:ring-[#003cc1]/20
                                            transition-all
                                        "
                                    />
                                ))}
                            </div>

                            {/* BUTTON */}
                            <button
                                onClick={handleVerify}
                                className="w-full py-4 rounded-xl text-white text-lg font-semibold bg-gradient-to-r from-[#003cc1] to-[#4a47d2] hover:opacity-90 active:scale-95 transition shadow-lg shadow-blue-200"
                            >
                                Verify Email
                            </button>

                            {/* FOOTER */}
                            <div className="mt-6 text-base text-gray-600">
                                Didn’t receive code?{" "}
                                <button onClick={handleResendOtp}
                                    className="text-[#003cc1] font-semibold hover:underline">
                                    Resend OTP
                                </button>
                            </div>

                            {/* NOTE */}
                    <p className="text-base text-center text-gray-700 mt-6">
                        🔐 Never share your OTP with anyone
                    </p>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};
// import { useState } from "react";
// import { useLocation } from "react-router-dom";
// import { useVerifyEmailMutation } from "../api/api";

// export const VerifyEmail = () => {
//     const location = useLocation();
//     const email = location.state?.email;

//     const [otp, setOtp] = useState("");

//     const [verifyEmail] = useVerifyEmailMutation();

//     const handleVerify = async () => {
//         console.log("Verify OTP for:", email, otp);

//         try {
//             await verifyEmail({ email, otp }).unwrap();
//             alert("Email verified successfully! You can now log in.");
//         } catch (err) {
//             alert("Verification failed: " + (err.data?.message || err.error));
//         }
        
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">

//             <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">

//                 <h1 className="text-xl font-bold text-center">
//                     Verify Your Email
//                 </h1>

//                 <p className="text-sm text-gray-600 text-center">
//                     OTP sent to: <b>{email}</b>
//                 </p>

//                 <input
//                     type="text"
//                     placeholder="Enter OTP"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md"
//                 />

//                 <button
//                     onClick={handleVerify}
//                     className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
//                 >
//                     Verify Email
//                 </button>

//             </div>
//         </div>
//     );
// };
