import React, { useEffect, useState } from "react";
import { fetchJSON } from "../shared/useApi";
import { useAuth } from "../shared/AuthContext";
import GroceryItem from "./GroceryItem";
import AddGrocery from "./AddGrocery";
import "./groceries.style.css";

export default function GroceriesPage({ groupId }){
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(){
    try {
      const q = await fetchJSON(`/groceries?groupId=${groupId}`, { headers: { Authorization: `Bearer ${token}` }});
      setItems(q.data || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); }, [groupId]);

  const handleAdded = (newItem) => setItems(prev => [newItem, ...prev]);
  const handleUpdated = (u) => setItems(prev => prev.map(p => p._id === u._id ? u : p));
  const handleDeleted = (id) => setItems(prev => prev.filter(p => p._id !== id));

  return (
    <div>
      <AddGrocery groupId={groupId} onAdded={handleAdded} />
      <div style={{marginTop:12}}>
        {loading ? <div className="small muted">Loading groceries...</div> : null}
        <div className="grocery-list">
          {items.map(item => (
            <GroceryItem key={item._id} item={item} onUpdated={handleUpdated} onDeleted={handleDeleted} />
          ))}
          { (!items || items.length === 0) && !loading ? <div className="small muted card">No groceries yet for this group.</div> : null }
        </div>
      </div>
    </div>
  );
}
