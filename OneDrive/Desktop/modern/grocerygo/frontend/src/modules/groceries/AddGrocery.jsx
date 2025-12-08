import React, { useState } from "react";
import { useAuth } from "../shared/AuthContext";
import { fetchJSON } from "../shared/useApi";

export default function AddGrocery({ groupId, onAdded = () => {} }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const { token } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

   
    const payload = {
      name: name.trim(),
      quantity: Number(quantity),
      groupId: String(groupId),
      isBought: false, 
    };

    console.log("Sending grocery:", payload);

    try {
      const created = await fetchJSON("/groceries", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Reset form
      setName("");
      setQuantity(1);

      
      setNotice({
        type: "success",
        text: `Added "${created.name}" successfully!`,
      });

      
      onAdded(created);
    } catch (err) {
      console.error("Error adding grocery:", err);

   
      const message =
        err.payload?.message ||
        (err.payload?.errors ? err.payload.errors.map((e) => e.msg).join(", ") : null) ||
        err.message ||
        "API error";

      setNotice({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h4>Add Grocery</h4>
      {notice && (
        <div className={notice.type === "error" ? "error" : "success"}>
          {notice.text}
        </div>
      )}
      <form onSubmit={handle}>
        <input
          className="input"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          className="input"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}
