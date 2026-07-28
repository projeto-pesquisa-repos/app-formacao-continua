# Original User Request

## Initial Request — 2026-07-28T17:17:57-03:00

Update an existing React + Vite mobile-first web app for professors. Apply a new color palette, replace emojis with Lucide icons, add a streak fire indicator, restructure bottom navigation with new Data and Profile tabs.

Working directory: C:\Users\Dell\Documents\- Projetos Github\novo-app-pesquisa
Integrity mode: development

The app already exists and runs. It connects to a live backend at `https://be-formacao-continua.onrender.com` using `X-Device-ID` header auth. Read all existing source files before making changes.

## Requirements

### R1. New Color Palette
Replace the current indigo/dark theme with the following palette throughout all screens and components:
- `#2C5EAD` — Dark Blue (nav bars, dark accents)
- `#1591DC` — Primary Dark Blue (buttons, primary actions)
- `#4BB8FA` — Primary Blue (accents, highlights, progress bars)
- `#C4E2F5` — Secondary Light Blue (subtle backgrounds, badges)
- `#FFFFFF` — White (card backgrounds, main background)

### R2. Replace Emojis with Lucide Icons
Remove ALL emoji usage (🎓🎤🏆📚💡🔥) from every screen. Replace them with appropriate Lucide React icons:
- Curso → `GraduationCap`
- Evento → `Mic` or `Calendar`
- Certificação → `Award`
- Produção Acadêmica → `BookOpen`
- Outro → `Lightbulb`
- Fire/Streak → `Flame`

This applies to: MainScreen cards, NewFormationScreen type chips, DetailScreen type display.

### R3. Header Streak Indicator
Add a streak fire indicator to the **top-right** of the main screen header bar. It should show an outlined `Flame` icon from Lucide with a number next to it, representing how many consecutive days the professor has visited the app. Fetch this from the gamification API (`streak` field — note: the backend may not return `streak` yet; if not, default to 0).

### R4. Back Arrow on New Formation Screen
The "Nova Formação" screen must have a back/return arrow at the top that works on **both** steps — not just step 2. On step 1, it should navigate back to the home screen (`/`). On step 2, it should go back to step 1.

### R5. Restructure Bottom Navigation to 3 Tabs
Replace the current 2-tab bottom nav (Home + Ranking) with 3 tabs:
1. **Home** (house icon) — existing timeline screen
2. **Dados** (bar chart icon) — new Data/Stats screen
3. **Perfil** (user icon) — new Profile screen

### R6. New "Dados" (Data) Screen
A statistics screen showing:
- **Daily XP bar chart**: A horizontal bar chart showing the last 7 days of XP earned per day. Include a dashed horizontal line showing the daily average. The last bar should have the current day number next to it. Use pure CSS/SVG for the chart — no chart libraries.
- **Total de XP de hoje**: Today's XP total displayed prominently
- **Total de XP**: All-time XP total
- **Rank diário de XP**: The professor's daily rank among all professors (shown as #N)
- **Total de horas de formação**: Sum of `carga_horaria` across all the professor's formations

### R7. New "Perfil" (Profile) Screen
Based on the wireframe provided:
- Large circular profile avatar area at the top (use the first letter of the professor name as placeholder)
- Professor name displayed prominently below (e.g., "Prof. X1")
- Subtitle line: "Nível {level} • {title}" where title is derived from level (e.g., Level 1-2: "Iniciante", Level 3-4: "Aprendiz", Level 5-6: "Intermediário", Level 7+: "Avançado")
- Stats row: "Total de XP" with value, "Streak saves" with value
- **Badges grid**: Display all earned badges in a grid of rounded cards. If no badges earned, show placeholder empty cards.

## Acceptance Criteria

### Color Palette
- [ ] All instances of `#6366F1` (old indigo) are replaced with the new blue palette
- [ ] Header/nav uses `#2C5EAD`, buttons use `#1591DC`, accents use `#4BB8FA`
- [ ] No remnant of the old indigo/purple color scheme

### Icons
- [ ] Zero emoji characters remain in any `.tsx` file
- [ ] All formation type indicators use Lucide React icon components
- [ ] Icons render correctly at appropriate sizes on all screens

### Header Streak
- [ ] Flame icon with streak count is visible in the top-right of the main screen header
- [ ] Streak number reflects the value from the gamification API

### Navigation
- [ ] Back arrow works on step 1 of NewFormationScreen (returns to home)
- [ ] Back arrow works on step 2 of NewFormationScreen (returns to step 1)
- [ ] Bottom nav has exactly 3 tabs: Home, Dados, Perfil
- [ ] Active tab is visually highlighted

### Data Screen
- [ ] Bar chart renders showing at least the current day's XP
- [ ] Dashed average line is visible across the chart
- [ ] All 4 stat values are displayed (today's XP, total XP, daily rank, total hours)

### Profile Screen
- [ ] Avatar placeholder shows professor's initial letter
- [ ] Professor name, level, and title are displayed
- [ ] Badges grid renders (even if empty, with placeholder cards)

### Build
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run dev` starts without errors
- [ ] App loads correctly at localhost
