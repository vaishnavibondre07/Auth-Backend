import { Router } from "express";
import { registerUser, loginUser, refreshToken, logoutUser, logoutAll, googleLogin, verifyEmail, resendOtp, forgotPassword, verifyForgotPasswordOTP, resetPassword, verifyRecaptcha, createCaptcha, deleteAccount } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/logout", logoutUser);
authRouter.post("/logout-all", logoutAll);
authRouter.post("/google-login", googleLogin);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-otp", resendOtp);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/verify-recaptcha", verifyRecaptcha)
authRouter.get("/create-captcha", createCaptcha);
authRouter.delete("/delete-account", deleteAccount);

export default authRouter;



// $2b$10$tI9YVfsi2PTwTpQncvjJTenI08VWtV3llDhHIuyDUeOdVYKIzu49K
// $2b$10$360mSaClXfjHxl8s2bvMAufa8Yv/p/UIkst2yaI4OdWVg6LYU2ZBC

