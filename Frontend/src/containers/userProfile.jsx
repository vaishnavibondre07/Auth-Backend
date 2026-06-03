import React, { useState } from "react";
import { useGetProfileQuery } from "../api/profileApi";
import { useGetUserFilesQuery } from "../api/fileApi";
import { useSessionChecker } from "../hook/useSessionChecker";
import MessageBox from "../components/MessageBox";

import ProfileHeader from "../components/profile/ProfileHeader";
import AccountInfo from "../components/profile/AccountInfo";
import PasswordRecovery from "../components/profile/PasswordRecovery";
import FileSection from "../components/profile/FileSection";
import FileViewerModal from "../components/profile/FileViewerModal";

import { useProfileActions } from "../hook/useProfileActions.js";

const UserProfile = () => {
  useSessionChecker();

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: filesData,
    isLoading: isFilesLoading,
  } = useGetUserFilesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const {
    handleLogout,
    handleDeleteAccount,
    handleFileUpload,
    handleDeleteFile,
    handleDashboardNavigation,
    isLoggingOut,
    isDeleting,
  } = useProfileActions(setMessage, data);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {message.text && (
          <MessageBox
            type={message.type}
            text={message.text}
            onClose={() => setMessage({ type: "", text: "" })}
          />
        )}

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && error?.status !== 401) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center max-w-md w-full">
          <div className="text-5xl">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Something went wrong
          </h2>

          <p className="text-gray-500 mt-2">
            Failed to fetch profile data.
          </p>

          <button
            onClick={() => refetch()}
            className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-10 px-4">

      {message.text && (
        <MessageBox
          type={message.type}
          text={message.text}
          onClose={() =>
            setMessage({
              type: "",
              text: "",
            })
          }
        />
      )}

      <div className="max-w-4xl mx-auto w-full">

        <ProfileHeader
          user={data?.data}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onDashboard={handleDashboardNavigation}
          isLoggingOut={isLoggingOut}
          isDeleting={isDeleting}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">

          <AccountInfo user={data?.data} />

          <PasswordRecovery />

        </div>

        <FileSection
          files={filesData?.files}
          loading={isFilesLoading}
          onUpload={handleFileUpload}
          onDelete={handleDeleteFile}
          onView={setSelectedFile}
        />

      </div>

      <FileViewerModal
        file={selectedFile}
        onClose={() => setSelectedFile(null)}
      />

    </div>
  );
};

export default React.memo(UserProfile);
