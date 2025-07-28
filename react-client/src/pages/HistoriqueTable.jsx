import React from 'react';

function HistoriqueTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Produit</th>
          <th>Type</th>
          <th>Description</th>
          <th>Technicien</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((rec, i) => (
          <tr key={i}>
            <td>{rec.produit}</td>
            <td>{rec.type}</td>
            <td>{rec.description}</td>
            <td>{rec.technicien}</td>
            <td>{rec.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default HistoriqueTable;