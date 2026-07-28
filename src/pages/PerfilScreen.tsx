import { useState, useEffect } from 'react';
import { Award, Trophy, Zap, Star, Shield, BookOpen, GraduationCap } from 'lucide-react';
import { getGamification, getSubmissions } from '../lib/api';
import type { GamificationData, Submission } from '../lib/api';
import { getProfessorName } from '../lib/device';

function getLevelTitle(level: number): string {
  if (level <= 2) return 'Iniciante';
  if (level <= 4) return 'Aprendiz';
  if (level <= 6) return 'Intermediário';
  return 'Avançado';
}

function renderBadgeIcon(iconName: string, size = 26, color = '#1591DC') {
  switch (iconName?.toLowerCase()) {
    case 'award':
      return <Award size={size} color={color} />;
    case 'trophy':
      return <Trophy size={size} color={color} />;
    case 'zap':
    case 'flame':
      return <Zap size={size} color={color} />;
    case 'star':
      return <Star size={size} color={color} />;
    case 'book':
    case 'bookopen':
      return <BookOpen size={size} color={color} />;
    case 'graduation':
    case 'graduationcap':
      return <GraduationCap size={size} color={color} />;
    default:
      return <Award size={size} color={color} />;
  }
}

const placeholderBadges = [
  {
    id: 'ph-1',
    name: 'Primeira Formação',
    description: 'Registre a sua primeira atividade de formação profissional.',
    iconName: 'GraduationCap',
  },
  {
    id: 'ph-2',
    name: 'Constância Formativa',
    description: 'Mantenha um streak ativo de registros de aprendizagem.',
    iconName: 'Flame',
  },
  {
    id: 'ph-3',
    name: 'Acumulador de XP',
    description: 'Acumule mais de 200 XP em sua jornada pedagógica.',
    iconName: 'Trophy',
  },
  {
    id: 'ph-4',
    name: 'Docente Especialista',
    description: 'Alcance os níveis intermediário e avançado de desenvolvimento.',
    iconName: 'Star',
  },
];

export default function PerfilScreen() {
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const professorName = getProfessorName();
  const initialLetter = professorName.trim().charAt(0).toUpperCase() || 'P';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamData, subsData] = await Promise.all([
          getGamification(),
          getSubmissions().catch(() => [])
        ]);
        setGamification(gamData);
        setSubmissions(subsData);
      } catch (error) {
        console.error('Erro ao carregar dados do perfil', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const level = gamification?.level ?? 1;
  const levelTitle = getLevelTitle(level);
  const totalXP = gamification?.xp ?? 0;
  const streakSaves = gamification?.streak ?? 0;
  const badges = gamification?.badges ?? [];

  // Calculate activity status
  let statusText = 'Defasado';
  let statusColor = '#EF4444'; // red
  if (submissions.length > 0) {
    const sorted = [...submissions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const mostRecentDate = new Date(sorted[0].created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - mostRecentDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays <= 30) {
      statusText = 'Ativo';
      statusColor = '#22C55E'; // green
    } else if (diffDays <= 90) {
      statusText = 'Regular';
      statusColor = '#F59E0B'; // amber
    }
  }

  return (
    <div className="perfil-screen">
      {/* Profile Header */}
      <div className="profile-header-card">
        <div className="profile-avatar-container">
          <div className="profile-avatar-circle">
            <span className="profile-avatar-letter">{initialLetter}</span>
          </div>
        </div>
        <h1 className="profile-name">{professorName}</h1>
        <div className="profile-subtitle-badge" style={{ marginBottom: '8px' }}>
          Nível {level} • {levelTitle}
        </div>
        <div 
          className="profile-activity-status" 
          style={{ 
            backgroundColor: statusColor, 
            color: '#fff', 
            padding: '4px 12px', 
            fontSize: '12px', 
            fontWeight: 700, 
            display: 'inline-block',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {statusText}
        </div>
      </div>

      {loading ? (
        <div className="loading">Carregando perfil...</div>
      ) : (
        <div className="perfil-content">
          {/* Stats Row */}
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="stat-card-icon blue">
                <Zap size={22} color="#1591DC" />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-label">Total de XP</span>
                <strong className="stat-card-value">{totalXP} XP</strong>
              </div>
            </div>

            <div className="profile-stat-card">
              <div className="stat-card-icon amber">
                <Trophy size={22} color="#F59E0B" />
              </div>
              <div className="stat-card-content">
                <span className="stat-card-label">Streak saves</span>
                <strong className="stat-card-value">{streakSaves} dias</strong>
              </div>
            </div>
          </div>

          {/* Badges Grid */}
          <div className="badges-section">
            <div className="badges-header">
              <h2>Conquistas & Badges</h2>
              <span className="badges-count">
                {badges.length > 0 ? `${badges.length} conquistadas` : 'Em progresso'}
              </span>
            </div>

            <div className="badges-grid">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <div key={badge.id} className="badge-card earned">
                    <div className="badge-icon-wrapper earned">
                      {renderBadgeIcon(badge.icon, 24, '#1591DC')}
                    </div>
                    <div className="badge-body">
                      <strong className="badge-name">{badge.name}</strong>
                      <p className="badge-desc">{badge.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                placeholderBadges.map((ph) => (
                  <div key={ph.id} className="badge-card placeholder">
                    <div className="badge-icon-wrapper placeholder">
                      <Shield size={24} color="#9CA3AF" />
                    </div>
                    <div className="badge-body">
                      <strong className="badge-name">{ph.name}</strong>
                      <p className="badge-desc">{ph.description}</p>
                      <span className="badge-locked-pill">Bloqueado</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
