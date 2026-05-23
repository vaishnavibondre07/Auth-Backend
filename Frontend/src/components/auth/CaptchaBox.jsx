import React from "react";
const CaptchaBox = ({ captcha, setCaptcha, fetchCaptcha , captchaQuestion, captchaAnswer}) => {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Security Verification
            </label>

            <div className="border bg-blue-50 rounded-xl p-3">
                <div className="flex items-center gap-3">

                    <div className="flex items-center gap-3 bg-white border rounded-lg px-3 py-2">
                        <span className="font-bold text-blue-700">
                            {captchaQuestion}
                        </span>

                        <button
                            type="button"
                            onClick={fetchCaptcha}
                            className="text-sm text-blue-600"
                        >
                            Refresh
                        </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Answer"
                        value={captchaAnswer}
                        onChange={(e) =>
                            setCaptcha((prev) => ({
                                ...prev,
                                answer: e.target.value,
                            }))
                        }
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default React.memo(CaptchaBox);