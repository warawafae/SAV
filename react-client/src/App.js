import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Responsable from "./pages/Responsable";
import ReclamationPage from "./pages/ReclamationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/responsable" element={<Responsable />} />
        <Route path="/creer-reclamation" element={<ReclamationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
