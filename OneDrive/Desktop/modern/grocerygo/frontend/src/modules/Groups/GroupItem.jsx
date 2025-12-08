import React from "react";
import { Link } from "react-router-dom";

export default function GroupItem({ group }){
  return (
    <div className="group-item card">
      <div>
        <div style={{fontWeight:700}}>{group.name}</div>
        <div className="small muted">Owner: {group.owner?.name || group.owner?.email}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        <div className="small">Code: <span className="badge">{group.code}</span></div>
        <Link to={`/groups/${group._id}`} className="link"><button className="btn">Open</button></Link>
      </div>
    </div>
  );
}
