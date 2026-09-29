'use client';

import { useState } from 'react';

export default function Header({ baseUrl, onSaveApi }) {
  const [apiInput, setApiInput] = useState(baseUrl);

  const handleSave = () => {
    onSaveApi(apiInput.trim());
  };

  return (
    <header>
      <div class="wrap">
        <h1>
          Billetera Cashless <span>· Festival Picnic 2026</span>
        </h1>
        <div class="api">
          <label htmlFor="api" style={{ margin: 0 }}>
            API
          </label>
          <input
            id="api"
            value={apiInput}
            onChange={(e) => setApiInput(e.target.value)}
          />
          <button className="ghost" type="button" onClick={handleSave}>
            Aplicar
          </button>
        </div>
      </div>
    </header>
  );
}