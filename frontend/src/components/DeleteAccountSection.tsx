import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { deleteAccount } from "../api/authApi";
import axios from "axios";
import PasswordInput from "./PasswordInput";

const DeleteAccountSection = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter your password to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount(password);
      logout();
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Failed to delete account");
      } else {
        setError("Failed to delete account");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-red-200 p-5 sm:p-6">
        <h2 className="font-semibold text-red-700 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Deleting your account is permanent and will remove all your data,
          including incomes, expenses, budgets, and categories. This cannot be
          undone.
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
        >
          Delete My Account
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Account"
      >
        <form onSubmit={handleDelete} className="space-y-4">
          <p className="text-sm text-gray-600">
            This action is permanent. Enter your password to confirm you want to
            delete your account and all associated data.
          </p>

          {error && (
            <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={isDeleting}
            className="w-full bg-red-600 text-white py-2 rounded-md font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Permanently Delete Account"}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default DeleteAccountSection;
