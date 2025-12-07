import { useNavigate } from "react-router-dom";

const GroceryItem = ({ grocery, onAddToCartClick }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/update-grocery/${grocery._id}`);
  };

  return (
    <div className="grocery-item">
      <h3>{grocery.name}</h3>
      <p>Quantity: {grocery.quantity}</p>
      <p>Bought: {grocery.isBought ? "Yes" : "No"}</p>
      <button onClick={() => onAddToCartClick(grocery)}>Add to Cart</button>
      <button onClick={handleEditClick}>Edit</button>
    </div>
  );
};

export default GroceryItem;