"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Sora:wght@300;400;500;600&display=swap');
        .login-page {
          min-height: 100vh;
          background: #0d1b2a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          position: relative;
          overflow: hidden;
        }
        .login-bg-text {
          position: absolute;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(80px, 20vw, 180px);
          font-weight: 700;
          color: rgba(255,255,255,0.025);
          letter-spacing: 10px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }
        .login-topbar {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 36px;
          z-index: 1;
        }
        .login-logo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid #c9a84c;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .login-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .login-brand-name {
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.3px;
        }
        .login-brand-sub {
          font-family: 'Sora', sans-serif;
          font-size: 10px;
          color: #c9a84c;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .login-card {
          background: #111e2e;
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 4px;
          width: 100%;
          max-width: 400px;
          padding: 40px 36px;
          position: relative;
          z-index: 1;
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 40px;
          right: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
        }
        .login-eyebrow {
          font-family: 'Sora', sans-serif;
          font-size: 10px;
          letter-spacing: 3px;
          color: #c9a84c;
          text-transform: uppercase;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .login-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1px;
          background: #c9a84c;
        }
        .login-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 38px;
          font-weight: 600;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 6px;
        }
        .login-subtitle {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 30px;
        }
        .login-error {
          background: rgba(220,60,60,0.1);
          border: 1px solid rgba(220,60,60,0.3);
          border-radius: 2px;
          padding: 10px 14px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: #ff7b7b;
          margin-bottom: 18px;
        }
        .login-label {
          display: block;
          font-family: 'Sora', sans-serif;
          font-size: 10px;
          letter-spacing: 2.5px;
          color: #c9a84c;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .login-field {
          margin-bottom: 20px;
          position: relative;
        }
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
          padding: 13px 16px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          color: #fff;
          outline: none;
          transition: border-color 0.2s;
        }
        .login-input::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .login-input:focus {
          border-color: #c9a84c;
        }
        .login-eye {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          font-size: 15px;
          padding: 4px;
        }
        .login-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 26px;
        }
        .login-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
        }
        .login-remember input {
          accent-color: #c9a84c;
        }
        .login-forgot {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          color: #c9a84c;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
        }
        .login-btn {
          width: 100%;
          background: #c9a84c;
          border: none;
          border-radius: 2px;
          padding: 15px;
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          color: #0d1b2a;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
        }
        .login-btn:hover {
          background: #dbbe6a;
        }
        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .login-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 26px 0;
        }
        .login-footer {
          font-family: 'Sora', sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.22);
          text-align: center;
          line-height: 1.9;
        }
        @media (max-width: 480px) {
          .login-card { padding: 32px 24px; }
        }
      `}</style>

      <div className="login-page">
        <div className="login-bg-text">IFA</div>

        <div className="login-topbar">
          <div className="login-logo">
            <img src="/logo.png" alt="IFA Logo" onError={e => {
              e.target.style.display = 'none';
            }} />
          </div>
          <div>
            <div className="login-brand-name">International French Academy</div>
            <div className="login-brand-sub">Kigali, Rwanda</div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-eyebrow">Secure Access</div>
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">Sign in to access your dashboard</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <input
                className="login-input"
                type="email"
                placeholder="admin@frenchacademy.rw"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-label">Password</label>
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: "44px" }}
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <div className="login-row">
              <label className="login-remember">
                <input type="checkbox" /> Remember me
              </label>
              <button type="button" className="login-forgot">Forgot password?</button>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In to Dashboard"}
            </button>
          </form>

          <hr className="login-divider" />
          <div className="login-footer">
            Authorised Personnel Only<br />
            This portal is restricted to IFA administrators.
          </div>
        </div>
      </div>
    </>
  );
}