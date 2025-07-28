import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Responsable from "./pages/Responsable";
import ReclamationForm from "./pages/ReclamationForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirige la racine vers /responsable */}
        <Route path="/" element={<Responsable />} />
        <Route path="/responsable" element={<Responsable />} />
        <Route path="/reclamation-form" element={<ReclamationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
