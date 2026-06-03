import React ,{ useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import  OTPVerification  from "../components/OTPVerification";
import  MessageBox  from "../components/MessageBox";
import { useVerifyEmailMutation, useResendOTPMutation} from "../api/authApi";

const VerifyEmail = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email; // email passed from register page

    const [verifyEmail] = useVerifyEmailMutation();
    const [resendOtp] = useResendOTPMutation();

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);

    const showMessage = (type, msg) => { setMessageType(type); setMessage(msg); };

    useEffect(() => {
       if (timer <= 0){
        setCanResend(true);
        return;
       }

       const interval = setInterval(() => {
        setTimer((t) => t - 1);
       }, 1000);
       
        return () => clearInterval(interval);
    }, [timer]);

    // VERIFY OTP
    const handleVerifyOtp = async (otp) => {

        if (!otp) {
            showMessage("error", "Enter OTP");
            return;
        }

        try {
            setLoading(true);

            await verifyEmail({ email, otp }).unwrap();

            showMessage("success", "Email verified successfully");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (err) {
            showMessage("error", err?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    // RESEND OTP
    const handleResendOtp = async () => {

        try {
            setLoading(true);

            await resendOtp({ email }).unwrap();

            showMessage("success", "OTP resent successfully");

            setTimer(60);
            setCanResend(false);

        } catch (err) {
            if(err.status == 429) {
                showMessage("error", "Too many attempts..Try after sometime")
            }
            showMessage("error", "Failed to resend OTP");
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">
                    Email not found. Please register again.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">

            <MessageBox
                type={messageType}
                text={message}
                onClose={() => setMessage("")}
            />

            <div className="w-full max-w-md">
                <OTPVerification
                    embedded
                    title="Verify Email"
                    subtitle="Enter the 6-digit code sent to"
                    email={email}
                    buttonText={loading ? "Verifying..." : "Verify"}
                    onSubmit={handleVerifyOtp}
                    onResend={handleResendOtp}
                    canResend={canResend}
                    timer={timer}
                    onBack={() => navigate("/login")}
                />
            </div>
        </div>
    );
};

export default React.memo(VerifyEmail);