import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Mic, Award, BookOpen, Lightbulb, AlertTriangle, Edit3 } from 'lucide-react';
import { getSubmission } from '../lib/api';
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

  return (
    <div className="detail-screen">
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h2>Detalhes da Formação</h2>
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
              <div className="file-box">
                {submission.arquivo_path.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                  <img src={`https://be-formacao-continua.onrender.com/api/files/${submission.arquivo_nome}`} alt="Comprovante" style={{ maxWidth: '100%' }} />
                ) : (
                  submission.arquivo_nome
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

