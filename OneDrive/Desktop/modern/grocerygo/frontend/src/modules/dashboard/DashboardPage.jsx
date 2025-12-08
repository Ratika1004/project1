import React, { useEffect, useState } from "react";
import Header from "./Header";
import NavBar from "./NavBar";
import { useAuth } from "../shared/AuthContext";
import { fetchJSON } from "../shared/useApi";
import { Link } from "react-router-dom";
import "./dashboard.style.css";

export default function DashboardPage(){
  const { user, token } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadGroups(){
    try {
      const g = await fetchJSON("/groups/my", { headers: { Authorization: `Bearer ${token}` }});
      setGroups(g || []);
    } catch (err) {
      console.error("Load groups failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ loadGroups(); }, []);

  return (
    <div className="container">
      <Header />
      <NavBar />
      <div className="card">
        <h2>Your Dashboard</h2>
        <p className="small muted">Groups you're a member of</p>
        <div style={{marginTop:12}}>
          {loading ? <div className="small muted">Loading groups...</div> : null}
          <div className="group-list">
            {groups.length === 0 && !loading ? (
              <div className="card">
                <p className="small">You are not a member of any groups yet.</p>
                <Link to="/groups" className="link"><button className="btn">Create / Join a Group</button></Link>
              </div>
            ) : groups.map(g => (
              <div className="card" key={g._id}>
                <h3 style={{margin:0}}>{g.name}</h3>
                <div className="meta small muted">
                  <div>Code: <span className="badge">{g.code}</span></div>
                  <Link to={`/groups/${g._id}`} className="link"><button className="btn">Open</button></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
