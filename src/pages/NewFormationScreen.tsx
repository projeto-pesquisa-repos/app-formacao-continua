import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Mic, Award, BookOpen, Lightbulb } from 'lucide-react';
import { createSubmission } from '../lib/api';

const TYPES = [
  { value: 'curso', label: 'Curso', Icon: GraduationCap },
  { value: 'evento', label: 'Evento', Icon: Mic },
  { value: 'certificacao', label: 'Certificação', Icon: Award },
  { value: 'producao', label: 'Produção Acadêmica', Icon: BookOpen },
  { value: 'outro', label: 'Outro', Icon: Lightbulb }
];

export default function NewFormationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const suggestion = location.state?.suggestion;

  const [step, setStep] = useState(suggestion ? 2 : 1);
  const [tipo, setTipo] = useState(suggestion ? suggestion.tipo : '');
  const [titulo, setTitulo] = useState(suggestion ? suggestion.title : '');
  const [dataConclusao, setDataConclusao] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [instituicaoPromotora, setInstituicaoPromotora] = useState('');
  const [tipoProducao, setTipoProducao] = useState('Artigo');
  const [urlCertificado, setUrlCertificado] = useState('');
  const [descricao, setDescricao] = useState(suggestion?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const handleSelectType = (val: string) => {
    setTipo(val);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload: any = {
      tipo,
      titulo,
      descricao,
      data_conclusao: dataConclusao,
    };

    if (['curso', 'evento', 'certificacao', 'outro'].includes(tipo)) {
      payload.carga_horaria = Number(cargaHoraria);
    }
    if (tipo === 'curso') {
      payload.instituicao_promotora = instituicaoPromotora;
    }
    if (tipo === 'producao') {
      payload.tipo_producao = tipoProducao;
    }
    if (tipo === 'certificacao') {
      payload.url_certificado = urlCertificado;
    }

    try {
      let submission;
      if (arquivo) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== null && value !== undefined) formData.append(key, String(value));
        });
        formData.append('arquivo', arquivo);
        
        submission = await createSubmission(formData);
      } else {
        submission = await createSubmission(payload);
      }
      navigate('/celebration', { state: { submission } });
    } catch (err) {
      setError('Erro ao registrar formação. Tente novamente.');
      setLoading(false);
    }
  };

  const selectedTypeInfo = TYPES.find(t => t.value === tipo);

  return (
    <div className="new-formation-screen">
      <header className="new-header">
        <button 
          className="back-button" 
          onClick={() => (step === 1 ? navigate('/') : setStep(1))} 
          type="button"
        >
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="step-indicator">
        <div className={`dot ${step >= 1 ? 'active' : ''}`} />
        <div className={`dot ${step >= 2 ? 'active' : ''}`} />
      </div>

      {step === 1 && (
        <div className="step-1">
          <h2>Nova Formação</h2>
          <p className="subtitle">Selecione o tipo de formação</p>
          
          <div className="type-grid">
            {TYPES.map(t => {
              const Icon = t.Icon;
              return (
                <button 
                  key={t.value} 
                  className="type-chip"
                  onClick={() => handleSelectType(t.value)}
                >
                  <span className="type-icon">
                    <Icon size={32} color="#1591DC" />
                  </span>
                  <span className="type-label">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-2">
          <h2>Detalhes da Formação</h2>
          
          {selectedTypeInfo && (
            <div className="selected-type-chip">
              <selectedTypeInfo.Icon size={18} color="#2C5EAD" />
              <span>{selectedTypeInfo.label}</span>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
              <label>Título *</label>
              <input 
                type="text" 
                required 
                value={titulo} 
                onChange={e => setTitulo(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Data de Conclusão</label>
              <input 
                type="date" 
                value={dataConclusao} 
                onChange={e => setDataConclusao(e.target.value)} 
              />
            </div>

            {['curso', 'evento', 'certificacao', 'outro'].includes(tipo) && (
              <div className="form-group">
                <label>Carga Horária <span className="optional-tag">(Opcional)</span></label>
                <input 
                  type="number" 
                  placeholder="Horas" 
                  value={cargaHoraria} 
                  onChange={e => setCargaHoraria(e.target.value)} 
                />
              </div>
            )}

            {tipo === 'curso' && (
              <div className="form-group">
                <label>Instituição Promotora <span className="optional-tag">(Opcional)</span></label>
                <input 
                  type="text" 
                  value={instituicaoPromotora} 
                  onChange={e => setInstituicaoPromotora(e.target.value)} 
                />
              </div>
            )}

            {tipo === 'producao' && (
              <div className="form-group">
                <label>Tipo de Publicação</label>
                <select 
                  value={tipoProducao} 
                  onChange={e => setTipoProducao(e.target.value)}
                >
                  <option value="Artigo">Artigo</option>
                  <option value="Livro">Livro</option>
                  <option value="Capítulo de Livro">Capítulo de Livro</option>
                  <option value="Resumo">Resumo</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            )}

            {tipo === 'certificacao' && (
              <div className="form-group">
                <label>URL do Certificado <span className="optional-tag">(Opcional)</span></label>
                <input 
                  type="url"
                  placeholder="https://..."
                  value={urlCertificado} 
                  onChange={e => setUrlCertificado(e.target.value)} 
                />
              </div>
            )}

            <div className="form-group">
              <label>Comprovante (Imagem) <span className="optional-tag">(Opcional)</span></label>
              <div 
                className="upload-area" 
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Tocar para enviar imagem (JPG, PNG)
              </div>
              <input 
                id="file-upload"
                type="file" 
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setArquivo(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {preview && (
                <div className="upload-preview">
                  <img src={preview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Descrição <span className="optional-tag">(Opcional)</span></label>
              <textarea 
                placeholder="Anotações pessoais..." 
                value={descricao} 
                onChange={e => setDescricao(e.target.value)}
                rows={4}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Formação'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
