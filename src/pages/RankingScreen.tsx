import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { getLeaderboard } from '../lib/api';

export default function RankingScreen() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Erro ao carregar ranking', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="ranking-screen">
      <header className="ranking-header">
        <Trophy size={32} color="#F59E0B" />
        <h2>Ranking Global</h2>
      </header>

      {loading ? (
        <p className="loading">Carregando ranking...</p>
      ) : leaderboard.length === 0 ? (
        <p className="empty-state">Nenhum dado no ranking ainda.</p>
      ) : (
        <div className="ranking-list">
          {leaderboard.map((entry, index) => {
            let rankClass = '';
            if (index === 0) rankClass = 'rank-gold';
            else if (index === 1) rankClass = 'rank-silver';
            else if (index === 2) rankClass = 'rank-bronze';

            return (
              <div key={entry.id} className={`ranking-row ${rankClass}`}>
                <div className="rank-number">#{entry.rank}</div>
                <div className="rank-avatar">
                  {entry.avatar ? (
                    <img src={entry.avatar} alt={entry.name} />
                  ) : (
                    <div className="avatar-placeholder">{entry.name.charAt(0)}</div>
                  )}
                </div>
                <div className="rank-info">
                  <div className="rank-name">{entry.name}</div>
                  <div className="rank-xp">{entry.xp} XP</div>
                </div>
                <div className="rank-level">
                  <span className="level-pill">Lvl {entry.level}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
