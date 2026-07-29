import { useState, useEffect } from 'react';
import { BarChart2, Zap, Trophy, Clock, TrendingUp } from 'lucide-react';
import {
  getGamification,
  getSubmissions,
  getLeaderboard,
} from '../lib/api';
import type {
  GamificationData,
  Submission,
  LeaderboardEntry,
} from '../lib/api';
import { getProfessorName } from '../lib/device';

interface DailyXP {
  dateObj: Date;
  dayLabel: string;
  dayNumber: number;
  isToday: boolean;
  xp: number;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default function DadosScreen() {
  const [gamification, setGamification] = useState<GamificationData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const professorName = getProfessorName();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamiData, subsData, leaderData] = await Promise.all([
          getGamification().catch(() => null),
          getSubmissions().catch(() => []),
          getLeaderboard().catch(() => []),
        ]);
        setGamification(gamiData);
        setSubmissions(subsData);
        setLeaderboard(leaderData);
      } catch (error) {
        console.error('Erro ao carregar dados da tela de estatísticas', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate 7-day daily XP
  const now = new Date();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const last7Days: DailyXP[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);

    const isToday = i === 0;
    const dayNumber = d.getDate();
    const dayLabel = weekDays[d.getDay()];

    const daySubs = submissions.filter((sub) => {
      if (!sub.created_at) return false;
      const subDate = new Date(sub.created_at);
      return isSameDay(subDate, d);
    });

    const xp = daySubs.length * 50;

    last7Days.push({
      dateObj: d,
      dayLabel,
      dayNumber,
      isToday,
      xp,
    });
  }

  // XP Today
  const xpHoje = last7Days[6].xp;

  // Total XP
  const totalXP = gamification?.xp ?? 0;

  // Calculate Rank
  let rankDisplay = '#1';
  if (leaderboard.length > 0) {
    const userEntry = leaderboard.find(
      (e) => e.name.toLowerCase() === professorName.toLowerCase()
    );
    if (userEntry) {
      rankDisplay = `#${userEntry.rank}`;
    } else {
      const higherCount = leaderboard.filter((e) => e.xp > totalXP).length;
      rankDisplay = `#${higherCount + 1}`;
    }
  }

  // Total Horas de Formação
  const totalHoras = submissions.reduce(
    (acc, sub) => acc + (Number(sub.carga_horaria) || 0),
    0
  );

  // SVG Bar Chart Math
  const maxXP = Math.max(...last7Days.map((d) => d.xp), 100);
  const total7DaysXP = last7Days.reduce((acc, d) => acc + d.xp, 0);
  const avgXP = Math.round(total7DaysXP / 7);

  const chartWidth = 320;
  const chartHeight = 220;
  const labelWidth = 75;
  const barMaxPx = chartWidth - labelWidth - 65;
  const rowHeight = 28;
  const avgX = labelWidth + (avgXP / maxXP) * barMaxPx;

  return (
    <div className="dados-screen">
      <header className="header">
        <div className="header-greeting">
          <h1>Dados & Estatísticas</h1>
          <p>Acompanhamento de desempenho</p>
        </div>
        <div className="header-icon">
          <BarChart2 size={28} color="#FFFFFF" />
        </div>
      </header>

      {loading ? (
        <div className="loading">Carregando estatísticas...</div>
      ) : (
        <div className="dados-content">
          {/* Total de XP de Hoje Prominent Card */}
          <div className="hero-xp-card">
            <div className="hero-xp-header">
              <div className="hero-xp-icon">
                <Zap size={24} color="#fff" />
              </div>
              <span className="hero-xp-title">Total de XP de hoje</span>
            </div>
            <div className="hero-xp-value">
              +{xpHoje} <span className="hero-xp-unit">XP</span>
            </div>
            <p className="hero-xp-subtext">
              {xpHoje > 0
                ? 'Excelente progresso hoje! Continue assim.'
                : 'Nenhum XP registrado hoje ainda.'}
            </p>
          </div>

          {/* Metric Cards Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-box blue">
                <TrendingUp size={20} color="#1591DC" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total de XP</span>
                <strong className="metric-value">{totalXP} XP</strong>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box amber">
                <Trophy size={20} color="#F59E0B" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Rank diário de XP</span>
                <strong className="metric-value">{rankDisplay}</strong>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-box navy">
                <Clock size={20} color="#2C5EAD" />
              </div>
              <div className="metric-info">
                <span className="metric-label">Total de horas</span>
                <strong className="metric-value">{totalHoras}h</strong>
              </div>
            </div>
          </div>

          {/* Daily XP Horizontal Bar Chart */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>XP nos Últimos 7 Dias</h3>
              <span className="chart-badge">Média: {avgXP} XP/dia</span>
            </div>

            <div className="svg-chart-container">
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* 7-day Average Dashed Reference Line */}
                <line
                  x1={avgX}
                  y1={26}
                  x2={avgX}
                  y2={chartHeight - 15}
                  stroke="#2C5EAD"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
                <text
                  x={avgX}
                  y={14}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#2C5EAD"
                >
                  Média ({avgXP})
                </text>

                {/* Bars */}
                {last7Days.map((d, idx) => {
                  const y = 26 + idx * rowHeight;
                  const barWidth = Math.max(4, (d.xp / maxXP) * barMaxPx);
                  const isLastBar = idx === 6;

                  return (
                    <g key={d.dateObj.toISOString()}>
                      {/* Day Label */}
                      <text
                        x={labelWidth - 8}
                        y={y + 13}
                        textAnchor="end"
                        fontSize="11"
                        fontWeight={isLastBar ? '700' : '600'}
                        fill={isLastBar ? '#1591DC' : '#1E2433'}
                      >
                        {isLastBar
                          ? `Hoje (${d.dayNumber})`
                          : `${d.dayLabel} ${d.dayNumber}`}
                      </text>

                      {/* Bar Rectangle */}
                      <rect
                        x={labelWidth}
                        y={y}
                        width={barWidth}
                        height={18}
                        rx={0}
                        fill={isLastBar ? '#1591DC' : '#C4E2F5'}
                      />

                      {/* XP Value Text */}
                      <text
                        x={labelWidth + barWidth + 8}
                        y={y + 13}
                        fontSize="11"
                        fontWeight="700"
                        fill={isLastBar ? '#1591DC' : '#6B7280'}
                      >
                        {d.xp} XP
                        {isLastBar && ` • Dia ${d.dayNumber}`}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="chart-footer">
              <span className="chart-legend-line" />
              <span>Linha pontilhada indica a média diária de 7 dias ({avgXP} XP).</span>
            </div>
          </div>

          {/* Leaderboard Section below Chart */}
          <div className="chart-card leaderboard-section-card" style={{ marginTop: '16px' }}>
            <div className="chart-card-header" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={20} color="#F59E0B" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Leaderboard / Ranking</h3>
              </div>
              <span className="chart-badge">Classificação</span>
            </div>

            {leaderboard.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', margin: '16px 0' }}>
                Nenhum dado de ranking disponível.
              </p>
            ) : (
              <div className="ranking-list" style={{ padding: 0 }}>
                {leaderboard.map((item) => {
                  const isCurrent = item.name.toLowerCase() === professorName.toLowerCase();
                  let rankClass = '';
                  if (item.rank === 1) rankClass = 'gold';
                  else if (item.rank === 2) rankClass = 'silver';
                  else if (item.rank === 3) rankClass = 'bronze';

                  return (
                    <div
                      key={item.id || item.rank}
                      className={`ranking-row ${isCurrent ? 'current' : ''}`}
                      style={{ borderRadius: '0px' }}
                    >
                      <div className={`rank-number ${rankClass}`}>#{item.rank}</div>
                      <div className="rank-avatar" style={{ borderRadius: '0px' }}>
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="rank-info">
                        <div className="rank-name">
                          {item.name} {isCurrent && <span style={{ fontSize: '11px', color: '#1591DC' }}>(Você)</span>}
                        </div>
                        <div className="rank-xp">{item.xp} XP</div>
                      </div>
                      <div className="rank-level">Nível {item.level}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
