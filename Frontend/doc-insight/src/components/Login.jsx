import { useState } from "react";
import RegisterModal from "./RegisterModal";
import api from "../services/api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store authentication information
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Tell App that login was successful
      onLogin(user);

    } catch (error) {
      console.error("Login failed:", error);

      alert(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full max-w-md px-8">

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">
              DocInsight
            </h1>

            <p className="text-gray-400">
              Chat with your documents
            </p>
          </div>

          <div className="bg-[#171717] border border-gray-700 rounded-2xl p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Login
            </h2>

            <form onSubmit={handleLogin}>

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
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg
                  bg-[#212121] border border-gray-600
                  text-white placeholder-gray-500
                  focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg
                bg-white text-black font-medium
                hover:bg-gray-200 transition
                disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

            </form>

            {/* Register */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                New to DocInsight?
              </p>

              <button
                onClick={() => setShowRegister(true)}
                className="mt-2 text-white hover:underline text-sm"
              >
                Create an account
              </button>
            </div>

          </div>
        </div>
      </div>

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
        />
      )}
    </>
  );
}

export default Login;