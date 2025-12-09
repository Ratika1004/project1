import React, { useEffect, useState } from "react";
import { fetchJSON } from "../shared/useApi";
import { useAuth } from "../shared/AuthContext";
import GroceryItem from "./GroceryItem";
import AddGrocery from "./AddGrocery";
import "./groceries.style.css";

export default function GroceriesPage({ groupId }) {
  const { token } = useAuth();


  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);


  const [total, setTotal] = useState(0);

  async function load() {
    try {
      setLoading(true);

      const q = await fetchJSON(
        `/groceries?groupId=${groupId}&search=${search}&sort_by=${sortBy}&sort_order=${sortOrder}&limit=${limit}&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems(q.data || []);
      setTotal(q.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [groupId, search, sortBy, sortOrder, page]);

  const handleAdded = (newItem) => setItems((prev) => [newItem, ...prev]);
  const handleUpdated = (u) =>
    setItems((prev) => prev.map((p) => (p._id === u._id ? u : p)));
  const handleDeleted = (id) =>
    setItems((prev) => prev.filter((p) => p._id !== id));

  return (
    <div>
     
      <AddGrocery groupId={groupId} onAdded={handleAdded} />

      <div className="filters">
        <input
          placeholder="Search groceries..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); 
          }}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="name">Name</option>
          <option value="quantity">Quantity</option>
        </select>

        <button onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}>
          {sortOrder === "asc" ? "⬆ Asc" : "⬇ Desc"}
        </button>
      </div>

    
      <div style={{ marginTop: 12 }}>
        {loading ? <div className="small muted">Loading groceries...</div> : null}

        <div className="grocery-list">
          {items.map((item) => (
            <GroceryItem
              key={item._id}
              item={item}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}

          {!loading && items.length === 0 ? (
            <div className="small muted card">No groceries found.</div>
          ) : null}
        </div>
      </div>


      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {Math.ceil(total / limit) || 1}
        </span>

        <button
          disabled={page >= Math.ceil(total / limit)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
