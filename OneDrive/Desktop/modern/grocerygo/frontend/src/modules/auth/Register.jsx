import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/AuthContext";
import "./auth.style.css";

export default function Register(){
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [notice,setNotice] = useState(null);
  const [loading,setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setNotice(null);
    try {
      await auth.register({ name, email, password, roles: ["customer"] });
      setNotice({ type: "success", text: "Account created. Please login."});
      setTimeout(()=> navigate("/login"), 1000);
    } catch (err) {
      const msg = err.payload?.errorMessage || err.payload?.message || err.message;
      setNotice({ type: "error", text: msg });
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h2 className="header">Create account</h2>
        {notice && <div className={notice.type === "error" ? "error" : "success"}>{notice.text}</div>}
        <form onSubmit={handleSubmit}>
          <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          <div className="auth-cta">
            <button className="btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
            <Link to="/login" className="small">Already have account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
