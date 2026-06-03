import React from "react";
import { useNavigate } from "react-router-dom";

const PasswordRecovery = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5">

      <h3 className="text-lg font-bold text-gray-800">
        Password Recovery
      </h3>

      <p className="text-sm text-gray-500 mt-2">
        Reset your password securely using email verification
        and OTP authentication.
      </p>

      <button
        onClick={() => navigate("/forgot-password")}
        className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Reset Password
      </button>

    </div>
  );
};

export default React.memo(PasswordRecovery);
