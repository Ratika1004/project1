import React, { useEffect, useState } from "react";
import Header from "../dashboard/Header";
import NavBar from "../dashboard/NavBar";
import { useAuth } from "../shared/AuthContext";
import { fetchJSON } from "../shared/useApi";
import GroupItem from "./GroupItem";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import "./groups.style.css";

export default function GroupsPage(){
  const { token } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(){
    try {
      const g = await fetchJSON("/groups/my", { headers: { Authorization: `Bearer ${token}` }});
      setGroups(g || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div className="container">
      <Header />
      <NavBar />
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px", gap:12}}>
        <div className="card">
          <h3>My Groups</h3>
          {loading ? <div className="small muted">Loading...</div> : null}
          {groups.length === 0 && !loading ? <div className="small muted">You haven't joined any groups yet.</div> : null}
          <div style={{marginTop:12,display:"grid",gap:8}}>
            {groups.map(g => <GroupItem key={g._id} group={g} />)}
          </div>
        </div>

        <div>
          <CreateGroup onCreated={load} />
          <JoinGroup onJoined={load} />
        </div>
      </div>
    </div>
  );
}
