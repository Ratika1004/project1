import React from "react";
import { useAuth } from "../shared/AuthContext";

export default function Header(){
  const { user, logout } = useAuth();
  return (
    <div className="navbar">
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <h3 style={{margin:0}}>GroceryGo</h3>
        <div className="small muted">shared lists with roommates</div>
      </div>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <div className="small">Hi, <strong>{user?.name || user?.email}</strong></div>
        <button className="btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
