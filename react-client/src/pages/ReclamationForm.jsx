import React, { useState } from 'react';

function ReclamationForm({ enseigne, onSuccess }) {
  const [form, setForm] = useState({
    produit: '',
    type: '',
    description: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`/api/reclamation/${enseigne}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    onSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="produit" placeholder="Produit" onChange={handleChange} />
      <input name="type" placeholder="Type" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
      <button type="submit">Envoyer</button>
    </form>
  );
}

export default ReclamationForm;
