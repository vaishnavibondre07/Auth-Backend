import { useEffect } from "react";

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
            className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white z-50
            ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
            {text}
        </div>
    );
};

export default MessageBox;