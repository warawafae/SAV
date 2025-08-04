// ContactForm.jsx
import { useState } from 'react';
import axios from 'axios';

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/email/send', formData);
      alert(response.data.message);
    } catch (error) {
      alert('Erreur lors de l’envoi.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nom" onChange={handleChange} required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <textarea name="message" placeholder="Message" onChange={handleChange} required />
      <button type="submit">Envoyer</button>
    </form>
  );
}

export default ContactForm;
