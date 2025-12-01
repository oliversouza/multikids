import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaChild, FaEdit, FaChartBar, FaFileAlt, FaTrash, FaHistory } from 'react-icons/fa';

function Dashboard() {
  const [children, setChildren] = useState([]);
  const [showChildForm, setShowChildForm] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [therapistName, setTherapistName] = useState('');

  useEffect(() => {
    const savedChildren = localStorage.getItem('children');
    if (savedChildren) {
      setChildren(JSON.parse(savedChildren));
    }

    const savedTherapist = localStorage.getItem('therapistName');
    if (savedTherapist) {
      setTherapistName(savedTherapist);
    }
  }, []);

  const deleteChild = (id) => {
    const updated = children.filter(c => c.id !== id);
    setChildren(updated);
    localStorage.setItem('children', JSON.stringify(updated));
  };

  const openNewChildForm = () => {
    setEditingChild(null);
    setFormName('');
    setFormAge('');
    setFormNotes('');
    setShowChildForm(true);
  };

  const openEditChildForm = (child) => {
    setEditingChild(child);
    setFormName(child.name);
    setFormAge(child.age.toString());
    setFormNotes(child.notes || '');
    setShowChildForm(true);
  };

  const saveChild = () => {
    if (!formName || !formAge) return;
    if (editingChild) {
      // Editando criança existente
      const updated = children.map(c => 
        c.id === editingChild.id 
          ? { ...c, name: formName, age: parseInt(formAge), notes: formNotes }
          : c
      );
      setChildren(updated);
      localStorage.setItem('children', JSON.stringify(updated));
    } else {
      // Nova criança
      const child = {
        id: Date.now().toString(),
        name: formName,
        age: parseInt(formAge),
        notes: formNotes,
        evaluations: []
      };
      const updated = [...children, child];
      setChildren(updated);
      localStorage.setItem('children', JSON.stringify(updated));
    }
    setShowChildForm(false);
  };

  const cancelForm = () => {
    setShowChildForm(false);
    setEditingChild(null);
  };

  const totalChildren = children.length;
  const totalEvaluations = children.reduce((sum, c) => sum + (c.evaluations ? c.evaluations.length : 0), 0);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h1>MultiKids</h1>
        <img src="/logo_multikids.png" alt="MultiKids Logo" className="sidebar-logo" />
        {therapistName && (
          <p className="therapist-greeting">Olá, {therapistName}!</p>
        )}
        <div className="stats">
          <div className="stat-card">
            <h3>Total de Crianças</h3>
            <p>{totalChildren}</p>
          </div>
          <div className="stat-card">
            <h3>Total de Avaliações</h3>
            <p>{totalEvaluations}</p>
          </div>
        </div>
        <button className="btn-primary" onClick={openNewChildForm}>
          <FaPlus /> Nova Criança
        </button>
        {showChildForm && (
          <div className="new-child-form">
            <h3>{editingChild ? 'Editar Criança' : 'Cadastrar Nova Criança'}</h3>
            <label>
              Nome:
              <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required />
            </label>
            <label>
              Idade (anos):
              <input type="number" value={formAge} onChange={(e) => setFormAge(e.target.value)} required />
            </label>
            <label>
              Observações:
              <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
            </label>
            <button onClick={saveChild}>Salvar</button>
            <button onClick={cancelForm}>Cancelar</button>
          </div>
        )}
      </div>
      <div className="main-content">
        <h2>Crianças Cadastradas</h2>
        <div className="children-grid">
          {children.length === 0 ? (
            <p>Nenhuma criança cadastrada.</p>
          ) : (
            children.map(child => (
              <div key={child.id} className="child-card">
                <div className="child-header">
                  <FaChild />
                  <span>{child.name}</span>
                </div>
                <p>{child.age} anos</p>
                <div className="child-actions">
                  <div className="action-row">
                    <button onClick={() => openEditChildForm(child)}><FaEdit /> Editar</button>
                  </div>
                  <div className="action-row">
                    <Link to={`/categories/${child.id}`}>
                      <button><FaChartBar /> Avaliar</button>
                    </Link>
                    {child.evaluations && child.evaluations.length > 0 && (
                      <>
                        <Link to={`/report/${child.id}`}>
                          <button><FaFileAlt /> Relatório</button>
                        </Link>
                        <Link to={`/history/${child.id}`}>
                          <button><FaHistory /> Histórico</button>
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="action-row">
                    <button onClick={() => deleteChild(child.id)} className="delete-btn"><FaTrash /> Excluir</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;