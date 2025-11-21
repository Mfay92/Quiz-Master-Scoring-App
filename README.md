# Quiz Master Dale - Scoring Application

A full-stack quiz scoring application built with React, Vite, TypeScript, and Supabase.

## Features

- 🎯 **14 Different Quiz Round Formats**
  - General Knowledge, Picture Round, Music Round
  - Connections Round, True/False, Multiple Choice
  - Easy/Hard Round, All-or-Nothing, Top 5 Round
  - 54321 Fast Questions, Bonus Round, Fill in the Blank
  - Odd One Out, What Comes Next?

- 👥 **User Authentication**
  - Email/password signup and login
  - User profiles with display names
  - Secure authentication with Supabase

- 🏆 **Team Management**
  - Create and manage quiz teams
  - Add team members by email
  - Track team performance
  - View team leaderboards

- 📊 **Score Tracking**
  - Real-time scoring calculation
  - Detailed round-by-round breakdown
  - Quiz history and statistics
  - Performance analytics

- 🎨 **Beautiful UI**
  - 5 theme options (Colorful, Dark, Ocean, Sunset, Forest)
  - Responsive mobile-first design
  - Celebration animations for correct answers
  - Glass-morphic design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.0.1
- **Styling**: Tailwind CSS 3.4.15
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React
- **Routing**: React Router (for future multi-page support)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (https://supabase.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Quiz-Master-Scoring-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at https://supabase.com
   - Go to the SQL Editor
   - Copy the contents of `supabase_setup.sql`
   - Paste into the SQL Editor and run
   - This creates all tables, RLS policies, and indexes

4. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   - Open http://localhost:5173

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Database Schema

### Tables

- **profiles** - User profiles (extends Supabase auth)
  - id, display_name, email, avatar_url, created_at, updated_at

- **teams** - Quiz teams
  - id, name, creator_id, description, is_public, created_at, updated_at

- **team_members** - Team membership junction table
  - id, team_id, user_id, joined_at

- **quizzes** - Quiz events
  - id, title, quiz_master_id, quiz_date, rounds_config, is_public, created_at, updated_at

- **quiz_attempts** - Team attempts at quizzes
  - id, quiz_id, team_id, user_id, total_score, max_score, percentage, started_at, completed_at, created_at, updated_at

- **quiz_scores** - Round-by-round scores
  - id, quiz_attempt_id, round_number, round_format, questions_data, round_score, max_round_score, created_at, updated_at

- **quiz_images** - Images for picture rounds
  - id, quiz_id, round_number, question_number, storage_path, uploaded_by, created_at

### Security

All tables have Row Level Security (RLS) policies enabled:
- Users can only see/modify their own data
- Team members can see team data
- Quiz masters can manage their quizzes
- Public quizzes visible to all

## File Structure

```
src/
├── components/
│   └── QuizScoresheet.tsx      # Main quiz component (718 lines)
├── context/
│   └── AuthContext.tsx          # Authentication context & hooks
├── hooks/
│   ├── useTeams.ts             # Team management hook
│   └── useQuizzes.ts           # Quiz operations hook
├── lib/
│   └── supabase.ts             # Supabase client configuration
├── pages/
│   ├── AuthPage.tsx            # Auth page router
│   ├── Login.tsx               # Login form
│   └── Signup.tsx              # Signup form
├── types/
│   └── index.ts                # TypeScript type definitions
├── App.tsx                     # Main app with auth routing
├── App.css                     # App styles
├── index.css                   # Tailwind CSS imports
└── main.tsx                    # React entry point
```

## Usage

### Authentication Flow

1. User visits app
2. If not logged in, shown login/signup page
3. User creates account or signs in
4. Profile automatically created
5. Redirected to quiz scoring interface

### Quiz Workflow

1. Select or create a team
2. Select round format (14 options)
3. Input answers and mark correct/incorrect
4. Score updates in real-time
5. Complete quiz to see detailed results
6. Results automatically saved to database

### Team Management

1. Click "Create Team"
2. Enter team name
3. Add team members by email
4. Track team quiz history and statistics

## Hooks

### useAuth()

```typescript
const { user, profile, loading, signUp, signIn, signOut, updateProfile } = useAuth();
```

### useTeams()

```typescript
const {
  teams, loading, error,
  fetchTeams, createTeam, updateTeam, deleteTeam,
  addTeamMember, removeTeamMember
} = useTeams();
```

### useQuizzes()

```typescript
const {
  quizAttempts, loading, error,
  startQuizAttempt, saveQuizScore, completeQuizAttempt,
  fetchTeamQuizAttempts, fetchQuizScores
} = useQuizzes();
```

## Next Steps / Future Features

- [ ] Quiz creation interface for quiz masters
- [ ] Image upload for picture rounds
- [ ] NotebookLM integration for question generation
- [ ] Leaderboard/statistics dashboard
- [ ] Export results to PDF
- [ ] Real-time multiplayer scoring
- [ ] Mobile app (React Native)
- [ ] Quiz templates marketplace

## Troubleshooting

### "Failed to fetch from Supabase"
- Check `.env.local` has correct credentials
- Verify Supabase project is active
- Run the SQL setup script in Supabase

### "User creation failed"
- Check email is not already registered
- Ensure password is 6+ characters
- Check RLS policy allows inserts

### "CORS errors"
- Verify Supabase URL in `.env.local`
- Check project settings allow your domain

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - Feel free to use this project as you wish.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check React documentation
4. Create an issue in the repository

---

**Built with ❤️ for Quiz Master Dale**
