const AuthButton = ({ text = "Submit", loading = false, type = "submit", onClick, disabled = false, className = ""}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={` w-full py-2.5 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${ disabled || loading  ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700" } text-white${className}`}
        >
            {loading ? (
                <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Loading...
                </>
            ) : (
                text
            )}
        </button>
    );
};

export default AuthButton;