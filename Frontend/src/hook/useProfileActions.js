import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../features/authSlice";

import {
  useLogoutUserMutation,
  useDeleteAccountMutation,
} from "../api/authApi";

import {
  useUploadFileMutation,
  useDeleteFileMutation,
  fileApi,
} from "../api/fileApi";

import { profileApi } from "../api/profileApi";

export const useProfileActions = (
  setMessage,
  profileData
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutUser, { isLoading: isLoggingOut }] =
    useLogoutUserMutation();

  const [deleteAccount, { isLoading: isDeleting }] =
    useDeleteAccountMutation();

  const [uploadFile] =
    useUploadFileMutation();

  const [deleteFile] =
    useDeleteFileMutation();

  const handleLogout = useCallback(async () => {
    try {
      const res =
        await logoutUser().unwrap();

      dispatch(logout());

      dispatch(
        profileApi.util.resetApiState()
      );

      dispatch(
        fileApi.util.resetApiState()
      );

      setMessage({
        type: "success",
        text: res.message,
      });

      navigate("/login");

    } catch (error) {

      setMessage({
        type: "error",
        text:
          error?.data?.message ||
          "Logout failed",
      });
    }
  }, [
    logoutUser,
    dispatch,
    navigate,
    setMessage,
  ]);

  const handleDeleteAccount =
    useCallback(async () => {

      const confirmed =
        window.confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        );

      if (!confirmed) return;

      try {

        const res =
          await deleteAccount().unwrap();

        setMessage({
          type: "success",
          text: res.message,
        });

        setTimeout(() => {
          navigate("/");
        }, 4000);

      } catch (error) {

        setMessage({
          type: "error",
          text:
            error?.data?.message ||
            "Failed to delete account",
        });
      }

    }, [
      deleteAccount,
      navigate,
      setMessage,
    ]);

  const handleDashboardNavigation =
    useCallback(() => {

      if (
        profileData?.data?.role ===
        "admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }

    }, [
      navigate,
      profileData,
    ]);

  const handleFileUpload =
    useCallback(async (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const formData =
        new FormData();

      formData.append(
        "files",
        file
      );

      try {

        await uploadFile(
          formData
        ).unwrap();

        setMessage({
          type: "success",
          text:
            "File uploaded successfully",
        });

      } catch (error) {

        setMessage({
          type: "error",
          text:
            error?.data?.message ||
            "Upload failed",
        });
      }

    }, [
      uploadFile,
      setMessage,
    ]);

  const handleDeleteFile =
    useCallback(async (id) => {

      try {

        await deleteFile(id)
          .unwrap();

        setMessage({
          type: "success",
          text:
            "File deleted successfully",
        });

      } catch (error) {

        setMessage({
          type: "error",
          text:
            error?.data?.message ||
            "Delete failed",
        });
      }

    }, [
      deleteFile,
      setMessage,
    ]);

  return {
    handleLogout,
    handleDeleteAccount,
    handleDashboardNavigation,
    handleFileUpload,
    handleDeleteFile,

    isLoggingOut,
    isDeleting,
  };
};