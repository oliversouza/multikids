import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChild } from 'react-icons/fa';
import questions from '../data/questions';

function Evaluation() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAgeRange, setSelectedAgeRange] = useState('');
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('children');
    if (saved) {
      const children = JSON.parse(saved);
      const found = children.find(c => c.id === childId);
      setChild(found);
    }
  }, [childId]);

  const categories = [...new Set(questions.map(q => q.category))];
  const ageRanges = selectedCategory ? [...new Set(questions.filter(q => q.category === selectedCategory).map(q => q.ageRange))] : [];

  const filteredQuestions = questions.filter(q => q.category === selectedCategory && q.ageRange === selectedAgeRange);

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const markAllAnswers = (answer) => {
    const newAnswers = { ...answers };
    filteredQuestions.forEach(q => {
      newAnswers[q.id] = answer;
    });
    setAnswers(newAnswers);
  };

  const submitEvaluation = () => {
    const allAnswered = filteredQuestions.every(q => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert('Por favor, responda todas as perguntas antes de finalizar.');
      return;
    }
    // Salvar avaliação
    const saved = localStorage.getItem('children');
    const children = JSON.parse(saved);
    const index = children.findIndex(c => c.id === childId);
    const evaluation = {
      category: selectedCategory,
      ageRange: selectedAgeRange,
      answers,
      date: new Date().toISOString()
    };
    children[index].evaluations.push(evaluation);
    localStorage.setItem('children', JSON.stringify(children));
    navigate(`/report/${childId}`);
  };

  if (!child) return <div>Carregando...</div>;

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="child-info">
          <FaChild /> {child.name} - {child.age} anos
          <button className="back-btn" onClick={() => navigate('/')}>Voltar</button>
        </div>
        {selectedCategory && selectedAgeRange && (
          <div className="evaluation-actions">
            <button className="submit-btn" onClick={submitEvaluation}>Finalizar Avaliação</button>
          </div>
        )}
        <h2>Categorias</h2>
        {categories.map(cat => (
          <button
            key={cat}
            className={selectedCategory === cat ? 'active' : ''}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedAgeRange('');
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="main-content">
        {selectedCategory && (
          <>
            <h2>{selectedCategory}</h2>
            <div className="age-buttons">
              {ageRanges.map(age => (
                <button
                  key={age}
                  className={selectedAgeRange === age ? 'active' : ''}
                  onClick={() => {
                    setSelectedAgeRange(age);
                  }}
                >
                  {age} anos
                </button>
              ))}
            </div>
            {selectedAgeRange && (
              <div className="quick-fill-buttons">
                <h3>Preenchimento Rápido:</h3>
                <div className="quick-buttons">
                  <button onClick={() => markAllAnswers(2)} className="quick-btn yes">
                    Sim para Todos
                  </button>
                  <button onClick={() => markAllAnswers(1)} className="quick-btn sometimes">
                    Às Vezes para Todos
                  </button>
                  <button onClick={() => markAllAnswers(0)} className="quick-btn no">
                    Não para Todos
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {selectedAgeRange && (
          <>
            <h3>{selectedAgeRange} anos</h3>
            {filteredQuestions.map(q => {
              const questionNumber = q.id.split('-').pop();
              const answer = answers[q.id];
              let backgroundColor = '#f9f9f9';
              if (answer === 2) backgroundColor = '#d4edda';
              else if (answer === 1) backgroundColor = '#fff3cd';
              else if (answer === 0) backgroundColor = '#f8d7da';
              return (
                <div key={q.id} className="question" style={{ backgroundColor }}>
                  <p><strong>{questionNumber}.</strong> {q.question}</p>
                  <div className="options">
                    <label>
                      <input
                        type="radio"
                        name={q.id}
                        value={0}
                        checked={answer === 0}
                        onChange={() => handleAnswer(q.id, 0)}
                      /> Não
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={q.id}
                        value={1}
                        checked={answer === 1}
                        onChange={() => handleAnswer(q.id, 1)}
                      /> Às vezes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={q.id}
                        value={2}
                        checked={answer === 2}
                        onChange={() => handleAnswer(q.id, 2)}
                      /> Sim
                    </label>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default Evaluation;