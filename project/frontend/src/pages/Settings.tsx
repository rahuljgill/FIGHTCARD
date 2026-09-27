import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import axios from "axios";

import binIcon from "../assets/bin.svg";
import lockIcon from "../assets/lock.svg";

import api from "../api/client";
import { useCurrentUser } from "../api/useCurrentUser";

function Settings() {
  const { data: user, isLoading } = useCurrentUser();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleChangePassword = async () => {
    try {
      setPasswordLoading(true);
      setPasswordError("");
      setPasswordSuccess("");

      await api.patch("/api/auth/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setPasswordSuccess("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      console.error("Password change failed:", error);

      if (axios.isAxiosError(error)) {
        setPasswordError(
          error.response?.data?.message ||
            "Failed to change password. Please try again.",
        );
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError("");

      await api.delete("/api/auth/delete");

      // Tell React Query that the user is no longer logged in.
      queryClient.setQueryData(["user"], null);

      // Close the modal.
      setDeleteModalOpen(false);

      // Send the user back to the home page.
      navigate("/");
    } catch (error) {
      console.error("Account deletion failed:", error);
      setDeleteError("Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-6 pt-32">
        <div className="mx-auto max-w-5xl font-body text-text">
          Loading account details...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-16">
      <div className="mx-auto max-w-5xl">
        {/* Settings container */}
        <div className="border border-purple bg-background px-6 py-8 md:px-8">
          {/* Header */}
          <div className="border-b border-purple/70 pb-5">
            <h1 className="font-heading text-3xl uppercase tracking-widest text-purple">
              Account Details
            </h1>

            <p className="mt-2 font-body text-sm text-text">
              View your account information.
            </p>
          </div>

          {/* Account information */}
          <div className="space-y-6 py-8">
            {/* Username */}
            <div>
              <label className="font-heading text-sm uppercase tracking-widest text-purple">
                Username
              </label>

              <div className="mt-2 border border-purple/70 px-4 py-4 font-body text-base text-text">
                {user?.name}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-heading text-sm uppercase tracking-widest text-purple">
                Email
              </label>

              <div className="mt-2 border border-purple/70 px-4 py-4 font-body text-base text-text">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Change password section */}
          <div className="border-t border-purple/70 pt-6">
            <div className="border border-purple/70 px-5 py-5">
              {/* Change password header */}
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-start gap-4">
                  <img
                    src={lockIcon}
                    alt=""
                    className="mt-2 h-9 w-9 translate-y-3 md:translate-y-0"
                  />

                  <div>
                    <h2 className="font-heading text-lg uppercase tracking-widest text-purple">
                      Change Password
                    </h2>

                    <p className="mt-1 font-body text-sm text-text">
                      Update your account password.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(!changePasswordOpen)}
                  className="border border-purple px-5 py-3 font-body text-sm uppercase tracking-widest text-purple transition-colors hover:bg-purple/10"
                >
                  {changePasswordOpen ? "Hide" : "Change Password"}
                </button>
              </div>

              {/* Change password form */}
              {changePasswordOpen && (
                <div className="mt-6 border-t border-purple/40 pt-6">
                  <div className="space-y-5">
                    {/* Current password */}
                    <div>
                      <label className="font-heading text-sm uppercase tracking-widest text-purple">
                        Current Password
                      </label>

                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setPasswordError("");
                          setPasswordSuccess("");
                        }}
                        className="mt-2 w-full border border-purple/70 bg-transparent px-4 py-4 font-body text-base text-text outline-none transition-colors focus:border-purple"
                      />
                    </div>

                    {/* New password */}
                    <div>
                      <label className="font-heading text-sm uppercase tracking-widest text-purple">
                        New Password
                      </label>

                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordError("");
                          setPasswordSuccess("");
                        }}
                        className="mt-2 w-full border border-purple/70 bg-transparent px-4 py-4 font-body text-base text-text outline-none transition-colors focus:border-purple"
                      />
                    </div>

                    {/* Confirm new password */}
                    <div>
                      <label className="font-heading text-sm uppercase tracking-widest text-purple">
                        Confirm New Password
                      </label>

                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError("");
                          setPasswordSuccess("");
                        }}
                        className="mt-2 w-full border border-purple/70 bg-transparent px-4 py-4 font-body text-base text-text outline-none transition-colors focus:border-purple"
                      />
                    </div>

                    {/* API error */}
                    {passwordError && (
                      <p className="font-body text-sm text-red-400">
                        {passwordError}
                      </p>
                    )}

                    {/* API success */}
                    {passwordSuccess && (
                      <p className="font-body text-sm text-green-400">
                        {passwordSuccess}
                      </p>
                    )}

                    {/* Submit */}
                    <div className="flex justify-center  md:justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="border border-purple px-6 py-3 font-body text-sm uppercase tracking-widest text-purple transition-colors hover:bg-purple/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {passwordLoading ? "Changing..." : "Change Password"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Delete account section */}
          <div className="mt-6 border-t border-purple/70 pt-6">
            <div className="flex flex-col justify-between gap-5 border border-red-500/80 px-5 py-5 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <img
                  src={binIcon}
                  alt=""
                  className="mt-2 h-9 w-9 translate-y-5.5 md:translate-y-0"
                />

                <div>
                  <h2 className="font-heading text-lg uppercase tracking-widest text-red-400">
                    Delete Account
                  </h2>

                  <p className="mt-1 font-body text-sm text-text">
                    Permanently delete your account and all associated data.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeleteError("");
                  setDeleteModalOpen(true);
                }}
                disabled={deleteLoading}
                className="border border-red-500 px-6 py-3 font-body text-sm uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-md border border-red-500 bg-background p-6">
            <h2 className="font-heading text-xl uppercase tracking-widest text-red-400">
              Delete Account?
            </h2>

            <p className="mt-3 font-body text-sm leading-6 text-text">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>

            {deleteError && (
              <p className="mt-3 font-body text-sm text-red-400">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteLoading}
                className="border border-purple/40 px-5 py-2 font-body text-sm uppercase tracking-widest text-text transition-colors hover:border-purple hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="border border-red-500 bg-red-500/10 px-5 py-2 font-body text-sm uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Settings;
