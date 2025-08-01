import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReclamationForm from "./ReclamationForm";

function ReclamationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { enseigne } = location.state || {};

  const handleSuccess = (newRec) => {
    // Après création, retour à la page Responsable
    navigate(`/responsable?enseigne=${enseigne}`, { state: { newRec } });
  };

  return (
    <div>
      <ReclamationForm enseigne={enseigne} onSuccess={handleSuccess} />
    </div>
  );
}
export default ReclamationPage;
