import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddGroceryPage = () => {
    const navigate = useNavigate();
    const [formData , setFormData] = useState({
        name : "",
        quantity : 1,
        groupId : "",
        addedBy : "",
        isBought : false,
    });

    const [isSubmitting , setIsSubmitting] = useState (false);
    const [formError , setFormError] = useState ("");

    const handleChange = (e) => {
        const {name, value , type , checked } = e.target;
        setFormData ( {...formData , [name] : type === "checkbox" ? checked : value });
        setFormError ("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting (true);

        try {
            const res = await fetch ("http://localhost:3000/groceries" , {
                method : "POST",
                headers : { "Content-Type" : "application/json" },
                body : JSON.stringify (formData),
            });

            const data = await res.json();
            if(res.ok) {
                alert ("Grocery item added successfully!");
                navigate("/");
            } else {
                setFormError (data.message || "Failed to add grocery item");
            }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setFormError ("Error submitting form");
        }

        setIsSubmitting (false);
    };

    return (
        <div>
            <h2>
                Add new grocery
            </h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Quantity</label>
                    <input type ="number" name="quantity" min={1} value={formData.quantity} onChange={handleChange} required />
                </div>
                <div>
                    <label>Group ID</label>
                    <input name="groupId" value={formData.groupId} onChange={handleChange} required />
                </div>
                <div>
                    <label>Added By</label>
                    <input name="addedBy" value={formData.addedBy} onChange={handleChange} required />
                </div>
                <div>
                    <label>Is Bought</label>
                    <input type="checkbox" name="isBought" checked={formData.isBought} onChange={handleChange} />
                </div>
                {formError && <p style={{ color: "red" }}>{formError}</p>}
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Add Grocery"}
                </button>
            </form>
        </div>
    );
};
export default AddGroceryPage;