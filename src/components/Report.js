import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, ArcElement } from 'chart.js';
import { FaChild, FaFileAlt, FaChartBar, FaTrophy, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import questions from '../data/questions';
import { getIdealScore, classifyPerformance } from '../data/portageStandards';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  RadialLinearScale, PointElement, LineElement, ArcElement
);

function Report() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [reportType, setReportType] = useState('overview'); // 'overview', 'progress', 'detailed', 'goals'

  useEffect(() => {
    const saved = localStorage.getItem('children');
    if (saved) {
      const children = JSON.parse(saved);
      const found = children.find(c => c.id === childId);
      setChild(found);

      if (found && found.evaluations) {
        setAllEvaluations(found.evaluations);
      }
    }
  }, [childId]);

  if (!child) return <div>Carregando...</div>;

  // Calcular dados de todas as categorias
  const categories = [...new Set(questions.map(q => q.category))];

  const categoryData = categories.map(category => {
    const categoryEvaluations = allEvaluations.filter(e => e.category === category);
    if (categoryEvaluations.length === 0) return null;

    // Usar a avaliação mais recente para esta categoria
    const latestEval = categoryEvaluations[categoryEvaluations.length - 1];
    const filteredQuestions = questions.filter(q => q.category === category && q.ageRange === latestEval.ageRange);
    const totalScore = Object.values(latestEval.answers).reduce((sum, val) => sum + (val || 0), 0);
    const maxScore = filteredQuestions.length * 2;
    const percentage = ((totalScore / maxScore) * 100);

    const idealScore = getIdealScore(category, latestEval.ageRange);
    const performance = classifyPerformance(percentage, idealScore);

    return {
      category,
      percentage: percentage.toFixed(1),
      idealScore,
      performance,
      ageRange: latestEval.ageRange
    };
  }).filter(Boolean);

  // Verificar se há dados suficientes para gerar gráficos
  const hasData = categoryData.length > 0;

  // Dados para gráficos (sempre inicializar com objetos vazios)
  const barChartData = hasData ? {
    labels: categoryData.map(d => d.category),
    datasets: [
      {
        label: `${child.name} (%)`,
        data: categoryData.map(d => parseFloat(d.percentage)),
        backgroundColor: categoryData.map(d => d.performance.color),
        borderColor: categoryData.map(d => d.performance.color),
        borderWidth: 1,
      },
      {
        label: 'Ideal PORTAGE (%)',
        data: categoryData.map(d => d.idealScore),
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      }
    ],
  } : { labels: [], datasets: [] };

  const radarChartData = hasData ? {
    labels: categoryData.map(d => d.category),
    datasets: [
      {
        label: `${child.name}`,
        data: categoryData.map(d => parseFloat(d.percentage)),
        borderColor: 'rgba(155, 89, 182, 1)',
        backgroundColor: 'rgba(155, 89, 182, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: categoryData.map(d => d.performance.color),
        pointBorderColor: categoryData.map(d => d.performance.color),
        pointBorderWidth: 2,
        pointRadius: 6,
      },
      {
        label: 'Ideal PORTAGE',
        data: categoryData.map(d => d.idealScore),
        borderColor: 'rgba(52, 152, 219, 1)',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(52, 152, 219, 1)',
        pointBorderColor: 'rgba(52, 152, 219, 1)',
        pointBorderWidth: 2,
        pointRadius: 4,
      }
    ],
  } : { labels: [], datasets: [] };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Relatório PORTAGE - ${child.name}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Idade: ${child.age} anos | Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);

    let y = 50;
    categoryData.forEach(cat => {
      doc.setFontSize(14);
      doc.text(`${cat.category} (${cat.ageRange} anos)`, 20, y);
      doc.setFontSize(12);
      doc.text(`Pontuação: ${cat.percentage}% | Ideal: ${cat.idealScore}% | Status: ${cat.performance.level}`, 30, y + 10);
      y += 25;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`relatorio-${child.name}.pdf`);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="child-info">
          <FaChild /> {child.name} - {child.age} anos
          <button className="back-btn" onClick={() => navigate('/painel')}>Voltar</button>
        </div>
      </div>
      <div className="main-content">
        <div className="report-header">
          <h1>Relatório de Desenvolvimento PORTAGE</h1>
          <div className="child-summary">
            <div className="summary-item">
              <FaChild />
              <span><strong>{child.name}</strong> - {child.age} anos</span>
            </div>
            <div className="summary-item">
              <FaChartBar />
              <span>{allEvaluations.length} avaliações realizadas</span>
            </div>
            <div className="summary-item">
              <FaTrophy />
              <span>Avaliação completa do desenvolvimento</span>
            </div>
          </div>
        </div>

        <div className="report-navigation">
          <button 
            className={reportType === 'overview' ? 'active' : ''} 
            onClick={() => setReportType('overview')}
          >
            Visão Geral
          </button>
          <button 
            className={reportType === 'progress' ? 'active' : ''} 
            onClick={() => setReportType('progress')}
          >
            Progresso
          </button>
          <button 
            className={reportType === 'detailed' ? 'active' : ''} 
            onClick={() => setReportType('detailed')}
          >
            Detalhado
          </button>
          <button 
            className={reportType === 'goals' ? 'active' : ''} 
            onClick={() => setReportType('goals')}
          >
            Metas
          </button>
        </div>

        {reportType === 'overview' && (
          <>
            <div className="performance-overview">
              <h2>Visão Geral do Desempenho</h2>
              <div className="performance-cards">
                {categoryData.map(cat => (
                  <div key={cat.category} className="performance-card" style={{ borderLeftColor: cat.performance.color }}>
                    <h3>{cat.category}</h3>
                    <div className="score-display">
                      <span className="actual-score">{cat.percentage}%</span>
                      <span className="ideal-score">/ {cat.idealScore}%</span>
                    </div>
                    <div className="performance-indicator" style={{ backgroundColor: cat.performance.color }}>
                      {cat.performance.level === 'Adequado' && <FaCheckCircle />}
                      {cat.performance.level === 'Atenção' && <FaExclamationTriangle />}
                      {cat.performance.level === 'Intervenção' && <FaExclamationTriangle />}
                      <span>{cat.performance.level}</span>
                    </div>
                    <p className="performance-desc">{cat.performance.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="charts-section">
              <h2>Análise Comparativa</h2>
              {hasData && barChartData.labels.length > 0 && radarChartData.labels.length > 0 ? (
                <div className="charts-grid">
                  <div className="chart-container main-chart">
                    <h3>Comparação por Categoria</h3>
                    <Bar
                      key={`bar-${childId}-${allEvaluations.length}`}
                      data={barChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: true, text: 'Desempenho vs Padrão PORTAGE' }
                        },
                        scales: {
                          y: { beginAtZero: true, max: 100 }
                        }
                      }}
                    />
                  </div>

                  <div className="chart-container main-chart">
                    <h3>Perfil de Desenvolvimento</h3>
                    <Line
                      key={`line-${childId}-${allEvaluations.length}`}
                      data={radarChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' }
                        },
                        scales: {
                          y: { beginAtZero: true, max: 100 },
                          x: { 
                            grid: { display: false },
                            ticks: { maxRotation: 45, minRotation: 45 }
                          }
                        },
                        interaction: {
                          intersect: false,
                          mode: 'index'
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="no-data-message">
                  <p>Realize algumas avaliações para visualizar os gráficos comparativos.</p>
                  <Link to={`/categories/${childId}`}>
                    <button className="btn-primary">Iniciar Avaliação</button>
                  </Link>
                </div>
              )}
            </div>

            <div className="recommendations">
              <h2>Recomendações</h2>
              <div className="recommendation-cards">
                {categoryData.filter(cat => cat.performance.level !== 'Adequado').map(cat => (
                  <div key={cat.category} className="recommendation-card">
                    <h4>{cat.category}</h4>
                    <p>Área que pode precisar de atenção especial no desenvolvimento da criança.</p>
                    <span className="priority" style={{ backgroundColor: cat.performance.color }}>
                      {cat.performance.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {reportType === 'progress' && (
          <div className="progress-report">
            <h2>Relatório de Progresso</h2>
            <p>Análise da evolução do desenvolvimento ao longo do tempo.</p>
            <div className="progress-content">
              <div className="progress-stats">
                <div className="stat-card">
                  <h3>Total de Avaliações</h3>
                  <span className="stat-number">{allEvaluations.length}</span>
                </div>
                <div className="stat-card">
                  <h3>Categorias Avaliadas</h3>
                  <span className="stat-number">{categoryData.length}</span>
                </div>
                <div className="stat-card">
                  <h3>Média Geral</h3>
                  <span className="stat-number">
                    {categoryData.length > 0 
                      ? Math.round(categoryData.reduce((sum, cat) => sum + parseFloat(cat.percentage), 0) / categoryData.length)
                      : 0}%
                  </span>
                </div>
              </div>
              <div className="progress-timeline">
                <h3>Linha do Tempo das Avaliações</h3>
                {allEvaluations.length > 0 ? (
                  <div className="timeline">
                    {allEvaluations.slice(-5).map((evaluation, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-date">
                          {new Date(evaluation.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="timeline-content">
                          <strong>{evaluation.category}</strong> - {evaluation.ageRange} anos
                          <div className="timeline-score">
                            Pontuação: {Object.values(evaluation.answers).reduce((sum, val) => sum + (val || 0), 0)} / {(Object.keys(evaluation.answers).length * 2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Nenhuma avaliação realizada ainda.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {reportType === 'detailed' && (
          <div className="detailed-report">
            <h2>Relatório Detalhado por Categoria</h2>
            <p>Análise aprofundada de cada área de desenvolvimento.</p>
            <div className="detailed-categories">
              {categoryData.map(cat => (
                <div key={cat.category} className="category-detail">
                  <div className="category-header">
                    <h3>{cat.category}</h3>
                    <div className="category-score">
                      <span className="score">{cat.percentage}%</span>
                      <span className="ideal">Ideal: {cat.idealScore}%</span>
                    </div>
                  </div>
                  <div className="category-analysis">
                    <div className="performance-badge" style={{ backgroundColor: cat.performance.color }}>
                      {cat.performance.level}
                    </div>
                    <p className="analysis-text">{cat.performance.description}</p>
                    <div className="recommendations-list">
                      <h4>Recomendações Específicas:</h4>
                      <ul>
                        <li>Continuar monitorando o desenvolvimento nesta área</li>
                        <li>Realizar atividades lúdicas para estimular o aprendizado</li>
                        <li>Buscar orientação profissional se necessário</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === 'goals' && (
          <div className="goals-report">
            <h2>Metas e Plano de Desenvolvimento</h2>
            <p>Objetivos personalizados baseados na avaliação PORTAGE.</p>
            <div className="goals-content">
              <div className="current-goals">
                <h3>Metas Atuais</h3>
                {categoryData.filter(cat => cat.performance.level !== 'Adequado').map(cat => (
                  <div key={cat.category} className="goal-item">
                    <div className="goal-header">
                      <h4>{cat.category}</h4>
                      <span className="goal-priority" style={{ backgroundColor: cat.performance.color }}>
                        {cat.performance.level}
                      </span>
                    </div>
                    <div className="goal-target">
                      <p>Meta: Alcançar {Math.min(cat.idealScore, parseFloat(cat.percentage) + 15)}% nos próximos 3 meses</p>
                      <div className="goal-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${(parseFloat(cat.percentage) / cat.idealScore) * 100}%`,
                              backgroundColor: cat.performance.color 
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">{cat.percentage}% de {cat.idealScore}%</span>
                      </div>
                    </div>
                    <div className="goal-actions">
                      <h5>Ações Recomendadas:</h5>
                      <ul>
                        <li>Realizar atividades diárias de estimulação</li>
                        <li>Participar de sessões de terapia ocupacional</li>
                        <li>Acompanhamento mensal com profissional especializado</li>
                      </ul>
                    </div>
                  </div>
                ))}
                {categoryData.filter(cat => cat.performance.level !== 'Adequado').length === 0 && (
                  <div className="no-goals">
                    <p>🎉 Excelente! Todas as áreas estão dentro dos padrões esperados.</p>
                    <p>Continue com as atividades de manutenção e monitoramento regular.</p>
                  </div>
                )}
              </div>
              
              <div className="future-planning">
                <h3>Planejamento Futuro</h3>
                <div className="planning-items">
                  <div className="planning-item">
                    <h4>Próxima Avaliação</h4>
                    <p>Recomendado: {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="planning-item">
                    <h4>Acompanhamento</h4>
                    <p>Mensal com profissional especializado</p>
                  </div>
                  <div className="planning-item">
                    <h4>Atividades em Casa</h4>
                    <p>15-20 minutos diários de estimulação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="report-actions">
          <button className="btn-primary" onClick={generatePDF}>
            <FaFileAlt /> Exportar PDF
          </button>
          <button className="btn-secondary" onClick={printReport}>
            <FaChartBar /> Imprimir
          </button>
          <Link to={`/categories/${childId}`}>
            <button className="btn-outline">
              <FaTrophy /> Nova Avaliação
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Report;