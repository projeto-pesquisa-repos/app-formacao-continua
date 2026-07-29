import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, GraduationCap, Mic, Award, BookOpen, Lightbulb, Flame } from 'lucide-react';
import { getSubmissions, getGamification, getSuggestions, acceptSuggestion, rejectSuggestion } from '../lib/api';
import { getProfessorName } from '../lib/device';

function renderTypeIcon(tipo: string, size = 20, color = "#fff") {
  switch (tipo) {
    case 'curso':
      return <GraduationCap size={size} color={color} />;
    case 'evento':
      return <Mic size={size} color={color} />;
    case 'certificacao':
      return <Award size={size} color={color} />;
    case 'producao':
      return <BookOpen size={size} color={color} />;
    default:
      return <Lightbulb size={size} color={color} />;
  }
}

function getTypeColor(tipo: string): string {
  const colors: Record<string, string> = {
    curso: '#1591DC',
    evento: '#4BB8FA',
    certificacao: '#22C55E',
    producao: '#2C5EAD',
  };
  return colors[tipo] || '#1591DC';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
}

export default function MainScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [gamification, setGamification] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const professorName = getProfessorName();

  const fetchData = async () => {
    try {
      const [subsData, gamificationData, suggestionsData] = await Promise.all([
        getSubmissions(),
        getGamification(),
        getSuggestions().catch(() => []) // fail gracefully
      ]);
      setSubmissions(subsData);
      setGamification(gamificationData);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.key]);

  useEffect(() => {
    const onFocus = () => {
      fetchData();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <div className="main-screen">
      <header className="header">
        <div className="header-greeting">
          <h1>Olá, {professorName}</h1>
        </div>
        <div className="streak-indicator" title="Streak">
          <Flame size={20} color="#F59E0B" />
          <span className="streak-count">{gamification?.streak ?? 0}</span>
        </div>
      </header>

      {gamification && (
        <section className="xp-section">
          <div className="xp-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Nível {gamification.level}</span>
            <div className="progress-bar-container" style={{ flexGrow: 1, margin: 0 }}>
              <div 
                className="progress-bar-fill" 
                style={{ width: `${Math.min(100, (gamification.xp / gamification.nextLevelThreshold) * 100)}%` }}
              />
            </div>
            <span className="xp-text" style={{ margin: 0 }}>
              {gamification.xp} / {gamification.nextLevelThreshold} XP
            </span>
          </div>
        </section>
      )}

      {suggestions.filter(s => s.status === 'pending' || s.status === 'accepted').length > 0 && (
        <section className="suggestions-section">
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '16px 0 12px' }}>Sugestões da Coordenação</h2>
          {suggestions.filter(s => s.status === 'pending' || s.status === 'accepted').map((sug) => (
            <div key={sug.id} className="suggestion-card">
              <h4>{sug.title}</h4>
              {sug.description && <p>{sug.description}</p>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {sug.status === 'pending' ? (
                  <>
                    <button
                      className="suggestion-action"
                      style={{ flex: 1 }}
                      onClick={async () => {
                        try {
                          await acceptSuggestion(sug.id);
                          setSuggestions(prev => prev.map(s => s.id === sug.id ? { ...s, status: 'accepted' } : s));
                        } catch (e) { console.error(e); }
                      }}
                    >
                      Aceitar
                    </button>
                    <button
                      className="suggestion-action"
                      style={{ flex: 1, backgroundColor: '#6B7280' }}
                      onClick={async () => {
                        try {
                          await rejectSuggestion(sug.id);
                          setSuggestions(prev => prev.filter(s => s.id !== sug.id));
                        } catch (e) { console.error(e); }
                      }}
                    >
                      Recusar
                    </button>
                  </>
                ) : (
                  <button
                    className="suggestion-action"
                    style={{ flex: 1 }}
                    onClick={() => navigate('/new', { state: { suggestion: sug } })}
                  >
                    Registrar Formação
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="formations-list">
        <h2>Suas Formações</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : submissions.length === 0 ? (
          <p className="empty-state">Nenhuma formação registrada ainda</p>
        ) : (
          <div className="cards-container">
            {submissions.map((submission) => (
              <div 
                key={submission.id} 
                className={`formation-card ${submission.status === 'rejeitado' ? 'rejected-card' : ''}`}
                onClick={() => navigate(`/detail/${submission.id}`)}
              >
                <div className="card-icon" style={{ backgroundColor: getTypeColor(submission.tipo) }}>
                  {renderTypeIcon(submission.tipo, 22, "#fff")}
                </div>
                <div className="card-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong>{submission.titulo}</strong>
                    {submission.status === 'rejeitado' && (
                      <span className="status-badge rejeitado">Rejeitado</span>
                    )}
                  </div>
                  <span>{formatDate(submission.data_conclusao)}</span>
                </div>
                <div className="card-xp">
                  + 50 XP
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button className="fab" onClick={() => navigate('/new')}>
        <Plus size={24} color="#fff" />
      </button>
    </div>
  );
}

