import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./containers/register";
import {VerifyEmail} from "./containers/verifyEmail";
import { Login } from "./containers/login";
import { ForgotPassword } from "./containers/forgotPassword";
import { Profile } from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;