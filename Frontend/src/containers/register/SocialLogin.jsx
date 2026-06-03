import React, { useCallback } from "react";
import { GoogleLogin } from "@react-oauth/google";

const SocialLogin = ({ googleLogin, navigate, setMessage }) => {

    return (
        <div className="flex justify-center">

            <GoogleLogin

                onSuccess={async ( credentialResponse) => {
                    try {
                        const response = await googleLogin( credentialResponse.credential ).unwrap();
                        setMessage({ type: "success", text:  response.message });
                        navigate("/profile");

                    } catch (err) {
                        setMessage({  type: "error",  text: err?.data?.message || "Google login failed", });
                    }
                }}

                onError={() => {
                     setMessage({ type: "error", text: "Google login failed" });
                }}
            />
        </div>
    );
};

export default React.memo(SocialLogin);