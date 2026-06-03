import React from "react";

const ProfileHeader = ({
  user,
  onLogout,
  onDeleteAccount,
  onDashboard,
  isLoggingOut,
  isDeleting,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl text-white">

      <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-6">

        {/* AVATAR */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg shrink-0">

          {user?.username
            ?.charAt(0)
            ?.toUpperCase()}

        </div>

        {/* USER INFO */}
        <div className="flex-1 text-center md:text-left w-full min-w-0">

          <h1 className="text-2xl sm:text-3xl font-bold break-words">
            {user?.username}
          </h1>

          <p className="text-blue-100 mt-1 text-sm sm:text-base break-all">
            {user?.email}
          </p>

          <div className="mt-4 flex gap-3 flex-wrap">

            <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
              {user?.role?.toUpperCase()}
            </span>

            <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
              {user?.verified
                ? "Verified User"
                : "Not Verified"}
            </span>

          </div>

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-2 sm:gap-3 w-full md:w-auto">

          {user?.role === "admin" && (
            <button
              onClick={onDashboard}
              className="w-full md:w-auto bg-white text-blue-600 px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-blue-50 transition"
            >
              Dashboard
            </button>
          )}

          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            className="w-full md:w-auto bg-white text-red-600 px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-red-50 transition disabled:opacity-50"
          >
            {isLoggingOut
              ? "Logging out..."
              : "Logout"}
          </button>

          <button
            onClick={onDeleteAccount}
            disabled={isDeleting}
            className="w-full md:w-auto bg-red-600 text-white px-5 py-3 min-h-[44px] rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : "Delete Account"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default React.memo(ProfileHeader);