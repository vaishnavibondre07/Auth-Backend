import { useEffect } from "react";

const MessageBox = ({ type = "success", message, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    return (
        <div
            className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white z-50
            ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
            {message}
        </div>
    );
};

export default MessageBox;