import { useEffect } from "react";
import React from "react";

const MessageBox = ({ type = "success", text, onClose }) => {
    useEffect(() => {
        if (text) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [text]);

    if (!text) return null;

    return (
        <div
            role="alert"
            className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-5 sm:max-w-sm mx-auto sm:mx-0 px-4 py-3 rounded-lg shadow-lg text-white text-sm sm:text-base z-50 break-words
            ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
            {text}
        </div>
    );
};

export default React.memo(MessageBox);