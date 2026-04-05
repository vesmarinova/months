# Months & Seasons Learning Game - Project Prompt

## Project Overview
Create an interactive, mobile-friendly educational game that teaches children the sequence of months and their associated seasons. The game should be engaging, visually appealing, and suitable for kids aged 5-10.

## Technical Requirements

### Core Technologies
- **Language**: TypeScript
- **Framework**: React with Vite (fast, modern, mobile-optimized)
- **Styling**: CSS-in-JS or Tailwind CSS for responsive mobile design
- **Deployment**: Vercel, Netlify, or GitHub Pages (free tier)
- **Build Tool**: Vite for fast development and optimized builds

### Mobile Requirements
- Responsive design (mobile-first approach)
- Touch-friendly interactions (large tap targets, swipe gestures)
- Works on iOS and Android browsers
- Portrait orientation optimized
- No external dependencies that require app store deployment

### Language Requirements
- **Bilingual Support**: English and Bulgarian
- **Implementation Options**:
  1. **Dual Display (Recommended)**: Show both languages simultaneously on cards/buttons
     - Example: "January / Януари", "Winter / Зима"
     - Kids learn both languages at once
  2. **Language Toggle**: Button to switch between English ↔ Bulgarian
     - Saves preference to localStorage
     - Flag icons (🇬🇧 🇧🇬) for visual language selection
- All UI text, month names, season names, and instructions must be translated
- Month pronunciation remains the same for both languages during gameplay

## Game Features

### Game Modes

#### Mode 1: Month Sequence Challenge
- Display shuffled month cards
- Kids drag/tap to arrange them in correct order (January → December)
- Visual feedback: ✓ for correct, ✗ for incorrect
- Celebration animation on completion
- Score based on time and attempts

#### Mode 2: Season Sorting
- Show months randomly
- Kids assign each month to correct season (Winter/Spring/Summer/Fall)
- Color-coded seasons with icons (❄️ 🌸 ☀️ 🍂)
- Progressive difficulty: start with 3 months, increase to all 12

#### Mode 3: Quick Quiz
- "What month comes after May?"
- "Which season is October in?"
- Multiple choice with colorful buttons
- Streak counter for consecutive correct answers

### User Interface Requirements

#### Visual Design
- Bright, child-friendly color palette
- Large, readable fonts (minimum 18px)
- Animated characters/mascots (optional seasonal animals)
- Sound effects for correct/incorrect answers (with mute option)
- Smooth transitions between screens

#### Navigation
- Simple home screen with three game mode buttons
- Back button always visible
- Progress indicators
- "Play Again" and "Main Menu" options

#### Accessibility
- High contrast text
- Simple language
- Audio cues for actions
- Support for both tap and drag interactions

## Data Structure

### Month Data Model
```typescript
interface Month {
  id: number;
  name: {
    en: string;
    bg: string;
  };
  abbreviation: {
    en: string;
    bg: string;
  };
  season: 'Winter' | 'Spring' | 'Summer' | 'Fall';
  daysInMonth: number;
  color: string; // Season-specific color
  emoji: string; // Seasonal emoji
}

// Example months data
const MONTHS = [
  { id: 1, name: { en: 'January', bg: 'Януари' }, abbreviation: { en: 'Jan', bg: 'Ян' }, season: 'Winter', ... },
  { id: 2, name: { en: 'February', bg: 'Февруари' }, abbreviation: { en: 'Feb', bg: 'Фев' }, season: 'Winter', ... },
  { id: 3, name: { en: 'March', bg: 'Март' }, abbreviation: { en: 'Mar', bg: 'Мар' }, season: 'Spring', ... },
  { id: 4, name: { en: 'April', bg: 'Април' }, abbreviation: { en: 'Apr', bg: 'Апр' }, season: 'Spring', ... },
  { id: 5, name: { en: 'May', bg: 'Май' }, abbreviation: { en: 'May', bg: 'Май' }, season: 'Spring', ... },
  { id: 6, name: { en: 'June', bg: 'Юни' }, abbreviation: { en: 'Jun', bg: 'Юни' }, season: 'Summer', ... },
  { id: 7, name: { en: 'July', bg: 'Юли' }, abbreviation: { en: 'Jul', bg: 'Юли' }, season: 'Summer', ... },
  { id: 8, name: { en: 'August', bg: 'Август' }, abbreviation: { en: 'Aug', bg: 'Авг' }, season: 'Summer', ... },
  { id: 9, name: { en: 'September', bg: 'Септември' }, abbreviation: { en: 'Sep', bg: 'Сеп' }, season: 'Fall', ... },
  { id: 10, name: { en: 'October', bg: 'Октомври' }, abbreviation: { en: 'Oct', bg: 'Окт' }, season: 'Fall', ... },
  { id: 11, name: { en: 'November', bg: 'Ноември' }, abbreviation: { en: 'Nov', bg: 'Ное' }, season: 'Fall', ... },
  { id: 12, name: { en: 'December', bg: 'Декември' }, abbreviation: { en: 'Dec', bg: 'Дек' }, season: 'Winter', ... }
];
```

### Season Configuration
- **Winter / Зима**: December/Декември, January/Януари, February/Февруари (🎄 ❄️ ⛄)
- **Spring / Пролет**: March/Март, April/Април, May/Май (🌸 🌷 🐰)
- **Summer / Лято**: June/Юни, July/Юли, August/Август (☀️ 🏖️ 🍉)
- **Fall / Есен**: September/Септември, October/Октомври, November/Ноември (🍂 🎃 🦃)

## Implementation Steps

### Phase 1: Setup & Foundation (Day 1)
1. Initialize Vite + React + TypeScript project
2. Set up project structure:
   ```
   /src
     /components
       /GameModes
       /UI
     /data
       months.ts (bilingual month data)
       translations.ts (UI text in both languages)
     /hooks
       useLanguage.ts (language toggle hook)
     /utils
     /styles
     /i18n (language context and utilities)
   ```
3. Create bilingual month data constants with Bulgarian translations
4. Set up language context/provider for app-wide language switching
5. Build responsive layout shell with language toggle
6. Deploy basic version to Vercel/Netlify

### Phase 2: Core Gameplay (Day 1-2)
1. Implement Month Sequence Challenge
   - Draggable month cards (react-dnd or custom)
   - Validation logic
   - Success/failure animations
2. Implement Season Sorting
   - Season zones with drop targets
   - Month-to-season assignment logic
3. Add game state management (Context API or Zustand)

### Phase 3: Polish & Deploy (Day 2)
1. Implement Quick Quiz mode
2. Add sound effects (optional, with mute)
3. Create celebration animations (confetti, stars)
4. Add score tracking and local storage persistence
5. Mobile testing and optimization
6. Final deployment with custom domain (optional)

## Deployment Instructions

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Netlify
```bash
npm run build
# Drag /dist folder to netlify.com/drop
```

### GitHub Pages
```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

## Success Criteria
- ✅ All three game modes functional
- ✅ Full bilingual support (English & Bulgarian) with language toggle or dual display
- ✅ All months and seasons translated correctly
- ✅ Fully responsive on mobile devices (320px - 768px)
- ✅ Loads in < 3 seconds on 3G connection
- ✅ No TypeScript errors
- ✅ Deployed and accessible via public URL
- ✅ Works on iOS Safari and Android Chrome
- ✅ Intuitive for kids to play without instructions
- ✅ Language preference saved to localStorage

## Optional Enhancements (If Time Permits)
- 🎵 Background music toggle
- 🏆 High score leaderboard (local storage)
- 🎨 Theme selector (different color schemes)
- 📊 Progress tracking across sessions
- 👥 Parent dashboard showing learning progress
- 🎮 Additional mini-games (match the month, memory cards)
- 🔊 Audio pronunciation of month names in both languages

## Code Quality Requirements
- TypeScript strict mode enabled
- ESLint configured for React/TypeScript
- Component-based architecture
- Reusable UI components
- Mobile-first CSS
- Semantic HTML
- Comments for complex game logic

## Testing Checklist
- [ ] Test on iPhone (Safari)
- [ ] Test on Android phone (Chrome)
- [ ] Test all game modes complete successfully
- [ ] Test touch interactions (tap, drag, swipe)
- [ ] Test language toggle functionality
- [ ] Verify Bulgarian text displays correctly (Cyrillic characters)
- [ ] Test that language preference persists across sessions
- [ ] Verify both dual-display and toggle modes work correctly
- [ ] Verify responsive design at 375px, 414px, 768px
- [ ] Test in landscape mode
- [ ] Verify loading states and error handling
- [ ] Check local storage persistence

## Delivery
Provide:
1. GitHub repository URL
2. Live deployment URL
3. README with:
   - How to run locally
   - How to deploy
   - Game instructions
   - Screenshots/GIF demo
4. Estimated 2-3 hours total development time for MVP

---

**Start Command**: `npm create vite@latest months-game -- --template react-ts`
**Target Completion**: Same day deployment
**Primary Focus**: Fun, educational, mobile-optimized, fast to build