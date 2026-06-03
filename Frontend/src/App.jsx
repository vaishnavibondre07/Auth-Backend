import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import VerifyEmail  from "./containers/verifyEmail";
import  ForgotPassword  from "./containers/forgotPassword";
import {AdminRoute } from "./routes/AdminRoutes";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminUserFiles from "./pages/AdminUserFiles";

// LAZY LOADING
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));

function App() {
    return (
        <BrowserRouter>

            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center px-4">
                        <h1 className="text-xl sm:text-2xl font-semibold text-blue-600">
                            Loading...
                        </h1>
                    </div>
                }
            >

                <Routes>

                    <Route path="/" element={<Register />} />

                    <Route path="/login" element={<Login />} />

                    <Route path="/verify-email" element={<VerifyEmail />} />

                    <Route path="/forgot-password" element={<ForgotPassword />}/>

                    <Route path="/profile" element={<Profile />} />

                    <Route path="/admin" element={ <AdminRoute> <Admin /> </AdminRoute> } />

                    <Route path="/admin/user/:id" element={< AdminRoute><AdminUserDetails /> </AdminRoute>}/>

                   <Route path="/admin/user/:id/files" element={ <AdminRoute> <AdminUserFiles /> </AdminRoute>}/>

                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;