# Phase 3: Dashboard, Multiplayer & Page Separation

## Overview
Transform the app from a single-page scoring interface into a multi-page application with a dashboard, game hosting, and multiplayer support.

---

## 1. Page Structure / Routing

### Pages to Create:
- **Dashboard** (`/dashboard`) - Landing page after login
- **Host Game** (`/host`) - Create and configure a new game
- **Join Game** (`/join`) - Enter a code to join someone's game
- **Lobby** (`/lobby/:gameCode`) - Waiting room before game starts
- **Game** (`/game/:gameCode`) - The actual scoring interface (current QuizScoresheet)
- **Results** (`/results/:gameCode`) - End-of-game results (extract from QuizScoresheet)

### Implementation:
- Use React Router (already installed)
- Wrap routes in AuthProvider
- Protect all routes except login/signup

---

## 2. Dashboard Page

### Stats to Display:
- **Games Played** - Total number of completed games
- **Win/Loss Record** - Games where user had highest score
- **Average Score** - Across all games
- **Best Round Type** - Which format they score highest on
- **Recent Games** - List of last 5-10 games with scores
- **Personal Bests** - Highest score, highest percentage, etc.

### UI Elements:
- Welcome message with user's display name
- Stats cards (games played, wins, average %)
- Recent games list with date, score, and position
- "Host Game" button (prominent)
- "Join Game" button
- Quick access to profile/settings

### Database Queries:
- Fetch from `quiz_attempts` where `user_id` = current user
- Join with `quizzes` for game details
- Calculate aggregates (wins, averages, bests)

---

## 3. Game Hosting System

### Host Game Flow:
1. User clicks "Host Game"
2. System generates unique 6-character game code (e.g., "QMD-A3X9")
3. Host enters game settings:
   - Game name/title
   - Number of rounds (default 7)
   - Configure each round's format ahead of time
4. Host sees lobby with:
   - Game code to share
   - List of joined players
   - "Start Game" button
5. When host starts, all players move to game view

### Database Schema Additions:

```sql
-- Live game sessions
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_code VARCHAR(10) UNIQUE NOT NULL,
  host_id UUID REFERENCES profiles(id) NOT NULL,
  title VARCHAR(255),
  status VARCHAR(20) DEFAULT 'lobby', -- 'lobby', 'in_progress', 'completed'
  rounds_config JSONB, -- Pre-configured round formats
  current_round INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Players in a game session
CREATE TABLE game_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  display_name VARCHAR(100),
  is_host BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_session_id, user_id)
);

-- Live scores during game
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  round_number INT NOT NULL,
  score DECIMAL(5,1) NOT NULL, -- Support half points
  answers_data JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Join Game Flow

### Join Process:
1. User clicks "Join Game"
2. Enter 6-character game code
3. System validates code exists and game is in 'lobby' status
4. User added to `game_players` table
5. Redirect to lobby view

### Lobby View (for joiners):
- Show game title and host name
- List of other players who've joined
- "Waiting for host to start..." message
- Option to leave game

---

## 5. Real-time Multiplayer

### Supabase Realtime Subscriptions:
- **Lobby**: Subscribe to `game_players` changes for player list updates
- **Game**: Subscribe to `game_scores` for live leaderboard
- **Host controls**: Broadcast round changes to all players

### Events to Handle:
- Player joins lobby
- Player leaves lobby
- Host starts game
- Host advances to next round
- Player submits round score
- Game completed

### Implementation:
```typescript
// Example subscription
const subscription = supabase
  .channel(`game:${gameCode}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'game_players',
    filter: `game_session_id=eq.${sessionId}`
  }, handlePlayerChange)
  .subscribe();
```

---

## 6. Game Flow Changes

### Current vs New Flow:

**Current:**
- Login → QuizScoresheet → Results

**New:**
- Login → Dashboard
- Dashboard → Host Game → Lobby → Game → Results
- Dashboard → Join Game → Lobby → Game → Results

### Host Capabilities:
- Configure rounds before starting
- Start game when ready
- Control round progression
- End game early if needed

### Player Capabilities:
- View current round format
- Enter answers and mark correct/incorrect
- See their running score
- See leaderboard (optional: hide until end)

---

## 7. Component Refactoring

### Extract from QuizScoresheet:
- **RoundSelector** - Dropdown for choosing round format
- **QuestionInput** - Single question with answer field and buttons
- **ScoreDisplay** - Current score and percentage
- **RoundScore** - Bottom score summary for a round

### New Components:
- **GameCodeDisplay** - Shows shareable code with copy button
- **PlayerList** - Shows players in lobby/game
- **Leaderboard** - Live rankings during game
- **StatsCard** - Reusable stat display for dashboard
- **RecentGamesList** - Table of past games

---

## 8. State Management

### Consider Using:
- React Context for game state (current round, players, scores)
- Or a simple state management solution

### Game State Shape:
```typescript
interface GameState {
  gameCode: string;
  sessionId: string;
  hostId: string;
  isHost: boolean;
  status: 'lobby' | 'in_progress' | 'completed';
  players: Player[];
  rounds: RoundConfig[];
  currentRound: number;
  scores: PlayerScore[];
}
```

---

## 9. UI/UX Improvements

### Navigation:
- Add a header/navbar with:
  - Logo/title
  - User name
  - Logout button
  - Back to dashboard

### Responsive Design:
- Dashboard works on mobile and desktop
- Lobby optimized for waiting
- Game view already mobile-first

### Animations:
- Player joins lobby - slide in animation
- Score updates - number animation
- Round completion - celebration
- Final results - confetti

---

## 10. Implementation Order

### Phase 3a - Page Structure:
1. Set up React Router with protected routes
2. Create basic Dashboard page
3. Move QuizScoresheet to `/game` route
4. Extract Results into separate route

### Phase 3b - Dashboard Stats:
1. Create stats queries/hooks
2. Build StatsCard components
3. Build RecentGamesList
4. Design and implement dashboard layout

### Phase 3c - Game Hosting:
1. Create database tables
2. Build Host Game page
3. Implement game code generation
4. Create Lobby page
5. Add round pre-configuration

### Phase 3d - Join Game:
1. Build Join Game page
2. Implement code validation
3. Add player to session

### Phase 3e - Real-time:
1. Set up Supabase realtime subscriptions
2. Live player list in lobby
3. Host game start broadcast
4. Live score updates

### Phase 3f - Polish:
1. Add loading states
2. Error handling
3. Animations and transitions
4. Testing multiplayer scenarios

---

## 11. Database Queries Reference

### Dashboard Stats:
```sql
-- Total games and wins
SELECT
  COUNT(*) as total_games,
  COUNT(*) FILTER (WHERE position = 1) as wins,
  AVG(percentage) as avg_percentage
FROM quiz_attempts
WHERE user_id = :userId;

-- Recent games
SELECT qa.*, gs.title, gs.game_code
FROM quiz_attempts qa
LEFT JOIN game_sessions gs ON qa.quiz_id = gs.id
WHERE qa.user_id = :userId
ORDER BY qa.completed_at DESC
LIMIT 10;
```

### Game Code Generation:
```typescript
function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 0, 1
  let code = 'QMD-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
```

---

## 12. Files to Create

### Pages:
- `src/pages/Dashboard.tsx`
- `src/pages/HostGame.tsx`
- `src/pages/JoinGame.tsx`
- `src/pages/Lobby.tsx`
- `src/pages/Game.tsx` (refactored from QuizScoresheet)
- `src/pages/Results.tsx` (extracted from QuizScoresheet)

### Components:
- `src/components/Navbar.tsx`
- `src/components/StatsCard.tsx`
- `src/components/RecentGamesList.tsx`
- `src/components/GameCodeDisplay.tsx`
- `src/components/PlayerList.tsx`
- `src/components/Leaderboard.tsx`
- `src/components/RoundConfig.tsx`

### Hooks:
- `src/hooks/useGameSession.ts`
- `src/hooks/usePlayerStats.ts`
- `src/hooks/useRealtimeGame.ts`

### Context:
- `src/context/GameContext.tsx`

---

## 13. Notes for Implementation

- Keep the current QuizScoresheet logic - it works well
- The scoring system with all 21 round types is complete
- Focus on wrapping it with multiplayer and routing
- Supabase realtime is included in the current package
- React Router is already installed but not used yet

---

## Questions to Consider

1. Should scores be visible to all players during the game, or only at the end?
2. Can players join mid-game, or only in lobby?
3. Should the host also play, or just manage?
4. Time limits per round?
5. Should we support teams in multiplayer?

---

**Created:** November 2024
**Status:** Ready for Phase 3 implementation
