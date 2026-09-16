import { useState } from "react";
import api from "../services/api";

function RegisterModal({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful. Please login.");

      onClose();

    } catch (error) {
      console.error("Registration failed:", error);

      alert(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#171717]
        border border-gray-700 rounded-2xl p-8
        text-white"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-semibold">
            Create Account
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ×
          </button>

        </div>

        <form onSubmit={handleRegister}>

          {/* Name */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg
              bg-[#212121] border border-gray-600
              text-white placeholder-gray-500
              focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg
              bg-[#212121] border border-gray-600
              text-white placeholder-gray-500
              focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-lg
              bg-[#212121] border border-gray-600
              text-white placeholder-gray-500
              focus:outline-none focus:border-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg
            bg-white text-black font-medium
            hover:bg-gray-200 transition
            disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default RegisterModal;