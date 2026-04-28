import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await login({ email, password });
      loginUser(res.data.user, res.data.accessToken, res.data.refreshToken);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#080904] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm px-8 flex flex-col">

        {/* LOGO */}
        <div className="flex justify-center mt-16 mb-10">
          <img src="/icons/headerlogo.svg" className="w-24 h-24 rounded-2xl" />
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold leading-tight mb-8">
          Sign in to your Account
        </h1>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* FIELDS */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-[#6C7278] font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Johndoe@gmail.com"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none focus:border-[#D5FF00]/50 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#6C7278] font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none focus:border-[#D5FF00]/50 transition-colors pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="text-xs text-[#CBF009] font-semibold">
              Forgot Password ?
            </button>
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#D5FF00] text-black font-semibold text-base py-4 rounded-xl mt-6 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* OR DIVIDER */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-[#6C7278] text-xs">Or</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* SOCIAL BUTTONS */}
        <div className="space-y-3">
          <button className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm font-semibold">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EB4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <button className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm font-semibold">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <defs>
                <linearGradient id="fb" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#19AFFF"/>
                  <stop offset="100%" stopColor="#0062E0"/>
                </linearGradient>
              </defs>
              <circle cx="9" cy="9" r="9" fill="url(#fb)"/>
              <path fill="white" d="M11.5 9H9.75v6H7.5V9H6V7h1.5V5.5C7.5 4.12 8.12 3 9.75 3H11.5v2H10.25c-.41 0-.5.19-.5.5V7H11.5l-.25 2z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        {/* SIGN UP */}
        <div className="flex items-center justify-center gap-1.5 mt-8 mb-8">
          <span className="text-xs text-white">Don't have an account?</span>
          <button
            onClick={() => navigate("/signup")}
            className="text-xs text-[#D5FF00] font-semibold underline"
          >
            Sign Up
          </button>
        </div>

      </div>
    </div>
  );
}