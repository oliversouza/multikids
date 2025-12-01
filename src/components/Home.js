import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [therapistName, setTherapistName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já tem nome salvo
    const saved = localStorage.getItem('therapistName');
    if (saved) {
      navigate('/painel');
    }
  }, [navigate]);

  const saveTherapistName = () => {
    if (therapistName.trim()) {
      localStorage.setItem('therapistName', therapistName.trim());
      navigate('/painel');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveTherapistName();
    }
  };

  return (
    <div className="home-welcome">
      <div className="welcome-content">
        <h1>MultiKids</h1>
        <img src="/logo_multikids.png" alt="MultiKids Logo" className="logo" />
        <p>Bem-vindo ao sistema de avaliação PORTAGE</p>
        <div className="therapist-form">
          <label>
            Digite seu nome como terapeuta:
            <input
              type="text"
              value={therapistName}
              onChange={(e) => setTherapistName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: Dra. Maria Silva"
              autoFocus
            />
          </label>
          <button onClick={saveTherapistName} disabled={!therapistName.trim()}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;