import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Register } from "./containers/register";
import {VerifyEmail} from "./containers/verifyEmail";
import { Login } from "./pages/login";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;