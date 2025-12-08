import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../dashboard/Header";
import NavBar from "../dashboard/NavBar";
import { fetchJSON } from "../shared/useApi";
import { useAuth } from "../shared/AuthContext";
import GroceriesPage from "../groceries/GroceriesPage";

export default function GroupPage(){
  const { id } = useParams();
  const { token } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load(){
    try {
      const g = await fetchJSON(`/groups/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      setGroup(g);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{ load(); }, [id]);

  return (
    <div className="container">
      <Header />
      <NavBar />
      <div className="card">
        {loading ? <div className="small muted">Loading group...</div> : null}
        {group && (
          <>
            <h2>{group.name}</h2>
            <p className="small muted">Members: {group.members?.map(m => m.name || m.email).join(", ")}</p>
            <hr />
            <GroceriesPage groupId={id} />
          </>
        )}
      </div>
    </div>
  );
}
