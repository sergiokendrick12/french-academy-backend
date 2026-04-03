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
  const [forgotSent, setForgotSent] = useState(false);

  const handleForgotPassword = async () => {
    const res = await fetch("/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "frenchacademyinternational@gmail.com" }),
    });
    if (res.ok) {
      setForgotSent(true);
      setTimeout(() => setForgotSent(false), 5000);
    } else {
      alert("❌ Failed to send. Try again.");
    }
  };

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
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #07111c 0%, #0d1b2a 50%, #091520 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 20px;
          position: relative;
          overflow: hidden;
        }
        .login-page::before {
          content: '';
          position: absolute;
          top: -200px; right: -200px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-page::after {
          content: '';
          position: absolute;
          bottom: -200px; left: -200px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
          pointer-events: none;
        }
        .login-wrap {
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
        }
        .login-topbar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 32px;
        }
        .login-logo {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: 2px solid #c9a84c;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: rgba(201,168,76,0.1);
          font-size: 22px;
          flex-shrink: 0;
        }
        .login-logo img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .login-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.3px;
          line-height: 1.2;
        }
        .login-brand-sub {
          font-family: 'Sora', sans-serif;
          font-size: 9px;
          color: #c9a84c;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-top: 3px;
        }
        .login-card {
          background: rgba(17, 30, 46, 0.95);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 12px;
          padding: 44px 40px;
          position: relative;
          backdrop-filter: blur(10px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.4);
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 50px; right: 50px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          border-radius: 1px;
        }
        .login-eyebrow {
          font-family: 'Sora', sans-serif;
          font-size: 9px;
          letter-spacing: 3.5px;
          color: #c9a84c;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .login-eyebrow::before {
          content: '';
          display: block;
          width: 24px; height: 1px;
          background: #c9a84c;
          flex-shrink: 0;
        }
        .login-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 700;
          color: #fff;
          line-height: 1.05;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }
        .login-subtitle {
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 32px;
          line-height: 1.6;
        }
        .login-error {
          background: rgba(220,60,60,0.08);
          border: 1px solid rgba(220,60,60,0.25);
          border-radius: 6px;
          padding: 11px 14px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: #ff8080;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .login-success {
          background: rgba(46,125,50,0.08);
          border: 1px solid rgba(46,125,50,0.25);
          border-radius: 6px;
          padding: 11px 14px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          color: #4ade80;
          margin-bottom: 20px;
        }
        .login-label {
          display: block;
          font-family: 'Sora', sans-serif;
          font-size: 9px;
          letter-spacing: 2.5px;
          color: rgba(201,168,76,0.8);
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .login-field {
          margin-bottom: 20px;
          position: relative;
        }
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 14px 16px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          color: #fff;
          outline: none;
          transition: all 0.2s;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.18); }
        .login-input:focus {
          border-color: rgba(201,168,76,0.5);
          background: rgba(201,168,76,0.03);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.06);
        }
        .login-eye {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          font-size: 16px; padding: 4px;
          transition: color 0.2s;
        }
        .login-eye:hover { color: rgba(255,255,255,0.6); }
        .login-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }
        .login-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
        }
        .login-remember input { accent-color: #c9a84c; cursor: pointer; }
        .login-forgot {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          color: #c9a84c;
          text-decoration: none;
          background: none; border: none;
          cursor: pointer;
          transition: color 0.2s;
          opacity: 0.8;
        }
        .login-forgot:hover { opacity: 1; text-decoration: underline; }
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #c9a84c, #b8943d);
          border: none;
          border-radius: 8px;
          padding: 16px;
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          color: #0d1b2a;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(201,168,76,0.2);
        }
        .login-btn:hover {
          background: linear-gradient(135deg, #dbbe6a, #c9a84c);
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(201,168,76,0.3);
        }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .login-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin: 28px 0 20px;
        }
        .login-footer {
          font-family: 'Sora', sans-serif;
          font-size: 10px;
          color: rgba(255,255,255,0.18);
          text-align: center;
          line-height: 2;
        }
        .login-footer span { color: rgba(201,168,76,0.4); }
        @media (max-width: 480px) {
          .login-card { padding: 32px 24px; }
          .login-title { font-size: 34px; }
        }
      `}</style>

      <div className="login-page">
        <div className="login-wrap">
          <div className="login-topbar">
            <div className="login-logo">
              <img src="/logo.png" alt="IFA" onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML='🇫🇷'; }} />
            </div>
            <div>
              <div className="login-brand-name">International French Academy</div>
              <div className="login-brand-sub">Kigali · Rwanda</div>
            </div>
          </div>

          <div className="login-card">
            <div className="login-eyebrow">Secure Access</div>
            <h1 className="login-title">Admin Login</h1>
            <p className="login-subtitle">Sign in to manage your academy dashboard</p>

            {error && <div className="login-error">⚠ {error}</div>}
            {forgotSent && <div className="login-success">✅ Password sent to your email!</div>}

            <form onSubmit={handleLogin}>
              <div className="login-field">
                <label className="login-label">Email Address</label>
                <input className="login-input" type="email" placeholder="admin@frenchacademy.rw" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <input className="login-input" type={showPassword ? "text" : "password"} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{paddingRight:"44px"}} required />
                <button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <div className="login-row">
                <label className="login-remember"><input type="checkbox" /> Remember me</label>
                <button type="button" className="login-forgot" onClick={handleForgotPassword}>Forgot password?</button>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In to Dashboard →"}
              </button>
            </form>

            <hr className="login-divider" />
            <div className="login-footer">
              <span>🔒</span> Authorised Personnel Only<br />
              This portal is restricted to IFA administrators.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}