import React, { useState } from "react";
import { fetchJSON } from "../shared/useApi";
import { useAuth } from "../shared/AuthContext";

export default function JoinGroup({ onJoined = () => {} }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const { token } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotice(null);

    try {
      const response = await fetchJSON("/groups/join", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ code }),
      });

      setCode("");
      setNotice({ type: "success", text: `Joined group "${response.group.name}" successfully!` });
      onJoined();
    } catch (err) {
      console.error("Error joining group:", err);
      setNotice({
        type: "error",
        text: err.payload?.errorMessage || err.message || "API error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h4>Join Group</h4>
      {notice && (
        <div className={notice.type === "error" ? "error" : "success"}>
          {notice.text}
        </div>
      )}
      <form onSubmit={handle}>
        <input
          className="input"
          placeholder="Enter group code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Joining..." : "Join"}
        </button>
      </form>
    </div>
  );
}
