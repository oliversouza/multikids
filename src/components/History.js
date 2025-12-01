import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaChild, FaCalendarAlt, FaChartBar } from 'react-icons/fa';

function History() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('children');
    if (saved) {
      const children = JSON.parse(saved);
      const found = children.find(c => c.id === childId);
      setChild(found);
    }
  }, [childId]);

  if (!child) return <div>Carregando...</div>;

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="child-info">
          <FaChild /> {child.name} - {child.age} anos
          <button className="back-btn" onClick={() => navigate('/')}>Voltar</button>
        </div>
      </div>
      <div className="main-content">
        <h1>Histórico de Avaliações</h1>
        {child.evaluations && child.evaluations.length > 0 ? (
          <div className="evaluations-list">
            {child.evaluations.map((evaluation, index) => (
              <div key={index} className="evaluation-item">
                <div className="evaluation-header">
                  <FaCalendarAlt />
                  <span>{new Date(evaluation.date).toLocaleDateString('pt-BR')}</span>
                  <span>{evaluation.category} - {evaluation.ageRange} anos</span>
                </div>
                <p>Pontuação: {Object.values(evaluation.answers).reduce((sum, val) => sum + (val || 0), 0)} / {(Object.keys(evaluation.answers).length * 2)}</p>
                <div className="evaluation-actions">
                  <Link to={`/report/${childId}?evalIndex=${index}`}>
                    <button className="btn-outline">Ver Detalhes</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma avaliação realizada ainda.</p>
        )}
        <div className="actions">
          <Link to={`/categories/${childId}`}>
            <button className="btn-primary"><FaChartBar /> Nova Avaliação</button>
          </Link>
          <Link to="/painel">
            <button className="btn-secondary">Voltar ao Painel</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default History;