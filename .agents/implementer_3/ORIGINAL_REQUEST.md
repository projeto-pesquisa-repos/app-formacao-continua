## 2026-07-28T20:28:37Z
You are assigned to implement Milestone 4: New "Dados" & "Perfil" Screens for `C:\Users\Dell\Documents\- Projetos Github\novo-app-pesquisa`.
Your working directory is `C:\Users\Dell\Documents\- Projetos Github\novo-app-pesquisa\.agents\implementer_3`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Create `.agents/implementer_3/` directory if needed, and maintain `progress.md` with `Last visited: [timestamp]` heartbeat.
2. Implement Requirement R6 (New "Dados" Screen - `src/pages/DadosScreen.tsx`):
   - Fetch real gamification stats (`getGamification()`), submissions (`getSubmissions()`), and leaderboard (`getLeaderboard()`) from `src/lib/api.ts`.
   - **Daily XP bar chart**: Pure CSS/SVG horizontal bar chart showing the last 7 days of XP earned per day. Include a dashed reference line showing the 7-day daily average. The last bar must display the current day number next to it (e.g. day of month).
   - Display **Total de XP de hoje** prominently.
   - Display **Total de XP** (all-time XP from gamification).
   - Display **Rank diário de XP** formatted as `#N`.
   - Display **Total de horas de formação** calculated as the sum of `carga_horaria` across all professor submissions.
3. Implement Requirement R7 (New "Perfil" Screen - `src/pages/PerfilScreen.tsx`):
   - Fetch real gamification data (`getGamification()`).
   - Large circular profile avatar area at the top displaying the first letter of the professor name as placeholder.
   - Professor name displayed prominently below.
   - Subtitle line: `"Nível {level} • {title}"` where title is computed:
     - Level 1-2: `"Iniciante"`
     - Level 3-4: `"Aprendiz"`
     - Level 5-6: `"Intermediário"`
     - Level 7+: `"Avançado"`
   - Stats row: `"Total de XP"` with value, and `"Streak saves"` with value.
   - **Badges grid**: Grid of rounded cards displaying earned badges (name/description/icon). If no badges earned (or empty array), render placeholder empty badge cards.
4. Styling:
   - Adhere strictly to the blue color palette (`#2C5EAD`, `#1591DC`, `#4BB8FA`, `#C4E2F5`, `#FFFFFF`).
   - Use Lucide React icons (no raw emojis!). Add styled CSS classes to `src/index.css`.
5. Verify build integrity by running `npx tsc --noEmit` and `npm run build`.
6. Write `.agents/implementer_3/handoff.md` with your changes and test/build output.
7. Send a completion message to the orchestrator with the handoff report path.
