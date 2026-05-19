import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import Session from "../models/session.model.js";
import { googleClient } from "../config/googleClient.js";
import { sendEmail } from "../services/email.service.js";
import {generateOTP, generateOTPHtml } from "../utils/otpGeneration.js";
import otpModel from "../models/otp.model.js";
import userModel from "../models/user.models.js";
import axios from "axios";
import { generateCaptcha } from "../utils/captchaGeneration.js";
import captcha from "../models/captcha.model.js";
import { verifyCaptcha } from "../utils/verifyCaptcha.js";



const createSession = async (userId, req) => {
    const session = await Session.create({
        user : userId,
        refreshToken : " ",
        ip : req.ip,
        userAgent : req.headers["user-agent"]
      })

      const refreshToken = jwt.sign({
        id : userId,
        sessionId : session._id
     }, config.JWT_SECRET, {expiresIn : "7d"});

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10); 
      session.refreshToken = hashedRefreshToken;
      await session.save();

      return {
        refreshToken,
        sessionId : session._id
    };
}

function generateAccessToken(userId, sessionId){
    return jwt.sign({
        id : userId,
        sessionId : sessionId
    }, config.JWT_SECRET, {expiresIn : "15m"});
}

export async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const isAlreadyRegistered = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (isAlreadyRegistered) {
        return res.status(400).json({
            success: false,
            message: "Username or email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const isCorrectCaptcha = await verifyCaptcha(req.body.captchaId, req.body.captchaAnswer);

    if(!isCorrectCaptcha){
      return res.status(400).json({
        success: false,
        message: "Invalid captcha"
      })
    }

     const user = await User.create({
        username,
        email,
        password: hashedPassword,
        verified: false   // IMPORTANT
    });

    await sendEmail(
        email,
        "Verify your email",
        "",
        generateOTPHtml(otp)
    );

    // Generate OTP
    const otpHash = await bcrypt.hash(otp.toString(), 10);
    
    await otpModel.create({
        email,
        user: user._id,
        otpHash,
        purpose: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 30 * 1000)
    });

    return res.status(201).json({
        success: true,
        message: "User registered successfully. Please verify your email.",
        data: {
            username: user.username,
            email: user.email,
            verified: user.verified
        }
    });
  
}

// ********************************************* LOGIN ***************************************************

export async function loginUser(req, res) {
  try {

    const { email, password, captchaId, captchaAnswer } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Unlock account automatically after lock expires
    if (user.lockUntil && user.lockUntil < Date.now()) {
      user.lockUntil = null;
      user.failedAttempts = 0;
      await user.save();
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {

      const remainingTime = Math.ceil(
        (user.lockUntil - Date.now()) / 1000
      );

      return res.status(400).json({
        success: false,
        message: `Account is locked. Try again in ${remainingTime} seconds`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // Wrong password
    if (!isMatch) {

      user.failedAttempts += 1;

      const remainingAttempts = 5 - user.failedAttempts;

      // Lock account after 5 attempts
      if (user.failedAttempts >= 5) {

        user.lockUntil = Date.now() + 1 * 60 * 1000; // 1 minute
        user.failedAttempts = 0;

        await user.save();

        return res.status(400).json({
          success: false,
          message: "Account locked for 1 minute due to too many failed attempts",
        });
      }

      await user.save();

      return res.status(400).json({
        success: false,
        message: `Invalid email or password. ${remainingAttempts} attempts remaining`,
      });
    }

    // Successful login
    // user.failedAttempts = 0;
    // user.lockUntil = null;

    // await user.save();

    if (!user.verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const isCorrectCaptcha = await verifyCaptcha(captchaId, captchaAnswer);

    if(!isCorrectCaptcha){
      return res.status(400).json({
        success: false,
        message: "Invalid captcha"
      })
    }


    const sessionData = await createSession(user._id, req);

    const accessToken = generateAccessToken(
      user._id,
      sessionData.sessionId
    );

    res.cookie("refreshToken", sessionData.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        username: user.username,
        email: user.email,
      },
      token: accessToken,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
// ********************************************* REFRESH TOKEN ***************************************************

export async function refreshToken(req, res){
  try {

    const refreshToken = req.cookies.refreshToken;
    // const refreshToken = req.body

    if(!refreshToken){
      return res.status(401).json({
        success : false,
        message : "Refresh token not found"
      })
    }

    const decode = jwt.verify(refreshToken, config.JWT_SECRET);

    const session = await Session.findById(decode.session.id);

    if(!session || session.revoked){
      return res.status(401).json({
        success : false,
        message : "Invalid session"
      })
    }

    const user = await User.findById(decode.id);

    if(!user){
        return res.status(401).json({
          success : false,
          message : "User not found"
        })
      }

    const accessToken = generateAccessToken(user._id, session._id);

    res.status(200).json({
      success : true,
      message : "Access token refreshed successfully",
      token : accessToken
    })


  } catch (error) {
     return res.status(401).json({
         success : false,
         message : "Invalid refresh token"
     })
  }
}

// ********************************************* Logout ***************************************************

export async function logoutUser(req,res){

    const refreshToken = req.cookies.refreshToken;

    console.log(refreshToken);
    
    if(!refreshToken){
      return res.status(401).json({
        success: false,
        message: "Refresh token not found"
      });
    }

    const decode = jwt.verify(refreshToken, config.JWT_SECRET);

    const session = await Session.findById(decode.sessionId);

    if(!session){
      return res.status(401).json({
        success : false,
        message : "Invalid refresh token"
      })
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken")

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

}

// ******************************************* Logout All *************************************************

export async function logoutAll(req, res){

  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(401).json({
      success : false,
      message : "Refresh token not found"
     })

  }


    const decode = jwt.verify(refreshToken, config.JWT_SECRET);

    const sessions = await Session.updateMany({user : decode.id, revoked : false}, {revoked : true});

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success : true,
      message : "Logged out from all devices successfully"
     })
}

// ******************************************* Google Login *************************************************

export async function googleLogin(req, res){
  try {
    const { token } = req.body;

    if(!token){
      return res.status(400).json({
        success : false,
        message : "Google token is required"
       })
    }

  // Verify the token with Google
  const ticket = await googleClient.verifyIdToken({
    idToken : token,
    audience : config.GOOGLE_CLIENT_ID,
  });

  // after verification google sends obj ticket which contains user info in payload

  const payload = ticket.getPayload();

  const email = payload.email;
  const name = payload.name;
  const googleId = payload.sub;   // Google's unique permanent ID for user.

  let user = await User.findOne({email});

  if(!user){
    user = await User.create({
      username : name,
      email,
      googleId,
      password: null
    });
  }

  const sessionData = await createSession(user._id, req);

  const accessToken = generateAccessToken(user._id, sessionData.sessionId);

  res.cookie("refreshToken", sessionData.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  return res.status(200).json({
    success : true,
    message : "Login with Google successful",
    data : {
      username : user.username,
      email : user.email
    },
    token : accessToken
  });

} catch (error) {
    console.log(error);
    return res.status(500).json({
      success : false,
      message : "Internal server error"
     })
  }

}

// ******************************************* Verify Email *************************************************

export async function verifyEmail(req, res) {

    try {

        const { email, otp } = req.body;

        const otpDoc = await otpModel.findOne({ email });

        console.log("otpDoc.user:", otpDoc.user);

        if (!otpDoc) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // // BLOCK CHECK
        // if (
        //     otpDoc.blockedUntil &&
        //     otpDoc.blockedUntil > new Date()
        // ) {

        //     const remainingTime = Math.ceil(
        //         (otpDoc.blockedUntil - new Date()) / 1000
        //     );

        //     return res.status(429).json({
        //         message:
        //             `Too many wrong attempts. Try again after ${remainingTime} sec`
        //     });

        // OTP EXPIRY CHECK
        if (otpDoc.expiresAt < new Date()) {

            // await otpModel.deleteMany({ email });

            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // COMPARE OTP
        const isMatch = await bcrypt.compare(
            otp,
            otpDoc.otpHash
        );

        // WRONG OTP
        if (!isMatch) {

            otpDoc.verifyAttempts += 1;

            // BLOCK AFTER 5 ATTEMPTS
            if (otpDoc.verifyAttempts >= 5) {

                otpDoc.blockedUntil =
                    new Date(Date.now() + 2 * 60 * 1000);

                await otpDoc.save();

                return res.status(429).json({
                    message:
                        "Too many wrong OTP attempts. Blocked for 2 mins"
                });
            }

            await otpDoc.save();

            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // VERIFY USER
        const user = await userModel.findByIdAndUpdate(
            otpDoc.user,
            { verified: true },
            { returnDocument: "after" }
        );

        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        if (user.verified === true) {
          await otpModel.deleteMany({
            user: otpDoc.user
        });

        // TOKENS
        const accessToken =
            generateAccessToken(user._id);

        const sessionData =
            await createSession(user._id, req);

        const refreshToken =
            sessionData.refreshToken;

        // COOKIES
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Email verified successfully",

            accessToken,
            refreshToken,

            user: {
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        });

    }
   } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

// ******************************************* Resend OTP *************************************************

export const resendOtp = async (req, res) => {

   try {

      const { email } = req.body;

      // FIND OTP DATA
      const otpData = await otpModel.findOne({ email });

      if (!otpData) {
         return res.status(404).json({
            success: false,
            message: "OTP data not found"
         });
      }

      // CHECK IF BLOCKED
      if (
         otpData.blockedUntil &&
         otpData.blockedUntil > new Date()
      ) {

         const remainingTime = Math.ceil(
            (otpData.blockedUntil - new Date()) / 1000
         );

         return res.status(429).json({
            success: false,
            message: `Too many attempts. Try again after ${remainingTime} sec`
         });
      }

      // RESET BLOCK AFTER TIME PASSES

      if ( otpData.blockedUntil && otpData.blockedUntil < new Date()) {
              otpData.blockedUntil = null;
              otpData.resendCount = 0;

              await otpData.save();
          }

      // CHECK RESEND LIMIT
      if (otpData.resendCount >= 5) {

         otpData.blockedUntil =
            new Date(Date.now() + 2 * 60 * 1000);

         await otpData.save();

         return res.status(429).json({
            success: false,
            message: "Too many resend attempts. Account blocked for 2 minutes"
         });
      }


      // GENERATE NEW OTP
      const otp = generateOTP();

      // HASH OTP
      const hashedOtp = await bcrypt.hash(otp, 10);

      // UPDATE OTP DATA
      otpData.otpHash = hashedOtp;

      // OTP VALID FOR 30 SEC
      otpData.expiresAt =
         new Date(Date.now() + 30 * 1000);

      // INCREASE RESEND COUNT
      otpData.resendCount += 1;

      await otpData.save();

      // SEND EMAIL
      await sendEmail(
         email,
         "Resend OTP",
          "",
         generateOTPHtml(otp)
      );

      return res.status(200).json({
         success: true,
         message: "OTP resent successfully"
      });

   } catch (error) {

      console.log(error);

      return res.status(500).json({
         success: false,
         message: "Internal Server Error"
      });

   }

};

// ******************************************* Forgot Password *************************************************

export const forgotPassword = async (req, res) => {
   try {

      const { email } = req.body;

      // 1. Validate email
      if (!email) {
         return res.status(400).json({
            success: false,
            message: "Email is required"
         });
      }

      // 2. Find user
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(404).json({
            success: false,
            message: "User not found"
         });
      }

      // 3. Generate OTP
      const otp = generateOTP();

      // 4. Hash OTP
      const hashedOTP = await bcrypt.hash(otp, 10);

      // 5. Delete old OTPs
      await otpModel.deleteMany({
         email,
         purpose: "FORGOT_PASSWORD"
      });

       // 7. Send email
      await sendEmail(
         email,
         "Password Reset OTP",
         "",
         generateOTPHtml(otp)
      );

      // 6. Save OTP
      await otpModel.create({
         email,
         user: user._id,
         otpHash: hashedOTP,
         purpose: "FORGOT_PASSWORD",
         expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      return res.status(200).json({
         success: true,
         message: "OTP sent successfully"
      });

   } catch (error) {

      return res.status(500).json({
         success: false,
         message: error.message
      });

   }
};

// ******************************************* Verify Forgot Password OTP *************************************************

export async function verifyForgotPasswordOTP(req, res) {

    try {

        const { email, otp } = req.body;

        // VALIDATION
        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        // FIND OTP
        const otpDoc = await otpModel.findOne({
            email,
            purpose: "FORGOT_PASSWORD"
        });

        // OTP NOT FOUND
        if (!otpDoc) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // BLOCK CHECK
        if (
            otpDoc.blockedUntil &&
            otpDoc.blockedUntil > new Date()
        ) {

            const remainingTime = Math.ceil(
                (otpDoc.blockedUntil - new Date()) / 1000
            );

            return res.status(429).json({
                message:
                    `Too many wrong attempts. Try again after ${remainingTime} sec`
            });
        }

        // OTP EXPIRY CHECK
        if (otpDoc.expiresAt < new Date()) {

            await otpModel.deleteMany({
                email,
                purpose: "FORGOT_PASSWORD"
            });

            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // COMPARE OTP
        const isMatch = await bcrypt.compare(
            otp,
            otpDoc.otpHash
        );

        // WRONG OTP
        if (!isMatch) {

            otpDoc.verifyAttempts += 1;

            // BLOCK AFTER 5 ATTEMPTS
            if (otpDoc.verifyAttempts >= 5) {

                otpDoc.blockedUntil =
                    new Date(Date.now() + 2 * 60 * 1000);

                await otpDoc.save();

                return res.status(429).json({
                    message:
                        "Too many wrong OTP attempts. Blocked for 2 mins"
                });
            }

            await otpDoc.save();

            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // RESET ATTEMPTS
        otpDoc.verifyAttempts = 0;

        // MARK VERIFIED
        otpDoc.verified = true;

        await otpDoc.save();

        // FIND USER
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // GENERATE RESET TOKEN
        const resetToken = jwt.sign(
            {
                userId: user._id,
                purpose: "PASSWORD_RESET"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m"
            }
        );

        // STORE TOKEN IN COOKIE (OPTIONAL)
        res.cookie("resetToken", resetToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 10 * 60 * 1000
        });

        return res.status(200).json({
            message: "OTP verified successfully",
            resetToken
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}


// ******************************************* Reset Password *************************************************

export async function resetPassword(req, res) {

    try {

        const { newPassword } = req.body;

        // GET TOKEN FROM COOKIE
        const resetToken = req.cookies.resetToken;

        // VALIDATION
        if (!resetToken) {
            return res.status(401).json({
                message: "Reset token missing"
            });
        }

        if (!newPassword) {
            return res.status(400).json({
                message: "New password is required"
            });
        }

        let decoded;

        // VERIFY TOKEN
        try {

            decoded = jwt.verify(
                resetToken,
                process.env.JWT_SECRET
            );

        } catch (error) {

            return res.status(401).json({
                message: "Invalid or expired reset token"
            });

        }

        // CHECK PURPOSE
        if (decoded.purpose !== "PASSWORD_RESET") {
            return res.status(403).json({
                message: "Invalid token purpose"
            });
        }

        // FIND USER
        const user = await userModel.findById(
            decoded.userId
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // UPDATE PASSWORD
        user.password = hashedPassword;

        await user.save();

        // DELETE FORGOT PASSWORD OTPS
        await otpModel.deleteMany({
            email: user.email,
            purpose: "FORGOT_PASSWORD"
        });

        // CLEAR RESET TOKEN COOKIE
        res.clearCookie("resetToken");

        return res.status(200).json({
            message: "Password reset successful"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

// ******************************************* reCaptcha  *************************************************
export const verifyRecaptcha = async (req, res) => {
  try {
    const { token } = req.body;

    console.log("Received Token:", token);
    console.log("Token Type:", typeof token);
    console.log("Token Length:", token?.length);



    if (!token) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA token missing"
      });
    }

    console.log("config.SECRET_KEY:", config.SECRET_KEY);

        // Step 1: Send token to Google
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      
      // BODY
      new URLSearchParams({
        secret: config.SECRET_KEY,
        response: token
      }),

      // HEADERS
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const data = response.data;
    console.log("reCAPTCHA response from Google:", data);

    // Step 2: Check Google response
    if (!data.success) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification failed"
      });
    }

    // Step 3 (IMPORTANT for v3)
    // score is only for v3
    if (data.score !== undefined) {
      if (data.score < 0.5) {
        return res.status(403).json({
          success: false,
          message: "Bot detected",
          score: data.score
        });
      }
    }

    // Step 4: success
    return res.status(200).json({
      success: true,
      message: "Human verified",
      score: data.score
    });

  } catch (error) {
    console.error("reCAPTCHA error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during reCAPTCHA verification"
    });
  }
};

// ******************************************* Mathematical Captcha  *************************************************

export async function createCaptcha(req, res) {

  try {
    const {question, answer} = generateCaptcha();
    console.log(question , answer);
    

    const newCaptcha = await captcha.create({
      question : question,
      answer : answer,
      expiresAt : Date.now() + 3 * 60 * 1000
    })

    return res.status(200).json({
      success: true,
      captchaId: newCaptcha._id,
      question: newCaptcha.question,
      answer: newCaptcha.answer
    });

  } catch(error) {
    return res.status(500).json({
      success: false,
      message : error.message

    })
  }
}
  