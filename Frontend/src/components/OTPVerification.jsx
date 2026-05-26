import { useRef, useState } from "react";

export const OTPVerification = ({
  title = "Verify your email",
  subtitle = "We've sent a 6-digit code to",
  email = "",
  buttonText = "Verify code",
  onSubmit,
  onResend,
  onBack,
  canResend = true,
  timer = 0,
  embedded = false,
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
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setMessage({ text: "Code resent!", type: "success" });
    inputRefs.current[0]?.focus();
    onResend?.();
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const card = (
    <div
      className={`bg-white border border-gray-200 rounded-2xl w-full max-w-sm text-center shadow-sm ${
        embedded ? "p-5 sm:p-8" : "p-6 sm:p-10"
      }`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{title}</h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-5 sm:mb-6 px-1 break-words">
        {subtitle}
        {email ? (
          <>
            {" "}
            <span className="font-medium text-gray-800">{email}</span>
          </>
        ) : null}
      </p>

      <div className="flex justify-center gap-1.5 sm:gap-2 mb-4 max-w-full">
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
            className={`w-9 h-11 sm:w-12 sm:h-[52px] text-center text-lg sm:text-xl font-semibold text-gray-900 rounded-lg border outline-none transition-all
                ${digit ? "border-indigo-500 bg-white" : "border-gray-300 bg-white"}
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100`}
          />
        ))}
      </div>

      {message.text && (
        <p
          className={`text-sm mb-3 ${
            message.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFilled}
        className={`w-full py-3 min-h-[44px] rounded-lg text-white text-sm font-medium transition-colors mb-4
            ${
              isFilled
                ? "bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
      >
        {buttonText}
      </button>

      <p className="text-xs sm:text-sm text-gray-500 mb-3">
        Didn&apos;t receive the code?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-indigo-500 font-medium hover:underline"
          >
            Resend
          </button>
        ) : (
          <span className="text-gray-400">Resend in {timer}s</span>
        )}
      </p>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-indigo-500 flex items-center justify-center gap-1 w-full hover:underline min-h-[44px]"
        >
          ← Back to log in
        </button>
      )}
    </div>
  );

  if (embedded) {
    return card;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-8">
      {card}
    </div>
  );
};
