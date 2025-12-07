import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function GroceryList() {
  const navigate = useNavigate();

  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [totalCount, setTotalCount] = useState(0);


  const fetchGroceries = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/groceries?search=${search}&page=${page}&limit=${limit}&sort_by=${sortBy}&sort_order=${sortOrder}`
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setGroceries(data.data || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      setError(err.message || "Failed to load groceries");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const delay = setTimeout(() => {
      fetchGroceries();
    }, 400);

    return () => clearTimeout(delay);
  }, [search, page, sortBy, sortOrder]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this grocery?")) return;

    try {
      const res = await fetch(`http://localhost:3000/groceries/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete grocery");

      setGroceries((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Grocery List</h2>


      <input
        type="text"
        placeholder="Search groceries..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        style={{
          padding: "6px",
          marginBottom: "15px",
          width: "200px",
        }}
      />

      
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{ marginLeft: "10px" }}
      >
        <option value="createdAt">Sort by Date</option>
        <option value="name">Sort by Name</option>
        <option value="quantity">Sort by Quantity</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        style={{ marginLeft: "10px" }}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

  
      {groceries.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid gray",
            marginTop: "10px",
            padding: "10px",
            borderRadius: "5px"
          }}
        >
          <p><b>Name:</b> {item.name}</p>
          <p><b>Quantity:</b> {item.quantity}</p>
          <p><b>Bought:</b> {item.isBought ? "Yes" : "No"}</p>

          <button
            onClick={() => navigate(`/update/${item._id}`)}
            style={{ marginRight: "10px" }}
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(item._id)}
            style={{ background: "red", color: "white" }}
          >
            Delete
          </button>
        </div>
      ))}

    
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default GroceryList;