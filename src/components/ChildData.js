import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChild } from 'react-icons/fa';

function ChildData() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');
  const [child, setChild] = useState(null);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem('children');
      if (saved) {
        const children = JSON.parse(saved);
        const found = children.find(c => c.id === id);
        setChild(found);
        if (found) {
          setName(found.name);
          setAge(found.age);
          setNotes(found.notes || '');
        }
      }
    }
  }, [id]);

  const saveChild = () => {
    const saved = localStorage.getItem('children') || '[]';
    const children = JSON.parse(saved);
    const newChild = {
      id: id || Date.now().toString(),
      name,
      age: parseInt(age),
      notes,
      evaluations: id ? children.find(c => c.id === id)?.evaluations || [] : []
    };
    if (id) {
      const index = children.findIndex(c => c.id === id);
      children[index] = newChild;
    } else {
      children.push(newChild);
    }
    localStorage.setItem('children', JSON.stringify(children));
    navigate('/');
  };

  return (
    <div className="dashboard">
      {id && child && (
        <div className="header">
          <FaChild /> {child.name} - {child.age} anos
        </div>
      )}
      <div className="main-content">
        <h1>{id ? 'Editar' : 'Nova'} Criança</h1>
        <form onSubmit={(e) => { e.preventDefault(); saveChild(); }}>
          <label>
            Nome:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Idade (anos):
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
          </label>
          <label>
            Observações:
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => navigate('/')}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

export default ChildData;