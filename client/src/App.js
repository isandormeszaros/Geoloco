import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Crud from "./components/Crud";
import SearchResult from "./components/SearchResult";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/locations" element={<Crud />} />
        <Route path="/search" element={<SearchResult/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
