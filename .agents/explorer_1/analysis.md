# Detailed Codebase Analysis Report — Novo App Pesquisa

## 1. Codebase Architecture Overview
The application is a React 19 + TypeScript single-page application built with Vite and React Router DOM (v7).

### File Structure:
```
src/
├── App.tsx                     # Main router configuration & layout shell
├── main.tsx                    # React root entry point
├── index.css                   # Global styles, CSS variables & component rules (947 lines)
├── components/
│   └── BottomNav.tsx           # Fixed bottom navigation bar
├── lib/
│   ├── api.ts                  # Fetch client for backend REST API
│   └── device.ts               # Device ID UUID generation & localStorage management
└── pages/
    ├── MainScreen.tsx          # Home dashboard (XP bar, list of submissions, header)
    ├── RankingScreen.tsx       # Global leaderboard screen
    ├── NewFormationScreen.tsx  # 2-step form to register new formations
    ├── DetailScreen.tsx        # View details for a single formation submission
    └── CelebrationScreen.tsx   # Success celebration screen post-submission
```

---

## 2. Color Scheme Audit (Old Colors & Theme Values)

### CSS Variables (`src/index.css`)
- **`--dark-nav`**: `#1E2433` (Lines 5, 254, 595, 676, 782) — Dark slate blue used for bottom navbar background, sticky headers, and celebration background overlay.
- **`--primary-accent`**: `#6366F1` (Lines 8, 89, 218, 281, 331, 372, 404, 445, 469, 635, 666, 831, 870, 906) — Indigo primary accent color used for buttons, active tabs, level badges, chip borders, focus outline, FAB background.
- **Secondary / Supporting Hex Colors**:
  - `#818CF8`: Lighter indigo used in gradients alongside `#6366F1` (Lines 89, 218, 469, 666, 870, 906).
  - `#2a3144`: Dark gradient endpoint for header backgrounds (Lines 51, 595).
  - `rgba(99, 102, 241, ...)`: Indigo RGBA variants used for card shadows, borders, active row backgrounds (Lines 74, 78, 223, 238, 374, 399, 400, 446, 477, 481, 636, 637).
  - `rgba(30, 36, 51, ...)`: Dark navy RGBA variants used in modal overlay backdrop (Line 676).

### Inline Color Definitions in JS/TS Components
- **`src/pages/MainScreen.tsx`**:
  - Line 13: `const colors: Record<string, string> = { curso: '#6366F1', evento: '#F59E0B', certificacao: '#22C55E', producao: '#3B82F6' };`
  - Hardcoded `#6366F1` indigo for `curso` category icon background.
- **`src/pages/RankingScreen.tsx`**:
  - Line 26: `<Trophy size={32} color="#F59E0B" />`
- **`src/pages/MainScreen.tsx`**:
  - Line 104: `<Plus size={24} color="#fff" />`

---

## 3. Emoji Usage Audit & Lucide Icon Mapping

The codebase currently uses raw unicode emojis as visual indicators across multiple screens.

### Emoji Locations & Current Usage
1. **`src/pages/MainScreen.tsx`**:
   - Line 8: `icons: Record<string, string> = { curso: '🎓', evento: '🎤', certificacao: '🏆', producao: '📚' }; return icons[tipo] || '💡';`
   - Line 59: `<span className="streak-badge">🔥</span>`
2. **`src/pages/NewFormationScreen.tsx`**:
   - Lines 6-12:
     - `curso`: `🎓`
     - `evento`: `🎤`
     - `certificacao`: `🏆`
     - `producao`: `📚`
     - `outro`: `💡`
3. **`src/pages/DetailScreen.tsx`**:
   - Line 7: `icons: Record<string, string> = { curso: '🎓', evento: '🎤', certificacao: '🏆', producao: '📚' }; return icons[tipo] || '💡';`
4. **`src/pages/CelebrationScreen.tsx`**:
   - Line 8: `<div className="celebration-checkmark">✓</div>` (Unicode checkmark).

### Proposed Lucide React Mapping Matrix
| Raw Emoji | Context / Category | Proposed Lucide Component | Lucide Import |
|---|---|---|---|
| 🎓 | `curso` (Course) | `GraduationCap` | `import { GraduationCap } from 'lucide-react'` |
| 🎤 | `evento` (Event) | `Mic` or `Calendar` | `import { Mic } from 'lucide-react'` |
| 🏆 | `certificacao` (Certification) | `Award` or `Trophy` | `import { Award } from 'lucide-react'` |
| 📚 | `producao` (Academic Production) | `BookOpen` or `FileText` | `import { BookOpen } from 'lucide-react'` |
| 💡 | `outro` / Fallback | `Lightbulb` | `import { Lightbulb } from 'lucide-react'` |
| 🔥 | Streak Counter | `Flame` | `import { Flame } from 'lucide-react'` |
| ✓ | Celebration Checkmark | `Check` or `CheckCircle2` | `import { CheckCircle2 } from 'lucide-react'` |

---

## 4. Header Component Analysis & Streak Integration

### Current Header Implementation
Currently, there is no reusable `Header` component in `src/components/`.
In `src/pages/MainScreen.tsx`, lines 50-53:
```tsx
<header className="header">
  <h1>Olá, {professorName}</h1>
  <p>Bem-vindo(a) de volta!</p>
</header>
```
The streak counter (`🔥`) is currently positioned separately inside `.xp-section` below the header (line 59):
```tsx
<div className="xp-header">
  <span className="level-badge">Nível {gamification.level}</span>
  <span className="streak-badge">🔥</span>
</div>
```

### Plan for Reusable Header & Top-Right Streak Badge
1. Extract Header to `src/components/Header.tsx` or update `MainScreen.tsx`.
2. Header structure:
   ```tsx
   <header className="header">
     <div className="header-user-info">
       <h1>Olá, {professorName}</h1>
       <p>Bem-vindo(a) de volta!</p>
     </div>
     <div className="header-streak-badge">
       <Flame size={18} color="#F59E0B" />
       <span>{streakCount}d</span>
     </div>
   </header>
   ```
3. Styling adjustment in `src/index.css`:
   ```css
   .header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     ...
   }
   ```

---

## 5. Navigation & Routing Structure

### Current Setup
- `src/App.tsx`:
  - Routes: `/` (`MainScreen`), `/detail/:id` (`DetailScreen`), `/new` (`NewFormationScreen`), `/ranking` (`RankingScreen`), `/celebration` (`CelebrationScreen`).
  - Shell renders `<BottomNav />` globally.
- `src/components/BottomNav.tsx`:
  - Has 2 tab buttons:
    1. **Início** (`/`, Lucide `Home`)
    2. **Ranking** (`/ranking`, Lucide `Trophy`)
  - Hidden on `/new`, `/celebration`, `/detail/*`.

### Required Transition: Home (`/`) + Dados (`/dados`) + Perfil (`/perfil`)
1. Create new page components:
   - `src/pages/DadosScreen.tsx` (Analytics, indicators, formation hours by area, trends).
   - `src/pages/PerfilScreen.tsx` (Teacher details, level, XP, earned badges, settings).
2. Register routes in `src/App.tsx`:
   - `<Route path="/dados" element={<DadosScreen />} />`
   - `<Route path="/perfil" element={<PerfilScreen />} />`
3. Refactor `src/components/BottomNav.tsx`:
   - Replace 2 tabs with 3 tabs:
     - **Início** (`/`, `Home`)
     - **Dados** (`/dados`, `BarChart2` or `TrendingUp`)
     - **Perfil** (`/perfil`, `User`)
   - Update CSS `.bottom-nav` if necessary to distribute 3 tabs evenly across 480px shell.

---

## 6. NewFormationScreen Analysis (Step State & Back Arrow)

### Current Implementation (`src/pages/NewFormationScreen.tsx`)
- Step state is managed with React `useState(1)`:
  - `step === 1`: Grid of formation type options (`type-grid`). User clicks a card -> calls `handleSelectType(val)` -> sets `tipo` and `setStep(2)`.
  - `step === 2`: Form with fields (`titulo`, `dataConclusao`, `cargaHoraria`, `instituicaoPromotora`, `tipoProducao`, `descricao`).

### Back Button Defect
- Lines 68-72:
  ```tsx
  <header className="new-header">
    {step === 2 && (
      <button className="back-button" onClick={() => setStep(1)} type="button">
        <ArrowLeft size={24} />
      </button>
    )}
  </header>
  ```
- **Defect**: On Step 1, the header renders NO back button. The user is trapped on Step 1 unless they submit or use browser navigation.
- **Remediation**:
  - Render `<ArrowLeft>` on both steps:
    - On Step 1: `onClick={() => navigate('/')}` (or `navigate(-1)`).
    - On Step 2: `onClick={() => setStep(1)}`.

---

## 7. Gamification API & Data Model Integration

### API Client (`src/lib/api.ts`)
- Base URL: `https://be-formacao-continua.onrender.com/api`
- Device Header: Every request attaches `'X-Device-ID': getDeviceId()`.
- Device ID & Name Generator (`src/lib/device.ts`):
  - Uses `localStorage` keys `'professor_device_id'` and `'professor_display_name'`.

### Endpoints & Types
1. `getGamification()` (`GET /api/gamification`):
   ```ts
   export interface GamificationData {
     xp: number;
     level: number;
     nextLevelThreshold: number;
     badges: Array<{ id: number; name: string; description: string; icon: string; awarded_at: string }>;
   }
   ```
2. `getLeaderboard()` (`GET /api/gamification/leaderboard`):
   ```ts
   export interface LeaderboardEntry {
     id: number;
     name: string;
     avatar: string | null;
     xp: number;
     level: number;
     rank: number;
   }
   ```
3. `getSubmissions()` (`GET /api/submissions`):
   ```ts
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
     arquivo_path: string | null;
     arquivo_nome: string | null;
     status: 'pendente' | 'aprovado' | 'rejeitado';
     created_at: string;
     user_name: string;
   }
   ```

### Gaps & Enhancements for Frontend Integration
1. **Streak property missing in `GamificationData`**:
   - `GamificationData` currently lacks `streak: number`. If backend returns `streak`, update interface.
2. **Formations Hours Calculation**:
   - Can be derived on frontend via `submissions.reduce((acc, s) => acc + (s.carga_horaria || 0), 0)`.
3. **State Management Hook**:
   - Recommend creating a custom hook `useGamification()` or React Context to share XP, level, streak, and badges between `MainScreen`, `Header`, and `PerfilScreen` without duplicate API calls.
