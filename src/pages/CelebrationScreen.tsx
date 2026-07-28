import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function CelebrationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const submission = (location.state as any)?.submission;
  const [phase, setPhase] = useState<1 | 2>(1);

  const xpEarned = 50;
  const previousXp = 240;
  const totalXp = previousXp + xpEarned;
  const nextLevelXp = 300;

  const newBadges = [
    { name: 'Mestre dos Cursos', description: 'Registrou 5 cursos' },
    { name: 'Estudo Diário', description: '24h totais de estudos' },
  ];

  if (phase === 1) {
    return (
      <div className="celebration-overlay">
        <div className="celebration-phase1">
          <div className="celebration-checkmark">
            <CheckCircle2 size={64} color="#fff" />
          </div>
          <h1 className="celebration-title">Obrigado!</h1>
          <p className="celebration-subtitle">Formação enviada!</p>
          <div className="celebration-xp">{xpEarned} xp</div>
          <button
            className="celebration-continue-btn"
            onClick={() => setPhase(2)}
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="celebration-overlay">
      <div className="celebration-phase2">
        <div className="celebration-checkmark celebration-checkmark-small">
          <CheckCircle2 size={40} color="#fff" />
        </div>

        <div className="celebration-xp-section">
          <div className="celebration-xp-label">
            <span>{submission?.tipo?.toUpperCase() || 'FORMAÇÃO'}</span>
            <span className="celebration-xp-numbers">{previousXp} + {xpEarned}</span>
          </div>
          <div className="celebration-progress-bar">
            <div
              className="celebration-progress-previous"
              style={{ width: `${(previousXp / nextLevelXp) * 100}%` }}
            />
            <div
              className="celebration-progress-new"
              style={{ width: `${(xpEarned / nextLevelXp) * 100}%`, left: `${(previousXp / nextLevelXp) * 100}%` }}
            />
          </div>
        </div>

        {newBadges.length > 0 && (
          <div className="celebration-badges">
            {newBadges.map((badge, i) => (
              <div key={i} className="celebration-badge-item" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                <span className="celebration-badge-label">Nova medalha!</span>
                <strong>{badge.name}</strong>
                <span className="celebration-badge-desc">{badge.description}</span>
              </div>
            ))}
          </div>
        )}

        <div className="celebration-total-row">
          <div className="celebration-total-xp">{totalXp} xp</div>
        </div>

        <button
          className="celebration-continue-btn"
          onClick={() => navigate('/')}
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
