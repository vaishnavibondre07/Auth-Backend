const AuthInput = ({ label, name, value, onChange, type = "text" }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm mb-1">{label}</label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
};

export default AuthInput;