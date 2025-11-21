# Quick Start Checklist

Complete these 3 steps to get your app fully running with database persistence.

## ✅ Step 1: Run the SQL Setup (2 minutes)

1. Go to https://supabase.com/dashboard
2. Click your project: **wtgotgzdfhgwdjiqqeka**
3. Left sidebar → **SQL Editor**
4. Click **New Query**
5. Open this file: `supabase_setup.sql` (in your project root)
6. Copy the entire contents
7. Paste into the SQL editor
8. Click **Run** (green button)
9. Wait for "Success" message ✅

**What this does:**
- Creates 7 database tables
- Sets up security policies
- Adds performance indexes
- Enables automatic timestamps

## ✅ Step 2: Verify .env.local (1 minute)

Your `.env.local` file should already exist and contain:

```
VITE_SUPABASE_URL=https://wtgotgzdfhgwdjiqqeka.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If it doesn't exist:
1. Create `.env.local` in project root
2. Add the two lines above
3. Save the file

## ✅ Step 3: Test It! (5 minutes)

1. Dev server should be running at `http://localhost:5173`
2. You should see **Login/Signup** page
3. Click "Create one now"
4. Fill in:
   - Display Name: `Your Name`
   - Email: `test@example.com`
   - Password: `TestPassword123`
   - Confirm: `TestPassword123`
5. Click **Create Account**
6. Should see "Account Created!" message
7. Auto-redirect to **Login**
8. Sign in with the email/password you just created
9. Should redirect to **Quiz Interface** ✅

**If this works, everything is set up!** 🎉

## Troubleshooting

### Page shows "Loading..." forever
- Check `.env.local` has correct URLs
- Verify Supabase project is active
- Restart dev server: `npm run dev`

### "Sign up failed" error
- Check email isn't already registered
- Password must be 6+ characters
- Try a different email

### "Cannot connect to database"
- Verify SQL setup ran successfully in Supabase
- Check Supabase project status (green = good)
- Wait 1-2 minutes and refresh page

### No error message, just blank page
- Open browser console (F12)
- Check for red error messages
- Take a screenshot of the error
- Review SUPABASE_SETUP_GUIDE.md

## What You Can Do Now

✅ **Sign up and log in**
✅ **Take quizzes and score them**
✅ **See results displayed**
✅ **Create multiple accounts**

## Next (Optional)

When ready, check out:
- `README.md` - Full documentation
- `PHASE2_COMPLETE.md` - What's been built
- `SUPABASE_SETUP_GUIDE.md` - Detailed setup

## Key Files

| File | Purpose |
|------|---------|
| `supabase_setup.sql` | Database schema - run in Supabase SQL Editor |
| `.env.local` | Your Supabase credentials |
| `src/context/AuthContext.tsx` | Login/signup logic |
| `src/components/QuizScoresheet.tsx` | Main quiz interface |
| `src/hooks/useTeams.ts` | Team management |
| `src/hooks/useQuizzes.ts` | Quiz operations |

## Commands

```bash
npm run dev      # Start dev server (already running)
npm run build    # Create production build
npm run preview  # Preview production build locally
```

---

**Everything is set up! You just need to run the SQL script and test it.** 🚀
