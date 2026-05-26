import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery } from "../api/profileApi";
import MessageBox from "../components/MessageBox";

export const AdminDashboard = () => {

    const navigate = useNavigate();
    const { data, isLoading, error } = useGetAllUsersQuery();

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const [message, setMessage] = useState({type : "" ,text : ""})
 
    const filteredUsers = data?.data?.filter((user) => {

        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === "all" || user.role === roleFilter;

        const matchesVerification =
            verificationFilter === "all" ||
            (verificationFilter === "verified" && user.verified) ||
            (verificationFilter === "notVerified" && !user.verified);

        return matchesSearch && matchesRole && matchesVerification;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <p className="text-lg sm:text-xl font-semibold text-gray-700">
                    Loading users...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <p className="text-lg sm:text-xl text-red-500 font-semibold text-center">
                    Failed to load users
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6">

            <MessageBox
                type={messageType}
                text={message}
                onClose={() => setMessage("")}
            />
            

            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-6">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Manage and monitor all registered users
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">

                        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold text-center">
                            Total Users: {filteredUsers?.length || 0}
                        </div>

                        <button
                            onClick={() => navigate("/profile")}
                            className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 min-h-[44px] rounded-xl hover:bg-blue-700 transition"
                        >
                            My Profile
                        </button>

                    </div>

                </div>

                {/* FILTERS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>

                    <select
                        value={verificationFilter}
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Users</option>
                        <option value="verified">Verified</option>
                        <option value="notVerified">Not Verified</option>
                    </select>

                </div>

                {/* MOBILE CARDS */}
                <div className="md:hidden space-y-4">
                    {filteredUsers?.length > 0 ? (
                        filteredUsers.map((user, index) => (
                            <article
                                key={user._id}
                                className="border rounded-xl p-4 bg-gray-50/80 space-y-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500">#{index + 1}</p>
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {user.username}
                                        </h3>
                                        <p className="text-sm text-gray-600 break-all">{user.email}</p>
                                    </div>
                                    <span
                                        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold
                                            ${user.role === "admin"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm">
                                    <span
                                        className={
                                            user.verified
                                                ? "text-green-600 font-medium"
                                                : "text-red-500 font-medium"
                                        }
                                    >
                                        {user.verified ? "Verified" : "Not Verified"}
                                    </span>
                                    <span className="text-gray-400">·</span>
                                    <span className="text-gray-600">
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "N/A"}
                                    </span>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="text-center py-10 text-gray-500">No users found</p>
                    )}
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto rounded-xl border">

                    <table className="w-full border-collapse">

                        {/* HEADER */}
                        <thead>
                            <tr className="bg-blue-600 text-white">

                                <th className="p-4 text-left">#</th>
                                <th className="p-4 text-left">Username</th>
                                <th className="p-4 text-left">Email</th>
                                <th className="p-4 text-left">Role</th>
                                <th className="p-4 text-left">Verified</th>
                                <th className="p-4 text-left">Created At</th>

                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>

                            {filteredUsers?.length > 0 ? (

                                filteredUsers.map((user, index) => (

                                    <tr
                                        key={user._id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >

                                        {/* SERIAL */}
                                        <td className="p-4 font-medium text-gray-700">
                                            {index + 1}
                                        </td>

                                        {/* USERNAME */}
                                        <td className="p-4 font-medium text-gray-800">
                                            {user.username}
                                        </td>

                                        {/* EMAIL */}
                                        <td className="p-4 text-gray-600">
                                            {user.email}
                                        </td>

                                        {/* ROLE */}
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold
                                                ${user.role === "admin"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* VERIFIED */}
                                        <td className="p-4">
                                            {user.verified ? (
                                                <span className="text-green-600 font-semibold">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="text-red-500 font-semibold">
                                                    Not Verified
                                                </span>
                                            )}
                                        </td>

                                        {/* CREATED AT */}
                                        <td className="p-4 text-gray-600">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500">
                                        No users found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetAllUsersQuery } from "../api/profileApi";

// export const AdminDashboard = () => {

//     const navigate = useNavigate();

//     const { data, isLoading, error } = useGetAllUsersQuery();

//     // SEARCH + FILTER STATES

//     const [searchTerm, setSearchTerm] = useState("");
//     const [roleFilter, setRoleFilter] = useState("all");
//     const [verificationFilter, setVerificationFilter] = useState("all");

//     // FILTER LOGIC

//     const filteredUsers = data?.data?.filter((user) => {

//         const matchesSearch =
//             user.username
//                 .toLowerCase()
//                 .includes(searchTerm.toLowerCase()) ||

//             user.email
//                 .toLowerCase()
//                 .includes(searchTerm.toLowerCase());

//         const matchesRole =
//             roleFilter === "all" ||
//             user.role === roleFilter;

//         const matchesVerification =
//             verificationFilter === "all" ||

//             (verificationFilter === "verified" &&
//                 user.verified) ||

//             (verificationFilter === "notVerified" &&
//                 !user.verified);

//         return (
//             matchesSearch &&
//             matchesRole &&
//             matchesVerification
//         );
//     });

//     // LOADING

//     if (isLoading) {
//         return (
//             <div className="p-10 text-xl font-semibold">
//                 Loading users...
//             </div>
//         );
//     }

//     // ERROR

//     if (error) {
//         return (
//             <div className="p-10 text-red-500 font-semibold">
//                 Failed to load users
//             </div>
//         );
//     }

//     return (

//         <div className="min-h-screen bg-gray-100 p-6">

//             <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">

//                 {/* HEADER */}

//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

//                     <div>

//                         <h1 className="text-3xl font-bold text-gray-800">
//                             Admin Dashboard
//                         </h1>

//                         <p className="text-gray-500 mt-1">
//                             Manage and monitor all registered users
//                         </p>

//                     </div>

//                     <div className="flex items-center gap-4">

//                         {/* TOTAL USERS */}

//                         <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">

//                             Total Users: {filteredUsers?.length || 0}

//                         </div>

//                         {/* PROFILE BUTTON */}

//                         <button
//                             onClick={() => navigate("/profile")}
//                             className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
//                         >
//                             My Profile
//                         </button>

//                     </div>

//                 </div>

//                 {/* SEARCH + FILTERS */}

//                 <div className="flex flex-col lg:flex-row gap-4 mb-6">

//                     {/* SEARCH */}

//                     <input
//                         type="text"
//                         placeholder="Search by username or email..."
//                         value={searchTerm}
//                         onChange={(e) =>
//                             setSearchTerm(e.target.value)
//                         }
//                         className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />

//                     {/* ROLE FILTER */}

//                     <select
//                         value={roleFilter}
//                         onChange={(e) =>
//                             setRoleFilter(e.target.value)
//                         }
//                         className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         <option value="all">
//                             All Roles
//                         </option>

//                         <option value="admin">
//                             Admin
//                         </option>

//                         <option value="user">
//                             User
//                         </option>

//                     </select>

//                     {/* VERIFICATION FILTER */}

//                     <select
//                         value={verificationFilter}
//                         onChange={(e) =>
//                             setVerificationFilter(e.target.value)
//                         }
//                         className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >

//                         <option value="all">
//                             All Users
//                         </option>

//                         <option value="verified">
//                             Verified
//                         </option>

//                         <option value="notVerified">
//                             Not Verified
//                         </option>

//                     </select>

//                 </div>

//                 {/* TABLE */}

//                 <div className="overflow-x-auto rounded-xl border">

//                     <table className="w-full border-collapse">

//                         {/* TABLE HEADER */}

//                         <thead>

//                             <tr className="bg-blue-600 text-white">

//                                 <th className="p-4 text-left">
//                                     Username
//                                 </th>

//                                 <th className="p-4 text-left">
//                                     Email
//                                 </th>

//                                 <th className="p-4 text-left">
//                                     Role
//                                 </th>

//                                 <th className="p-4 text-left">
//                                     Verified
//                                 </th>

//                                 <th className="p-4 text-left">
//                                     Created At
//                                 </th>

//                             </tr>

//                         </thead>

//                         {/* TABLE BODY */}

//                         <tbody>

//                             {filteredUsers?.length > 0 ? (

//                                 filteredUsers.map((user) => (

//                                     <tr
//                                         key={user._id}
//                                         className="border-b hover:bg-gray-50 transition"
//                                     >

//                                         {/* USERNAME */}

//                                         <td className="p-4 font-medium text-gray-800">
//                                             {user.username}
//                                         </td>

//                                         {/* EMAIL */}

//                                         <td className="p-4 text-gray-600">
//                                             {user.email}
//                                         </td>

//                                         {/* ROLE */}

//                                         <td className="p-4">

//                                             <span
//                                                 className={`px-3 py-1 rounded-full text-sm font-semibold
                                                
//                                                 ${user.role === "admin"
//                                                         ? "bg-red-100 text-red-700"
//                                                         : "bg-blue-100 text-blue-700"
//                                                     }`}
//                                             >
//                                                 {user.role}
//                                             </span>

//                                         </td>

//                                         {/* VERIFIED */}

//                                         <td className="p-4">

//                                             {user.verified ? (

//                                                 <span className="text-green-600 font-semibold">
//                                                     Verified
//                                                 </span>

//                                             ) : (

//                                                 <span className="text-red-500 font-semibold">
//                                                     Not Verified
//                                                 </span>

//                                             )}

//                                         </td>

//                                         {/* CREATED AT */}

//                                         <td className="p-4 text-gray-600">

//                                             {user.createdAt
//                                                 ? new Date(
//                                                     user.createdAt
//                                                 ).toLocaleDateString()
//                                                 : "N/A"}

//                                         </td>

//                                     </tr>
//                                 ))

//                             ) : (

//                                 <tr>

//                                     <td
//                                         colSpan="5"
//                                         className="text-center py-10 text-gray-500"
//                                     >
//                                         No users found
//                                     </td>

//                                 </tr>

//                             )}

//                         </tbody>

//                     </table>

//                 </div>

//             </div>

//         </div>
//     );
// };



// // import { useState } from "react";
// // import { useGetAllUsersQuery } from "../api/profileApi";

// // export const AdminDashboard = () => {

// //     const { data, isLoading, error } = useGetAllUsersQuery();

// //     // SEARCH + FILTER STATES

// //     const [searchTerm, setSearchTerm] = useState("");
// //     const [roleFilter, setRoleFilter] = useState("all");
// //     const [verificationFilter, setVerificationFilter] = useState("all");

// //     // FILTER LOGIC

// //     const filteredUsers = data?.data?.filter((user) => {

// //         const matchesSearch =
// //             user.username
// //                 .toLowerCase()
// //                 .includes(searchTerm.toLowerCase()) ||

// //             user.email
// //                 .toLowerCase()
// //                 .includes(searchTerm.toLowerCase());

// //         const matchesRole =
// //             roleFilter === "all" ||
// //             user.role === roleFilter;

// //         const matchesVerification =
// //             verificationFilter === "all" ||

// //             (verificationFilter === "verified" &&
// //                 user.verified) ||

// //             (verificationFilter === "notVerified" &&
// //                 !user.verified);

// //         return (
// //             matchesSearch &&
// //             matchesRole &&
// //             matchesVerification
// //         );
// //     });

// //     // LOADING

// //     if (isLoading) {
// //         return (
// //             <div className="p-10 text-xl font-semibold">
// //                 Loading users...
// //             </div>
// //         );
// //     }

// //     // ERROR

// //     if (error) {
// //         return (
// //             <div className="p-10 text-red-500 font-semibold">
// //                 Failed to load users
// //             </div>
// //         );
// //     }

// //     return (

// //         <div className="min-h-screen bg-gray-100 p-6">

// //             <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">

// //                 {/* HEADER */}

// //                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

// //                     <div>
// //                         <h1 className="text-3xl font-bold text-gray-800">
// //                             Admin Dashboard
// //                         </h1>

// //                         <p className="text-gray-500 mt-1">
// //                             Manage and monitor all registered users
// //                         </p>
// //                     </div>

// //                     <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
// //                         Total Users: {filteredUsers?.length || 0}
// //                     </div>

// //                 </div>

// //                 {/* SEARCH + FILTERS */}

// //                 <div className="flex flex-col lg:flex-row gap-4 mb-6">

// //                     {/* SEARCH */}

// //                     <input
// //                         type="text"
// //                         placeholder="Search by username or email..."
// //                         value={searchTerm}
// //                         onChange={(e) =>
// //                             setSearchTerm(e.target.value)
// //                         }
// //                         className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     />

// //                     {/* ROLE FILTER */}

// //                     <select
// //                         value={roleFilter}
// //                         onChange={(e) =>
// //                             setRoleFilter(e.target.value)
// //                         }
// //                         className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     >
// //                         <option value="all">
// //                             All Roles
// //                         </option>

// //                         <option value="admin">
// //                             Admin
// //                         </option>

// //                         <option value="user">
// //                             User
// //                         </option>

// //                     </select>

// //                     {/* VERIFICATION FILTER */}

// //                     <select
// //                         value={verificationFilter}
// //                         onChange={(e) =>
// //                             setVerificationFilter(e.target.value)
// //                         }
// //                         className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                     >

// //                         <option value="all">
// //                             All Users
// //                         </option>

// //                         <option value="verified">
// //                             Verified
// //                         </option>

// //                         <option value="notVerified">
// //                             Not Verified
// //                         </option>

// //                     </select>

// //                 </div>

// //                 {/* TABLE */}

// //                 <div className="overflow-x-auto rounded-xl border">

// //                     <table className="w-full border-collapse">

// //                         {/* TABLE HEADER */}

// //                         <thead>

// //                             <tr className="bg-blue-600 text-white">

// //                                 <th className="p-4 text-left">
// //                                     Username
// //                                 </th>

// //                                 <th className="p-4 text-left">
// //                                     Email
// //                                 </th>

// //                                 <th className="p-4 text-left">
// //                                     Role
// //                                 </th>

// //                                 <th className="p-4 text-left">
// //                                     Verified
// //                                 </th>

// //                                 <th className="p-4 text-left">
// //                                     Created At
// //                                 </th>

// //                             </tr>

// //                         </thead>

// //                         {/* TABLE BODY */}

// //                         <tbody>

// //                             {filteredUsers?.length > 0 ? (

// //                                 filteredUsers.map((user) => (

// //                                     <tr
// //                                         key={user._id}
// //                                         className="border-b hover:bg-gray-50 transition"
// //                                     >

// //                                         {/* USERNAME */}

// //                                         <td className="p-4 font-medium text-gray-800">
// //                                             {user.username}
// //                                         </td>

// //                                         {/* EMAIL */}

// //                                         <td className="p-4 text-gray-600">
// //                                             {user.email}
// //                                         </td>

// //                                         {/* ROLE */}

// //                                         <td className="p-4">

// //                                             <span
// //                                                 className={`px-3 py-1 rounded-full text-sm font-semibold
                                                
// //                                                 ${user.role === "admin"
// //                                                         ? "bg-red-100 text-red-700"
// //                                                         : "bg-blue-100 text-blue-700"
// //                                                     }`}
// //                                             >
// //                                                 {user.role}
// //                                             </span>

// //                                         </td>

// //                                         {/* VERIFIED */}

// //                                         <td className="p-4">

// //                                             {user.verified ? (

// //                                                 <span className="text-green-600 font-semibold">
// //                                                     Verified
// //                                                 </span>

// //                                             ) : (

// //                                                 <span className="text-red-500 font-semibold">
// //                                                     Not Verified
// //                                                 </span>

// //                                             )}

// //                                         </td>

// //                                         {/* CREATED AT */}

// //                                         <td className="p-4 text-gray-600">

// //                                             {user.createdAt
// //                                                 ? new Date(
// //                                                     user.createdAt
// //                                                 ).toLocaleDateString()
// //                                                 : "N/A"}

// //                                         </td>

// //                                     </tr>
// //                                 ))

// //                             ) : (

// //                                 <tr>

// //                                     <td
// //                                         colSpan="5"
// //                                         className="text-center py-10 text-gray-500"
// //                                     >
// //                                         No users found
// //                                     </td>

// //                                 </tr>

// //                             )}

// //                         </tbody>

// //                     </table>

// //                 </div>

// //             </div>

// //         </div>
// //     );
// // };