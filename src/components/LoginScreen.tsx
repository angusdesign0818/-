import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (token: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save to localStorage so they stay authenticated
        localStorage.setItem("boss_auth_token", data.token);
        onLoginSuccess(data.token);
      } else {
        setError(data.error || "帳號或密碼輸入錯誤，請重試。");
      }
    } catch (err: any) {
      console.error("Login request failed:", err);
      setError("無法與伺服器連線，請確認後端服務是否正常。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center p-4 sm:p-6 select-none font-sans relative overflow-hidden" id="login-container">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800/80 rounded-2xl shadow-2xl p-8 relative z-10 flex flex-col items-center" id="login-card">
        {/* Concentric Glossy Wood & Glowing Crown Logo (Exactly matches left sidebar) */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-b from-amber-600 via-amber-800 to-amber-950 p-[3px] shadow-lg flex items-center justify-center relative overflow-hidden ring-4 ring-amber-500/10 mb-6" id="login-logo-ring">
          <div className="absolute inset-[3px] rounded-full border border-amber-500/30 opacity-40"></div>
          <div className="absolute top-0 inset-x-0 h-1/2 bg-white/10 rounded-t-full pointer-events-none"></div>
          <div className="relative flex flex-col items-center justify-center text-center">
            <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.6)]">👑</span>
            <span className="text-white text-[9.5px] font-bold tracking-widest mt-1 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)]">好老闆</span>
          </div>
        </div>

        {/* Brand System Titles */}
        <div className="text-center mb-8 shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-white font-sans">好老闆系統整合管理端</h1>
          <p className="text-xs text-neutral-400 mt-1.5 font-medium leading-relaxed">請輸入管理者帳號密碼進行安全身分驗證</p>
        </div>

        {/* Warning / Error Message Area */}
        {error && (
          <div className="w-full bg-red-950/40 border border-red-500/30 rounded-xl p-3.5 mb-6 text-xs text-red-200 flex items-start gap-2.5" id="login-error-alert">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold">驗證未通過：</span> {error}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5" id="login-form">
          <div className="flex flex-col gap-2">
            <label className="text-[10.5px] text-neutral-400 font-bold uppercase tracking-wider pl-1">
              管理者帳號 (Username)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                required
                placeholder="請輸入帳號"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-950 hover:bg-neutral-950/90 focus:bg-neutral-950 text-white pl-10 pr-4 py-3 rounded-xl border border-neutral-800 focus:border-amber-500/60 focus:outline-hidden text-sm transition-colors font-sans"
                id="login-input-username"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10.5px] text-neutral-400 font-bold uppercase tracking-wider pl-1">
              密碼 (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="請輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 hover:bg-neutral-950/90 focus:bg-neutral-950 text-white pl-10 pr-11 py-3 rounded-xl border border-neutral-800 focus:border-amber-500/60 focus:outline-hidden text-sm transition-colors font-mono"
                id="login-input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 p-1 rounded-sm focus:outline-hidden"
                id="login-toggle-visible"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-amber-900/10 cursor-pointer disabled:opacity-50 select-none flex items-center justify-center gap-2 transform active:scale-98 transition-all mt-3"
            id="login-submit-button"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4 stroke-[2.5px]" />
                <span>安全登入系統</span>
              </>
            )}
          </button>
        </form>

        {/* Tips footer inside the card to keep the page completely clean */}
        <div className="w-full bg-neutral-950/40 border border-neutral-800/50 p-4 rounded-xl text-[11px] text-neutral-500 leading-normal mt-8 text-left" id="login-hints">
          <span className="font-bold text-neutral-300 block mb-1">💡 首次登錄或部署提示：</span>
          <p className="mb-1.5">
            1. 本系統預設的安全登入資訊為（帳號：<code className="bg-neutral-900 text-amber-500 font-mono px-1 rounded">boss</code>，密碼：<code className="bg-neutral-900 text-amber-500 font-mono px-1 rounded">boss1234</code>）。
          </p>
          <p>
            2. 正式部署時，您可以在雲端控制台（或右上角 Settings ⚙️ Secrets 中）設定 <code className="text-amber-500 font-mono">ADMIN_USERNAME</code> 與 <code className="text-amber-500 font-mono">ADMIN_PASSWORD</code> 環境變數，即可客製化您的登入認證資訊。
          </p>
        </div>
      </div>

      {/* Decorative footer credits */}
      <div className="absolute bottom-4 text-center text-[10px] text-neutral-600 font-sans" id="login-footer">
        好老闆・一站式雲端社群管理與資訊整合系統 © 2026
      </div>
    </div>
  );
}
