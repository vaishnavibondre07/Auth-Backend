// import { useRef, useState } from "react";

// export const OTPVerification = ({
//     title,
//     subtitle,
//     buttonText,
//     onSubmit,
//     onResend,
// }) => {

//     const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//     const inputRefs = useRef([]);

//     const handleOtpChange = (value, index) => {
//         if (!/^\d*$/.test(value)) return;

//         const updatedOtp = [...otp];
//         updatedOtp[index] = value;
//         setOtp(updatedOtp);

//         if (value && index < 5) {
//             inputRefs.current[index + 1].focus();
//         }
//     };

//     const handleKeyDown = (e, index) => {
//         if (e.key === "Backspace" && !otp[index] && index > 0) {
//             inputRefs.current[index - 1].focus();
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit(otp.join(""));
//     };

//     return (
//         <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

//             <h1 className="text-3xl font-bold text-center">
//                 {title}
//             </h1>

//             <p className=" text-center mt-2 mb-8">
//                 {subtitle}
//             </p>

//             <form onSubmit={handleSubmit}>

//                 <div className="flex justify-between gap-2 mb-8">
//                     {otp.map((digit, index) => (
//                         <input
//                             key={index}
//                             type="text"
//                             maxLength="1"
//                             value={digit}
//                             ref={(el) => (inputRefs.current[index] = el)}
//                             onChange={(e) =>
//                                 handleOtpChange(e.target.value, index)
//                             }
//                             onKeyDown={(e) =>
//                                 handleKeyDown(e, index)
//                             }
//                             className="w-12 h-14rounded-xl text-center text-xl font-bold focus:outline-none focus:border-indigo-500"
//                         />
//                     ))}
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold"
//                 >
//                     {buttonText}
//                 </button>

//                 <button
//                     type="button"
//                     onClick={onResend}
//                     className="w-full mt-4 text-indigo-400"
//                 >
//                     Resend OTP
//                 </button>

//             </form>
//         </div>
//     );
// };

import { useRef, useState } from "react";

export const OTPVerification = ({
  title = "Verify your email",
  subtitle = "We've sent a 6-digit code to",
  email = "name@company.com",
  buttonText = "Verify code",
  onSubmit,
  onResend,
  onBack,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const inputRefs = useRef([]);

  const isFilled = otp.every((d) => d !== "");

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value ? value[value.length - 1] : "";
    setOtp(updated);
    setMessage({ text: "", type: "" });
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const updated = [...otp];
      updated[index - 1] = "";
      setOtp(updated);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "");
    const updated = [...otp];
    text.split("").slice(0, 6).forEach((ch, i) => {
      if (index + i < 6) updated[index + i] = ch;
    });
    setOtp(updated);
    const next = Math.min(index + text.length, 5);
    inputRefs.current[next]?.focus();
  };

  const handleSubmit = () => {
    onSubmit?.(otp.join(""));
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setMessage({ text: "Code resent!", type: "success" });
    inputRefs.current[0]?.focus();
    onResend?.();
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 w-full max-w-sm text-center shadow-sm">

        {/* Icon */}
        <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-1">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {subtitle} <span className="font-medium text-gray-800">{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e, index)}
              className={`w-12 h-13 text-center text-xl font-semibold text-gray-900 rounded-lg border outline-none transition-all
                ${digit ? "border-indigo-500 bg-white" : "border-gray-300 bg-white"}
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
              style={{ height: "52px" }}
            />
          ))}
        </div>

        {/* Message */}
        {message.text && (
          <p className={`text-sm mb-3 ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
            {message.text}
          </p>
        )}

        {/* Verify Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFilled}
          className={`w-full py-3 rounded-lg text-white text-sm font-medium transition-colors mb-4
            ${isFilled ? "bg-indigo-500 hover:bg-indigo-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
        >
          {buttonText}
        </button>

        {/* Resend */}
        <p className="text-sm text-gray-500 mb-3">
          Didn't receive the code?{" "}
          <button onClick={handleResend} className="text-indigo-500 font-medium hover:underline">
            Resend
          </button>
        </p>

        {/* Back */}
        <button
          onClick={onBack}
          className="text-sm text-indigo-500 flex items-center justify-center gap-1 w-full hover:underline"
        >
          ← Back to log in
        </button>

      </div>
    </div>
  );
};