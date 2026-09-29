'use client';

import { useState } from 'react';

export default function BuscarForm({ onSearch, searchId, setSearchId }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchId) onSearch(searchId);
  };

  return (
    <form onSubmit={handleSubmit} className="row">
      <div>
        <input
          type="number"
          min="1"
          step="1"
          placeholder="ID"
          required
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>
      <button type="submit">Buscar</button>
    </form>
  );
}