# Focus Refresh - Quick Start Guide

## 🎯 Project Overview

**Goal:** Build a web app that helps users take refreshing 10-15 minute breaks with mini-games, then gently reminds them to return to work.

**Tech Stack:** Next.js + React + TypeScript + Tailwind CSS

**Timeline:** ~10-11 days for MVP

---

## 📋 Development Checklist

### Day 1: Setup
- [ ] `npx create-next-app@latest focus-refresh --typescript --tailwind --app`
- [ ] Create folder structure
- [ ] Test `npm run dev` works
- [ ] Create basic layout component

### Day 1-2: Navigation
- [ ] Landing page with "Start Break" button
- [ ] Mood selection page (4 mood options)
- [ ] Timer selection page (5/10/15 min)
- [ ] Test navigation between pages

### Day 2-3: State Management
- [ ] Create GameContext.tsx
- [ ] Add mood state
- [ ] Add timer state
- [ ] Test state persists across navigation

### Day 3-4: Timer
- [ ] Create Timer component
- [ ] Create useTimer hook
- [ ] Test countdown works
- [ ] Test timer completion callback

### Day 4-6: First Game (Memory Match)
- [ ] Create MemoryMatch component
- [ ] Implement card flip logic
- [ ] Implement match detection
- [ ] Integrate with timer
- [ ] Test game completion

### Day 6: Game Recommendations
- [ ] Create gameRecommendations.ts
- [ ] Show recommended game on timer page
- [ ] Test mood → game mapping

### Day 7: Alert System
- [ ] Create Alert component
- [ ] Show alert when timer completes
- [ ] Add "End Break" functionality
- [ ] Test alert appears correctly

### Day 8-10: Additional Games
- [ ] Word Puzzle game
- [ ] Color Match game
- [ ] Test all games work

### Day 10-11: Polish
- [ ] Improve styling
- [ ] Add animations
- [ ] Test on mobile
- [ ] Fix bugs
- [ ] Final testing

---

## 🗂️ Folder Structure (Quick Reference)

```
focus-refresh/
├── src/
│   ├── app/              # Pages (Next.js App Router)
│   │   ├── page.tsx      # Landing
│   │   ├── mood-selection/
│   │   ├── timer-selection/
│   │   ├── game/[gameId]/
│   │   └── alert/
│   │
│   ├── components/
│   │   ├── ui/           # Button, Card, Timer
│   │   ├── games/        # MemoryMatch, WordPuzzle, etc.
│   │   └── layout/       # Header, Footer
│   │
│   ├── context/          # GameContext.tsx
│   ├── hooks/            # useTimer.ts, useGameState.ts
│   ├── utils/            # gameRecommendations.ts
│   └── types/            # TypeScript types
```

---

## 🔑 Key Concepts

### State Flow
```
User selects mood → Saved in Context
User selects timer → Saved in Context
User starts game → Context provides mood + timer to game
Game runs → Updates game state in Context
Timer completes → Shows alert
User ends break → Context resets
```

### Timer Logic
- Convert minutes to seconds: `5 min = 300, 10 min = 600, 15 min = 900`
- Count down every second using `setInterval`
- Always clean up interval in `useEffect` return
- When seconds === 0, call `onComplete` callback

### Game Logic
- Each game is self-contained component
- Game state is separate from timer state
- Game can complete before timer (show message, timer continues)
- Timer can complete during game (show alert, pause game)

---

## 🐛 Common Mistakes to Avoid

1. **Memory Leaks**
   - ❌ Not cleaning up `setInterval` in `useEffect`
   - ✅ Always return cleanup function

2. **State Updates**
   - ❌ Directly mutating state: `state.cards.push(newCard)`
   - ✅ Create new object: `setCards([...cards, newCard])`

3. **Navigation**
   - ❌ Forgetting to reset state when navigating
   - ✅ Reset context when returning to landing page

4. **Timer**
   - ❌ Starting multiple timers
   - ✅ Clear previous timer before starting new one

5. **Game Logic**
   - ❌ Allowing clicks during animations
   - ✅ Disable interactions during flip/transition

---

## 🧪 Testing Quick Reference

### Happy Path Test
1. Open app → Click "Start Break"
2. Select mood → Click "Continue"
3. Select timer → Click "Start Game"
4. Play game → Complete or wait for timer
5. See alert → Click "End Break"
6. Return to landing page

### Edge Cases to Test
- [ ] Page refresh during game
- [ ] Browser back button
- [ ] Rapid clicking
- [ ] Timer completes during game
- [ ] Game completes before timer
- [ ] Direct URL access to game page

---

## 📝 Code Snippets Reference

### Timer Hook (Basic)
```typescript
function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (isActive && seconds > 0) {
      const interval = setInterval(() => {
        setSeconds(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup!
    }
  }, [isActive, seconds]);
  
  return { seconds, isActive, start: () => setIsActive(true) };
}
```

### Context Provider (Basic)
```typescript
const GameContext = createContext();

export function GameProvider({ children }) {
  const [mood, setMood] = useState(null);
  const [timerDuration, setTimerDuration] = useState(null);
  
  return (
    <GameContext.Provider value={{ mood, setMood, timerDuration, setTimerDuration }}>
      {children}
    </GameContext.Provider>
  );
}
```

### Format Time (MM:SS)
```typescript
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
```

---

## 🚀 Next Steps After MVP

1. **Add More Games** - Expand game library
2. **Improve UX** - Animations, sounds, themes
3. **Add Backend** - Save break history, sync across devices
4. **Add Auth** - User accounts, personalized experience
5. **Mobile App** - React Native version
6. **Browser Extension** - Quick access from any tab

---

## 📚 Learning Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 💡 Pro Tips

1. **Start Small**: Build one feature at a time
2. **Test Often**: Test after each small change
3. **Use Console**: `console.log()` is your friend for debugging
4. **Read Errors**: Error messages usually tell you what's wrong
5. **Take Breaks**: Use your own app! 😄

---

**Remember:** This is a learning project. It's okay to make mistakes and refactor. The goal is to build something that works and learn along the way!

For detailed explanations, see `PRODUCT_PLAN.md`
For architecture diagrams, see `ARCHITECTURE_DIAGRAM.md`


