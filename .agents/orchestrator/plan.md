# Project Plan: Novo App Pesquisa Update

## Overview
Updating existing React + Vite mobile-first web app for professors at `C:\Users\Dell\Documents\- Projetos Github\novo-app-pesquisa`.

## Architecture
React + Vite, Lucide Icons, CSS Modules / Tailwind / pure CSS styling, API connection to `https://be-formacao-continua.onrender.com` with `X-Device-ID` header.

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Codebase Analysis | Analyze all existing `src/` files, state, styles, components, and routes | None | DONE |
| 2 | Color Palette & Lucide Icons Refactor | Implement palette `#2C5EAD`, `#1591DC`, `#4BB8FA`, `#C4E2F5`, `#FFFFFF`. Replace emojis with Lucide icons. | M1 | DONE |
| 3 | Header Streak & Navigation Restructuring | Header flame indicator + streak count from API. 3-tab bottom nav (Home, Dados, Perfil). Fix NewFormationScreen back arrow. | M2 | DONE |
| 4 | New "Dados" & "Perfil" Screens | Implement Dados screen (XP horizontal bar chart, stats) and Perfil screen (avatar, stats, badges grid). | M3 | DONE |
| 5 | Build Verification & Integrity Audit | `npx tsc --noEmit` pass, dev server test, Forensic Auditor verification, victory message to Sentinel. | M4 | DONE |

## Interface Contracts & Specs

### Color Palette (R1)
- `#2C5EAD`: Nav bars, dark blue accents
- `#1591DC`: Buttons, primary blue actions
- `#4BB8FA`: Highlights, progress bars, accents
- `#C4E2F5`: Secondary light blue, subtle backgrounds, badges
- `#FFFFFF`: Main background, card backgrounds

### Lucide Icons (R2)
- Curso -> `GraduationCap`
- Evento -> `Mic` or `Calendar`
- Certificação -> `Award`
- Produção Acadêmica -> `BookOpen`
- Outro -> `Lightbulb`
- Fire/Streak -> `Flame`

### Header Streak (R3)
- Top-right flame outlined icon with streak count.
- Source: Gamification API `streak` field (fallback 0).

### Navigation & Back Arrow (R4 & R5)
- Bottom Nav: Home (house), Dados (bar chart), Perfil (user)
- Back arrow on Nova Formação: Step 1 -> Navigate to `/`, Step 2 -> Return to step 1.

### Dados Screen (R6)
- 7-day XP horizontal bar chart (pure CSS/SVG, dashed average line, last bar shows current day number).
- Prominent Today's XP, Total XP, Daily Rank (#N), Total formation hours (`carga_horaria` sum).

### Perfil Screen (R7)
- Large circular avatar placeholder with professor's first letter.
- Name ("Prof. X1"), Subtitle ("Nível {level} • {title}").
- Stats row ("Total de XP", "Streak saves").
- Badges grid (rounded cards, placeholder empty cards if none).
