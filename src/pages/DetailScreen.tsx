import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Mic, Award, BookOpen, Lightbulb, AlertTriangle, Edit3, Trash2, MoreVertical } from 'lucide-react';
import { getSubmission, deleteSubmission } from '../lib/api';
import type { Submission } from '../lib/api';

function renderTypeIcon(tipo: string, size = 36, color = "#1591DC") {
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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
}

export default function DetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (id) {
          const data = await getSubmission(parseInt(id, 10));
          setSubmission(data);
        }
      } catch (error) {
        console.error('Erro ao carregar detalhes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="loading">Carregando...</div>;
  if (!submission) return <div className="error">Formação não encontrada.</div>;

  const rejectionReason = submission.justificativa_rejeicao || submission.justificativa;

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja remover esta formação?')) {
      try {
        await deleteSubmission(submission.id);
        navigate('/', { replace: true });
      } catch (error) {
        alert('Erro ao remover formação.');
      }
    }
  };

  const handleEdit = () => {
    navigate('/new', { state: { editSubmission: submission } });
  };

  return (
    <div className="detail-screen">
      <header className="detail-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <h2>Detalhes da Formação</h2>
        </div>
        
        {submission.status !== 'aprovado' && (
          <div className="header-actions">
            <button className="more-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <MoreVertical size={24} />
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleEdit}>
                  <Edit3 size={16} /> Editar
                </button>
                <button className="dropdown-item delete" onClick={handleDelete}>
                  <Trash2 size={16} /> Remover
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="detail-content">
        {submission.status === 'rejeitado' && (
          <div className="rejection-callout">
            <div className="rejection-header">
              <AlertTriangle size={20} color="#EF4444" />
              <span>Formação Rejeitada</span>
            </div>
            <p className="rejection-body">
              {rejectionReason || 'A coordenação solicitou revisão e reenquadramento desta atividade.'}
            </p>
            <button
              className="resubmit-btn"
              onClick={() => navigate('/new', { state: { editSubmission: submission } })}
            >
              <Edit3 size={18} />
              Editar e Reenviar
            </button>
          </div>
        )}

        <div className="detail-hero">
          <div className="detail-icon">
            {renderTypeIcon(submission.tipo, 36, "#1591DC")}
          </div>
          <span className="detail-type">{submission.tipo.toUpperCase()}</span>
          <h2>{submission.titulo}</h2>
          
          <span className={`status-badge ${submission.status || 'pendente'}`}>
            {(!submission.status || submission.status === 'pendente') ? 'Sob análise' : submission.status.toUpperCase()}
          </span>
        </div>

        <div className="detail-info">
          {submission.data_conclusao && (
            <div className="info-row">
              <label>Data de Conclusão</label>
              <span>{formatDate(submission.data_conclusao)}</span>
            </div>
          )}
          
          {submission.carga_horaria && (
            <div className="info-row">
              <label>Carga Horária</label>
              <span>{submission.carga_horaria} horas</span>
            </div>
          )}
          
          {submission.instituicao_promotora && (
            <div className="info-row">
              <label>Instituição</label>
              <span>{submission.instituicao_promotora}</span>
            </div>
          )}
          
          {submission.tipo_participacao && (
            <div className="info-row">
              <label>Tipo de Participação</label>
              <span>{submission.tipo_participacao}</span>
            </div>
          )}

          {submission.nome_evento && (
            <div className="info-row">
              <label>Nome do Evento</label>
              <span>{submission.nome_evento}</span>
            </div>
          )}

          {submission.tipo_producao && (
            <div className="info-row">
              <label>Tipo de Publicação</label>
              <span>{submission.tipo_producao}</span>
            </div>
          )}
          
          {submission.doi_isbn && (
            <div className="info-row">
              <label>DOI/ISBN</label>
              <span>{submission.doi_isbn}</span>
            </div>
          )}

          {submission.url_certificado && (
            <div className="info-row">
              <label>URL do Certificado</label>
              <a href={submission.url_certificado} target="_blank" rel="noreferrer" style={{ color: '#1591DC', textDecoration: 'underline' }}>Acessar Link</a>
            </div>
          )}

          {submission.descricao && (
            <div className="info-section">
              <label>Descrição</label>
              <p>{submission.descricao}</p>
            </div>
          )}

          {submission.arquivo_path && (
            <div className="info-section">
              <label>Comprovante</label>
              <div className="image-carousel-container">
                {submission.arquivo_nome.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <img className="carousel-image" src={`https://be-formacao-continua.onrender.com/api/files/${submission.arquivo_nome}`} alt="Comprovante" />
                ) : (
                  <div className="file-box">
                    <p>{submission.arquivo_nome}</p>
                    <a href={`https://be-formacao-continua.onrender.com/api/files/${submission.arquivo_nome}`} target="_blank" rel="noreferrer" className="text-primary-blue underline text-sm">Visualizar arquivo</a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

