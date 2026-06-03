import React from "react";

const AccountInfo = ({ user }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-5">

      <h2 className="text-lg font-bold text-gray-800 mb-4">
        Account Information
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-xs text-gray-500">
            Username
          </p>

          <p className="text-base font-semibold text-gray-800">
            {user?.username}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Email Address
          </p>

          <p className="text-base font-semibold text-gray-800 break-all">
            {user?.email}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Role
          </p>

          <p className="text-base font-semibold text-gray-800">
            {user?.role}
          </p>
        </div>

      </div>

    </div>
  );
};

export default React.memo(AccountInfo);

