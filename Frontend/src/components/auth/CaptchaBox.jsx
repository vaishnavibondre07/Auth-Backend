import React from "react";

const CaptchaBox = ({
    captcha,
    setCaptcha,
    fetchCaptcha,
    captchaQuestion,
    captchaAnswer,
    captchaInput,
    setCaptchaInput,
}) => {
    const question = captchaQuestion ?? captcha?.question ?? "";
    const answer = captchaAnswer ?? captchaInput ?? captcha?.answer ?? "";

    const handleAnswerChange = (value) => {
        if (setCaptchaInput) {
            setCaptchaInput(value);
            return;
        }
        if (setCaptcha) {
            setCaptcha((prev) =>
                typeof prev === "object" && prev !== null
                    ? { ...prev, answer: value }
                    : value
            );
        }
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Security Verification
            </label>

            <div className="border bg-blue-50 rounded-xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center justify-between gap-3 bg-white border rounded-lg px-3 py-2.5 w-full sm:w-auto sm:min-w-35">
                        <span className="font-bold text-blue-700 text-sm sm:text-base break-all">
                            {question}
                        </span>

                        <button
                            type="button"
                            onClick={fetchCaptcha}
                            className="text-sm text-blue-600 shrink-0 hover:underline"
                        >
                            Refresh
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Answer"
                        value={answer}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-full flex-1 px-3 py-2.5 min-h-11 text-base sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(CaptchaBox);
