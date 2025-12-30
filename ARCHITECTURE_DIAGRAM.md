# Focus Refresh - Architecture Diagrams

## Component Hierarchy

```
App (Root)
│
├── Layout
│   ├── Header
│   └── Footer (optional)
│
└── Pages (Routes)
    │
    ├── Landing Page (/)
    │   └── Button: "Start Break"
    │
    ├── Mood Selection (/mood-selection)
    │   ├── Card: Tired
    │   ├── Card: Bored
    │   ├── Card: Unfocused
    │   └── Card: Stressed
    │
    ├── Timer Selection (/timer-selection)
    │   ├── Card: 5 minutes
    │   ├── Card: 10 minutes
    │   ├── Card: 15 minutes
    │   └── Game Recommendation Display
    │
    ├── Game Page (/game/[gameId])
    │   ├── Timer Component (shows countdown)
    │   └── Game Component (MemoryMatch / WordPuzzle / ColorMatch)
    │
    └── Alert Page (/alert)
        ├── Motivational Message
        ├── Button: "End Break"
        └── Button: "Extend 5 min" (optional)
```

## Data Flow

```
User Action Flow:
┌─────────────┐
│  Landing    │
│   Page      │
└──────┬──────┘
       │ Click "Start Break"
       ▼
┌─────────────┐
│    Mood     │
│ Selection   │ ──► Saves to Context: { mood: "bored" }
└──────┬──────┘
       │ Select mood, click "Continue"
       ▼
┌─────────────┐
│   Timer     │
│ Selection   │ ──► Saves to Context: { timer: 600, game: "memory-match" }
└──────┬──────┘
       │ Select timer, click "Start Game"
       ▼
┌─────────────┐
│  Game Page  │
│             │ ──► Reads from Context: mood, timer, game
│  ┌───────┐  │
│  │ Timer │  │ ──► Counts down independently
│  └───────┘  │
│  ┌───────┐  │
│  │ Game  │  │ ──► Runs independently
│  └───────┘  │
└──────┬──────┘
       │ Timer reaches 0 OR Game completes
       ▼
┌─────────────┐
│   Alert     │
│   Page      │ ──► Shows completion message
└──────┬──────┘
       │ Click "End Break"
       ▼
┌─────────────┐
│  Landing    │ ──► Context reset, ready for new break
│   Page      │
└─────────────┘
```

## State Management (Context API)

```
GameContext Structure:
{
  // User Selections
  mood: 'tired' | 'bored' | 'unfocused' | 'stressed' | null,
  timerDuration: 300 | 600 | 900 | null,  // in seconds
  selectedGame: 'memory-match' | 'word-puzzle' | 'color-match' | null,
  
  // Game State
  currentGameState: {
    isActive: boolean,
    isCompleted: boolean,
    score: number,
  },
  
  // Timer State
  timerState: {
    remainingSeconds: number,
    isActive: boolean,
    isCompleted: boolean,
  },
  
  // Actions
  setMood: (mood) => void,
  setTimerDuration: (duration) => void,
  setSelectedGame: (game) => void,
  startGame: () => void,
  endGame: () => void,
  resetContext: () => void,
}
```

## Game Component Structure

```
MemoryMatch Component:
├── State
│   ├── cards: Card[] (array of card objects)
│   ├── flippedCards: number[] (indices of flipped cards)
│   ├── matchedPairs: number[] (indices of matched cards)
│   └── isCompleted: boolean
│
├── Functions
│   ├── initializeCards() - Creates and shuffles cards
│   ├── handleCardClick(index) - Handles card flip
│   ├── checkMatch() - Checks if two flipped cards match
│   └── checkCompletion() - Checks if all pairs matched
│
└── Render
    ├── Grid of Card components
    └── Completion message (if isCompleted)
```

## Timer Hook Flow

```
useTimer Hook:
┌─────────────────┐
│ Initialization  │
│ - Set seconds   │
│ - Set isActive  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   useEffect     │
│   (when active) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      Every 1 second
│  setInterval    │ ◄─────────────────┐
│  - Decrement    │                   │
│    seconds      │                   │
└────────┬────────┘                   │
         │                            │
         ▼                            │
┌─────────────────┐                   │
│ seconds === 0?  │                   │
└────────┬────────┘                   │
         │                            │
    Yes  │  No                        │
         │                            │
         ▼                            │
┌─────────────────┐                   │
│ onComplete()    │                   │
│ callback        │                   │
└─────────────────┘                   │
         │                            │
         └────────────────────────────┘
```

## File Import Dependencies

```
page.tsx (Landing)
  └── components/ui/Button.tsx

mood-selection/page.tsx
  ├── context/GameContext.tsx
  └── components/ui/Card.tsx

timer-selection/page.tsx
  ├── context/GameContext.tsx
  ├── components/ui/Card.tsx
  └── utils/gameRecommendations.ts

game/[gameId]/page.tsx
  ├── context/GameContext.tsx
  ├── components/ui/Timer.tsx
  ├── hooks/useTimer.ts
  ├── components/games/MemoryMatch.tsx
  ├── components/games/WordPuzzle.tsx
  └── components/games/ColorMatch.tsx

alert/page.tsx
  ├── context/GameContext.tsx
  └── components/ui/Button.tsx
```

## Game Recommendation Logic

```
Mood Selection
      │
      ▼
┌─────────────┐
│   Mood      │
│  Selected   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ gameRecommendations │
│    .ts utility      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  moodToGame map:    │
│  'tired' →          │
│    ['ColorMatch']   │
│  'bored' →          │
│    ['WordPuzzle']   │
│  'unfocused' →      │
│    ['MemoryMatch']  │
│  'stressed' →       │
│    ['ColorMatch']   │
└──────┬──────────────┘
       │
       ▼
┌─────────────┐
│ Recommended │
│    Game     │
└─────────────┘
```

## Timer & Game Synchronization

```
Independent Execution:
┌─────────────┐         ┌─────────────┐
│   Timer     │         │    Game     │
│             │         │             │
│ 10:00 → 0:00│         │ Start → End │
│             │         │             │
│ Counts down │         │ User plays  │
│ every sec   │         │ independently│
└──────┬──────┘         └──────┬──────┘
       │                       │
       │                       │
       ▼                       ▼
┌─────────────────────────────────┐
│      Completion Detection       │
│                                 │
│  Timer === 0  OR  Game Complete │
│                                 │
│         ▼                       │
│  Show Alert/Notification        │
└─────────────────────────────────┘
```

## Error Handling Flow

```
User Action
    │
    ▼
┌─────────────┐
│ Try Action  │
└──────┬──────┘
       │
   Success? ──Yes──► Continue
       │
      No
       │
       ▼
┌─────────────┐
│ Catch Error │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Show Error  │
│  Message    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Log Error   │
│ (console)   │
└─────────────┘
```

---

## Quick Component Checklist

### Must-Have Components
- [ ] Button (reusable)
- [ ] Card (for selections)
- [ ] Timer (countdown display)
- [ ] MemoryMatch (game)
- [ ] Alert/Modal (completion)

### Pages (Routes)
- [ ] `/` - Landing
- [ ] `/mood-selection` - Mood picker
- [ ] `/timer-selection` - Timer picker
- [ ] `/game/[gameId]` - Game page
- [ ] `/alert` - Completion alert

### Context & Hooks
- [ ] GameContext (state management)
- [ ] useTimer (timer logic)
- [ ] useGameState (game logic)

### Utilities
- [ ] gameRecommendations.ts (mood → game)
- [ ] localStorage.ts (optional: save history)

---

This diagram shows the structure at a glance. Refer to PRODUCT_PLAN.md for detailed explanations.


