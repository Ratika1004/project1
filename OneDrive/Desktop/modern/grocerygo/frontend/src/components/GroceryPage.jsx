import { useNavigate } from "react-router-dom";
import GroceryList from "./GroceryList";

const GroceriesPage = ({ onAddToCartClick }) => {
  const navigate = useNavigate();

  return (
    <main>
      <button
        onClick={() => navigate("/add-grocery")}
        style={{ padding: "10px 16px", marginBottom: "20px", cursor: "pointer" }}
      >
        Add New Grocery
      </button>

      <GroceryList onAddToCartClick={onAddToCartClick} />
    </main>
  );
};

export default GroceriesPage;