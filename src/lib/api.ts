import { getDeviceId, getProfessorName } from './device';

const API_BASE = 'https://be-formacao-continua.onrender.com/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const deviceId = getDeviceId();
  const professorName = getProfessorName();
  const headers: Record<string, string> = {
    'X-Device-ID': deviceId,
    'X-Device-Name': professorName,
    ...(options.headers as Record<string, string> || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro de rede' }));
    throw new Error(error.error || `Erro ${response.status}`);
  }

  return response.json();
}

export interface Submission {
  id: number;
  user_id: number;
  tipo: string;
  titulo: string;
  descricao: string | null;
  carga_horaria: number | null;
  instituicao_promotora: string | null;
  data_conclusao: string | null;
  tipo_participacao: string | null;
  nome_evento: string | null;
  local_evento: string | null;
  tipo_producao: string | null;
  doi_isbn: string | null;
  url_certificado?: string | null;
  arquivo_path: string | null;
  arquivo_nome: string | null;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  justificativa?: string | null;
  justificativa_rejeicao?: string | null;
  created_at: string;
  user_name: string;
}

export interface GamificationData {
  xp: number;
  level: number;
  nextLevelThreshold: number;
  badges: Array<{ id: number; name: string; description: string; icon: string; awarded_at: string }>;
  streak?: number;
}

export interface LeaderboardEntry {
  id: number;
  name: string;
  avatar: string | null;
  xp: number;
  level: number;
  rank: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function getSubmissions(): Promise<Submission[]> {
  const res = await request<ApiResponse<Submission[]>>('/submissions');
  return res.data;
}

export async function getSubmission(id: number): Promise<Submission> {
  const res = await request<ApiResponse<Submission>>(`/submissions/${id}`);
  return res.data;
}

export async function createSubmission(data: Record<string, unknown> | FormData): Promise<any> {
  const res = await request<ApiResponse<any>>('/submissions', {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
  return res.data;
}

export async function updateSubmission(id: string | number, data: Record<string, unknown> | FormData): Promise<any> {
  const res = await request<ApiResponse<any>>(`/submissions/${id}`, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
  });
  return res.data;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
}

export async function getBadges(): Promise<Badge[]> {
  const res = await request<ApiResponse<Badge[]>>('/gamification/badges');
  return res.data;
}

export async function getGamification(): Promise<GamificationData> {
  const res = await request<ApiResponse<GamificationData>>('/gamification');
  return res.data;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await request<ApiResponse<LeaderboardEntry[]>>('/gamification/leaderboard');
  return res.data;
}

export interface Suggestion {
  id: number;
  created_by: number;
  title: string;
  description: string;
  tipo: string;
  target_professor_id: number | null;
  created_at: string;
  status: string;
}

export async function getSuggestions(): Promise<Suggestion[]> {
  const res = await request<ApiResponse<Suggestion[]>>('/suggestions');
  return res.data;
}

