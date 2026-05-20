import { useState } from "react";
import MessageBox from "./MessageBox";
import { useCreateCaptchaMutation } from "../api/api";


export const Captcha = () => {

    const [captchaQuestion, setCaptchaQuestion] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaId, setCaptchaId] = useState("");

    const [message, setMessage] = useState({ type: "", text: "" });

    const [createCaptcha] = useCreateCaptchaMutation();

}


    