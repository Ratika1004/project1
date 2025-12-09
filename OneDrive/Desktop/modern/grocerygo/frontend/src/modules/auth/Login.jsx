import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/AuthContext";
import "./auth.style.css";

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);
    setLoading(true);
    try {
      await auth.loginSendOtp({ email, password });
      // backend sends OTP email; now route to verify screen. Save the email in temp storage
      sessionStorage.setItem("grocerygo_pending_email", email.trim().toLowerCase());
      navigate("/verify-otp");
    } catch (err) {
      setNotice({ type: "error", text: err.payload?.errorMessage || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="header">Grocery GO  </h1>
        <h2 className="header">Login  </h2>
        {notice && <div className={notice.type === "error" ? "error" : "success"}>{notice.text}</div>}
        <form onSubmit={handleSubmit}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
            <button className="btn" type="submit" disabled={loading}>{loading? "Sending OTP..." : "Send OTP"}</button>
            <Link to="/register" className="small">Create account</Link>
          </div>
        </form>
      </div>
      <p className="center small muted" style={{marginTop:12}}></p>
    </div>
  );
}
