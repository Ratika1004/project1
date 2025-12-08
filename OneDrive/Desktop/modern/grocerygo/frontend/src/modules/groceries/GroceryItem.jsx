import React, { useState, useEffect } from "react";
import { useAuth } from "../shared/AuthContext";
import { fetchJSON } from "../shared/useApi";

export default function GroceryItem({ item, onUpdated, onDeleted }) {
  const { token, user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [isBought, setIsBought] = useState(item.isBought);

  // Sync local isBought state if item prop changes
  useEffect(() => {
    setIsBought(item.isBought);
  }, [item.isBought]);

  const toggleBought = async () => {
    setUpdating(true);
    try {
      const updated = await fetchJSON(`/groceries/${item._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isBought: !isBought }),
      });

      setIsBought(updated.isBought); 
      onUpdated && onUpdated(updated); 
    } catch (err) {
      console.error("Error toggling isBought:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this item?")) return;
    setUpdating(true);
    try {
      await fetchJSON(`/groceries/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted && onDeleted(item._id);
    } catch (err) {
      console.error("Error deleting grocery:", err);
    } finally {
      setUpdating(false);
    }
  };

  const canModify =
    user?.roles?.includes("admin") || (user?.groups || []).includes(String(item.groupId));

  return (
    <div className="grocery-item card">
      <div className="grocery-meta">
        <div style={{ fontWeight: 700 }}>
          {item.name} <span className="small muted">x{item.quantity || 1}</span>
        </div>
        <div className="small muted">Added by: {item.addedByName || item.addedBy}</div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div className="small">{isBought ? "Bought " : "Pending "}</div>
        <button className="btn" onClick={toggleBought} disabled={!canModify || updating}>
          {updating ? "..." : isBought ? "Unmark" : "Mark bought"}
        </button>
        {canModify && (
          <button className="btn" style={{ background: "#e74c3c" }} onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
