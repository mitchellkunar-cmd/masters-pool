"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }
      window.location.href = "/picks";
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#006747] flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-[#004d35] border-b-4 border-[#FFD700] px-6 py-6 text-center">
          <img src="/masters-logo.svg" alt="The Masters" className="h-24 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-[#FFD700]">405 Masters Pool</h1>
          <p className="text-green-200 mt-1">2026 Masters Tournament</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-gray-600 text-sm text-center">
            Enter a username and the pool password to join or view your picks.
          </p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-[#006747] focus:outline-none"
              placeholder="Choose a username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pool Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-[#006747] focus:outline-none"
              placeholder="Enter the shared password"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD700] text-[#004d35] font-bold py-3 rounded-lg text-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Enter Pool"}
          </button>
        </form>
      </div>
    </div>
  );
}
