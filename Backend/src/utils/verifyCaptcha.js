import Captcha from "../models/captcha.model.js";

export const verifyCaptcha = async (
  captchaId,
  captchaAnswer
) => {

  const captcha = await Captcha.findById(captchaId);

  if (!captcha) {
    throw new Error("Captcha expired or invalid");
  }

  if (captcha.answer !== Number(captchaAnswer)) {

    throw new Error("Invalid captcha");

  }

  await Captcha.findByIdAndDelete(captchaId);

  return true;
};