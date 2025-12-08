import React from "react";
import { Link } from "react-router-dom";

export default function NavBar(){
  return (
    <div style={{display:"flex",gap:12,marginBottom:12}}>
      <Link to="/dashboard" className="link">Dashboard</Link>
      <Link to="/groups" className="link">My Groups</Link>
    </div>
  );
}
