import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import GroceryList from "./components/GroceryList";
import AddGroceryPage from "./components/AddGroceryPage";
import UpdateGroceryPage from "./components/UpdateGroceryPage";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: "20px", margin: "20px" }}>
        <Link to="/">Grocery List</Link>
        <Link to="/add">Add Grocery</Link>
      </nav>

      <Routes>
        <Route path="/" element={<GroceryList />} />
        <Route path="/add" element={<AddGroceryPage />} />
        <Route path="/update/:id" element={<UpdateGroceryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;