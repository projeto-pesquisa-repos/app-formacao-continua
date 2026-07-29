import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function CelebrationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as any) || {};
  const rawData = state.submission;

  const [phase, setPhase] = useState<1 | 2>(1);

  // Extract dynamic data from payload
  const submission = rawData?.submission || (rawData?.id ? rawData : null);
  const xpEarned = rawData?.xpAwarded ?? state.xpAwarded ?? 50;
  const newBadges: Array<{ name: string; description?: string }> = 
    rawData?.newBadges ?? state.newBadges ?? [];
  const gamification = rawData?.gamification ?? state.gamification;

  const totalXp = gamification?.xp ?? 50;
  const previousXp = Math.max(0, totalXp - xpEarned);
  const nextLevelXp = gamification?.nextLevelThreshold ?? 300;

  const prevPct = Math.min(100, (previousXp / nextLevelXp) * 100);
  const newPct = Math.min(100 - prevPct, (xpEarned / nextLevelXp) * 100);

  if (phase === 1) {
    return (
      <div className="celebration-overlay">
        <div className="celebration-phase1">
          <div className="celebration-checkmark">
            <CheckCircle2 size={64} color="#fff" />
          </div>
          <h1 className="celebration-title">Obrigado!</h1>
          <p className="celebration-subtitle">Formação enviada!</p>
          <div className="celebration-xp">+{xpEarned} XP</div>
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
            <span className="celebration-xp-numbers">{previousXp} + {xpEarned} XP</span>
          </div>
          <div className="celebration-progress-bar">
            <div
              className="celebration-progress-previous"
              style={{ width: `${prevPct}%` }}
            />
            <div
              className="celebration-progress-new"
              style={{ width: `${newPct}%`, left: `${prevPct}%` }}
            />
          </div>
        </div>

        {newBadges.length > 0 && (
          <div className="celebration-badges">
            {newBadges.map((badge, i) => (
              <div key={i} className="celebration-badge-item" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                <span className="celebration-badge-label">Nova medalha!</span>
                <strong>{badge.name}</strong>
                {badge.description && <span className="celebration-badge-desc">{badge.description}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="celebration-total-row">
          <div className="celebration-total-xp">{totalXp} XP</div>
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

