import React, { useState } from "react";
import { fetchJSON } from "../shared/useApi";
import { useAuth } from "../shared/AuthContext";

export default function CreateGroup({ onCreated = () => {} }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const { token } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    try {
      
      const group = await fetchJSON("/groups", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      setName("");
      setNotice({ type: "success", text: `Group "${group.name}" created successfully!` });
      onCreated();
    } catch (err) {
      console.error("Error creating group:", err);
      setNotice({
        type: "error",
        text: err.payload?.errorMessage || err.message || "API error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <h4>Create Group</h4>
      {notice && (
        <div className={notice.type === "error" ? "error" : "success"}>
          {notice.text}
        </div>
      )}
      <form onSubmit={handle}>
        <input
          className="input"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
