import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateGroceryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    isBought: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch existing grocery
  useEffect(() => {
    const fetchGrocery = async () => {
      try {
        const res = await fetch(`http://localhost:3000/groceries/${id}`);
        if (!res.ok) throw new Error("Failed to fetch grocery");

        const data = await res.json();
        setFormData({
          name: data.name,
          quantity: data.quantity,
          isBought: data.isBought,
        });
      } catch (err) {
        setFormError(err.message);
      }
    };

    fetchGrocery();
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
    setFormError("");

    try {
      const res = await fetch(`http://localhost:3000/groceries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setFormError(data.errors.map(err => err.msg).join(", "));
        } else if (data.message) {
          setFormError(data.message);
        } else {
          setFormError("Something went wrong");
        }
      } else {
        alert("Grocery updated successfully!");
        navigate("/");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setFormError("Network error.");
    }

    setIsSubmitting(false);
  };

  return (
    <div>
      <h2>Update Grocery</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="isBought"
              checked={formData.isBought}
              onChange={handleChange}
            />
            Bought
          </label>
        </div>

        {formError && <p style={{ color: "red" }}>{formError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Grocery"}
        </button>
      </form>
    </div>
  );
}

export default UpdateGroceryPage;