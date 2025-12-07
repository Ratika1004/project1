import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditGroceryPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    quantity: 1,
    groupId: "",
    addedBy: "",
    isBought: false,
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch grocery data for editing
  useEffect(() => {
    const fetchGrocery = async () => {
      try {
        const res = await fetch(`http://localhost:3000/groceries/${id}`);
        const data = await res.json();

        if (res.ok) {
          setFormData({
            name: data.data.name,
            quantity: data.data.quantity,
            groupId: data.data.groupId,
            addedBy: data.data.addedBy,
            isBought: data.data.isBought,
          });
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setFormError("Failed to load grocery");
      }
    };

    const fetchUsersAndGroups = async () => {
      try {
        const u = await fetch("http://localhost:3000/users");
        const g = await fetch("http://localhost:3000/groups");

        setUsers(await u.json());
        setGroups(await g.json());
      } catch {
        setFormError("Failed to load user/group data");
      }
    };

    fetchGrocery();
    fetchUsersAndGroups();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`http://localhost:3000/groceries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Grocery updated successfully!");
        navigate("/");
      } else {
        setFormError("Update failed");
      }
    } catch {
      setFormError("Network error");
    }

    setIsSubmitting(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Grocery</h2>

      <form onSubmit={handleSubmit}>
        
        <div>
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min={1}
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

       
        <div>
          <label>Added By (User)</label>
          <select name="addedBy" value={formData.addedBy} onChange={handleChange} required>
            <option value="">Select User</option>
            {users.data?.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

      
        <div>
          <label>Group</label>
          <select name="groupId" value={formData.groupId} onChange={handleChange} required>
            <option value="">Select Group</option>
            {groups.data?.map((g) => (
              <option key={g._id} value={g._id}>
                {g.groupName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Bought?</label>
          <input
            type="checkbox"
            name="isBought"
            checked={formData.isBought}
            onChange={handleChange}
          />
        </div>

        {formError && <p style={{ color: "red" }}>{formError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Grocery"}
        </button>
      </form>
    </div>
  );
};

export default EditGroceryPage;