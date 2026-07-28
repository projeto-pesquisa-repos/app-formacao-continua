## 2026-07-28T17:30:51Z
You are assigned to review Milestone 4 (New "Dados" & "Perfil" Screens) for `C:\Users\Dell\Documents\- Projetos Github\novo-app-pesquisa`.
Your working directory is `C:\Users\Dell\Documents\- Projetos Github\novo-app-pesquisa\.agents\reviewer_3`.

Your Tasks:
1. Create `.agents/reviewer_3/` directory if needed, and maintain `progress.md` with `Last visited: [timestamp]` heartbeat.
2. Read `.agents/implementer_3/handoff.md` and inspect `src/pages/DadosScreen.tsx`, `src/pages/PerfilScreen.tsx`, and `src/index.css`.
3. Verify Acceptance Criteria for Milestone 4:
   - [ ] R6: Horizontal daily XP bar chart renders showing last 7 days of XP (pure SVG/CSS, no chart libraries).
   - [ ] R6: Dashed average line is visible across the bar chart.
   - [ ] R6: Last bar has current day number displayed next to it.
   - [ ] R6: Displayed stats: "Total de XP de hoje", "Total de XP", "Rank diário de XP" (#N), and "Total de horas de formação" (sum of `carga_horaria`).
   - [ ] R7: Profile avatar placeholder shows professor's initial letter in a large circular container.
   - [ ] R7: Professor name and level title subtitle ("Nível {level} • {title}") are displayed (Iniciante for lvl 1-2, Aprendiz for 3-4, Intermediário for 5-6, Avançado for 7+).
   - [ ] R7: Stats row displays "Total de XP" and "Streak saves".
   - [ ] R7: Badges grid renders earned badges or placeholder cards if empty.
   - [ ] Build verification (`npx tsc --noEmit` and `npm run build`) passes cleanly with zero errors.
4. Document your review verdict and observations in `.agents/reviewer_3/handoff.md`.
5. Send a message to orchestrator with your verdict (PASS / VETO) and justification.
