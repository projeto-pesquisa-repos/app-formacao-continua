## 2026-07-28T20:26:08Z
You are assigned to implement Milestone 3: Header Streak & Navigation Restructuring for `C:\Users\Dell\Documents\- Projetos Github\novo-app-pesquisa`.
Your working directory is `C:\Users\Dell\Documents\- Projetos Github\novo-app-pesquisa\.agents\implementer_2`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Create `.agents/implementer_2/` directory if needed, and maintain `progress.md` with `Last visited: [timestamp]` heartbeat.
2. Implement Requirement R3 (Header Streak Indicator):
   - Update `src/lib/api.ts` `GamificationData` interface to include optional `streak?: number` (or read `streak` field from gamification response).
   - Refactor main header in `src/pages/MainScreen.tsx` (or create a reusable `Header.tsx` component if cleaner) to have a flex container with professor greeting on the left and the streak indicator on the top-right.
   - Streak indicator must show an outlined `Flame` icon from `lucide-react` with the streak number next to it (default to 0 if undefined/null).
3. Implement Requirement R4 (Back Arrow on New Formation Screen):
   - Modify `src/pages/NewFormationScreen.tsx` so the top back arrow is rendered unconditionally on BOTH step 1 and step 2 (removing the `{step === 2 && ...}` guard).
   - On Step 1: clicking back arrow navigates to `/` (Home).
   - On Step 2: clicking back arrow navigates back to step 1 (`setStep(1)`).
4. Implement Requirement R5 (Restructure Bottom Navigation to 3 Tabs):
   - Update `src/components/BottomNav.tsx` to render exactly 3 tabs:
     1. **Home** (icon: `Home`, label: `Início`, route: `/`)
     2. **Dados** (icon: `BarChart2` or `ChartNoAxesColumn`, label: `Dados`, route: `/dados`)
     3. **Perfil** (icon: `User`, label: `Perfil`, route: `/perfil`)
   - Ensure active tab is visually highlighted based on current path (`useLocation`).
   - Add routes `/dados` and `/perfil` in `src/App.tsx`.
   - Create initial/stub component files `src/pages/DadosScreen.tsx` and `src/pages/PerfilScreen.tsx` so the routes render properly and compile cleanly.
5. Verify build integrity by running `npx tsc --noEmit` and `npm run build`.
6. Write `.agents/implementer_2/handoff.md` with your changes and test/build output.
7. Send a completion message to the orchestrator with the handoff report path.
