import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../shared/AuthContext";
import "./auth.style.css";

export default function VerifyOtp(){
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const pending = sessionStorage.getItem("grocerygo_pending_email");
    if (!pending) {
      navigate("/login");
    } else {
      setEmail(pending);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(null);
    setLoading(true);
    try {
      const data = await auth.verifyOtp({ email, otp });
      // success => auth context now has token + user
      sessionStorage.removeItem("grocerygo_pending_email");
      navigate("/dashboard");
    } catch (err) {
      setNotice({ type: "error", text: err.payload?.errorMessage || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 className="header">Verify OTP</h2>
        <p className="small muted">An OTP was sent to <strong>{email}</strong></p>
        {notice && <div className={notice.type === "error" ? "error" : "success"}>{notice.text}</div>}

        <form onSubmit={handleSubmit}>
          <input className="input" placeholder="6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} required />
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <button className="btn" type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify & Login"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
