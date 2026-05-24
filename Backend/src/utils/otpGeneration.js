export function generateOTP() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    
   return otp
}

export function generateOTPHtml(otp) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>

  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #f4f4f4, #e9f0ff);
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background: #ffffff;
      padding: 30px;
      border-radius: 12px;
      width: 100%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }

    .logo {
      font-size: 22px;
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 10px;
    }

    h2 {
      color: #333;
      margin-bottom: 10px;
    }

    p {
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }

    .otp-box {
      margin: 20px 0;
      font-size: 26px;
      letter-spacing: 6px;
      font-weight: bold;
      color: #111;
      background: #f3f4f6;
      padding: 12px;
      border-radius: 8px;
      display: inline-block;
    }

    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #999;
    }

    .btn {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 18px;
      background: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="logo">YourApp</div>

    <h2>OTP Verification</h2>

    <p>
      We received a request to verify your account.  
      Use the OTP below to complete your verification process.
    </p>

    <div class="otp-box">
      ${otp}
    </div>

    <p>This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.</p>

    <a href="#" class="btn">Verify Now</a>

    <div class="footer">
      If you didn’t request this, you can safely ignore this email.
    </div>
  </div>
</body>
</html>`;
}

