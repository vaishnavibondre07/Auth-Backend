import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import CaptchaBox from "../../components/auth/CaptchaBox";

const RegisterForm = ({ form, handleChange, handleSubmit, isLoading, captcha, setCaptcha, fetchCaptcha }) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            
            <AuthInput
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
            />

            <AuthInput
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
            />

            <PasswordInput
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
            />

            <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
            />

            {/* CAPTCHA */}
            <CaptchaBox
                captchaQuestion={captcha.question}
                captchaAnswer={captcha.answer}
                setCaptcha={setCaptcha}
                fetchCaptcha={fetchCaptcha}
            />

            <AuthButton
                text="Create Account"
                loading={isLoading}
            />
        </form>
    );
};

export default RegisterForm;